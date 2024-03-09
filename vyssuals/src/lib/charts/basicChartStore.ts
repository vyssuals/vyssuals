import { writable } from 'svelte/store';
import type { ChartData} from "../types";
import { db } from "../data/db";
import { getChartData } from "./chartDataUtils";

interface ChartStore {
    subscribe: (run: (value: any) => void) => () => void;
    fetch: (index: string) => void;
}

function createChartStore(): ChartStore {
    const { subscribe, update } = writable<Record<string, ChartData | undefined>>({});

    return {
        subscribe,
        fetch: (index: string) => {
            db.chartConfigs.get(index).then((result) => {
                const config = result;
                if (config) {
                    db.dataSources.get(config.dataSourceName || "").then((result) => {
                        const dataSource = result;
                        if (dataSource && config) {
                            getChartData(dataSource.name, config).then((result) => {
                                const data = result;
                                db.getHeaderByName(dataSource.name, config.showValues).then((result) => {
                                    const unitSymbol = result.unitSymbol;
                                    update(store => ({ ...store, [index]: { config, dataSource, data, unitSymbol } }));
                                });
                            });
                        }
                    });
                }
            });
        }
    };
}

export const basicChartStore = createChartStore();