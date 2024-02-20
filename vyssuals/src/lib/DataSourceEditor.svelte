<script lang="ts">
  import FloatingWindow from "./FloatingWindow.svelte";
  import {
    showDataConnectionEditor,
    dataSources,
    showDataSourceEditor,
    dataSourceToEdit,
  } from "./store";
  import { UNIT_SYMBOLS, COLUMN_TYPES } from "./types";

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
          <h2 class="chart-title">{header.name}</h2>
          <div class="config-option">
            <label for="dataTypes">Data Type:</label>
            <select
              class="config-select"
              id="dataTypes"
              bind:value={header.type}
              on:change={() => {
                if (header.type === "string") {
                  header.unitSymbol = "# Unique Items";
                }
              }}
            >
              {#each COLUMN_TYPES as type}
                <option value={type}>{type}</option>
              {/each}
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
      The values of 'Number' parameters will be aggregated, while 'String' (Text)
      parameters will show the count of unique items.<br />
      'UnitSymbol' does not affect calculations.
    </p>
  </div>
</FloatingWindow>

<style lang="scss">
  .grid-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: center;
    margin-top: 1em;
    overflow: auto; /* Add a scrollbar if necessary */
    max-height: 80%; /* Set a maximum height */
  }

  .grid-container {
    position: relative;
    /* ... your existing styles ... */
  }

  .grid-container::before,
  .grid-container::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 20px; /* adjust this to control the height of the fade effect */
    pointer-events: none; /* prevent the pseudo-elements from capturing click events */
    background: linear-gradient(
      to bottom,
      var(--card-background-color),
      transparent
    );
  }

  .grid-container::after {
    bottom: 0;
    background: linear-gradient(
      to top,
      var(--card-background-color),
      transparent
    );
  }

  .grid-item {
    text-align: center;
    position: relative;
    background-color: var(--background-color);
    padding: 5px;
    border-radius: 1em;
    height: 130px;
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
    max-height: 80%;
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

  .chart-title {
    font-weight: 500;
    padding-top: 10px;
    padding-bottom: 5px;
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

  /* This applies to the scrollbar in the .grid-container */
  .grid-container::-webkit-scrollbar {
    width: 10px; /* width of the entire scrollbar */
  }

  .grid-container::-webkit-scrollbar-track {
    background: var(--card-background-color); /* color of the tracking area */
  }

  .grid-container::-webkit-scrollbar-thumb {
    background: var(--background-color); /* color of the scroll thumb */
    border-radius: 10px; /* roundness of the scroll thumb */
  }

  /* Add a hover effect to the scroll thumb */
  .grid-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
