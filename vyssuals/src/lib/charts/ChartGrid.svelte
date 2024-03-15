<script lang="ts">
    import { chartToEdit, showChartEditor } from "../store";
    import Chart from "./Chart.svelte";
    import html2canvas from "html2canvas";
    import { formatTitle } from "../utils/textUtils";
    import { db } from "../data/databaseManager";
    import type { ChartConfig } from "../types";
    import { liveQuery } from "dexie";
    import { blur } from "svelte/transition";


    let gridItems: any = [];

    $: chartConfigs = liveQuery(() => db.vyssuals.chartConfigs.toArray().then((configs) => configs.sort((a, b) => a.index - b.index)));

    const width: Record<string, string> = {
        bar: "595px",
        doughnut: "380px",
        total: "165px",
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
</script>

<div class="grid-container">
    {#if $chartConfigs}
        {#each $chartConfigs as config, index (config.id)}
            <div class="grid-item" bind:this={gridItems[index]} style="width: {width[config.chartType]}" transition:blur={{ duration: 500 }}>
                <Chart config={config} />
                <button title="Close" class="close-button" on:click={() => handleRemoveChart(config)}>&times;</button>
                <button title="Edit" class="edit-button" on:click={() => handleEditChart(config)}>&#9998;</button>
                <button title="Download Image" class="export-button" on:click={() => exportNodeAsPNG(index)}>&DownArrowBar;</button>

                <h3 class="datasource-overlay">{$chartConfigs[index].dataSourceName}</h3>
            </div>
        {/each}
    {/if}
</div>

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
        padding: 20px;
        border-radius: 1em;
    }

    .grid-item:hover {
        filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
        transition: 100ms;
    }

    .grid-item:hover .close-button {
        visibility: visible;
    }

    .grid-item:hover .edit-button {
        visibility: visible;
    }

    .grid-item:hover .export-button {
        visibility: visible;
    }

    .grid-item:hover .datasource-overlay {
        color: var(--color);
        transition: 0.5s;
    }

    button {
        font-weight: 700;
        font-size: large;
        background-color: #00000000;
        border: none;
        cursor: pointer;
        visibility: hidden;
    }

    .close-button {
        position: absolute;
        top: 0.3em;
        right: 0.3em;
    }

    .close-button:hover {
        filter: drop-shadow(0 0 8px #000000);
    }

    .edit-button {
        position: absolute;
        top: 0.3em;
        left: 0.3em;
    }

    .edit-button:hover {
        filter: drop-shadow(0 0 8px #000000);
    }

    .export-button {
        position: absolute;
        top: 0.3em;
        left: 2.4em;
    }

    .export-button:hover {
        filter: drop-shadow(0 0 8px #000000);
    }
</style>
