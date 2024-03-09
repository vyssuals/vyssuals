import Dexie, { liveQuery, type IndexableType, type Observable, type PromiseExtended } from "dexie";
import type { ChartConfig, DataSource, Header, Update, Item, Versions, Attributes } from "../types";
import { getSelectedItems, getLatestItemValue, getLatestItemAttributes } from "./itemUtils";

class VyssualsDatabase extends Dexie {
    chartConfigs: Dexie.Table<ChartConfig, string>;
    dataSources: Dexie.Table<DataSource, string>;

    constructor() {
        super("vyssuals");

        this.version(1).stores({
            chartConfigs: "&++id, dataSourceName, chartType, showValues, groupBy, startColor, endColor",
            dataSources: "&name, type, lastUpdate",
        });

        this.chartConfigs = this.table("chartConfigs");
        this.dataSources = this.table("dataSources");
    }

    // Method to check if a store exists
    private storeExists(dataSourceName: string): boolean {
        return this.tables.some((table) => table.name.startsWith(dataSourceName));
    }

    // Method to add new stores
    private addStores(dataSourceName: string): void {
        const currentVersion = this.verno;
        this.version(currentVersion + 1).stores({
            [`${dataSourceName}__updates`]: "&timestamp, type, name, visibleItemIds",
            [`${dataSourceName}__items`]: "&id, versions",
            [`${dataSourceName}__metadata`]: "&name, type, unitSymbol, uniqueValues, cardinalityRatio",
        });
    }

    private ensureStore(dataSourceName: string): void {
        if (!this.storeExists(dataSourceName)) {
            this.addStores(dataSourceName);
        }
    }

    addUpdate(dataSourceName: string, update: Update): void {
        this.ensureStore(dataSourceName);
        this.table(`${dataSourceName}__updates`)
            .add(update)
            .catch((error) => {
                console.error(`Failed to add update with timestamp ${update.timestamp}: ${error}`);
            });
    }

    addMetadata(dataSourceName: string, metadata: Header[]): void {
        this.ensureStore(dataSourceName);
        for (const header of metadata) {
            this.table(`${dataSourceName}__metadata`)
                .add(header)
                .catch((error) => {
                    console.error(`Failed to add metadata with name ${header.name}: ${error}`);
                });
        }
    }

    getMetadata(dataSourceName: string): Observable<Header[]> {
        return liveQuery(() => this.table(`${dataSourceName}__metadata`).toArray());
    }

    updateHeader(dataSourceName: string, header: Header): void {
        this.table(`${dataSourceName}__metadata`)
            .put(header)
            .catch((error) => {
                console.error(`Failed to update metadata with name ${header.name}: ${error}`);
            });
    }

    getHeaderByName(dataSourceName: string, name: string): PromiseExtended<Header> {
        return this.table(`${dataSourceName}__metadata`).get(name);
    }

    addItems(dataSourceName: string, items: Item[]): void {
        this.ensureStore(dataSourceName);
        for (const item of items) {
            this.addItem(dataSourceName, item);
        }
    }

    private async addItem(dataSourceName: string, item: Item) {
        const table = this.table(`${dataSourceName}__items`);
        const existingItem: Item | undefined = await table.get(item.id);

        if (existingItem) {
            const mergedVersions: Versions = {
                ...existingItem.versions,
                ...item.versions,
            };
            await table.put({ ...item, versions: mergedVersions });
        } else {
            await table.put(item);
        }
    }

    addDataSource(dataSource: DataSource): void {
        this.dataSources.add(dataSource).catch((error) => {
            console.error(`Failed to add data source ${dataSource.name}: ${error}`);
        });
    }

    getDataSourceByType(type: string): Observable<DataSource[]> {
        return liveQuery(() => this.dataSources.where("type").equals(type).toArray());
    }

    getDataSources(): Observable<DataSource[]> {
        return liveQuery(() => this.dataSources.toArray());
    }

    getChartConfigs(): Observable<ChartConfig[]> {
        return liveQuery(() => this.chartConfigs.toArray());
    }

    deleteDataSource(dataSourceName: string): void {
        this.transaction("rw", this.tables, async () => {
            await this.dataSources.where("name").equals(dataSourceName).delete();
            await this.chartConfigs.where("dataSourceName").equals(dataSourceName).delete();
            await this.table(`${dataSourceName}__updates`).clear();
            await this.table(`${dataSourceName}__items`).clear();
            await this.table(`${dataSourceName}__metadata`).clear();
        });
    }

    getKeys(dataSourceName: string): Observable<IndexableType[]> {
        return liveQuery(() => this.table(`${dataSourceName}__metadata`).toCollection().primaryKeys());
    }

    getLatestValues(dataSourceName: string, attribute: string, items: string[] = []): Promise<(string | number | undefined)[]> {
        return new Promise(async (resolve) => {
            const table = this.table(`${dataSourceName}__items`);
            const selectedItems = await getSelectedItems(table, items);
            const latestValues = selectedItems.map((item) => getLatestItemValue(item, attribute));

            resolve(latestValues);
        });
    }

    getLatestAttributes(dataSourceName: string, items: string[] = []): Promise<Attributes[]> {
        return new Promise(async (resolve) => {
            const table = this.table(`${dataSourceName}__items`);
            const selectedItems = await getSelectedItems(table, items);
            const latestAttributes = selectedItems.map((item) => getLatestItemAttributes(item));

            resolve(latestAttributes);
        });
    }
}

export const db = new VyssualsDatabase();
