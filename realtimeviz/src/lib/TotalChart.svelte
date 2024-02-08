<script lang="ts">
    import type { ChartConfig } from "../types";
    export let config: ChartConfig;

    // sum all values of config.data.datasets[0].data
    let total = 0;
    config.data.datasets[0].data.forEach((value: number) => {
        total += value;
    });

</script>

<h2>Total</h2>
<h1>{total}</h1>
