<script lang="ts">
  import { dataset } from './store';
  import { startColor, endColor, editChartIndex, showChartEditor, chartConfigs } from './store';
  import { getUniqueAttributeKeys,  } from './utils/dataUtils';
  import type { ChartConfig } from './types';
  import Draggable from './Draggable.svelte';

  const left = (window.innerWidth / 2) - 135;
  const top = (window.innerHeight / 2) - 250;

  let chartType: string;
  let selectedShowValues: string;
  let selectedGroupBy: string;
  let selectedUnitSymbol: string;
  const unitSymbols = ['Count', 'm', 'm2', 'm3', 'ft', 'ft2', 'ft3'];
  let selectedStartColor: string;
  let selectedEndColor: string;

  let attributeKeys = getUniqueAttributeKeys($dataset);

  if ($editChartIndex === -1) {
    // In this scenario, we are creating a new chart, 
    // so we set the default values to the first attribute key
    selectedShowValues = attributeKeys.length > 0 ? attributeKeys[0] : 'No Data';
    selectedGroupBy = attributeKeys.length > 0 ? attributeKeys[0] : 'No Data';
    chartType = 'bar';
    selectedUnitSymbol = unitSymbols[0];
    selectedStartColor = $startColor;
    selectedEndColor = $endColor;
  }
  else 
  {
    // In this scenario, we are editing an existing chart,
    // so we set the default values to the values of the chart being edited
    selectedShowValues = $chartConfigs[$editChartIndex].showValues;
    selectedGroupBy = $chartConfigs[$editChartIndex].groupBy;
    chartType = $chartConfigs[$editChartIndex].type;
    selectedUnitSymbol = $chartConfigs[$editChartIndex].unitSymbol;
    selectedStartColor = $chartConfigs[$editChartIndex].startColor;
    selectedEndColor = $chartConfigs[$editChartIndex].endColor;
  }

  function handleCreateChart() {
    saveChartConfig(chartType, selectedGroupBy, selectedShowValues, selectedUnitSymbol);
    toggleChartEditor();
  }

  function handleUpdateChart() {
    saveChartConfig(chartType, selectedGroupBy, selectedShowValues, selectedUnitSymbol);
    toggleChartEditor 
 }
  
  function toggleChartEditor() {
    showChartEditor.set(false)
    editChartIndex.set(-1);
}

export function addChartConfig(config: ChartConfig) {
    chartConfigs.update(data => [...data, config]);
}

// function for creating a chartConfig based on two inputs: groupBy and showValues. the data to used is the dataset store.
export function saveChartConfig(chartType: string, groupBy: string, showValues: string, unitSymbol: string): void {
    const config = {
        id: Math.random().toString(36).substr(2, 9),
        type: chartType,
        showValues: showValues,
        groupBy: groupBy,
        unitSymbol: unitSymbol,
        startColor: selectedStartColor,
        endColor: selectedEndColor
    }
    editChartIndex.subscribe((index) => {
        if (index > -1) {
            updateChartConfig(config, index);
        } 
        else 
        {
        addChartConfig(config);
        }
    })();
    startColor.set(selectedStartColor);
    endColor.set(selectedEndColor);
}

export function updateChartConfig(config: ChartConfig, index: number) {
    chartConfigs.update(data => {
        data[index] = config;
        return data;
    });
}

</script>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  
  <div class="chart-editor-overlay" on:click|self={toggleChartEditor}>
    <Draggable {left} {top}>
    <div class="chart-editor">
      <h2>Chart Editor</h2>
    <div>
      <div class="config-option">
        <label for="chartType">Chart Type:</label>
        <select id="chartType" bind:value={chartType}> 
          <option value="bar">Bar</option>
          <option value="doughnut">Doughnut</option>
          <option value="total">Total</option>
        </select>
      </div>
      
      <div class="config-option">
        <label for="showValues">Show Values Of:</label>
        <select id="showValues" bind:value={selectedShowValues}>
          {#each attributeKeys as key}
          <option value={key}>{key}</option>
          {/each}
        </select>
      </div>
      
      {#if !(chartType === 'total')}
      <div class="config-option">
        <label for="groupBy">Grouped By:</label>
        <select id="groupBy" bind:value={selectedGroupBy}>
          {#each attributeKeys as key}
          <option value={key}>{key}</option>
          {/each}
        </select>
      </div>
      {/if}
      
      <div class="config-option">
        <label for="unitSymbol">Unit Symbol:</label>
        <select id="unitSymbol" bind:value={selectedUnitSymbol}>
          {#each unitSymbols as symbol}
          <option value={symbol}>{symbol}</option>
          {/each}
        </div>
        
        {#if !(chartType === 'total')}
        <div class="config-option">
          <input class="color-input" type="color" id="startColor" bind:value={selectedStartColor} style="background-color: {selectedStartColor}"/>
          <input class="color-input" type="color" id="endColor" bind:value={selectedEndColor} style="background-color: {selectedEndColor}"/>
        </div>
        {/if}
    </div>
        
        {#if $editChartIndex > -1}
        <button on:click={handleUpdateChart}>Update Chart</button>
        {:else}
        <button on:click={handleCreateChart}>Create Chart</button>
        {/if}
      </div>
    </Draggable>
    </div>


<style>
.chart-editor-overlay {
    background: rgba(0, 0, 0, 0.149);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
  }

  .chart-editor {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 240px;
    gap: 10px;
    background-color: var(--card-background-color);
    border-radius: 1em;
    padding: 1em;
  }

  .config-option {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    text-align: right;
    gap: 5px;
    margin: 10px;
  }

  label {
    font-weight: 300;
    align-self: center;
    font-size: 0.9em;
  }
  
  select {
    padding: 5px;
    border-radius: 0.5em;
    background-color: var(--card-background-color);
    border-color: var(--outline-color);
  }

  .color-input {
    padding: 1px;
    border-radius: 0.5em;
    width: 100%;
    /* background-color: var(--card-background-color); */
    border: none;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }

  .color-input::-webkit-color-swatch {
    border: none;
  }

  button {
    background-color: var(--background-color);
    border: none;
    color: var(--color);
    cursor: pointer;
    width: 86%;

  }

  button:hover {
    filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
    color: #05acffa0;
  }
</style>