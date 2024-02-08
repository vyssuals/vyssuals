<script lang="ts">
  import { onMount } from 'svelte';
  import { dataset } from '../store';
  import { startColor, endColor, editChartIndex, showChartEditor, chartConfigs } from "../store";
  import { getUniqueAttributeKeys,  } from './dataUtils';
  import type { ChartConfig } from '../types';


  let chartType: string;
  let selectedShowValues: string;
  let selectedGroupBy: string;

  let attributeKeys = getUniqueAttributeKeys($dataset);

  if ($editChartIndex === -1) {
    // In this scenario, we are creating a new chart, 
    // so we set the default values to the first attribute key
    selectedShowValues = attributeKeys.length > 0 ? attributeKeys[0] : 'No Data';
    selectedGroupBy = attributeKeys.length > 0 ? attributeKeys[0] : 'No Data';
    chartType = 'bar';
  }
  else 
  {
    // In this scenario, we are editing an existing chart,
    // so we set the default values to the values of the chart being edited
    selectedShowValues = $chartConfigs[$editChartIndex].showValues;
    selectedGroupBy = $chartConfigs[$editChartIndex].groupBy;
    chartType = $chartConfigs[$editChartIndex].type;
  }

  function handleCreateChart() {
    saveChartConfig(chartType, selectedGroupBy, selectedShowValues);
    showChartEditor.update(value => !value);
  }

  function handleUpdateChart() {
    saveChartConfig(chartType, selectedGroupBy, selectedShowValues);
    showChartEditor.update(value => !value);
    editChartIndex.set(-1);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.chart-editor')) {
      showChartEditor.set(false);
      editChartIndex.set(-1);
    }
  }

export function addChartConfig(config: ChartConfig) {
    chartConfigs.update(data => [...data, config]);
}


// function for creating a chart config, returns chartconfig
export function createChartConfig(type: string, showValues: string, groupBy: string): ChartConfig {
    return {
        type: type,
        showValues: showValues,
        groupBy: groupBy,
    };
}

// function for creating a chartConfig based on two inputs: groupBy and showValues. the data to used is the dataset store.
export function saveChartConfig(chartType: string, groupBy: string, showValues: string): void {
    const config = createChartConfig(chartType, showValues, groupBy);
    editChartIndex.subscribe((index) => {
        if (index > -1) {
            updateChartConfig(config, index);
        } 
        else 
        {
        addChartConfig(config);
        }
    })();
}
// // function for creating a chartConfig based on two inputs: groupBy and showValues. the data to used is the dataset store.
// export function saveChartConfig(chartType: string, groupBy: string, showValues: string): void {
//     const labels = getAttributeValues($dataset, groupBy);
//     const data = createChartData(labels, [
//         createChartDataset(showValues, labels.map(label => aggregateAttributeBy($dataset, showValues, label, groupBy)))
//     ]);
//     const options = {};
//     const config = createChartConfig(chartType, data, showValues, groupBy, options);
//     editChartIndex.subscribe((index) => {
//         if (index > -1) {
//             updateChartConfig(config, index);
//         } 
//         else 
//         {
//         addChartConfig(config);
//         }
//     })();
// }

export function updateChartConfig(config: ChartConfig, index: number) {
    chartConfigs.update(data => {
        data[index] = config;
        return data;
    });
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

    {#if $editChartIndex > -1}
      <button on:click={handleUpdateChart}>Update Chart</button>
    {:else}
    <button on:click={handleCreateChart}>Create Chart</button>
    {/if}
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