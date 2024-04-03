<script lang="ts">
    import type { ChartConfig, Header, Info, Item } from "../types";
    import { calculateChartData } from "../utils/chartDataUtils";
    import { Doughnut } from "svelte-chartjs";
    import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, type ChartOptions } from "chart.js";
    import { formatTitle, formatSubtitle } from "../utils/textUtils";
    import { colorSyncChartConfig } from "../store";
    import { db } from "../data/databaseManager";
    import { DataSourceDatabase } from "../data/dataSourceDatabase";
    import { getAttributes, getLabels } from "../utils/chartDataUtils";
    import { liveQuery, type Observable } from "dexie";
    import { debounce } from "lodash";

    export let config: ChartConfig;

    let ds: DataSourceDatabase;
    let items: Observable<Item[]>;
    let lastUpdate: Observable<Info | undefined>;
    let header: Observable<Header | undefined>;

    $: ds = db.get(config.dataSourceName);

    $: lastUpdate = liveQuery(() => ds.info.get("lastUpdate"));
    $: header = liveQuery(() => ds.metadata.get(config.showValues));

    $: console.log(`donutchart.svelte: lastUpdate changed ${$lastUpdate?.value}`);
    $: console.log(`donutchart.svelte: config changed ${config.update}`);

    let timestamp: string;
    $: if (config.update != "Latest Update") {
        timestamp = config.update;
    }

    $: if ($lastUpdate && config.update == "Latest Update") {
        timestamp = $lastUpdate?.value || "Latest Update";
    }
    $: console.log(`donutchart.svelte: timestamp changed ${timestamp}`);

    let updateType: string = "auto";
    let updateName: string = "";
    $: if ($lastUpdate) {
        items = undefined;
        items = liveQuery(async () => {
            if (!timestamp) {
                const rawItems = await ds.items.toArray();
                return rawItems.filter((item): item is Item => item !== undefined);
            }
            const update = await ds.updates.get(timestamp);
            updateType = update?.type || "auto";
            updateName = update?.name || "";
            const rawItems = await ds.items.bulkGet(update?.visibleItemIds || []);
            return rawItems.filter((item): item is Item => item !== undefined);
        });
    }

    $: if ($items) console.log(`donutchart.svelte: items changed, count: ${$items.length}`);

    let labels: string[] = [];
    let attributes: any[] = [];
    let data: any = undefined;
    let subtitle: string;

    const debouncedUpdate = debounce(() => { if (config && $items && $header) {
        labels = getLabels($items, config.groupBy, config.update);
        attributes = getAttributes($items, config.update);
        subtitle = formatSubtitle(config, $header.unitSymbol, updateName, updateType);
        if (labels.length > 0 && attributes.length > 0) {
            data = calculateChartData(labels, attributes, $header.type, config);
        }
    }}, 50)
    
    $: {
        config, $items, $header;
        data = undefined;
        debouncedUpdate();
    }

    $: console.log(`donutchart.svelte: data changed ${data}`);
    $: title = formatTitle(config);

    $: if ($colorSyncChartConfig && data && $colorSyncChartConfig.index === config.index) {
        $colorSyncChartConfig.labels = data.labels;
    }

    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

    let options: ChartOptions<"doughnut"> = {
        responsive: false,
        plugins: {
            legend: {
                labels: {
                    generateLabels: (chart: any) =>
                        chart.data.labels.map((l: string, i: number) => ({
                            datasetIndex: 0,
                            index: i,
                            text: l?.length > 8 ? `${l.slice(0, 6)}...` : l,
                            fillStyle: chart.data.datasets[0].colors[i],
                            strokeStyle: chart.data.datasets[0].borderColor[i],
                            hidden: false,
                            fontColor: "#666666",
                        })),
                },
                position: "bottom",
                onClick: (e, legendItem, legend) => {
                    // Implement your onClick logic here
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
{#if data !== undefined}
    <h3 class="chart-subtitle" title="You can edit the unit symbol in the settings of this datasource.">{subtitle}</h3>
    <Doughnut {data} {options} style="height: 310px; width: 380px" />
{:else}
    <h3 class="chart-subtitle">Loading...</h3>
{/if}
