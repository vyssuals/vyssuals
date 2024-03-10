import Dexie, { liveQuery, type IndexableType, type Observable, type PromiseExtended } from "dexie";
import type { Header, Update, Item, Versions, Attributes } from "../types";
import { getSelectedItems, getLatestItemValue, getLatestItemAttributes } from "./itemUtils";

export class DataSourceDatabase extends Dexie {
    updates: Dexie.Table<Update, string>;
    items: Dexie.Table<Item, string>;
    metadata: Dexie.Table<Header, string>;
    info: Dexie.Table<{ id: number, value: any }, number>;

    constructor(name: string) {
        super(name);

        this.version(1).stores({
            updates: "&timestamp, type, name, visibleItemIds",
            items: "&id, versions",
            metadata: "&name, type, unitSymbol, uniqueValues, cardinalityRatio",
            info: "++id"
        });

        this.updates = this.table("updates");
        this.items = this.table("items");
        this.metadata = this.table("metadata");
        this.info = this.table("info");
    }

    private async setInfo(value: any): Promise<void> {
        const existing = await this.info.get(1);
        const merged = {...existing, ...value};
        await this.info.put({id: 1, value: merged});
    }

    private async getInfo(): Promise<any> {
        const info = await this.info.get(1);
        return info && info.value;
    }

    get lastUpdate(): Promise<string | undefined>{
        return this.getInfo().then(info => info && info.lastUpdate);
    }

    set type(type: string) {
        this.setInfo({type});
    }

    get type(): Promise<string | undefined>{
        return this.getInfo().then(info => info && info.type);
    }

    addUpdate(update: Update): void {
        this.updates
            .add(update)
            .catch((error) => {}); // Ignore errors
        this.setInfo({lastUpdate: update.timestamp.toString()});
    }

    addMetadata(metadata: Header[]): void {
        if (metadata.length > 1) {
            this.metadata.bulkAdd(metadata, {allKeys: true})
            .catch((error) => {
                if (error instanceof Dexie.BulkError) {} // Ignore errors
            });
        } else if (metadata.length === 1) {
            this.metadata.add(metadata[0])
                .catch((error) => {});
        };
    }
    

    getMetadata(): Observable<Header[]> {
        return liveQuery(() => this.metadata.toArray());
    }

    updateHeader(header: Header): void {
        this.metadata
            .put(header)
            .catch((error) => {
                console.error(`Failed to update metadata with name ${header.name}: ${error}`);
            });
    }

    getHeaderByName(name: string): PromiseExtended<Header | undefined> {
        return this.metadata.get(name);
    }

    addItems(items: Item[]): void {
        items.forEach(item => this.addItem(item));
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

    get keys(): Observable<IndexableType[]> {
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
