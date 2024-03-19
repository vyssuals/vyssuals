import type { ChartConfig, Header, Attributes,  } from "../types";
import { createColorArray } from "../utils/colorUtils";
import { getItemValue, getItemAttributes } from "../data/itemUtils";
import type { Item } from "../types";
import type { DataSourceDatabase } from "../data/dataSourceDatabase";

export async function calculateChartData(labels: string[], attributes: Attributes[], dataType: string, config: ChartConfig): Promise<any> {
    let data: number[] = [];
    
    if (dataType === "number") {
        data = labels.map((label) => sumAttributeBy(attributes, config.showValues, label?.toString() || "", config.groupBy));
    } else {
        data = labels.map((label) => countAttributeBy(attributes, config.showValues, label?.toString() || "", config.groupBy))
    }

    return assembleChartData(labels, data, config.startColor, config.endColor);
}

function assembleChartData(labels: string[], data: number[], startColor: string, endColor: string) {
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
    return attributes.reduce((total: number, item: Attributes) => {
        if (!item) return total;
        if (attribute in item) {
            return total + Number(item[attribute]);
        } else {
            return total;
        }
    }, 0);
}

// aggregate values of a specific attribute,  inputs: attribute to aggregate, list of labels to aggregate by, attibute key of labels
function sumAttributeBy(attributes: Attributes[], aggregateAttribute: string, label: string, groupBy: string): number {
    return attributes.reduce(
        (total: number, item: Attributes) =>
            item && item[groupBy] == label && aggregateAttribute in item ? total + Number(item[aggregateAttribute]) : total,
        0
    );
}

function countAttributeBy(attributes: Attributes[], aggregateAttribute: string, label: string, groupBy: string): number {
    return attributes.reduce(
        (total: number, item: Attributes) =>
            item && item[groupBy] == label && aggregateAttribute in item ? total + 1 : total,
        0
    );
}

export function getLabelsAndAttributes(items: Item[], groupBy: string, update: string) {
    const labels = [...new Set(items.map((item) => item && getItemValue(item.versions, groupBy, update).toString()).filter(Boolean).sort())];
    const attributes = items.map((item) => item && getItemAttributes(item.versions, update)).filter(Boolean) || [];
    return { labels, attributes };
}

export async function fetchItems(ds: DataSourceDatabase, timestamp: string): Promise<Item[]> {
    const update = await ds.updates.get(timestamp);
    const rawItems = await ds.items.bulkGet(update?.visibleItemIds || []);
    return rawItems.filter((item): item is Item => item !== undefined);
}