<script lang="ts">
    import { chartConfigs, editChartIndex } from './store';
    import Chart from './charts/Chart.svelte';
    import { showChartEditor } from './store';

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
                <Chart index={index} />
                <button class="close-button" on:click={() => handleRemoveChart(index)}>x</button>
                <button class="edit-button" on:click={() => handleEditChart(index)}>...</button>             
            </div>
        {/each}
    </div>
{/if}

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, minmax(300px, 1fr)); /* 3 columns with a minimum width of 300px */
        gap: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    @media (max-width: 900px) {
        .grid-container {
            grid-template-columns: repeat(2, minmax(300px, 1fr)); /* 2 columns with a minimum width of 300px */
        }
    }

    @media (max-width: 600px) {
        .grid-container {
            grid-template-columns: repeat(1, minmax(300px, 1fr)); /* 1 column with a minimum width of 300px */
        }
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
        max-height: 400px;
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