<script lang="ts">
  import FloatingWindow from "./FloatingWindow.svelte";
  import {
    showDataConnectionEditor,
    dataSources,
    dataSourcesWebsocket,
    chartConfigs,
    dataset,
    showDataSourceEditor,
    dataSourceToEdit,
  } from "./store";
  import type { ChartConfig, DataSource } from "./types";
  import { UNIT_SYMBOLS } from "./types";

  function hideDataSetEditor() {
    showDataSourceEditor.set(false);
    showDataConnectionEditor.set(true);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideDataSetEditor}>
  <div class="datasource-editor">
    <button
      title="Close"
      class="close-button"
      on:click={() => hideDataSetEditor()}>&times;</button
    >
    <h1>Datasource Editor</h1>
    <h2>{$dataSources[$dataSourceToEdit].name}</h2>
    <div class="grid-container">
      {#each $dataSources[$dataSourceToEdit].headerData as header (header)}
        <div class="grid-item">
          <h3 class="chart-title">{header.name}</h3>
          <div class="config-option">
            <label for="dataTypes">Type:</label>
            <select
              class="config-select"
              id="dataTypes"
              bind:value={header.type}
              on:change={() => {
                if (header.type === 'string') {
                  header.unitSymbol = '# Unique Items';
                }
              }}
            >
              <option value="number">Number</option>
              <option value="string">String</option>
            </select>
          </div>
          <div class="config-option">
            <label for="unitSymbol">Unit Symbol:</label>
            <select
              class="config-select"
              id="unitSymbol"
              bind:value={header.unitSymbol}
              disabled={header.type !== "number"}
            >
              {#each UNIT_SYMBOLS as symbol}
                <option value={symbol}>{symbol}</option>
              {/each}
            </select>
          </div>
        </div>
      {/each}
    </div>
    <p>
      The 'Type' affects calculations.<br />
      The values of 'Number' parameters will be aggregated, while 'Text' parameters
      will show the count of unique items.<br />
      'UnitSymbol' does not affect calculations.
    </p>
  </div>
</FloatingWindow>

<style>
  .grid-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: center;
    padding-top: 1em;
  }
  .grid-item {
    text-align: center;
    position: relative;
    background-color: var(--background-color);
    padding: 5px;
    border-radius: 1em;
    height: 120px;
    width: 250px;
  }

  .grid-item:hover {
    scale: 1.05;
    transition: 100ms;
  }

  .datasource-editor {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--card-background-color);
    padding: 2em;
    border-radius: 1em;
    width: 80%;
  }

  h1 {
    margin-bottom: 1em;
  }

  h2 {
    margin: 0;
  }

  h3 {
    font-weight: 500;
    padding-left: 5px;
    padding-right: 5px;
  }

  p {
    text-align: center;
    font-weight: 300;
  }

  .close-button {
    font-weight: 700;
    font-size: large;
    background-color: #00000000;
    border: none;
    cursor: pointer;

    position: absolute;
    top: 0.3em;
    right: 0.3em;
  }

  .close-button:hover {
    filter: drop-shadow(0 0 8px #000000);
  }
</style>
