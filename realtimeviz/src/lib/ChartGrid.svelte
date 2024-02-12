<script lang="ts">
    import { chartConfigs, editChartIndex } from './store';
    import Chart from './charts/Chart.svelte';
    import { showChartEditor } from './store'; 

    const width: Record<string, string> = {
        'bar': '595px',
        'doughnut': '380px',
        'total': '165px'
    }


    function handleRemoveChart(index: number) {
        chartConfigs.update(configs => {
            // Create a new array excluding the chart configuration at the given index
            const newConfigs = configs.filter((_, i) => i !== index);
            return newConfigs;
        });
    }

    function handleEditChart(index: number) {
        editChartIndex.set(index);
        showChartEditor.set(true);
    }

</script>


<div class="grid-container">
    {#each $chartConfigs as config, index}
    <div class="grid-item" style="width: {width[config.type]}">
        <Chart index={index} />
        <button class="close-button" on:click={() => handleRemoveChart(index)}>x</button>
        <button class="edit-button" on:click={() => handleEditChart(index)}>...</button>             
    </div>
    {/each}
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
        height: 400px;
        background-color: var(--card-background-color);
        padding: 20px;
        border-radius: 1em;

    }

    .grid-item:hover {
        filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
    }

    .grid-item:hover .close-button {
        visibility: visible;
    }

    .grid-item:hover .edit-button {
        visibility: visible;
    }


    .close-button {
        position: absolute;
        top: 0.3em;
        right: 0.3em;
        background-color: #00000000;
        border: none;
        cursor: pointer;
        visibility: hidden;
    }

    .close-button:hover {
        filter: drop-shadow(0 0 8px #000000);
    }

    .edit-button {
        position: absolute;
        top: 0.3em;
        left: 0.3em;
        background-color: #00000000;
        border: none;
        cursor: pointer;
        visibility: hidden;
    }

    .edit-button:hover {
        filter: drop-shadow(0 0 8px #000000);
    }

</style>