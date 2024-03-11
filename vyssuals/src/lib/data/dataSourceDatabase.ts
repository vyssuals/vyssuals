import Dexie, { liveQuery, type IndexableType, type Observable, type PromiseExtended } from "dexie";
import type { Header, Update, Item, Versions, Attributes, Info } from "../types";
import { getSelectedItems, getLatestItemValue, getLatestItemAttributes } from "./itemUtils";

export class DataSourceDatabase extends Dexie {
    updates: Dexie.Table<Update, string>;
    items: Dexie.Table<Item, string>;
    metadata: Dexie.Table<Header, string>;
    private info: Dexie.Table<Info, any>;

    constructor(name: string) {
        super(name);

        this.version(1).stores({
            updates: "&timestamp, type, name, visibleItemIds",
            items: "&id, versions",
            metadata: "&name, type, unitSymbol, uniqueValues, cardinalityRatio",
            info: "&key, value",
        });

        this.updates = this.table("updates");
        this.items = this.table("items");
        this.metadata = this.table("metadata");
        this.info = this.table("info");
    }

    get lastUpdate(): Promise<string | undefined> {
        return this.info.get("lastUpdate").then((x) => x?.value);
    }

    async setLastUpdate(lastUpdate: string) {
        await this.info.put({key: "lastUpdate", value: lastUpdate});
    }

    get type(): Promise<string | undefined> {
        return this.info.get("type").then((x) => x?.value);
    }

    async setType(type: string) {
        await this.info.put({key: "type", value: type});
    }

    addUpdate(update: Update): void {
        this.updates.add(update).catch((error) => {}); // Ignore errors
        this.setLastUpdate(update.timestamp.toString());
    }

    addMetadata(metadata: Header[]): void {
        if (metadata.length > 1) {
            this.metadata.bulkAdd(metadata, { allKeys: true }).catch((error) => {
                if (error instanceof Dexie.BulkError) {
                } // Ignore errors
            });
        } else if (metadata.length === 1) {
            this.metadata.add(metadata[0]).catch((error) => {});
        }
    }

    get _metadata(): Observable<Header[]> {
        return liveQuery(() => this.metadata.toArray());
    }

    updateHeader(header: Header): void {
        this.metadata.put(header).catch((error) => {
            console.error(`Failed to update metadata with name ${header.name}: ${error}`);
        });
    }

    getHeaderByName(name: string): PromiseExtended<Header | undefined> {
        return this.metadata.get(name);
    }

    addItems(items: Item[]): void {
        items.forEach((item) => this.addItem(item));
    }

    private async addItem(item: Item) {
        const existingItem: Item | undefined = await this.items.get(item.id);

        if (existingItem) {
            const mergedVersions: Versions = {
                ...existingItem.versions,
                ...item.versions,
            };
            await this.items.put({ ...item, versions: mergedVersions });
        } else {
            await this.items.put(item);
        }
    }

    get _keys(): Observable<IndexableType[]> {
        return liveQuery(() => this.metadata.toCollection().primaryKeys());
    }

    getLatestValues(attribute: string, items: string[] = []): Promise<(string | number | undefined)[]> {
        return new Promise(async (resolve) => {
            const selectedItems = await getSelectedItems(this.items, items);
            const latestValues = selectedItems.map((item) => getLatestItemValue(item, attribute));

            resolve(latestValues);
        });
    }

    getLatestAttributes(items: string[] = []): Promise<Attributes[]> {
        return new Promise(async (resolve) => {
            const selectedItems = await getSelectedItems(this.items, items);
            const latestAttributes = selectedItems.map((item) => getLatestItemAttributes(item));

            resolve(latestAttributes);
        });
    }
}
