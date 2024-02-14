<script lang="ts">
  import { dataset } from './store';
  import { startColor, endColor, editChartIndex, showChartEditor, chartConfigs } from './store';
  import { getUniqueAttributeKeys,  } from './utils/dataUtils';
  import type { ChartConfig } from './types';
  import Draggable from './Draggable.svelte';
  import FloatingWindow from './FloatingWindow.svelte';


  const left = (window.innerWidth / 2) - 135;
  const top = (window.innerHeight / 2) - 250;

  let dataSource: string;
  const dataSources = () => {
    return Array.from(new Set($dataset.map(item => item.dataSource)));
  }
  let chartType: string;
  let showValues: string;
  let groupBy: string;
  let unitSymbol: string;
  const unitSymbols = ['Count', 'm', 'm2', 'm3', 'ft', 'ft2', 'ft3'];
  let selectedStartColor: string;
  let selectedEndColor: string;

  let attributeKeys = getUniqueAttributeKeys($dataset);

  if ($editChartIndex === -1) {
    // In this scenario, we are creating a new chart, 
    // so we set the default values to the first attribute key
    dataSource = $dataset[0].dataSource;
    chartType = 'bar';
    showValues = attributeKeys.length > 0 ? attributeKeys[0] : 'No Data';
    groupBy = attributeKeys.length > 0 ? attributeKeys[0] : 'No Data';
    unitSymbol = unitSymbols[0];
    selectedStartColor = $startColor;
    selectedEndColor = $endColor;
  }
  else 
  {
    // In this scenario, we are editing an existing chart,
    // so we set the default values to the values of the chart being edited
    dataSource = $chartConfigs[$editChartIndex].dataSource;
    chartType = $chartConfigs[$editChartIndex].chartType;
    showValues = $chartConfigs[$editChartIndex].showValues;
    groupBy = $chartConfigs[$editChartIndex].groupBy;
    unitSymbol = $chartConfigs[$editChartIndex].unitSymbol;
    selectedStartColor = $chartConfigs[$editChartIndex].startColor;
    selectedEndColor = $chartConfigs[$editChartIndex].endColor;
  }

  function handleCreateChart() {
    saveChartConfig();
    hideChartEditor();
  }

  function handleUpdateChart() {
    saveChartConfig();
 }
  
  function hideChartEditor() {
    showChartEditor.set(false)
    editChartIndex.set(-1);
}

export function addChartConfig(config: ChartConfig) {
    chartConfigs.update(data => [...data, config]);
}

// function for creating a chartConfig based on two inputs: groupBy and showValues. the data to used is the dataset store.
export function saveChartConfig(): void {
    const config = {
        id: Math.random().toString(36).slice(2, 11),
        dataSource,
        chartType,
        showValues,
        groupBy,
        unitSymbol,
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
  
  <!-- <div class="floating-window" on:click|self={toggleChartEditor}> -->
    
  <FloatingWindow on:click={hideChartEditor}>
    <Draggable {left} {top}>
    <div class="chart-editor">
      <h2>Chart Editor</h2>

      <div>
        <div class="config-option">
          <label for="dataSource">Data Source:</label>
          <select id="dataSource" bind:value={dataSource}>
          {#each dataSources() as source}
            <option value={source}>{source}</option>
          {/each}
        </div>

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
        <select id="showValues" bind:value={showValues}>
        {#each attributeKeys as key}
          <option value={key}>{key}</option>
        {/each}
        </select>
      </div>
      
      {#if !(chartType === 'total')}
        <div class="config-option">
          <label for="groupBy">Grouped By:</label>
          <select id="groupBy" bind:value={groupBy}>
          {#each attributeKeys as key}
            <option value={key}>{key}</option>
          {/each}
          </select>
        </div>
      {/if}
      
      <div class="config-option">
        <label for="unitSymbol">Unit Symbol:</label>
        <select id="unitSymbol" bind:value={unitSymbol}>
        {#each unitSymbols as symbol}
          <option value={symbol}>{symbol}</option>
        {/each}
      </div>
        
      {#if !(chartType === 'total')}
        <div class="config-option">
          <input class="color-input" type="color" id="startColor" bind:value={selectedStartColor} style="background-color: {selectedStartColor}" />
          <input class="color-input" type="color" id="endColor" bind:value={selectedEndColor} style="background-color: {selectedEndColor}" />
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
</FloatingWindow>



<style>
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
    width: 100px;
    overflow: hidden; /* Hide overflowed content */
    text-overflow: ellipsis; /* Show ellipsis (...) when the content overflows */
    white-space: nowrap; /* Prevent text from wrapping onto the next line */
  }

  .color-input {
    padding: 1px;
    border-radius: 0.5em;
    width: 100%;
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