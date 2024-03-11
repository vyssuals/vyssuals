<script lang="ts">
    import { Bar } from "svelte-chartjs";
    import { basicChartStore } from './basicChartStore';
    import { formatTitle } from "../utils/textUtils";
    import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
    import type { ChartData, ChartConfig } from '../types';

    export let config: ChartConfig;
    let title: string;

    let state: ChartData | undefined;
    basicChartStore.subscribe((value: Record<string, ChartData | undefined>) => { state = value[config.id]; });

    $: if (config) {basicChartStore.fetch(config)};
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

<h1 class="chart-title" style="width: 550px">{title}</h1>
{#if state}
<h3 title="You can edit the unit symbol in the settings of this datasource.">{state.unitSymbol}</h3>
    <Bar data={state.data} {options} style="height: 310px; width: 595px" />
{/if}
