import type { DataSourceDatabase } from "./data/dataSourceDatabase";
import { db } from "./data/databaseManager";
import { fetchItems, getAttributes } from "./utils/chartDataUtils";
import type { Attributes, ColorPayload, ColorInformation, ChartConfig, WebSocketMessage } from ".//types";
import { createColorArray } from "./utils/colorUtils";
import { socket } from './websocket/websocket';

export async function sendColors(config: ChartConfig, labels: string[]) {
    const colorPayload = await createColorPayload(config, labels)
    if (socket && socket.readyState === WebSocket.OPEN) {
        const message: WebSocketMessage = {
            timestamp: new Date().toISOString(),
            sender: "Vyssuals",
            senderName: config.dataSourceName,
            senderVersion: "1.0",
            version: "1.0",
            type: "color",
            payload: colorPayload
        };
        console.log(`sending color payload`);
        socket.send(JSON.stringify(message));
    }
}

export async function sendCleanup() {
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
}}

async function createColorPayload(config: ChartConfig, labels: string[]) {
    const ds: DataSourceDatabase = db.get(config.dataSourceName);
    const timestamp = await getTimestamp(ds, config.update);
    const items = await fetchItems(ds, timestamp);
    const attributes = getAttributes(items, timestamp);
    const colors = createColorArray(labels.length, config.startColor, config.endColor);
    const colorPayload: ColorPayload = { colors: [] };
    labels.forEach((label, index) => {
        colorPayload.colors.push(createColorInformation(config.groupBy, label, attributes, colors[index]));
    });
    return colorPayload;
}

function createColorInformation(attributeName: string, label: string, attributes: Attributes[], color: string): ColorInformation {
    return {
        color,
        ids: attributes.filter((attribute) => attribute[attributeName] == label).map((attribute) => attribute.Id)
    };
}

async function getTimestamp(ds: DataSourceDatabase, update: string): Promise<string> {
    if (update == "Latest Update") {
        return ds.lastUpdate;
    } else {
        return update;
    }
}
