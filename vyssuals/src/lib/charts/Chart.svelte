<!-- Chart.svelte -->
<script lang="ts">
    import type { ChartConfig, Item } from "../types";
    import BarChart from "./BarChart.svelte";
    import DoughnutChart from "./DoughnutChart.svelte";
    import TotalChart from "./TotalChart.svelte";
    import TimelineChart from "./TimelineChart.svelte";

    export let config: ChartConfig;

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
            case "timeline":
                chartInstance = TimelineChart;
                break;
            default:
                console.error("Invalid chart type specified in config");
        }
    }
</script>

{#if chartInstance}
    <svelte:component this={chartInstance} {config} />
{/if}
