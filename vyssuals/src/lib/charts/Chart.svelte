<!-- Chart.svelte -->
<script lang="ts">
    import type { ChartConfig, Item } from "../types";
    import { liveQuery, type Observable } from "dexie";
    import BarChart from "./BarChart.svelte";
    import DoughnutChart from "./DoughnutChart.svelte";
    import TotalChart from "./TotalChart.svelte";
    import LineChart from "./LineChart.svelte";
    import { db } from "../data/databaseManager";
    import { DataSourceDatabase } from "../data/dataSourceDatabase";
    import { fetchItems, getLabelsAndAttributes } from "./chartDataUtils";

    export let config: ChartConfig;

    let ds: DataSourceDatabase;
    $: ds = db.get(config.dataSourceName);

    let timestamp: string = "Latest Update";
    $: {
        async function getTimestamp() {
            if (config.update != "Latest Update") {
                timestamp = config.update;
            } else {
                timestamp = await ds.lastUpdate;
            }
        }
        getTimestamp();
    }

    let items: Observable<Item[]>;
    $: items = liveQuery(() => fetchItems(ds, timestamp));

    let labels: string[];
    let attributes: any[];

    $: {
        const result = $items && getLabelsAndAttributes($items, config.groupBy, config.update);
        labels = result?.labels;
        attributes = result?.attributes;
    }
    $: header = liveQuery(() => ds.metadata.get(config.showValues));
    $: chartData = { labels, attributes, header: $header };

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

{#if chartInstance && labels && attributes.length && $header}
    <svelte:component this={chartInstance} {config} {chartData} />
{/if}
