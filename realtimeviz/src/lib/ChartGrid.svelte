<script lang="ts">
    import { chartConfigs, editChartIndex } from '../store';
    import Chart from './Chart.svelte';
    import { showChartEditor } from '../store';

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

{#if $chartConfigs.length > 0}
    <div class="grid-container">
        {#each $chartConfigs as config, index}
            <div class="grid-item">
                <Chart chartConfig={config} />
                <button class="close-button" on:click={() => handleRemoveChart(index)}>x</button>
                <button class="edit-button" on:click={() => handleEditChart(index)}>...</button>             
            </div>
        {/each}
    </div>
{/if}

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 3 columns */
        gap: 10px;
    }

    .grid-item:hover {
        filter: drop-shadow(0 0 0.5em #4e4f4f48);
    }

    .grid-item:hover .close-button {
        visibility: visible;
    }

    .grid-item:hover .edit-button {
        visibility: visible;
    }
    
    .grid-item {
        position: relative; /* Add this line to make the close button relative to the grid item */
        background-color: var(--card-background-color);
        padding: 20px;
        text-align: center;
        border-radius: 1em;
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