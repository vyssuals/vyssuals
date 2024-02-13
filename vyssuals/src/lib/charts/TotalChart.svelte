<script lang="ts">
    import type { ChartConfig, DataItem } from "../types";
    import { chartConfigs, dataset } from "../store";
    import { titleCase } from "../utils/textUtils";
    import { getAttributeValues, allAttributeValuesAreNumbers } from "../utils/dataUtils";

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

    function abbreviateNumber(num: number) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        }
        return num.toString();
    }

    let total: number = 0;
    let fullFormattedNumber: string = '';

    $: {
        config = $chartConfigs[index];
        if (allAttributeValuesAreNumbers($dataset, config.showValues)) {
            total = aggregateAttributeValues($dataset, config.showValues);
            fullFormattedNumber = formatNumber(total);
        } else {
            // count the number of unique items in the dataset
            total = getAttributeValues($dataset, config.showValues).length;
            fullFormattedNumber = total.toString();
        }
    }

</script>

<h2>Total {titleCase(config.showValues)}</h2>
<h3>{config.unitSymbol}</h3>
<div class="total">
    <h1>{abbreviateNumber(total)}</h1>
    
</div>
{#if total > 999}
    <p>{fullFormattedNumber}</p>
{/if}

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
        