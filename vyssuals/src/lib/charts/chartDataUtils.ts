import type { ChartConfig, Header, Attributes } from "../types";
import { createColorArray } from "../utils/colorUtils";
import { db } from "../data/databaseManager";
import type { ChartData } from "chart.js";

// function for creating chart data, returns chart data
export async function getChartData(dataSourceName: string, config: ChartConfig): Promise<ChartData> {
    const ds = db.get(dataSourceName);
    const values = await ds.getLatestValues(config.groupBy);
    const header: Header | undefined = await ds.getHeaderByName(config.showValues);
    const attributes = await ds.getLatestAttributes();

    const labels = Array.from(new Set(values))
        .sort()
        .map((label) => (label ? label.toString() : ""));

    let data: number[] = [];

    if (header?.type === "number") {
        data = labels.map((label) => sumAttributeBy(attributes, config.showValues, label?.toString() || "", config.groupBy));
    } else {
        // count unique values per label
        data = await Promise.all(
            labels.map(async (label) => {
                const dataValues = await ds.getLatestValues(label);
                return Array.from(new Set(dataValues)).length;
            })
        );
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
