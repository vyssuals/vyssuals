<script lang="ts">
  import FloatingWindow from "../wrapper/FloatingWindow.svelte";
  import {
    showDataConnectionEditor,
    showChartEditor,
    dataSources,
    dataSourcesWebsocket,
    chartConfigs,
    startColor,
    endColor,
    dataset,
    showDataSourceEditor,
    dataSourceToEdit,
  } from "../store";
  import type { ChartConfig, DataSource } from "../types";
  import GradientButton from "../buttons/GradientButton.svelte";
  import { loadCSVFile } from "./DataConnector";
  import ConnectorList from "../connectors/ConnectorList.svelte";
  import { autoChart } from "../charts/AutoCharts";

  let files: FileList | null = null;
  // $: console.log("DataConnectionEditor says: dataSources changed", $dataSources);
  // $: console.log("DataConnectionEditor says: dataset changed", $dataset);

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
        .filter(item => item !== null) as DataSource[]; // filter out null values and cast the result to DataSource[]

      for (const item of newSources) {
        if (item) {
          loadCSVFile(item);
        }
      }
      dataSources.update((prev) => [...prev, ...newSources]);
      files = null;
    }

  function hideDataSourceEditor() {
    showDataConnectionEditor.set(false);
  }

  function handleAddChart() {
    hideDataSourceEditor();
    showChartEditor.set(true);
  }

  async function handleAutoChart(dataSource: DataSource) {
    try {
      const autoChartConfig: ChartConfig[] = await autoChart(
        dataSource,
        5,
        $startColor,
        $endColor
      );
      chartConfigs.update((prev) => [...prev, ...autoChartConfig]);
    } catch (error) {
      console.error("Error generating auto chart:", error);
    }
  }

  function handleReloadCSVFile(dataSource: DataSource, e: Event) {
    // check if file is the same as the one already loaded
    if (e.target instanceof HTMLInputElement && e.target.files && e.target.files.length > 0) {
      const file: File = e.target.files[0];
      if (dataSource.file?.name === file.name) {
        dataSource.file = file;
        loadCSVFile(dataSource);
        const filePicker = document.getElementById('filePicker');
        if (filePicker) {
          (filePicker as HTMLInputElement).value = "";
        }
        return;
      } else {
        alert("Ooops, clicked on the wrong file? Please select the same file to reload it.");
      }
    }
  }

  function handleEditButton(index: number) {
    dataSourceToEdit.set(index);
    showDataConnectionEditor.set(false);
    showDataSourceEditor.set(true);
  }

  function removeItem(path: string) {
    $chartConfigs = $chartConfigs.filter((item) => item.dataSourceName !== path);
    $dataSources = $dataSources.filter((item) => item.name !== path);
    $dataset = $dataset.filter((item) => item.dataSourceName !== path);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<FloatingWindow on:click={hideDataSourceEditor}>
  <div class="dataconnection-editor">
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

    <h1>CSV Connections</h1>
    {#if $dataSources.length > 0}
      <table>
        <thead>
          <tr>
            <th>Auto Create</th>
            <th>Path</th>
            <th>Settings</th>
            <th>Reload</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {#each $dataSources as item, index (item.name)}
            <tr>
              <td
                ><GradientButton
                  on:click={() => {
                    handleAutoChart(item);
                  }}
                  buttonText="Add Charts"
                /></td
              >
              <td><p class="file-path">{item.name}</p></td>
              <td class="symbol"><button style="font-size: 25px; padding: 0.15em" on:click={() => handleEditButton(index)}>&#9881;</button></td>
              <td class="symbol"
                ><input type="file" id="filePicker" accept=".csv" on:change="{(e) => handleReloadCSVFile(item, e)}" style="display: none" />
                <button on:click="{() => {
                  if (confirm(`Due to browser security restrictions, please select the same file again to reload it: ${item.name}`)) {
                      const filePicker = document.getElementById('filePicker');
                      if (filePicker) {
                        filePicker.click();
                      }
                  }
              }}">&#x21BB;</button></td
              >
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

    {#if $dataSources.length > 0 || $dataSourcesWebsocket.length > 0}
      <div style="padding-top: 1em;">
        <GradientButton on:click={handleAddChart} />
      </div>
    {/if}
  </div>
</FloatingWindow>

<style>
  .dataconnection-editor {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--card-background-color);
    padding: 2em;
    border-radius: 1em;
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
    padding: 10px;
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
    font-size: 20px;
    padding: 0.3em;
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
