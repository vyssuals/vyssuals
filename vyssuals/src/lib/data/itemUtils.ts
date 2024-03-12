import type { Attributes, Item, Versions } from "../types";
import Dexie from "dexie";

export function getLatestItemAttributes(versions: Versions): Attributes {
    // sort item.versions by timestamp and return the values of the latest version
    const timestamps: string[] = Object.keys(versions).sort().reverse();
    const latestVersion = versions[timestamps[0]];
    return latestVersion;
}

export function getLatestItemValue(versions: Versions, key: string): string | number {
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
