import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
// import type { DataItem, DataSource } from "./types";
import type { ChartConfig,  } from "./types";
import { produce } from "immer";

// Chart Configs
export const showChartEditor = writable(false);
export const chartToEdit: Writable<string> = writable("");

export const startColor: Writable<string> = writable("#DC0999");
export const endColor: Writable<string> = writable("#05ACFF");

export const showConnector: Writable<string> = writable("");

export const showDataConnectionEditor: Writable<boolean> = writable(false);

export const showDataSourceEditor: Writable<boolean> = writable(false);
export const dataSourceToEdit: Writable<string> = writable("");

// export const chartConfigs: Writable<ChartConfig[]> = writable([]);

// Dataset
// export const dataset: Writable<DataItem[]> = writable([]);

// export function addDataItem(item: DataItem) {
//   dataset.update((data) => [...data, item]);
// }

// export function logDatasetContent() {
//   console.log("Dataset:");
//   dataset.subscribe((value) => {
//     value.forEach((item) => {
//       console.log(
//         `ID: ${item.id}, Datasource: ${item.dataSourceName}, Timestamp: ${item.timestamp}, Attributes:`,
//         item.attributes
//       );
//     });
//   })();
// }

// export const dataSourcesWebsocket: Writable<string[]> = writable([]);
// export const dataSources: Writable<DataSource[]> = writable([]);


// const initialState: Store = {
//   dataSources: {}
// };

// function createImmerStore(initialState: Store) {
//   const { subscribe, set, update } = writable(initialState);

//   return {
//     subscribe,
//     set,
//     update: (fn: (draft: Store) => void) => update(state => produce(state, fn))
//   };
// }

// export const dataStore = createImmerStore(initialState);