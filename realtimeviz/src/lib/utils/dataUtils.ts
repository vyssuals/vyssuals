import type { ChartConfig, DataItem } from '../types';
import { createColorArray, darkenColors } from './colorUtils';


export function getUniqueAttributeKeys(dataset: DataItem[]): string[] {
    let result: string[] = [];
        dataset.forEach(item => {
            Object.keys(item.attributes).forEach(key => {
                if (!result.includes(key)) {
                    result.push(key);
                }
            });
        });
    return result;
}

// get all unique values of a specific attribute
export function getAttributeValues(dataset: DataItem[], attribute: string): string[] {
    let result: string[] = [];
        dataset.forEach(item => {
            if (attribute in item.attributes) {
                if (!result.includes(item.attributes[attribute])) {
                    result.push(item.attributes[attribute]);
                }
            }
        });
    return result;
}

// function for checking if all attribute values are numbers
export function allAttributeValuesAreNumbers(dataset: DataItem[], attribute: string) {
    for (let i = 0; i < dataset.length; i++) {
        if (isNaN(Number(dataset[i].attributes[attribute]))) {
            return false;
        }
    }
    return true;
}

// aggregate values of a specific attribute, sum if numeric, count if not. inputs: attribute to aggregate, list of labels to aggregate by, attibute key of labels
export function aggregateAttributeBy(dataset: DataItem[], aggregateAttribute: string, label: string, groupBy: string): number {
    let result = 0;
        dataset.forEach(item => {
            if (item.attributes[groupBy] === label) {
                if (aggregateAttribute in item.attributes) {
                    if (!isNaN(item.attributes[aggregateAttribute])) {
                        result += item.attributes[aggregateAttribute];
                    } else {
                        result += 1; // Increment the count if the attribute is not a number
                    }
                }
            }
        });
    return result;
}


// function for creating chart data, returns chart data
export function createChartData(dataset: DataItem[], chartConfig: ChartConfig): any {
    const labels = getAttributeValues(dataset, chartConfig.groupBy);
    const data = labels.map(label => aggregateAttributeBy(dataset, chartConfig.showValues, label, chartConfig.groupBy));
    const backgroundColor = createColorArray(data.length, chartConfig.startColor, chartConfig.endColor);

    return {
      labels: labels,
      datasets: [
        {
          label: chartConfig.showValues,
          data: data,
          backgroundColor: backgroundColor,
          borderWidth: 2,
          borderColor: '#ffffff00',
          borderRadius: 8,
          offset: 5
        }
      ]
    };
}