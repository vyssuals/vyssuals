<script>
  import ChartConfigurator from './ChartConfigurator.svelte';
  import { showChartConfigurator } from '../store';

  function handleClick() {
    // Set the buttonClicked store value to true when the button is clicked
    showChartConfigurator.set(true);
  }


</script>

<button on:click={handleClick}>Add Diagram</button>

<!-- Render Component B conditionally -->
{#if $showChartConfigurator}
  <ChartConfigurator />
{/if}

