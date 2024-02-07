<script lang="ts">
    import type { ChartConfig } from "../types";
    import { Doughnut } from 'svelte-chartjs';
    
    import {
      Chart as ChartJS,
      Title,
      Tooltip,
      Legend,
      ArcElement,
      CategoryScale,
    } from 'chart.js';

    export let config: ChartConfig;
    const data = config.data;

    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

</script>

<h1>DoughnutChart</h1>
<p>{config.type}</p>
<Doughnut {data} options={{ responsive: true }} />