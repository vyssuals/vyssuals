import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { DataItem, DiagramInfo } from './types';


export const showChartConfigurator = writable(false);

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

// Diagrams
const initialDiagramInfo: DiagramInfo[] = [];
export const diagramsInfo: Writable<DiagramInfo[]> = writable(initialDiagramInfo)

export function addDiagramInfo(item: DiagramInfo) {
    diagramsInfo.update(data => [...data, item])
}

export function getDiagramCount(): number {
    let count = 0;
    diagramsInfo.subscribe(diagrams => {
        count = diagrams.length;
    });
    return count;
}

export function logDiagramInfo() {
    console.log('Diagrams:');
    diagramsInfo.subscribe(value => {
        value.forEach(item => {
            console.log(`Number: ${item.diagramNumber}, groupBy: ${item.groupBy}, showValues: ${item.showValues}`);
        });
    })();
}