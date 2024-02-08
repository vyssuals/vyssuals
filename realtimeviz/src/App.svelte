<script lang="ts">
  import AddChartButton from './lib/AddChartButton.svelte'
  import { onMount } from 'svelte';
  import { logDatasetContent, showChartEditor } from './store';
  import { generateDummyData } from './testData';
  import ChartGrid from './lib/ChartGrid.svelte';
  import ChartConfigurator from './lib/ChartEditor.svelte';

  onMount(() => {
    generateDummyData();
    logDatasetContent(); // Call logDatasetContent after generateDummyData
});

</script>

<main>
  {#if $showChartEditor}
  <div >
    <ChartConfigurator />
  </div>
  {/if}
  <div >
    <ChartGrid />
  </div>
    <div >
      <AddChartButton />
    </div>
</main>
