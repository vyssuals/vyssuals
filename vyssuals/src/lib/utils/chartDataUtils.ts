import type { ChartConfig, Header, Attributes, Versions,  } from "../types";
import { createColorArray, darkenHexColor, lightenHexColor } from "./colorUtils";
import { getItemValue, getItemAttributes } from "./itemUtils";
import type { Item } from "../types";
import type { DataSourceDatabase } from "../data/dataSourceDatabase";


export function calculateChartData(labels: string[], attributes: Attributes[], dataType: string, config: ChartConfig): any {
    let data: number[] = [];
    
    if (dataType === "number") {
        data = labels.map((label) => sumAttributeBy(attributes, config.showValues, label?.toString() || "", config.groupBy));
    } else {
        data = labels.map((label) => countAttributeBy(attributes, config.showValues, label?.toString() || "", config.groupBy))
    }

    return assembleChartData(labels, data, config.startColor, config.endColor);
}

function assembleChartData(labels: string[], data: number[], startColor: string, endColor: string) {
    const colors = createColorArray(data.length, startColor, endColor);

    return {
        labels: labels,
        datasets: [
            {
                data: data,
                colors: colors,
                // backgroundColor: colors,
                backgroundColor: (context: any) => {
                    let chart = context.chart;
                    let ctx = chart.ctx;
                    let color = colors[context.dataIndex];
                    const type = chart.config._config.type;
                    let gradient: CanvasGradient;
                    if (type === "doughnut") {
                        return lightenHexColor(color, 10);
                    } else {
                        gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                        gradient.addColorStop(1, `${color}99`);
                        gradient.addColorStop(0, color);
                    }
                    return gradient;
                },
                borderColor: colors.map((color) => darkenHexColor(color, 60)),
                borderWidth: 1.7,
                borderRadius: 5,
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

export function getLabels(items: Item[], groupBy: string, update: string): string[] {
    return [...new Set(items.map((item) => item && getItemValue(item.versions, groupBy, update).toString()).filter(Boolean).sort())];
}

export function getAttributes(items: Item[], update: string): Attributes[] {
    if (!update) {
        // return all attributes from all versions for all items
        let allAttributes: Attributes[] = [];
        items.forEach((item) => {
            if (item) {
                allAttributes = allAttributes.concat(Object.values(item.versions));
            }
        });
        return allAttributes;
    }
    return items.map((item) => item && getItemAttributes(item.versions, update)).filter(Boolean) || [];
}


export async function fetchItems(ds: DataSourceDatabase, timestamp: string = ""): Promise<Item[]> {
    if (!timestamp) {
        const rawItems = await ds.items.toArray();
        return rawItems.filter((item): item is Item => item !== undefined);
    }
    const update = await ds.updates.get(timestamp);
    const rawItems = await ds.items.bulkGet(update?.visibleItemIds || []);
    return rawItems.filter((item): item is Item => item !== undefined);
}