<script lang="ts">
    import type { ChartConfig } from "../types";
    import { Doughnut } from 'svelte-chartjs';
    import { formatTitle } from "./text";
    import { createChartData } from "./dataUtils";
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
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom"
      }
    }
  }

</script>

<h2>{formatTitle(config)}</h2>
<h3>{config.unitSymbol}</h3>
<Doughnut {data} {options} />