<script lang="ts">
  import type { ChartData, ChartConfig } from "../types";
  import { Doughnut } from "svelte-chartjs";
  import { formatTitle } from "../utils/textUtils";
  import { basicChartStore } from './basicChartStore';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    type ChartOptions,
  } from "chart.js";

  export let index: string;
  let title: string;
  let state: ChartData | undefined;

  basicChartStore.subscribe((value: Record<string, ChartData | undefined>) => { state = value[index]; });

  $: index && basicChartStore.fetch(index);
  $: state && state.config && (title = formatTitle(state.config as ChartConfig));

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

<h1 class="chart-title" style="width: 350px">{title}</h1>
{#if state}
  <h3 title="You can edit the unit symbol in the settings of this datasource.">{state.unitSymbol}</h3>
  <Doughnut data={state.data} {options} style="height: 310px; width: 380px" />
{/if}