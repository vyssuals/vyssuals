<script lang="ts">
    import type { ChartConfig } from "../types";
    import { Doughnut } from 'svelte-chartjs';
    import { formatTitle } from "./text";
    
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

<h2>{formatTitle(config)}</h2>
<Doughnut {data} options={{ responsive: true }} />