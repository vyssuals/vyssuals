<!-- GridFromStore.svelte -->

<script lang="ts">
    import { chartConfigs } from '../store';
    import { onMount } from 'svelte';
    import type { ChartConfig } from '../types';

    // Define an empty array to hold chart configurations
    let chartConfigurations: ChartConfig[] = [];

    // Subscribe to the chartConfigs store and update the local array
    const unsubscribe = chartConfigs.subscribe(value => {
        chartConfigurations = value;
    });

    // Unsubscribe from the store when the component is destroyed
    onMount(() => {
        return () => {
            unsubscribe();
        };
    });
</script>

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
</style>

{#if chartConfigurations.length > 0}
    <div class="grid-container">
        <!-- Iterate over the chart configurations and display their index -->
        {#each chartConfigurations as config, index}
            <div class="grid-item">{index}</div>
        {/each}
    </div>
{/if}