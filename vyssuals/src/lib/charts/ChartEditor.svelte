<script lang="ts">
    import { startColor, endColor, chartToEdit, showChartEditor } from "../store";
    import type { ChartConfig, ChartType, DataSource } from "../types";
    import Draggable from "../wrapper/Draggable.svelte";
    import FloatingWindow from "../wrapper/FloatingWindow.svelte";
    import type { Observable, IndexableType } from "dexie";
    import { db } from "../data/databaseManager";
    import { onMount } from "svelte";
    import type { Writable } from "svelte/store";

    const left = window.innerWidth / 2 - 135;
    const top = window.innerHeight / 2 - 250;

    let chartConfigs: Observable<ChartConfig[]>;
    let config: ChartConfig;

    let dbNames: Writable<string[]>;

    let attributeKeys: string[];

    onMount(async () => {
        dbNames = db.dataSourceNames;
        console.log(`dbNames: ${$dbNames}`); 
        chartConfigs = db.vyssuals._chartConfigs;
        await db.get($dbNames[0]).metadata.toCollection().primaryKeys().then((keys) => {
            attributeKeys = keys;
        })
        console.log(`attributeKeys: ${attributeKeys}`); 

        if ($chartToEdit != "") {
            db.vyssuals.chartConfigs.get($chartToEdit).then((chart) => {
                if (chart) {
                    config = chart;
                } else {
                    config = createConfig();
                }
            });
        } else {
            config = createConfig();
        }
    });

    $: if (config) {
        db.get(config.dataSourceName).metadata.toCollection().primaryKeys().then((keys) => {
            attributeKeys = keys;
        })
    }

    function createConfig(): ChartConfig {
        return {
            id: Math.random().toString(36).slice(2, 12),
            index: 0,
            dataSourceName: $dbNames[0]?.toString() ?? "<No Data>",
            chartType: "bar",
            showValues: attributeKeys[0]?.toString() ?? "<No Data>",
            groupBy: attributeKeys[0]?.toString() ?? "<No Data>",
            startColor: $startColor,
            endColor: $endColor,
        };
    }

    function handleCreateChart() {
        saveChartConfig();
        hideChartEditor();
    }

    function handleUpdateChart() {
        saveChartConfig();
    }

    function hideChartEditor() {
        showChartEditor.set(false);
        chartToEdit.set("");
    }

    export async function saveChartConfig() {
        if (config.index <= 0) {
        const count = await db.vyssuals.chartConfigs.count()
        config.index = count + 1;
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
        <div class="chart-editor" id="chartEditor">
            <h1>Chart Editor</h1>
            {#if config && attributeKeys && $dbNames}
                <div>
                    <div class="config-option">
                        <label for="dataSource">Data Source:</label>
                        <select class="config-select" id="dataSource" bind:value={config.dataSourceName}>
                            {#each $dbNames as name}
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
                            <!-- <option value="line">Timeline</option> -->
                        </select>
                    </div>

                    <div class="config-option">
                        <label title="This attribute goes on the X axis" for="showValues">Show Values Of:</label>
                        <select class="config-select" id="showValues" bind:value={config.showValues}>
                            {#each attributeKeys as key}
                                <option value={key}>{key}</option>
                            {/each}
                        </select>
                    </div>

                    {#if !(config.chartType === "total" || config.chartType === "line")}
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
