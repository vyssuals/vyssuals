<script lang="ts">
    import type { ChartConfig } from "../types";
    import { Doughnut } from 'svelte-chartjs';
    import { formatTitle } from "../utils/textUtils";
    import { createChartData } from "../utils/dataUtils";
    import { chartConfigs, dataset } from "../store";
    
    import {
      Chart as ChartJS,
      Title,
      Tooltip,
      Legend,
      ArcElement,
      CategoryScale,
    } from 'chart.js';

    export let index: number;
    let data: any;
    let config: ChartConfig;

    $: {
      config = $chartConfigs[index];
      data = createChartData($dataset, config);
    }

    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

    let options = {
      responsive: false,
      plugins: {
        legend: {
          labels: {
            generateLabels: (chart: any) => chart.data.labels.map((l: string, i: number) => ({
              datasetIndex: 0,
              index: i,
                text: l.length > 8 ? `${l.slice(0, 6)}...` : l,
              fillStyle: chart.data.datasets[0].backgroundColor[i],
              strokeStyle: chart.data.datasets[0].backgroundColor[i],
              hidden: false
            }))
          },
          position: "bottom",
      }
    }
  }

</script>

<h2 class="chart-title" style="width: 350px">{formatTitle(config)}</h2>
<h3>{config.unitSymbol}</h3>
<Doughnut {data} {options} style="height: 80%; width: 380px" />

