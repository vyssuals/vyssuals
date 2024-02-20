<script lang="ts">
  import FloatingWindow from "./FloatingWindow.svelte";
  import {
    showDataSourceEditor,
    showChartEditor,
    dataSources,
    dataSourcesWebsocket,
    chartConfigs,
    startColor,
    endColor,
    dataset,
  } from "./store";
  import type { ChartConfig, DataSource } from "./types";
  import GradientButton from "./GradientButton.svelte";
  import { loadCSVFile } from "./DataConnector";
  import ConnectorList from "./ConnectorList.svelte";
  import { autoChart } from "./AutoCharts";

  let files: FileList | null = null;

  $: if (files) {
    // add file path to dataSources and set interval to 60 seconds
    const newSources: DataSource[] = Array.from(files)
      .map((file) => {
        const name = file.name;
        const interval = 0;
        if ($dataSources.some((item) => item.name === name)) {
          alert(`File is already a data source: ${name}`);
          return null;
        }
        return { name, file, interval };
      })
      .filter(Boolean); // filter out null values

    for (const item of newSources) {
      if (item) {
        loadCSVFile(item);
      }
    }
    dataSources.update((prev) => [...prev, ...newSources]);
    files = null;
  }

  function hideDataSourceEditor() {
    showDataSourceEditor.set(false);
  }

  function handleAddChart() {
    hideDataSourceEditor();
    showChartEditor.set(true);
  }

  async function handleAutoChart() {
    try {
      const autoChartConfig: ChartConfig[] = await autoChart(
        $dataSources[$dataSources.length - 1],
        5,
        $startColor,
        $endColor
      );
      chartConfigs.update((prev) => [...prev, ...autoChartConfig]);
    } catch (error) {
      console.error("Error generating auto chart:", error);
    }
    hideDataSourceEditor();
  }

  function removeItem(path: string) {
    $chartConfigs = $chartConfigs.filter((item) => item.dataSource !== path);
    $dataSources = $dataSources.filter((item) => item.name !== path);
    $dataset = $dataset.filter((item) => item.dataSource !== path);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideDataSourceEditor}>
  <div class="datasource-editor" id="dataSourceEditor">
    <button
      title="Close"
      class="close-button"
      on:click={() => hideDataSourceEditor()}>&times;</button
    >
    <h1>Real-Time Connections</h1>
    {#if $dataSourcesWebsocket.length > 0}
      <div style="padding-bottom: 1em;">
        {#each $dataSourcesWebsocket as item (item)}
          <p class="file-path" style="margin: 2px;">{item}</p>
        {/each}
      </div>
    {:else}
      <p>
        No Real-Time Connection Active.<br />
        Start the Vyssuals plugin in your desktop application or install a connector
        plugin:
      </p>
      <div style="padding: 1em;">
        <ConnectorList />
      </div>
    {/if}
    <!-- <hr style="width: 100%; margin-top: 1em;" /> -->

    <h1>Other Data Sources</h1>
    {#if $dataSources.length > 0}
      <table>
        <thead>
          <tr>
            <th>Path</th>
            <th title="Reload Now">Reload</th>
            <th title="Auto-refresh Interval in Seconds">Interval</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {#each $dataSources as item (item.name)}
            <tr>
              <td><p class="file-path">{item.name}</p></td>
              <td class="symbol"
                ><button on:click={() => loadCSVFile(item)}>&#x21BB;</button
                ></td
              >
              <td>
                <input type="number" min="0" bind:value={item.interval} />
              </td>
              <td class="symbol"
                ><button on:click={() => removeItem(item.name)}>&times;</button
                ></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
    <div>
      <label for="filePicker">Add CSV:</label>
      <input type="file" id="filePicker" accept=".csv" bind:files />
    </div>
    <p style="padding-top: 1em;">
      Data sources auto-refresh at given intervals. 0 means no auto-refresh. (in
      seconds)
    </p>

    {#if $dataSources.length > 0 || $dataSourcesWebsocket.length > 0}
      <!-- <hr style="width: 100%; margin-top: 2em;"/> -->
      <div class="chart-buttons">
        <GradientButton on:click={handleAddChart} />
        <GradientButton on:click={handleAutoChart} buttonText="AutoChart" />
      </div>
    {/if}
  </div>
</FloatingWindow>

<style>
  .datasource-editor {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--card-background-color);
    padding: 2em;
    border-radius: 1em;
  }

  .chart-buttons {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  h1 {
    margin-bottom: 1em;
  }

  p {
    font-weight: 300;
    margin: 0;
    text-align: center;
  }

  th {
    font-weight: 500;
  }

  .file-path {
    overflow: hidden; /* Hide overflowed content */
    text-overflow: ellipsis; /* Show ellipsis (...) when the content overflows */
    white-space: nowrap; /* Prevent text from wrapping onto the next line */
    width: 300px;
    font-weight: 300;
    text-align: center;
    border-radius: 8px;
    border: 3px solid var(--background-color);
    padding: 0.4em 1.2em;
    margin: 0;
  }

  input[type="file"] {
    background: var(--background-color);
    border-radius: 8px;
    width: 200px;
    padding: 15px;
    cursor: pointer;
  }

  input[type="file"]::file-selector-button {
    display: none;
    /* border: none; */
  }

  input[type="file"]:hover {
    filter: drop-shadow(0 0 0.5em var(--dropshadow-color));
  }

  .symbol button {
    font-weight: 700;
    background-color: var(--background-color);
    width: 80px;
  }

  td input {
    width: 100px;
    border: none;
    text-align: center;
    padding: 0.6em 1.2em;
    font-size: 1em;
    background-color: var(--background-color);
    border-radius: 8px;
  }

  td p {
    background-color: var(--card-background-color);
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
