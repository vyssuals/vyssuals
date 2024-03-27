import type { Attributes, Item, Versions } from "../types";
import Dexie from "dexie";

export function getItemAttributes(versions: Versions, timestamp: string = ""): Attributes {
    if (timestamp != "Latest Update") {
        if (timestamp in versions) { 
            console.log(`found timestamp: ${timestamp}, returning`)
            return versions[timestamp]; }
        const timestamps: string[] = Object.keys(versions).sort().reverse();
        for (const ts of timestamps) {
            console.log(`ts: ${ts}, timestamp: ${timestamp}`)
            if (ts <= timestamp) {
                return versions[ts];
            }
        }
        return {} as Attributes;
    }
    // sort item.versions by timestamp and return the values of the latest version
    const timestamps: string[] = Object.keys(versions).sort().reverse();
    const latestVersion = versions[timestamps[0]];
    return latestVersion;
}

export function getItemValue(versions: Versions, key: string, timestamp: string = "Latest Update"): string | number {
    if (timestamp != "Latest Update") {
        // try to get the value from the specified timestamp
        if (timestamp in versions) { return versions[timestamp][key] ?? ""; }
        // if the timestamp is not in versions, get the values from a version prior to the specified timestamp
        const timestamps: string[] = Object.keys(versions).sort().reverse();
        for (const ts of timestamps) {
            if (ts <= timestamp) {
                return versions[ts][key] ?? "";
            }
        }
        return "";
    }

    const versionCount = Object.keys(versions).length;
    if (versionCount === 0) {
        return "";
    } else if (versionCount === 1) {
        return versions[Object.keys(versions)[0]][key] ?? "";
    }
    const timestamps: string[] = Object.keys(versions).sort().reverse();
    return versions[timestamps[0]][key] ?? "";
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
