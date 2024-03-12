<script lang="ts">
  import FloatingWindow from "../wrapper/FloatingWindow.svelte";
  import {
    showDataConnectionEditor,
    showChartEditor,
    startColor,
    endColor,
    showDataSourceEditor,
    dataSourceToEdit,
  } from "../store";
  import type { ChartConfig, DataSource, Header } from "../types";
  import GradientButton from "../buttons/GradientButton.svelte";
  // import { loadCSVFile } from "./DataConnector";
  import ConnectorList from "../connectors/ConnectorList.svelte";
  // import { autoChart } from "../charts/AutoCharts";
  import { db } from "./databaseManager";
  import { type Observable } from "dexie";

  let files: FileList | null = null;

  // $: if (files) {
  //   const file = files?.[0];
  //   if (file) {
  //     const name = file.name;
  //     if ($dataSources.some((item) => item.name === name)) {
  //       alert(`File is already a data source: ${name}`);
  //     } else {
  //       const newSource: DataSource = {
  //         name,
  //         file,
  //         type: 'file',
  //         lastUpdate: new Date(),
  //         header: [] as Header[],
  //       };
  //       (async () => {
  //         try {
  //           const result = await loadCSVFile(newSource);
  //           $dataSources = [...$dataSources, result.dataSource];
  //           $dataset = [...$dataset, ...result.data];
  //         } catch (error) {
  //           console.error("Error loading CSV file:", error);
  //         }
  //       })();
  //     }
  //   }
  //   files = null;
  // }

 

  let wsDataSources: Observable<string[]>;
  let fileDataSources: Observable<string[]>;
  let chartConfigs: Observable<ChartConfig[]>;

  $: wsDataSources = db.wsNames;
  $: fileDataSources = db.fileNames;
  $: chartConfigs = db.vyssuals._chartConfigs;
      
  function hideDataSourceEditor() {
    showDataConnectionEditor.set(false);
  }

  function handleAddChart() {
    hideDataSourceEditor();
    showChartEditor.set(true);
  }

  async function handleAutoChart(dataSource: DataSource) {
    // try {
    //   const autoChartConfig: ChartConfig[] = await autoChart(
    //     dataSource,
    //     5,
    //     $startColor,
    //     $endColor
    //   );
    //   chartConfigs.update((prev) => [...prev, ...autoChartConfig]);
    // } catch (error) {
    //   console.error("Error generating auto chart:", error);
    // }
    console.log('fix me please! (handleAutoChart)')
  }

  function handleReloadCSVFile(dataSourceName: string, e: Event) {
    // check if file is the same as the one already loaded
    // if (e.target instanceof HTMLInputElement && e.target.files && e.target.files.length > 0) {
    //   const file: File = e.target.files[0];
    //   if (dataSource.file?.name === file.name) {
    //     dataSource.file = file;
    //     loadCSVFile(dataSource);
    //     const filePicker = document.getElementById('filePicker');
    //     if (filePicker) {
    //       (filePicker as HTMLInputElement).value = "";
    //     }
    //     return;
    //   } else {
    //     alert("Ooops, clicked on the wrong file? Please select the same file to reload it.");
    //   }
    // }

    console.log("handleReloadCSVFile", dataSourceName);
  }

  function handleEditButton(name: string) {
    dataSourceToEdit.set(name);
    showDataConnectionEditor.set(false);
    showDataSourceEditor.set(true);
  }

  function handleRemoveItem(dataSourceName: string) {
    db.deleteDatabase(dataSourceName);
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
    {#if $wsDataSources }
      <div style="padding-bottom: 1em;">
        {#each $wsDataSources as item (item)}
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
    {#if $fileDataSources}
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
          {#each $fileDataSources as item (item)}
            <tr>
              <td
                ><GradientButton
                  on:click={() => {
                    // handleAutoChart(item);
                    console.log('please implement meeee (auto chart)!')
                  }}
                  buttonText="Add Charts"
                /></td
              >
              <td><p class="file-path">{item}</p></td>
              <td class="symbol"
                ><button
                  style="font-size: 25px; padding: 0.15em"
                  on:click={() => handleEditButton(item)}>&#9881;</button
                ></td
              >
              <td class="symbol"
                ><input
                  type="file"
                  id="filePicker"
                  accept=".csv"
                  on:change={(e) => handleReloadCSVFile(item, e)}
                  style="display: none"
                />
                <button
                  on:click={() => {
                    if (
                      confirm(
                        `Due to browser security restrictions, please select the same file again to reload it: ${item}`
                      )
                    ) {
                      const filePicker = document.getElementById("filePicker");
                      if (filePicker) {
                        filePicker.click();
                      }
                    }
                  }}>&#x21BB;</button
                ></td
              >
              <td class="symbol"
                ><button on:click={() => handleRemoveItem(item)}>&times;</button
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

    {#if $fileDataSources || $wsDataSources}
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
