<script lang="ts">
    import type { ChartConfig } from "../types";
    import { titleCase } from "./text";
    export let config: ChartConfig;

    // sum all values of config.data.datasets[0].data
    let total = 0;
    config.data.datasets[0].data.forEach((value: number) => {
        total += value;
    });

</script>

<h2>Total {titleCase(config.showValues)}</h2>
<h1>{total}</h1>

<style>
    h1 {
        text-align: center;
        font-size: 3em;
    }
</style>
