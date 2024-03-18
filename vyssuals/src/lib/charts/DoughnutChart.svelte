<script lang="ts">
    import type { ChartConfig, RawChartData } from "../types";
    import { calculateChartData } from "./chartDataUtils";
    import { Doughnut } from "svelte-chartjs";
    import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, type ChartOptions } from "chart.js";
    import { formatTitle, formatSubtitle } from "../utils/textUtils";

    export let config: ChartConfig;
    export let chartData: RawChartData;

    let data: any;
    $: calculateChartData(chartData.labels, chartData.attributes, chartData.header.type, config).then((value) => { data = value });
    $: title = formatTitle(config);
    $: subtitle = formatSubtitle(config, chartData.header.unitSymbol);


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
                            fillStyle: chart.data.datasets[0].backgroundColor[i],
                            strokeStyle: chart.data.datasets[0].backgroundColor[i],
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
    };
</script>

<h1 class="chart-title">{title}</h1>
{#if data}
<h3 class="chart-subtitle" title="You can edit the unit symbol in the settings of this datasource.">{subtitle}</h3>
    <Doughnut data={data} {options} style="height: 310px; width: 380px" />
{/if}
