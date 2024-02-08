<!-- Chart.svelte -->
<script lang="ts">
    import { chartConfigs } from '../store';
    import { type ChartConfig } from '../types'; // Define your types for data and config
    import BarChart from './BarChart.svelte';
    import DoughnutChart from './DoughnutChart.svelte';
    import TotalChart from './TotalChart.svelte';
  
    export let index: number;
    let config: ChartConfig;

    $: {
      config = $chartConfigs[index];
    }
    
    let chartInstance: any; // Store reference to the chart instance
  
    $: {
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
    }
  </script>
  
  <div class="chart-container">
    <!-- Render the chart instance based on the type specified in the config -->
    {#if chartInstance}
      <svelte:component this={chartInstance} index={index} />
    {/if}
  </div>
  
