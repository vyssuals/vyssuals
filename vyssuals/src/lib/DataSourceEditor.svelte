<script lang="ts">
  import Papa from "papaparse";
  import type { ParseResult } from "papaparse";
  import FloatingWindow from "./FloatingWindow.svelte";
  import { showDataSourceEditor, dataSources, dataset } from "./store";
  import type { DataItem, DataSource } from "./types";

  let files: FileList | null = null;

  $: if (files) {
    // add file path to dataSources and set interval to 60 seconds
    const newSources: DataSource[] = Array.from(files)
      .map((file) => {
        const path = file.name;
        const interval = 60;
        if ($dataSources.some((item) => item.file.name === path)) {
          alert(`File is already a data source: ${path}`);
          return null;
        }
        return { file, interval };
      })
      .filter(Boolean); // filter out null values

    dataSources.update((prev) => [...prev, ...newSources]);

    for (const item of newSources) {
      if (item) {
        loadFile(item.file);
      }
    }
    files = null;
  }

  function hideDataSourceEditor() {
    showDataSourceEditor.set(false);
  }

function toLocalISOString(date: Date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset * 60 * 1000));
    return date.toISOString().slice(0, 23).replace('T', ' ');
}


  // Define the dummy functions
  function loadFile(file: File) {
    if (file) {
      const timestamp: Date = new Date();
      const timestampString = toLocalISOString(timestamp);
      console.log(`Loading file: ${file.name}`);

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results: ParseResult<Record<string, any>>) {
          console.log("Parsing complete:", results.data);

          const data: DataItem[] = results.data.map(
            (row: Record<string, any>, index: number) => ({
              id: String(index),
              dataSource: file.name,
              timestamp: timestamp,
              attributes: { ...row, timestamp: timestampString },
            })
          );
          dataset.update((prev) => [...prev, ...data]);
        },
      });
    } else {
      console.log("No file to load");
    }
  }

  function removeItem(path: string) {
    $dataSources = $dataSources.filter((item) => item.file.name !== path);
  }

  function setRefreshInterval(path: string, interval: number) {
    $dataSources = $dataSources.map((item) =>
      item.file.name === path ? { ...item, interval } : item
    );
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
    <h1>Data Sources</h1>
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
          {#each $dataSources as item (item.file.name)}
            <tr>
              <td><p class="file-path">{item.file.name}</p></td>
              <td class="symbol"
                ><button on:click={() => loadFile(item.file)}>&#x21BB;</button
                ></td
              >
              <td>
                <input
                  type="number"
                  min="0"
                  bind:value={item.interval}
                  on:input={(e) =>
                    setRefreshInterval(item.path, e.target?.value)}
                />
              </td>
              <td class="symbol"
                ><button on:click={() => removeItem(item.file.name)}
                  >&times;</button
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
    <p>
      Data sources listed here will automatically refresh at the given interval
      (in seconds).
    </p>
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

  h1 {
    margin-bottom: 1em;
  }

  p {
    font-weight: 300;
    width: 60%;
    text-align: center;
  }

  table {
    margin-bottom: 1em;
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
