<script lang="ts">
    import { Bar } from "svelte-chartjs";
    import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
    import type { ChartConfig, RawChartData } from "../types";
    import { calculateChartData } from "../utils/chartDataUtils";
    import { formatTitle, formatSubtitle } from "../utils/textUtils";
    import { createColorArray } from "../utils/colorUtils";

    export let config: ChartConfig;
    export let chartData: RawChartData;

    $: data = calculateChartData(chartData.labels, chartData.attributes, chartData.header.type, config);
    $: title = formatTitle(config);
    $: subtitle = formatSubtitle(config, chartData.header.unitSymbol);

    $: if (data.datasets) data.datasets[0].borderColor = data.datasets[0].backgroundColor;
    $: if (data.datasets)
        data.datasets[0].backgroundColor = data.datasets[0].backgroundColor.map((color: string) => {
            return `${color}99`;
        });

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
