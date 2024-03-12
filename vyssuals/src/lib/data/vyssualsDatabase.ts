import Dexie, { type Observable, liveQuery } from "dexie";
import type { ChartConfig, DataSource } from "../types";

export class VyssualsDatabase extends Dexie {
    chartConfigs: Dexie.Table<ChartConfig, string>;
    // dataSources: Dexie.Table<DataSource, string>;

    constructor() {
        super("vyssuals");

        this.version(1).stores({
            chartConfigs: "&id, index, dataSourceName, chartType, showValues, groupBy, startColor, endColor",
            // dataSources: "&name, type, lastUpdate",
        });

        this.chartConfigs = this.table("chartConfigs");
        // this.dataSources = this.table("dataSources");
    }

    get hasChartConfigs(): Observable<boolean> {
        return liveQuery(() => this.chartConfigs.count().then((count) => count > 0));
    }

    // addDataSource(dataSource: DataSource): void {
    //     this.dataSources.add(dataSource).catch((error) => {
    //         console.error(`Failed to add data source ${dataSource.name}: ${error}`);
    //     });
    // }

    // getDataSourceByType(type: string): Observable<DataSource[]> {
    //     return liveQuery(() => this.dataSources.where("type").equals(type).toArray());
    // }

    // getDataSources(): Observable<DataSource[]> {
    //     return liveQuery(() => this.dataSources.toArray());
    // }

    get _chartConfigs(): Observable<ChartConfig[]> {
        return liveQuery(() => this.chartConfigs.toArray());
    }

    // deleteDataSource(dataSourceName: string): void {
    //     this.transaction("rw", this.tables, async () => {
    //         await this.dataSources.where("name").equals(dataSourceName).delete();
    //         await this.chartConfigs.where("dataSourceName").equals(dataSourceName).delete();
    //     });
    // }
}
