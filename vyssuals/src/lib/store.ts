import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { DataItem, DataSource } from "./types";
import type { ChartConfig } from "./types";

// Chart Configs
export const showChartEditor = writable(false);
export const editChartIndex: Writable<number> = writable(-1);

export const startColor: Writable<string> = writable("#DC0999");
export const endColor: Writable<string> = writable("#05ACFF");

export const chartConfigs: Writable<ChartConfig[]> = writable([]);

export const showConnector: Writable<string> = writable("");

// Dataset
export const dataset: Writable<DataItem[]> = writable([]);

export function addDataItem(item: DataItem) {
  dataset.update((data) => [...data, item]);
}

export function logDatasetContent() {
  console.log("Dataset:");
  dataset.subscribe((value) => {
    value.forEach((item) => {
      console.log(
        `ID: ${item.id}, Datasource: ${item.dataSource}, Timestamp: ${item.timestamp}, Attributes:`,
        item.attributes
      );
    });
  })();
}

export const dataSourcesWebsocket: Writable<string[]> = writable([]);
export const dataSources: Writable<DataSource[]> = writable([]);
export const showDataConnectionEditor: Writable<boolean> = writable(false);

export const showDataSourceEditor: Writable<boolean> = writable(false);
export const dataSourceToEdit: Writable<number> = writable(0);
