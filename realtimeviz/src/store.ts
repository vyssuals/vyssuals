import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { DataItem } from './types';

const initialData: DataItem[] = [];

// Create a writable store with initial empty data
export const dataset: Writable<DataItem[]> = writable(initialData);

export function addDataItem(item: DataItem) {
    dataset.update(data => [...data, item]);
}

export function removeDataItem(index: number) {
    dataset.update(data => {
        const newData = [...data];
        newData.splice(index, 1);
        return newData;
    });
}

// Function to log the dataset content
export function logDatasetContent() {
    console.log('Dataset:');
    dataset.subscribe(value => {
        value.forEach(item => {
            console.log(`ID: ${item.id}, Attributes:`, item.attributes);
            console.log('item found')
        });
    })();
}

export const showChartConfigurator = writable(false);