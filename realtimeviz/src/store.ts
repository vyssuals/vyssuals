import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type {  DataItem } from './types';
import type { ChartConfig } from './types';

// Chart Configs
export const showChartEditor = writable(false);
export const editChartIndex: Writable<number> = writable(-1);

export const startColor: Writable<string> = writable('#4CAF50');
export const endColor: Writable<string> = writable('#FFC107');

export const chartConfigs: Writable<ChartConfig[]> = writable([]);


// Dataset
const initialData: DataItem[] = [];
export const dataset: Writable<DataItem[]> = writable(initialData);

export function addDataItem(item: DataItem) {
    dataset.update(data => [...data, item]);
}

export function logDatasetContent() {
    console.log('Dataset:');
    dataset.subscribe(value => {
        value.forEach(item => {
            console.log(`ID: ${item.id}, Attributes:`, item.attributes);
        });
    })();
}
