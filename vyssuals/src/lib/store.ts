import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { ChartConfig } from "./types";

// Chart Configs
export const showChartEditor = writable(false);
export const chartToEdit: Writable<string> = writable("");

export const startColor: Writable<string> = writable("#DC0999");
export const endColor: Writable<string> = writable("#05ACFF");

export const showConnector: Writable<string> = writable("");

export const showDataConnectionEditor: Writable<boolean> = writable(false);

export const showDataSourceEditor: Writable<boolean> = writable(false);
export const dataSourceToEdit: Writable<string> = writable("");

export const colorSyncChartConfig: Writable<ChartConfig | null> = writable({} as ChartConfig);

export const showDataInfo: Writable<boolean> = writable(false);