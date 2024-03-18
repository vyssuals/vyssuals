<!-- Chart.svelte -->
<script lang="ts">
    import type { ChartConfig, Item } from "../types";
    import { getItemValue, getItemAttributes } from "../data/itemUtils";
    import { liveQuery } from "dexie";
    import BarChart from "./BarChart.svelte";
    import DoughnutChart from "./DoughnutChart.svelte";
    import TotalChart from "./TotalChart.svelte";
    import LineChart from "./LineChart.svelte";
    import { db } from "../data/databaseManager";
    import { DataSourceDatabase } from "../data/dataSourceDatabase";

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

    $: items = liveQuery(() => 
            ds.updates.get(timestamp).then((update) => ds.items.bulkGet(update?.visibleItemIds || []))
    );

    $: labels = [...new Set($items?.map((item) => item && getItemValue(item.versions, config.groupBy, config.update).toString()).filter(Boolean).sort())];
    $: attributes = $items?.map((item) => item && getItemAttributes(item.versions, config.update)).filter(Boolean) || [];
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
