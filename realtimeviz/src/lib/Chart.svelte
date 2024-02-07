<!-- Chart.svelte -->
<script lang="ts">
    import { onMount, onDestroy, setContext } from 'svelte';
    import { type ChartConfig } from '../types'; // Define your types for data and config
    import BarChart from './BarChart.svelte';
    import DoughnutChart from './DoughnutChart.svelte';
    import TotalChart from './TotalChart.svelte';
    import { chartConfigs } from '../store'; // Import the store that holds the chart configurations
  
    export let chartIndex: number; // Index of the chart in the array
    // get chart configuration by index from store
    let config: ChartConfig = $chartConfigs[chartIndex];
    
    let chartInstance: any; // Store reference to the chart instance
  
    onMount(() => {
      // Initialize chart based on the type specified in the config
      switch(config.type) {
        case 'bar':
          chartInstance = BarChart;
          break;
        case 'doughnut':
          chartInstance = DoughnutChart;
          break;
        case 'total':
          chartInstance = TotalChart;
          break;
        // Add cases for other chart types as needed
        default:
          console.error('Invalid chart type specified in config');
      }
      
    });
  
  </script>
  
  <div class="chart-container">
    <!-- Render the chart instance based on the type specified in the config -->
    {#if chartInstance}
      <svelte:component this={chartInstance} config={config} />
    {/if}
  </div>
  