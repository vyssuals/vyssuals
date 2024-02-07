<script lang="ts">
    import type { ChartConfig } from "../types";
    import { Bar } from 'svelte-chartjs';
    
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

<h1>BarChart</h1>
<p>{config.type}</p>
<Bar {data} options={{ responsive: true }} />