<script lang="ts">
    import { chartConfigs } from '../store';
    import Chart from './Chart.svelte';

    // Function to remove chart at the given index
    function removeChart(index: number) {
        chartConfigs.update(configs => {
            // Create a new array excluding the chart configuration at the given index
            const newConfigs = configs.filter((_, i) => i !== index);
            return newConfigs;
        });
    }
</script>

{#if $chartConfigs.length > 0}
    <div class="grid-container">
        <!-- Iterate over the chart configurations and display their index -->
        {#each $chartConfigs as config, index}
            <div class="grid-item">
                <Chart chartConfig={config} />
                <button on:click={() => removeChart(index)}>Remove</button> <!-- Button to remove chart -->
            </div>
        {/each}
    </div>
{/if}

<style>
    /* CSS styles for the grid */
    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 3 columns */
        gap: 10px;
    }

    .grid-item {
        background-color: #f2f2f2;
        padding: 20px;
        text-align: center;
    }

    .grid-item:hover {
        filter: drop-shadow(0 0 0.5em #05305548);
    }
</style>