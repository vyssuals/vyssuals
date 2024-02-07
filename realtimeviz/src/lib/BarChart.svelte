<script lang="ts">
    import type { ChartConfig } from "../types";
    import { Bar } from 'svelte-chartjs';
    import { formatTitle } from "./text";
    
    import {
        Chart,
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
    } from 'chart.js';

    export let config: ChartConfig;
    const data = config.data;

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