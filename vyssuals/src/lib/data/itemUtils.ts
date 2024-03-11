import type { Attributes, Item } from "../types";
import Dexie from "dexie";

export function getLatestItemAttributes(item: Item): Attributes {
    // sort item.versions by timestamp and return the values of the latest version
    const timestamps = Object.keys(item.versions)
        .map(Number)
        .sort((a, b) => b - a);
    const latestVersion = item.versions[timestamps[0]];
    return latestVersion;
}

export function getLatestItemValue(item: Item, key: string): string | number {
    const timestamps = Object.keys(item.versions)
        .map(Number)
        .sort((a, b) => b - a);
    const latestVersion = item.versions[timestamps[0]];
    if (latestVersion === undefined) {
        console.error("latestVersion is undefined");
        return "";
    }
    return latestVersion[key];
}

// Function to get selected items from a Dexie table
export async function getSelectedItems(
    table: Dexie.Table<Item>,
    itemIds: string[]
): Promise<Item[]> {
    if (itemIds.length > 0) {
        const items = await Promise.all(itemIds.map((id) => table.get(id)));
        return items.filter((item): item is Item => item !== undefined);
    }
    const items = await table.toCollection().toArray();
    return items.filter((item): item is Item => item !== undefined);
}
