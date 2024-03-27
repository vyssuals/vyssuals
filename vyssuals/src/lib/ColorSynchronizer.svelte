<script lang="ts">
    import { db } from "./data/databaseManager";
    import { liveQuery, type Observable } from "dexie";
    import { colorSyncChartConfig } from "./store";
    import { DataSourceDatabase } from "./data/dataSourceDatabase";
    import { fetchItems, getLabels, getAttributes, calculateChartData } from "./utils/chartDataUtils";
    import type { ColorPayload, Item, Attributes, ColorInformation, WebSocketMessage, Header } from "./types";
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

    $: if ($colorSyncChartConfig && $colorSyncChartConfig.labels && $colorSyncChartConfig.labels.length > 0 &&  $items) {
        labels = $colorSyncChartConfig.labels ;
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
            const message: WebSocketMessage = {
                timestamp: new Date().toISOString(),
                sender: "Vyssuals",
                senderName: $colorSyncChartConfig.dataSourceName,
                senderVersion: "1.0",
                version: "1.0",
                type: "color",
                payload: colorPayload
            };
            console.log(`sending color payload`);
            socket.send(JSON.stringify(message));
        }
    }

    $: if ($colorSyncChartConfig == null) {
        console.log("sending color cleanup...");
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message: WebSocketMessage = {
                timestamp: new Date().toISOString(),
                sender: "Vyssuals",
                senderName: "Vyssuals",
                senderVersion: "1.0",
                version: "1.0",
                type: "colorCleanup",
            };
            console.log(`sending color cleanup: ${JSON.stringify(message)}`);
            socket.send(JSON.stringify(message));
        }
        // Dummy reference to make $colorSyncChartConfig a dependency of this block
        console.log($colorSyncChartConfig);
    }

    function createColorPayload(attributeName: string, labels: string[], attributes: Attributes[], colors: string[]): ColorPayload {
    const colorPayload: ColorPayload = { colors: []};
    labels.forEach((label, index) => {
        colorPayload.colors.push(createColorInformation(attributeName, label, attributes, colors[index]));
    });

    return colorPayload;
    }

    function createColorInformation(attributeName: string, label: string, attributes: Attributes[], color: string): ColorInformation {
        console.log(`creating color information for ${label}`);
        return {
            color,
            ids: attributes.filter((attribute) => attribute[attributeName] == label).map((attribute) => attribute.Id)
        };
    }
</script>
