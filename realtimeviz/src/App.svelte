<script lang="ts">
  import AddChartButton from './lib/AddChartButton.svelte'
  import { onMount } from 'svelte';
  import { logDatasetContent, showChartConfigurator } from './store';
  import { generateDummyData } from './testData';
  import ChartGrid from './lib/ChartGrid.svelte';
  import ChartConfigurator from './lib/ChartConfigurator.svelte';

  onMount(() => {
    generateDummyData();
    logDatasetContent(); // Call logDatasetContent after generateDummyData
});

</script>

<main>
  {#if !$showChartConfigurator}
    <div >
      <AddChartButton />
    </div>
  {/if}
  {#if $showChartConfigurator}
    <div >
      <ChartConfigurator />
    </div>
  {/if}
  <div >
    <ChartGrid />
  </div>
</main>
