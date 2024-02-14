<script lang="ts">
  import AddChartButton from './lib/AddChartButton.svelte'
  import { onMount } from 'svelte';
  import { generateDummyData } from './lib/tests/testData';
  import { dataset, logDatasetContent, showChartEditor, chartConfigs, showDataSourceEditor } from './lib/store';
  import ChartGrid from './lib/ChartGrid.svelte';
  import ChartEditor from './lib/ChartEditor.svelte';
  import Welcome from './lib/Welcome.svelte';
  import DataSourceEditor from './lib/DataSourceEditor.svelte';
  import AddCsvButton from './lib/AddCsvButton.svelte';
  import OpenDataSourcesButton from './lib/OpenDataSourcesButton.svelte';
 

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

$: {console.log('App.svelte: dataset', $dataset)}

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

  {#if $showDataSourceEditor}
    <DataSourceEditor />
  {/if}

  {#if $dataset.length > 0}
    <AddChartButton />
    <OpenDataSourcesButton />
    {:else}
    <AddCsvButton />
  {/if}
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
    margin-top: 2em;

  }
  a {
    text-decoration: none;
    color: #7d7d7d;
    font-style: italic;
    font-weight: 300;
  }
  a:hover {
    color: #05ACFF;
  }

</style>