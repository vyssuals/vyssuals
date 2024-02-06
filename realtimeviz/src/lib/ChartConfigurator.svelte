<script>
  import { showChartConfigurator } from '../store';

  // Example function to toggle the chart configurator visibility
  function toggleChartConfigurator() {
    showChartConfigurator.update(value => !value);
  }
</script>

<div>
  <button on:click={toggleChartConfigurator}>Done</button>
</div>
