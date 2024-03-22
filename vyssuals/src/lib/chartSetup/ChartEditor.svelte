<script lang="ts">
    import { startColor, endColor, chartToEdit, showChartEditor } from "../store";
    import type { ChartConfig, _Update } from "../types";
    import Draggable from "../wrapper/Draggable.svelte";
    import FloatingWindow from "../wrapper/FloatingWindow.svelte";
    import { db } from "../data/databaseManager";
    import { onMount } from "svelte";
    import { blur } from "svelte/transition";
    import { DataSourceDatabase } from "../data/dataSourceDatabase";
    import posthog from "posthog-js";

    const left = window.innerWidth / 2 - 135;
    const top = window.innerHeight / 2 - 250;

    let config: ChartConfig;
    let dsNames: string[];
    let attributeKeys: string[];
    let updates: _Update[];

    onMount(async () => {
        dsNames = db.dataSourceNames;
        const dbConfig = await db.vyssuals.chartConfigs.get($chartToEdit);
        if (dbConfig) {
            config = dbConfig;
            updates = await getUpdates(db.get(config.dataSourceName));
            attributeKeys = (await db.get(config.dataSourceName).metadata.toCollection().primaryKeys()) as string[];
        } else {
            const ds = db.get(dsNames[0]);
            updates = await getUpdates(ds);
            attributeKeys = (await ds.metadata.toCollection().primaryKeys()) as string[];
            config = createConfig(dsNames[0], attributeKeys[0], attributeKeys[0], updates[updates.length - 1].timestamp);
        }
    });

    function createConfig(dataSourceName: string, showValues: string, groupBy: string, update: string): ChartConfig {
        return {
            id: Math.random().toString(36).slice(2, 12),
            index: -1,
            dataSourceName,
            chartType: "bar",
            showValues,
            groupBy,
            startColor: $startColor,
            endColor: $endColor,
            update,
        };
    }

    async function getUpdates(ds: DataSourceDatabase): Promise<_Update[]> {
        let updates =  (await ds.updates.orderBy("timestamp").toArray()) as _Update[];
        updates.push({ timestamp: "Latest Update", name: "Use Latest", type: "auto" });
        return updates;
    }

    function formatUpdate(update: _Update) {
        if (update.timestamp === "Latest Update") return update.name;
        return `${update.name} (${new Date(update.timestamp).toLocaleString()}, ${update.type})`;
    }

    async function handleDataSourceChange() {
        attributeKeys = await db.get(config.dataSourceName).metadata.toCollection().primaryKeys();
        config.showValues = attributeKeys[0];
        config.groupBy = attributeKeys[0];
        updates = await getUpdates(db.get(config.dataSourceName));
        config.update = updates[updates.length - 1].timestamp;
        posthog.capture("data_source_changed");
    }

    function handleCreateChart() {
        saveChartConfig();
        hideChartEditor();
        posthog.capture("chart_created", { chartType: config.chartType });
    }

    function handleUpdateChart() {
        saveChartConfig();
        posthog.capture("chart_updated", { chartType: config.chartType });
    }

    function hideChartEditor() {
        showChartEditor.set(false);
        chartToEdit.set("");
    }

    async function saveChartConfig() {
        if (config.index < 0) {
            const count = await db.vyssuals.chartConfigs.count();
            config.index = count + 1;
        }
        if (config.chartType == "timeline") {
            config.groupBy = "Timestamp";
            config.update = "";
        }
        db.vyssuals.chartConfigs.put(config);
        startColor.set(config.startColor);
        endColor.set(config.endColor);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideChartEditor}>
    <Draggable {left} {top}>
        <div class="chart-editor" id="chartEditor" transition:blur={{ duration: 100 }}>
            <h1>Chart Editor</h1>
            {#if config && attributeKeys && dsNames}
                <div>
                    <div class="config-option">
                        <label for="dataSource">Data Source:</label>
                        <select class="config-select" id="dataSource" bind:value={config.dataSourceName} on:change={handleDataSourceChange}>
                            {#each dsNames as name}
                                <option value={name}>{name}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="config-option">
                        <label for="chartType">Chart Type:</label>
                        <select class="config-select" id="chartType" bind:value={config.chartType}>
                            <option value="bar">Bar</option>
                            <option value="doughnut">Doughnut</option>
                            <option value="total">Total</option>
                            <option value="timeline">Timeline</option>
                        </select>
                    </div>
                    
                    {#if !(config.chartType == "timeline")}
                    <div class="config-option">
                        <label for="update">Update:</label>
                        <select class="config-select" id="update" bind:value={config.update}>
                            {#each updates as update}
                                <option value={update.timestamp}>{formatUpdate(update)}</option>
                            {/each}
                        </select>
                    </div>
                    {/if}

                    <div class="config-option">
                        <label title="This attribute goes on the X axis" for="showValues">Show Values Of:</label>
                        <select class="config-select" id="showValues" bind:value={config.showValues}>
                            {#each attributeKeys as key}
                                <option value={key}>{key}</option>
                            {/each}
                        </select>
                    </div>

                    {#if !(config.chartType === "total" || config.chartType === "timeline")}
                        <div class="config-option">
                            <label title="This attribute goes on the Y axis" for="groupBy">Grouped By:</label>
                            <select class="config-select" id="groupBy" bind:value={config.groupBy}>
                                {#each attributeKeys as key}
                                    <option value={key}>{key}</option>
                                {/each}
                            </select>
                        </div>
                    {/if}

                    {#if !(config.chartType === "total")}
                        <div class="config-option">
                            <input
                                class="color-input"
                                type="color"
                                id="startColor"
                                bind:value={config.startColor}
                                style="background-color: {config.startColor}"
                            />
                            <input
                                class="color-input"
                                type="color"
                                id="endColor"
                                bind:value={config.endColor}
                                style="background-color: {config.endColor}"
                            />
                        </div>
                    {/if}
                </div>
            {/if}

            {#if $chartToEdit != ""}
                <button on:click={handleUpdateChart}>Update Chart</button>
            {:else}
                <button on:click={handleCreateChart}>Create Chart</button>
            {/if}
        </div>
    </Draggable>
</FloatingWindow>

<style>
    .chart-editor {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 260px;
        gap: 10px;
        background-color: var(--card-background-color);
        border-radius: 1em;
        padding: 1em;
    }

    .color-input {
        padding: 1px;
        border-radius: 0.5em;
        width: 100%;
        border: none;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
        opacity: 0.6;
    }

    .color-input::-webkit-color-swatch {
        border: none;
    }

    button {
        background-color: var(--background-color);
        border: none;
        color: var(--color);
        cursor: pointer;
        width: 86%;
    }

    button:hover {
        filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
        color: #05acffa0;
    }
</style>
