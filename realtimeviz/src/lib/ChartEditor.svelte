<script lang="ts">
    import { onMount } from 'svelte';
    import { dataset } from '../store';
    import { showChartEditor } from '../store';
    import type { DataItem } from '../types';
    import { createChartConfigFromSelection } from '../store';

    import { startColor, endColor } from "../store";

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
    createChartConfigFromSelection(chartType, selectedGroupBy, selectedShowValues);
    showChartEditor.update(value => !value);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.chart-editor')) {
      showChartEditor.set(false);
    }
  }

  onMount(() => {
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100); // Add a delay of 100 milliseconds
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

</script>

<div class="chart-editor-overlay">
  <div class="chart-editor">
    <h2>Chart Editor</h2>

    <div class="config-opotion">
      <label for="chartType">Chart Type:</label>
      <select id="chartType" bind:value={chartType}> 
        <option value="bar">Bar</option>
        <option value="doughnut">Doughnut</option>
        <option value="total">Total</option>
      </select>
    </div>

    <div class="config-opotion">
      <label for="showValues">Show Values Of:</label>
      <select id="showValues" bind:value={selectedShowValues}>
        {#each attributeKeys as key}
        <option value={key}>{key}</option>
        {/each}
      </select>
    </div>

    {#if !(chartType === 'total')}
      <div class="config-opotion">
        <label for="groupBy">Grouped By:</label>
        <select id="groupBy" bind:value={selectedGroupBy}>
          {#each attributeKeys as key}
          <option value={key}>{key}</option>
          {/each}
        </select>
      </div>
    {/if}

    <div class="config-opotion">
      <label for="startColor">Start Color:</label>
      <input type="color" id="startColor" bind:value={$startColor} />

      <label for="endColor">End Color:</label>
      <input type="color" id="endColor" bind:value={$endColor} />
    </div>

    <button on:click={handleCreateChart}>Create Diagram</button>
  </div>

</div>

<style>
  .chart-editor-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    filter: drop-shadow(0 0 0.5em #05305548);
  }

  .chart-editor {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    gap: 10px;
    background-color: var(--card-background-color);
    border-radius: 1em;
    padding: 1em;
  }

  .config-opotion {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    text-align: right;
    gap: 5px;
  }

  label {
    font-weight: medium;
    font-size: meduim;
  }
  
  select {
    padding: 5px;
    border-radius: 0.5em;
    background-color: var(--card-background-color);
    border-color: var(--outline-color);
  }
  
  input {
    padding: 1px;
    border-radius: 0.5em;
    width: 100%;
    background-color: var(--card-background-color);
    border: none;
  }
  button {
    padding: 10px;
    background-color: #00000029;
    border: none;
    cursor: pointer;
  }

  button:hover {
    filter: drop-shadow(0 0 0.2em #4e4f4f48);
  }
</style>