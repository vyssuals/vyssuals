<script lang="ts">
    import type { ChartConfig, DataItem } from "../types";
    import { chartConfigs, dataset } from "../store";
    import { titleCase } from "./text";
    import { getAttributeValues } from "./dataUtils";

    export let index: number;
    let config: ChartConfig;

    function aggregateAttributeValues(dataset: DataItem[], attribute: string) {
        let total = 0;
        for (let i = 0; i < dataset.length; i++) {
            total += Number(dataset[i].attributes[attribute]);
        }
        return total;
    }

    let total:number = 0;

    $: {
      config = $chartConfigs[index];
        total = aggregateAttributeValues($dataset, config.showValues);
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
