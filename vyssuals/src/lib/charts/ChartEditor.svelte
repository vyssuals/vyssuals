<script lang="ts">
  import { dataset } from "../store";
  import {
    startColor,
    endColor,
    editChartIndex,
    showChartEditor,
    chartConfigs,
    dataSources,
  } from "../store";
  import type { ChartConfig, ChartType, DataSource } from "../types";
  import Draggable from "../wrapper/Draggable.svelte";
  import FloatingWindow from "../wrapper/FloatingWindow.svelte";

  const left = window.innerWidth / 2 - 135;
  const top = window.innerHeight / 2 - 250;

  let dataSourceName: string;

  let chartType: ChartType;
  let showValues: string;
  let groupBy: string;
  let selectedStartColor: string;
  let selectedEndColor: string;

  let attributeKeys: string[];

  if ($editChartIndex > -1) {
    dataSourceName = $chartConfigs[$editChartIndex].dataSourceName;
    chartType = $chartConfigs[$editChartIndex].chartType;
    showValues = $chartConfigs[$editChartIndex].showValues;
    groupBy = $chartConfigs[$editChartIndex].groupBy;
    selectedStartColor = $chartConfigs[$editChartIndex].startColor;
    selectedEndColor = $chartConfigs[$editChartIndex].endColor;
  } else {
    dataSourceName = $dataset[0].dataSourceName;
    chartType = "bar";
    selectedStartColor = $startColor;
    selectedEndColor = $endColor;
  }

  // Reactive statement for data processing
  $: {
    let dataSource: DataSource | undefined = $dataSources.find(
      (item) => item.name === dataSourceName
    );
    if (dataSource) {
      attributeKeys = dataSource.headerData.map((item) => item.name);
    }
    if (attributeKeys.length > 0) {
      if (!showValues || !attributeKeys.includes(showValues)) {
        showValues = attributeKeys[0];
      }
      if (!groupBy || !attributeKeys.includes(groupBy)) {
        groupBy = attributeKeys[0];
      }
    } else {
      showValues = "No Data";
      groupBy = "No Data";
    }
  }

  function handleCreateChart() {
    saveChartConfig();
    hideChartEditor();
  }

  function handleUpdateChart() {
    saveChartConfig();
  }

  function hideChartEditor() {
    showChartEditor.set(false);
    editChartIndex.set(-1);
  }

  export function addChartConfig(config: ChartConfig) {
    chartConfigs.update((data) => [...data, config]);
  }

  // function for creating a chartConfig based on two inputs: groupBy and showValues. the data to used is the dataset store.
  export function saveChartConfig(): void {
    const config = {
      id: Math.random().toString(36).slice(2, 11),
      dataSourceName: dataSourceName,
      chartType,
      showValues,
      groupBy,
      startColor: selectedStartColor,
      endColor: selectedEndColor,
    };
    editChartIndex.subscribe((index) => {
      if (index > -1) {
        updateChartConfig(config, index);
      } else {
        addChartConfig(config);
      }
    })();
    startColor.set(selectedStartColor);
    endColor.set(selectedEndColor);
  }

  export function updateChartConfig(config: ChartConfig, index: number) {
    chartConfigs.update((data) => {
      data[index] = config;
      return data;
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideChartEditor}>
  <Draggable {left} {top}>
    <div class="chart-editor" id="chartEditor">
      <h1>Chart Editor</h1>

      <div>
        <div class="config-option">
          <label for="dataSource">Data Source:</label>
          <select class="config-select" id="dataSource" bind:value={dataSourceName}>
            {#each $dataSources as source}
              <option value={source.name}>{source.name}</option>
            {/each}
          </select>
        </div>

        <div class="config-option">
          <label for="chartType">Chart Type:</label>
          <select class="config-select" id="chartType" bind:value={chartType}>
            <option value="bar">Bar</option>
            <option value="doughnut">Doughnut</option>
            <option value="total">Total</option>
            <!-- <option value="line">Timeline</option> -->
          </select>
        </div>

        <div class="config-option">
          <label title="This attribute goes on the X axis" for="showValues"
            >Show Values Of:</label
          >
          <select class="config-select" id="showValues" bind:value={showValues}>
            {#each attributeKeys as key}
              <option value={key}>{key}</option>
            {/each}
          </select>
        </div>

        {#if !(chartType === "total" || chartType === "line")}
          <div class="config-option">
            <label title="This attribute goes on the Y axis" for="groupBy"
              >Grouped By:</label
            >
            <select class="config-select" id="groupBy" bind:value={groupBy}>
              {#each attributeKeys as key}
                <option value={key}>{key}</option>
              {/each}
            </select>
          </div>
        {/if}

        {#if !(chartType === "total")}
          <div class="config-option">
            <input
              class="color-input"
              type="color"
              id="startColor"
              bind:value={selectedStartColor}
              style="background-color: {selectedStartColor}"
            />
            <input
              class="color-input"
              type="color"
              id="endColor"
              bind:value={selectedEndColor}
              style="background-color: {selectedEndColor}"
            />
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
    width: 260px;
    gap: 10px;
    background-color: var(--card-background-color);
    border-radius: 1em;
    padding: 1em;
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
