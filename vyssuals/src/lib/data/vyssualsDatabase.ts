import Dexie, { type Observable, liveQuery } from "dexie";
import type { ChartConfig } from "../types";

export class VyssualsDatabase extends Dexie {
    chartConfigs: Dexie.Table<ChartConfig, string>;

    constructor() {
        super("vyssuals");

        this.version(1).stores({
            chartConfigs: "&id, index, dataSourceName, chartType, showValues, groupBy, startColor, endColor",
        });

        this.chartConfigs = this.table("chartConfigs");
    }

    get hasChartConfigs(): Observable<boolean> {
        return liveQuery(() => this.chartConfigs.count().then((count) => count > 0));
    }

    get _chartConfigs(): Observable<ChartConfig[]> {
        return liveQuery(() => this.chartConfigs.toArray());
    }
}
