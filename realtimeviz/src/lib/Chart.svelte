<!-- Chart.svelte -->
<script lang="ts">
    import { onMount, onDestroy, setContext } from 'svelte';
    import { type ChartConfig } from '../types'; // Define your types for data and config
    import BarChart from './BarChart.svelte';
    import PieChart from './PieChart.svelte';
  
  
    let chartInstance: any; // Store reference to the chart instance
  
    onMount(() => {
      // Initialize chart based on the type specified in the config
      switch(config.type) {
        case 'bar':
          chartInstance = new BarChart({
            target: document.querySelector('.chart-container'),
            props: {
              data,
              config
            }
          });
          break;
        case 'pie':
          chartInstance = new PieChart({
            target: document.querySelector('.chart-container'),
            props: {
              data,
              config
            }
          });
          break;
        // Add cases for other chart types as needed
        default:
          console.error('Invalid chart type specified in config');
      }
      
      // Set up a context to watch for changes in data
      setContext('data', data);
    });
  
    onDestroy(() => {
      // Cleanup code, destroy the chart instance if necessary
      if (chartInstance) {
        chartInstance.$destroy();
      }
    });
  
    // Watch for changes in data and update the chart
    $: {
      if (chartInstance) {
        chartInstance.updateData($data);
      }
    }
  </script>
  
  <div class="chart-container">
    <!-- This is where the chart will be rendered -->
  </div>
  
  <style>
    /* Define your chart styles here */
  </style>
  