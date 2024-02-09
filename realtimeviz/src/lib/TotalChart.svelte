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

    // function for formatting large numbers with ` , e.g. 1`000`000
    function formatNumber(num: number) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    }

    let total:number = 0;

    $: {
      config = $chartConfigs[index];
        total = aggregateAttributeValues($dataset, config.showValues);
    }

</script>

<h2>Total {titleCase(config.showValues)}</h2>
<h3>{config.unitSymbol}</h3>
<div class="total">
    <h1>{formatNumber(total)}</h1>
</div>

<style>
    h1 {
        font-size: 3rem;
        margin-top: 0.3em;
        margin-bottom: 0.37em;
    }

    .total {
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
</style>
        