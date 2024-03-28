<script lang="ts">
    import type { ChartConfig, Item } from "../types";
    import { formatSubtitle, titleCase } from "../utils/textUtils";
    import Chart from "./Chart.svelte";
    import { getLabels, sumAttributeValues, getAttributes } from "../utils/chartDataUtils";
    import { colorSyncChartConfig } from "../store";
    import { liveQuery, type Observable } from "dexie";
    import { DataSourceDatabase } from "../data/dataSourceDatabase";
    import { db } from "../data/databaseManager";


    export let config: ChartConfig;

    let ds: DataSourceDatabase;
    $: ds = db.get(config.dataSourceName);

    let total: number = 0;
    let fullFormattedNumber: string = "";

    let fontSize: string = '3rem';
    $: if (fullFormattedNumber) {
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
    
    $: lastUpdate = liveQuery(() => ds.info.get("lastUpdate"));
    let timestamp: string;
    $: {
        async function getTimestamp() {
            if (config.update != "Latest Update") {
                timestamp = config.update;
            } else {
                timestamp = $lastUpdate?.value || "Latest Update";
            }
        }
        getTimestamp();
    }

    $: header = liveQuery(() => ds.metadata.get(config.showValues));

    $: title = titleCase(config.showValues);
    let subtitle: string;
    $: if ($header) subtitle = formatSubtitle(config, $header.unitSymbol);

    let items: Observable<Item[]>;
    $: items = liveQuery(async () => {
        if (!timestamp) {
            const rawItems = await ds.items.toArray();
            return rawItems.filter((item): item is Item => item !== undefined);
        }
        const update = await ds.updates.get(timestamp);
        const rawItems = await ds.items.bulkGet(update?.visibleItemIds || []);
        return rawItems.filter((item): item is Item => item !== undefined);
    });

    let attributes: any[];

    $: if (config && $items) {
        attributes = getAttributes($items, config.update);
    }

    $: if ($header && attributes && $header.type === "number") {
            total = sumAttributeValues(attributes, config.showValues) || 0;
            fullFormattedNumber = formatNumber(total);
        } else {
            // count the number of unique items in the dataset
            total = attributes?.length;
            fullFormattedNumber = total?.toString();
        }
    
    $: if ($colorSyncChartConfig && $colorSyncChartConfig.index === config.index) {
        
        let labels: string[] = [...new Set(attributes.map((attr) => attr[config.showValues].toString()).filter(Boolean))]
        $colorSyncChartConfig.labels = labels
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
    <h3>{$header?.unitSymbol}</h3>
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
