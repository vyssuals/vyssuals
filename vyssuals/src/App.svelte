<script lang="ts">
  import GradientButton from "./lib/buttons/GradientButton.svelte";
  import { onMount } from "svelte";
  import { generateDummyData } from "./lib/tests/testData";
  import {
    dataset,
    logDatasetContent,
    showChartEditor,
    chartConfigs,
    showDataConnectionEditor,
    showDataSourceEditor,
  } from "./lib/store";
  import ChartGrid from "./lib/charts/ChartGrid.svelte";
  import ChartEditor from "./lib/charts/ChartEditor.svelte";
  import Welcome from "./lib/Welcome.svelte";
  import DataConnectionEditor from "./lib/data/DataConnectionEditor.svelte";
  import OpenDataSourcesButton from "./lib/buttons/OpenDataSourcesButton.svelte";
  import { connectWebSocket } from "./lib/data/websocket";
  import DataSourceEditor from "./lib/data/DataSourceEditor.svelte";

  onMount(() => {
    connectWebSocket();
  });

  //   onMount(() => {
  //     const dataSources: string[] = ['Revit-2022__836_Project-Name', 'Rhino-8__2402_DR_some-long-filename', 'Csv_brutally-long-filename-2023-02-23_randomShit'];
  //     generateDummyData(dataSources[0], 5);
  //     // generate more dummy data every 5 seconds
  //     setInterval(() => {
  //       const randomDataSourceIndex = Math.floor(Math.random() * dataSources.length);
  //       const randomCount = Math.floor(Math.random() * 100);
  //       generateDummyData(dataSources[randomDataSourceIndex], randomCount);
  //       console.log('Generated more dummy data');
  //     }, 20000);
  //     logDatasetContent(); // Call logDatasetContent after generateDummyData
  // });

  function handleAddChart() {
    showChartEditor.set(true);
  }
</script>

<main>
  {#if $chartConfigs.length === 0}
    <Welcome />
  {:else}
    <ChartGrid />
  {/if}

  {#if $showChartEditor}
    <ChartEditor />
  {/if}

  {#if $showDataConnectionEditor}
    <DataConnectionEditor />
  {/if}

  {#if $showDataSourceEditor}
  <DataSourceEditor />
  {/if}

  {#if $dataset.length > 0}
  <div style="padding-top: 2em; padding-bottom: 1em;">
    <GradientButton on:click={handleAddChart} />
  </div>
  {:else}
  <div style="display: flex; justify-content: center; padding-top: 1em; font-weight: 300;">
    <p>Load CSV File:</p>
  </div>
  {/if}
  <OpenDataSourcesButton />
</main>

<footer>
  <a href="https://www.yssentyl.com">© Yssentyl 2024</a>
</footer>

<style>
  main {
    padding: 2rem;
  }

  footer {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 40px;
  }

  a {
    text-decoration: none;
    color: #7d7d7d;
    font-style: italic;
    font-weight: 300;
  }

  a:hover {
    color: #05acff;
  }
</style>
