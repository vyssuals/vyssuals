<!-- Chart.svelte -->
<script lang="ts">
    import type { ChartConfig, Item } from "../types";
    import { liveQuery, type Observable } from "dexie";
    import BarChart from "./BarChart.svelte";
    import DoughnutChart from "./DoughnutChart.svelte";
    import TotalChart from "./TotalChart.svelte";
    import TimelineChart from "./TimelineChart.svelte";
    import { db } from "../data/databaseManager";
    import { DataSourceDatabase } from "../data/dataSourceDatabase";
    import { fetchItems, getAttributes, getLabels } from "../utils/chartDataUtils";

    export let config: ChartConfig;

    let ds: DataSourceDatabase;
    $: ds = db.get(config.dataSourceName);

    let timestamp: string;
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
    $: items = liveQuery(async () => {
        if (!timestamp) {
            const rawItems = await ds.items.toArray();
            return rawItems.filter((item): item is Item => item !== undefined);
        }
        const update = await ds.updates.get(timestamp);
        const rawItems = await ds.items.bulkGet(update?.visibleItemIds || []);
        return rawItems.filter((item): item is Item => item !== undefined);
    });


    let labels: string[];
    let attributes: any[];

    $: if (config && $items) {
        labels = getLabels($items, config.groupBy, config.update);
        attributes = getAttributes($items, config.update);
    }
    $: header = liveQuery(() => ds.metadata.get(config.showValues));
    $: chartData = labels && { labels, attributes, header: $header };

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

{#if chartInstance && labels && attributes.length && $header}
    <svelte:component this={chartInstance} {config} {chartData} />
{/if}
