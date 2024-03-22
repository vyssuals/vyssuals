<script lang="ts">
    import type { ChartConfig, RawChartData } from "../types";
    import { formatSubtitle, titleCase } from "../utils/textUtils";
    import Chart from "./Chart.svelte";
    import { sumAttributeValues } from "../utils/chartDataUtils";

    export let config: ChartConfig;
    export let chartData: RawChartData;

    let total: number = 0;
    let fullFormattedNumber: string = "";

    let fontSize: string = '3rem';
    $: {
        if (fullFormattedNumber.length > 13) {
            fontSize = '2rem'; // adjust as needed
        } 
        else if (fullFormattedNumber.length > 10) {
            fontSize = '2.5rem'; // adjust as needed
        } else if (fullFormattedNumber.length > 5) {
            fontSize = '3rem'; // adjust as needed
        } else {
            fontSize = '5rem'; // adjust as needed
        }
    }
    
    $: title = titleCase(config.showValues);
    $: subtitle = formatSubtitle(config, chartData.header.unitSymbol);

    $: if (chartData.header.type === "number") {
            total = sumAttributeValues(chartData.attributes, config.showValues) || 0;
            fullFormattedNumber = formatNumber(total);
        } else {
            // count the number of unique items in the dataset
            total = chartData.attributes.length;
            fullFormattedNumber = total.toString();
        }
    

    // function for formatting large numbers with ` , e.g. 1`000`000
    function formatNumber(num: number) {
        num = Math.round(num * 100) / 100;
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    }

    function abbreviateNumber(num: number) {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + "B";
        }
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + "M";
        }
        if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + "K";
        }
        return num.toString();
    }
</script>

<h1 class="chart-title">Total {title}</h1>
<h3 class="chart-subtitle" title="You can edit the unit symbol in the settings of this datasource.">{subtitle}</h3>
<div class="total">
    <h1 class="total-number" style="font-size: {fontSize};">{fullFormattedNumber}</h1>
    <h3>{chartData.header.unitSymbol}</h3>
</div>


<style>
    .total-number {
        font-size: 5rem;
        margin-top: 0;
        margin-bottom: 10px;
    }

    .total {
        margin-top: 90px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    h3 {
        align-self: flex-end center;
    }

</style>
