import { writable } from "svelte/store";
import type { ChartData } from "../types";
import { db } from "../data/databaseManager";
import { getChartData } from "./chartDataUtils";
import type { ChartConfig } from "../types";

interface ChartStore {
    subscribe: (run: (value: any) => void) => () => void;
    fetch: (config: ChartConfig) => void;
}

function createChartStore(): ChartStore {
    const { subscribe, update } = writable<Record<string, ChartData | undefined>>({});

    return {
        subscribe,
        fetch: (config: ChartConfig) => {
            if (config) {
                const ds = db.get(config.dataSourceName);
                if (ds) {
                    getChartData(ds, config).then((result) => {
                        const data = result;
                        ds.getHeaderByName(config.showValues).then((result) => {
                            if (!result) return;
                            const unitSymbol = result.unitSymbol;
                            update((store) => ({ ...store, [config.id]: { data, unitSymbol } }));
                        });
                    });
                }
            }
        },
    };
}

export const basicChartStore = createChartStore();
