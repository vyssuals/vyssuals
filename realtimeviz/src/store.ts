import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { DataItem } from './types';
import { createColorArray, darkenColors } from './lib/colors';
import type { ChartConfig } from './types';


export const showChartConfigurator = writable(false);

// Dataset
const initialData: DataItem[] = [];
export const dataset: Writable<DataItem[]> = writable(initialData);

export function addDataItem(item: DataItem) {
    dataset.update(data => [...data, item]);
}

// get all unique values of a specific attribute
export function getAttributeValues(attribute: string): string[] {
    let result: string[] = [];
    dataset.subscribe(data => {
        data.forEach(item => {
            if (attribute in item.attributes) {
                if (!result.includes(item.attributes[attribute])) {
                    result.push(item.attributes[attribute]);
                }
            }
        });
    })();
    return result;
}


// aggregate values of a specific attribute, sum if numeric, count if not. inputs: attribute to aggregate, list of labels to aggregate by, attibute key of labels
export function aggregateAttribute(aggregateAttribute: string, label: string, groupBy: string): number {
    let result = 0;
    dataset.subscribe(data => {
        data.forEach(item => {
            if (item.attributes[groupBy] === label) {
                if (aggregateAttribute in item.attributes) {
                    result += item.attributes[aggregateAttribute];
                }
            }
        });
    })();
    return result;
}



export function logDatasetContent() {
    console.log('Dataset:');
    dataset.subscribe(value => {
        value.forEach(item => {
            console.log(`ID: ${item.id}, Attributes:`, item.attributes);
        });
    })();
}


// create store for list of ChartConfigs
export const chartConfigs: Writable<ChartConfig[]> = writable([]);

export function addChartConfig(config: ChartConfig) {
    chartConfigs.update(data => [...data, config]);
}

// function for creating a chart config, returns chartconfig
export function createChartConfig(type: string, data: any, options: any): ChartConfig {
    return {
        type: type,
        data: data,
        options: options
    };
}

// function for creating chart data, returns chart data
export function createChartData(labels: string[], datasets: any[]): any {
    return {
        labels: labels,
        datasets: datasets
    };
}

// function for creating chart dataset, returns chart dataset
export function createChartDataset(label: string, data: number[], ): any {
    let backgroundColor = createColorArray(data.length, '#4CAF50', '#FFC107');
    let borderWidth = 2;
    let borderColor = darkenColors(backgroundColor);
    
    return {
        label: label,
        data: data,
        backgroundColor: backgroundColor,
        borderWidth: borderWidth,
        borderColor: borderColor
    };
}

// function for creating a chartConfig based on two inputs: groupBy and showValues. the data to used is the dataset store.
export function createChartConfigFromDiagram(chartType: string, groupBy: string, showValues: string): void {
    const labels = getAttributeValues(groupBy);
    const data = createChartData(labels, [
        createChartDataset(showValues, labels.map(label => aggregateAttribute(showValues, label, groupBy)))
    ]);
    const options = {};
    addChartConfig(createChartConfig(chartType, data, options));
}

export function logChartConfigs() {
    console.log('ChartConfigs:');
    chartConfigs.subscribe(value => {
        value.forEach(item => {
            console.log(`Type: ${item.type}, Data:`, item.data, `Options:`, item.options);
        });
    })();
}