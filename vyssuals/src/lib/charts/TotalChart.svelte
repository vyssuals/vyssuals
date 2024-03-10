<script lang="ts">
    import type { ChartConfig, DataSource, Header } from "../types";
    import { titleCase } from "../utils/textUtils";
    import { sumAttributeValues } from "./chartDataUtils";
    import { db } from "../data/databaseManager";

    export let index: string;
    
    let title: string = "";
    let total: number = 0;
    let unitSymbol: string;
    let fullFormattedNumber: string = "";

    $: {
        db.vyssuals.chartConfigs.get(index)
            .then((config) => {
                if (!config) config = {} as ChartConfig;
                title = titleCase(config.showValues);
                return config;
            })
            .then((config) => db.get(config.dataSourceName).getHeaderByName(config.showValues)
                .then((header) => {
                    return { config, header };
                })
            )
            .then(({ config, header }) => {
                unitSymbol = header?.unitSymbol || "";
                let dataType = header?.type || "";
                return { config, dataType };
            })
            .then(({ config, dataType }) => db.get(config.dataSourceName).getLatestAttributes()
                .then((latestAttributes) => {
                    if (dataType === "number") {
                        total = sumAttributeValues(latestAttributes, config.showValues) || 0;
                        fullFormattedNumber = formatNumber(total);
                    } else {
                        // count the number of unique items in the dataset
                        total = latestAttributes.length;
                        fullFormattedNumber = total.toString();
                    }
                })
            );
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

<h1>Total</h1>
<h2>{title}</h2>
<div class="total">
    <h1 class="total-number">{abbreviateNumber(total)}</h1>
</div>
<h3 title="You can edit the unit symbol in the settings of this datasource.">{unitSymbol}</h3>
{#if total > 999}
    <details>
        <summary>&#9781;</summary>
        <p>{fullFormattedNumber}</p>
    </details>
{/if}

<style>
    .total-number {
        font-size: 3rem;
        margin-top: 0.3em;
        margin-bottom: 0.37em;
    }

    .total {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    h2 {
        overflow: hidden; /* Hide overflowed content */
        text-overflow: ellipsis; /* Show ellipsis (...) when the content overflows */
        white-space: nowrap; /* Prevent text from wrapping onto the next line */
    }

    h3 {
        align-self: flex-end center;
    }

    details {
        margin-top: 2em;
        font-weight: 300;
    }

    details summary {
        cursor: pointer;
        list-style: none;
    }

    details summary:hover {
        scale: 1.5;
    }

    details p {
        font-weight: 500;
    }
</style>
