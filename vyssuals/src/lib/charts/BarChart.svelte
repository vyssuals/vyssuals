<script lang="ts">
    import { Bar } from "svelte-chartjs";
    import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
    import type {  ChartConfig, RawChartData } from '../types';
    import { calculateChartData } from "./chartDataUtils";
    import { formatTitle } from "../utils/textUtils";

    export let config: ChartConfig;
    export let chartData: RawChartData;

    let data: any;
    $: calculateChartData(chartData.labels, chartData.attributes, chartData.header.type, config).then((value) => { data = value });
    $: title = formatTitle(config);

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
    };
</script>

<h1 class="chart-title">{title}</h1>
{#if data}
<h3 title="You can edit the unit symbol in the settings of this datasource.">{chartData.header.unitSymbol}</h3>
    <Bar data={data} {options} style="height: 310px; width: 595px" />
{/if}
