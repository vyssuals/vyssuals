<script lang="ts">
    import { Line } from "svelte-chartjs";
    import type { ChartConfig, Items, RawChartData, Update } from "../types";
    import { formatTitle, formatSubtitle } from "../utils/textUtils";
    import { db } from "../data/databaseManager";
    import { getItemValue } from "../utils/itemUtils";
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler } from "chart.js";
    import { liveQuery } from "dexie";

    export let config: ChartConfig;
    export let chartData: RawChartData;

    $: ds = db.get(config.dataSourceName);

    $: updates = liveQuery(() => ds.updates.toCollection().sortBy("timestamp"));

    let data: any;
    $: if ($updates) {
        data = calculateChartData($updates, config);
    }
    $: console.log(data);

    async function calculateChartData(updates: Update[], config: ChartConfig) {
        const items: Items = await ds.items.toArray().then((x) => {
            let items: Items = {};
            x.forEach((item) => {
                items[item.id] = item;
            });
            return items;
        });

        const header = await ds.metadata.get(config.showValues);
        let labels: string[] = [];
        let data = updates.map((update) => {
            labels.push(new Date(update.timestamp).toLocaleString());
            let sum = 0;
            let visibleItems = update.visibleItemIds.map((id) => items[id]).filter((item) => item);
            visibleItems.forEach((item) => {
                if (header?.type === "number") {
                    sum += Number(getItemValue(item.versions, config.showValues, update.timestamp));
                } else {
                    // check if the item has a value for the given timestamp
                    if (getItemValue(item.versions, config.showValues, update.timestamp)) {
                        sum += 1;
                    }
                }
            });
            return sum;
        });

        return {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: (ctx: any) => {
                        const canvas = ctx.chart.ctx;
                        const gradient = canvas.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, `${config.startColor}70`);
                        gradient.addColorStop(1, `${config.endColor}10`);
                        return gradient;
                    },
                    borderWidth: 2,
                    borderColor: config.startColor,
                    borderRadius: 8,
                    offset: 5,
                    tension: 0,
                    fill: true,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    pointBackgroundColor: config.startColor,
                    
                },
            ],
        };
    }

    $: title = formatTitle(config);
    $: subtitle = formatSubtitle(config, chartData.header.unitSymbol);

    ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);

    let options = {
        responsive: false,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: function (value: string): string {
                        let label = this.getLabelForValue(value).split(' ')[1];
                        return label.length > 8 ? `${label.slice(0, 20)}...` : label;
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
    };
</script>

<h1 class="chart-title">{title}</h1>
{#await data then data}
    <h3 class="chart-subtitle" title="You can edit the unit symbol in the settings of this datasource.">{subtitle}</h3>
    <Line {data} {options} style="height: 310px; width: 595px" />
{/await}
