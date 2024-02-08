<script lang="ts">
    import type { ChartConfig } from "../types";
    import { chartConfigs, dataset } from "../store";
    import { titleCase } from "./text";
    import { getAttributeValues } from "./dataUtils";

    export let index: number;
    let config: ChartConfig;

    let total:number = 0;

    $: {
      config = $chartConfigs[index];
        let values = getAttributeValues($dataset, config.showValues);
        // convert all values to numbers and sum them
        total = values.map(Number).reduce((a, b) => a + b, 0);
    }

</script>

<h2>Total {titleCase(config.showValues)}</h2>
<h1>{total}</h1>

<style>
    h1 {
        text-align: center;
        font-size: 3em;
    }
</style>
