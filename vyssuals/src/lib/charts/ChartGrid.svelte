<script lang="ts">
    import { chartToEdit, showChartEditor, colorSyncChartConfig } from "../store";
    import Chart from "./Chart.svelte";
    import html2canvas from "html2canvas";
    import { formatTitle } from "../utils/textUtils";
    import { db } from "../data/databaseManager";
    import type { ChartConfig } from "../types";
    import { liveQuery } from "dexie";
    import { blur } from "svelte/transition";
    import { flip } from "svelte/animate";


    let gridItems: any = [];

    $: chartConfigs = liveQuery(() => db.vyssuals.chartConfigs.toArray().then((configs) => configs.sort((a, b) => a.index - b.index)));

    $: if ($chartConfigs) {
        let isChanged = false;
        $chartConfigs.forEach((config, index) => {
            if (config.index !== index) {
                config.index = index;
                isChanged = true;
            }
        });
        if (isChanged) {
            db.vyssuals.chartConfigs.bulkPut($chartConfigs);
        }
    }

    const width: Record<string, string> = {
        bar: "595px",
        doughnut: "380px",
        total: "280px",
        // total: "165px",
    };

    function handleRemoveChart(chart: ChartConfig) {
        db.vyssuals.chartConfigs.delete(chart.id);
    }

    function handleEditChart(chart: ChartConfig) {
        chartToEdit.set(chart.id);
        showChartEditor.set(true);
    }

    async function exportNodeAsPNG(index: number): Promise<void> {
        const node = gridItems[index];
        const filename = generateFileName(index);

        const scale = 2; // Increase this to increase resolution
        const canvas = await html2canvas(node, { scale });

        const dataURL = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function generateFileName(index: number): string {
        // naming pattern: YYYY-MM-DD_Chart-Title_Index.png
        const date = new Date().toISOString().split("T")[0];
        const title = formatTitle($chartConfigs[index]);
        return `${date}_${title}_${index}.png`;
    }

    function toggleColorSync(config: ChartConfig): void {
        if ($colorSyncChartConfig && $colorSyncChartConfig.id === config.id) {
            colorSyncChartConfig.set(null);
        } else {
            colorSyncChartConfig.set(config);
        }
        console.log("colorSyncChartConfig", $colorSyncChartConfig);
    }

</script>

{#if $chartConfigs}
    <div class="grid-container">
        {#each $chartConfigs as config, index (config.id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class={$colorSyncChartConfig && $colorSyncChartConfig.id === config.id ? 'grid-item color-sync' : 'grid-item'} bind:this={gridItems[index]} style="width: {width[config.chartType]}" transition:blur={{ duration: 300 }} animate:flip={{ duration: 300 }} on:click={() => toggleColorSync(config)}>
                <Chart config={config} />
                <button title="Close" class="close-button" on:click={() => handleRemoveChart(config)}>&#x2717;</button>
                <button title="Edit" class="edit-button" on:click={() => handleEditChart(config)}>&#9998;</button>
                <button title="Download Image" class="export-button" on:click={() => exportNodeAsPNG(index)}>&DownArrowBar;</button>
                <!-- <button title="Sync Colors" class="sync-button" on:click={() => toggleColorSync(config)}>&#x2756;</button> -->
            </div>
        {/each}
    </div>
{/if}

<style>
    .grid-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
    }

    .grid-item {
        text-align: center;
        position: relative;
        height: 400px;
        background-color: var(--card-background-color);
        padding: 0.3em 20px 20px;
        border-radius: 1em;
    }

    .color-sync {
        border: 2px solid red;
    }

    .grid-item:hover {
        filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
        transition: 100ms;
    }

    .grid-item:hover button {
        opacity: 0.8;
        transition: 500ms;
    }

    button {
        font-weight: 700;
        font-size: large;
        background-color: #00000000;
        border: none;
        cursor: pointer;
        opacity: 0;
        right: 0.3em;
        position: absolute;
    }
    
    button:hover {
        opacity: 1;
        scale: 1.3;
    }
    
    .close-button {
        opacity: 0.05;
        top: 0.5rem;
    }

    .close-button:hover {
        content: "Close";
    }
    
    .edit-button {
        top: 2.75rem;
    }
    
    .export-button {
        top: 5rem;
    }

    .sync-button {
        top: 7.25rem;
    }

</style>
