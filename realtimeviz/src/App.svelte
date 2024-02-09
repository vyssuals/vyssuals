<script lang="ts">
  import AddChartButton from './lib/AddChartButton.svelte'
  import { onMount } from 'svelte';
  import { dataset, logDatasetContent, showChartEditor, showConnector } from './lib/store';
  import { generateDummyData } from './lib/tests/testData';
  import ChartGrid from './lib/ChartGrid.svelte';
  import ChartEditor from './lib/ChartEditor.svelte';
  import { chartConfigs } from './lib/store';
  import Instructions from './lib/Instructions.svelte';
    import Connector from './lib/connectors/Connector.svelte';

//   onMount(() => {
//     generateDummyData();
//     // generate more dummy data every 5 seconds
//     setInterval(() => {
//       generateDummyData();
//       console.log('Generated more dummy data');
//     }, 5000);
//     logDatasetContent(); // Call logDatasetContent after generateDummyData
// });
</script>

<main>
  {#if $showChartEditor}
    <ChartEditor />
  {/if}

  {#if $chartConfigs.length === 0}
    <Instructions />
  {/if}

  {#if $showConnector.length > 0}
  <Connector />
  {/if}

  <ChartGrid />
  {#if $dataset.length > 0}
    <AddChartButton />
  {/if}
</main>

<footer>
  <a href="https://www.yssentyl.com">© Yssentyl 2024</a>
</footer>

<style>
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
</style>