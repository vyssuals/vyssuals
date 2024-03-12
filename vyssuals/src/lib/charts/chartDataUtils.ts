import type { ChartConfig, Header, Attributes } from "../types";
import { createColorArray } from "../utils/colorUtils";
import type { ChartData } from "chart.js";
import type { DataSourceDatabase } from "../data/dataSourceDatabase";

export async function getChartData(dataSource: DataSourceDatabase, config: ChartConfig): Promise<ChartData> {
    const values = await dataSource.getLatestValues(config.groupBy);
    const labels = Array.from(new Set(values))
    .sort()
    .map((label) => (label ? label.toString() : ""));
    
    let data: number[] = [];
    
    const attributes = await dataSource.getLatestAttributes();
    const header: Header | undefined = await dataSource.getHeaderByName(config.showValues);
    if (header?.type === "number") {
        data = labels.map((label) => sumAttributeBy(attributes, config.showValues, label?.toString() || "", config.groupBy));
    } else {
        data = labels.map((label) => countAttributeBy(attributes, config.showValues, label?.toString() || "", config.groupBy))
    }

    return assembleChartData(labels, data, config.startColor, config.endColor);
}

function assembleChartData(labels: string[], data: number[], startColor: string, endColor: string): ChartData {
    const backgroundColor = createColorArray(data.length, startColor, endColor);

    return {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: backgroundColor,
                borderWidth: 2,
                borderColor: "#ffffff00",
                borderRadius: 8,
                offset: 5,
            },
        ],
    };
}


// function to sum values of a specific attribute
export function sumAttributeValues(attributes: Attributes[], attribute: string): number {
    return attributes.reduce((total: number, item: Attributes) => total + (Number(item[attribute]) || 0), 0);
}

// aggregate values of a specific attribute,  inputs: attribute to aggregate, list of labels to aggregate by, attibute key of labels
function sumAttributeBy(attributes: Attributes[], aggregateAttribute: string, label: string, groupBy: string): number {
    return attributes.reduce(
        (total: number, item: Attributes) =>
            item && item[groupBy] === label && aggregateAttribute in item ? total + Number(item[aggregateAttribute]) : total,
        0
    );
}

function countAttributeBy(attributes: Attributes[], aggregateAttribute: string, label: string, groupBy: string): number {
    return attributes.reduce(
        (total: number, item: Attributes) =>
            item && item[groupBy] === label && aggregateAttribute in item ? total + 1 : total,
        0
    );
}
