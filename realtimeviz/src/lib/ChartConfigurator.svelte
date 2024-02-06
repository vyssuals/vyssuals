<script lang="ts">
    import { onMount } from 'svelte';
    import { dataset } from '../store';
    import { showChartConfigurator } from '../store';
    import { getDiagramCount, addDiagramInfo } from '../store';
    import type { DataItem, DiagramInfo } from '../types';
    import { logDiagramInfo } from '../store';

  let attributeKeys: string[] = []; // Array to hold unique attribute keys
  let selectedShowValues: string = '';
  let selectedGroupBy: string = '';

  // Subscribe to changes in the dataset store
  const unsubscribe = dataset.subscribe((value: DataItem[]) => {
    // Extract all unique attribute keys
    const allKeys: string[] = value.flatMap(item => Object.keys(item.attributes));
    attributeKeys = Array.from(new Set(allKeys));
  });

  // Unsubscribe after the initial update
  onMount(() => unsubscribe());

  const diagramInfo: DiagramInfo = { 
    diagramNumber: getDiagramCount() + 1,
    groupBy: 'none',
    showValues: 'none'
    }

  function handleCreateDiagram() {
    diagramInfo.groupBy = selectedGroupBy;
    diagramInfo.showValues = selectedShowValues;
    addDiagramInfo(diagramInfo);
    showChartConfigurator.update(value => !value);
    logDiagramInfo();
  }
</script>

<div>
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

  <button on:click={handleCreateDiagram}>Create Diagram</button>
</div>