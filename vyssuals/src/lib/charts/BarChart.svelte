<script lang="ts">
    import { Bar } from "svelte-chartjs";
    import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
    import type { ChartConfig, Item } from "../types";
    import { calculateChartData } from "../utils/chartDataUtils";
    import { formatTitle, formatSubtitle } from "../utils/textUtils";
    import { colorSyncChartConfig } from "../store";
    import { db } from "../data/databaseManager";
    import { DataSourceDatabase } from "../data/dataSourceDatabase";
    import { getAttributes, getLabels } from "../utils/chartDataUtils";
    import { liveQuery, type Observable } from "dexie";

    export let config: ChartConfig;

    let ds: DataSourceDatabase;
    $: ds = db.get(config.dataSourceName);
    $: lastUpdate = liveQuery(() => ds.info.get("lastUpdate"));
    $: console.log(`barchart.svelte: lastUpdate changed ${$lastUpdate?.value}`);

    let timestamp: string;
    $: {
        async function getTimestamp() {
            if (config.update != "Latest Update") {
                timestamp = config.update;
            } else {
                timestamp = $lastUpdate?.value || "Latest Update";
            }
        }
        getTimestamp();
    }
    $: console.log(`barchart.svelte: timestamp changed ${timestamp}`);

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

    $: if ($items) console.log(`barchart.svelte: items changed, count: ${$items.length}`);

    let labels: string[];
    let attributes: any[];

    $: if (config && $items) {
        labels = getLabels($items, config.groupBy, config.update);
        attributes = getAttributes($items, config.update);
    }
    $: header = liveQuery(() => ds.metadata.get(config.showValues));

    let data: any;
    let subtitle: string;
    $: if (labels && attributes && $header) {
        data = calculateChartData(labels, attributes, $header.type, config);
        subtitle = formatSubtitle(config, $header.unitSymbol);
    }
    $: title = formatTitle(config);

    $: if ($colorSyncChartConfig && $colorSyncChartConfig.index === config.index) {
        $colorSyncChartConfig.labels = data.labels;
    }

    Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

    let options = {
        responsive: false,
        maintainAspectRatio: false,
        // aspectRatio: 2,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: function (value: any): string {
                        let label = (this as any).getLabelForValue(value);
                        return label?.length > 8 ? `${label.slice(0, 6)}...` : label;
                    },
                },
                grid: {
                    display: true,
                    drawOnChartArea: false,
                    drawTicks: false,
                },
            },
            y: {
                grid: {
                    display: true,
                    drawOnChartArea: false,
                    drawTicks: false,
                },
            },
        },
        animation: {
            easing: "easeInOutQuart",
            duration: 600,
        },
    };
</script>

<h1 class="chart-title">{title}</h1>
{#await data then data}
    <h3 class="chart-subtitle" title="You can edit the unit symbol in the settings of this datasource.">{subtitle}</h3>
    <Bar id="barchart" {data} {options} style="height: 310px; width: 595px" />
{/await}
