<!-- Chart.svelte -->
<script lang="ts">
  import { chartConfigs } from "../store";
  import { type ChartConfig } from "../types";
  import BarChart from "./BarChart.svelte";
  import DoughnutChart from "./DoughnutChart.svelte";
  import TotalChart from "./TotalChart.svelte";
  import LineChart from "./LineChart.svelte";

  export let index: number;
  let config: ChartConfig;

  $: {
    config = $chartConfigs[index];
  }

  let chartInstance: any; // Store reference to the chart instance

  $: {
    switch (config.chartType) {
      case "bar":
        chartInstance = BarChart;
        break;
      case "doughnut":
        chartInstance = DoughnutChart;
        break;
      case "total":
        chartInstance = TotalChart;
        break;
      case "line":
        chartInstance = LineChart;
        break;
      default:
        console.error("Invalid chart type specified in config");
    }
  }
</script>

<!-- Render the chart instance based on the type specified in the config -->
{#if chartInstance}
  <svelte:component this={chartInstance} {index} />
{/if}
