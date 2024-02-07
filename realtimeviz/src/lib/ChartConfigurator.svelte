<script lang="ts">
    import { onMount } from 'svelte';
    import { dataset, logChartConfigs } from '../store';
    import { showChartConfigurator } from '../store';
    import type { DataItem } from '../types';
    import { createChartConfigFromDiagram } from '../store';

  let attributeKeys: string[] = []; // Array to hold unique attribute keys
  
  // Subscribe to changes in the dataset store
  const unsubscribe = dataset.subscribe((value: DataItem[]) => {
      // Extract all unique attribute keys
      const allKeys: string[] = value.flatMap(item => Object.keys(item.attributes));
      attributeKeys = Array.from(new Set(allKeys));
    });
    
    let chartType: string = 'bar';
    let selectedShowValues: string = attributeKeys.length > 0 ? attributeKeys[0] : 'No Data';
    let selectedGroupBy: string = attributeKeys.length > 0 ? attributeKeys[0] : 'No Data';

  // Unsubscribe after the initial update
  onMount(() => unsubscribe());

  function handleCreateChart() {
    createChartConfigFromDiagram(chartType, selectedGroupBy, selectedShowValues);
    showChartConfigurator.update(value => !value);
    logChartConfigs();
  }
</script>

<div>
  <h2>Chart Configurator</h2>
  
  <label for="chartType">Chart Type:</label>
  <select id="chartType" bind:value={chartType}> 
    <option value="bar">Bar Chart</option>
    <option value="pie">Pie Chart</option>
    <option value="line">Line Chart</option>
  </select>

  <label for="showValues">Show Values Of:</label>
  <select id="showValues" bind:value={selectedShowValues}>
    {#each attributeKeys as key}
      <option value={key}>{key}</option>
    {/each}
  </select>

  <label for="groupBy">Grouped By:</label>
  <select id="groupBy" bind:value={selectedGroupBy}>
    {#each attributeKeys as key}
      <option value={key}>{key}</option>
    {/each}
  </select>

  <button on:click={handleCreateChart}>Create Diagram</button>
</div>