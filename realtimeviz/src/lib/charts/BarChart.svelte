<script lang="ts">
    import type { ChartConfig } from "../types";
    import { chartConfigs, dataset } from "../store";
    import { Bar } from 'svelte-chartjs';
    import { formatTitle } from "../utils/textUtils";
    import { createChartData } from "../utils/dataUtils";
    
    import {
        Chart,
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
    } from 'chart.js';

    export let index: number;
    let data: any;
    let config: ChartConfig;
    
    $: {
      config = $chartConfigs[index];
      data = createChartData($dataset, config);
    }

    Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  let options = {
    responsive: false,
    maintainAspectRatio: false,
    // aspectRatio: 2,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawOnChartArea: false,
          drawTicks: false,
        }
      },
      y: {        
        grid: {
          display: true,
          drawOnChartArea: false,
          drawTicks: false,
        }
        }
      }
  }


</script>


  <h2>{formatTitle(config)}</h2>
  <h3>{config.unitSymbol}</h3>
  <Bar {data} {options} style="height: 80%; width: 595px"/>
