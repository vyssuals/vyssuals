<script lang="ts">
    import type { ChartConfig } from "../types";
    import { chartConfigs, dataset } from "../store";
    import { Bar } from 'svelte-chartjs';
    import { formatTitle } from "./text";
    import { createChartData } from "./dataUtils";
    
    import {
        Chart,
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
    } from 'chart.js';

    export let index: number;
    let data: any;
    let config: ChartConfig;
    
    $: {
      config = $chartConfigs[index];
      data = createChartData($dataset, config);
    }

    Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

</script>
<h2>{formatTitle(config)}</h2>
<Bar {data} options={{ responsive: true }} />