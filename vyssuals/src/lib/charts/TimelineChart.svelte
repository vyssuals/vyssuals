<script lang="ts">
    import { Line } from "svelte-chartjs";
    import type { ChartConfig, RawChartData } from "../types";
    import { calculateChartData, calculateTimelineChartData } from "./chartDataUtils";
    import { formatTitle, formatSubtitle } from "../utils/textUtils";

    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler } from "chart.js";

    export let config: ChartConfig;
    export let chartData: RawChartData;

    let data: any;
    $: if (chartData.labels.length > 0 && chartData.attributes.length > 0  && chartData.header && chartData.header.type && config) {
      data = calculateTimelineChartData(chartData.labels, chartData.attributes, chartData.header.type, config);
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
                    callback: function (value: any): string {
                        let label = this.getLabelForValue(value);
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
