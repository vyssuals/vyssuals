<script lang="ts">
    import { db } from "./data/databaseManager";
    import { liveQuery, type Observable } from "dexie";
    import { colorSyncChartConfig } from "./store";
    import { DataSourceDatabase } from "./data/dataSourceDatabase";
    import { fetchItems, getLabels, getAttributes } from "./utils/chartDataUtils";
    import type { ColorPayload, Item, Attributes, ColorInformation } from "./types";
    import { createColorArray } from "./utils/colorUtils";
    import { socket } from './websocket/websocket';


    let ds: DataSourceDatabase;
    $: if ($colorSyncChartConfig && $colorSyncChartConfig.dataSourceName) {
        ds = db.get($colorSyncChartConfig.dataSourceName);
    }

    let timestamp: string = "Latest Update";
    $: if ($colorSyncChartConfig) {
        async function getTimestamp() {
            if ($colorSyncChartConfig?.update != "Latest Update") {
                timestamp = $colorSyncChartConfig?.update as string;
            } else {
                timestamp = await ds.lastUpdate;
            }
        }
        getTimestamp();
    }

    let items: Observable<Item[]>;
    $: if ($colorSyncChartConfig) {
        items = liveQuery(() => fetchItems(ds, timestamp));
    }

    let labels: string[];
    let attributes: any[];

    $: if ($colorSyncChartConfig && $items) {
        labels = getLabels($items, $colorSyncChartConfig.groupBy, $colorSyncChartConfig.update);
        attributes = getAttributes($items, $colorSyncChartConfig.update)
    }

    let colorPayload: ColorPayload;
    $: if ($colorSyncChartConfig && labels && attributes) {
        colorPayload = createColorPayload(
            $colorSyncChartConfig.groupBy,
            labels,
            attributes,
            createColorArray(labels.length, $colorSyncChartConfig.startColor, $colorSyncChartConfig.endColor)
        );
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(colorPayload));
        }
    }

    function createColorPayload(attributeName: string, labels: string[], attributes: Attributes[], colors: string[]): ColorPayload {
    const colorPayload: ColorPayload = {};
    labels.forEach((label, index) => {
        const colorInformation = createColorInformation(attributeName, label, attributes, colors[index]);
        colorPayload[colorInformation.color] = colorInformation;
    });

    return colorPayload;
    }

    function createColorInformation(attributeName: string, label: string, attributes: Attributes[], color: string): ColorInformation {
        console.log(`creating color information for ${label}`);
        return {
            color,
            attributeName,
            attributeValue: label,
            ids: attributes.filter((attribute) => attribute[attributeName] == label).map((attribute) => attribute.Id)
        };
    }
</script>
