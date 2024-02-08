<script lang="ts">
  import AddChartButton from './lib/AddChartButton.svelte'
  import { onMount } from 'svelte';
  import { logDatasetContent, showChartEditor } from './store';
  import { generateDummyData } from './testData';
  import ChartGrid from './lib/ChartGrid.svelte';
  import ChartEditor from './lib/ChartEditor.svelte';

  onMount(() => {
    generateDummyData();
    // generate more dummy data every 5 seconds
    setInterval(() => {
      generateDummyData();
    }, 5000);
    logDatasetContent(); // Call logDatasetContent after generateDummyData
});

</script>

<main>
  {#if $showChartEditor}
    <div >
      <ChartEditor />
    </div>
  {/if}
  <div >
    <ChartGrid />
  </div>
    <div >
      <AddChartButton />
    </div>
</main>
