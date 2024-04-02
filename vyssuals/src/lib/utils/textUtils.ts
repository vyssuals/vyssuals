import type { ChartConfig } from "../types";

export function formatTitle(chartConfig: ChartConfig): string {
    return `${titleCase(chartConfig.showValues)} by ${titleCase(chartConfig.groupBy)}`;
}

// title case function
export function titleCase(str: string): string {
    return str.toLowerCase().split(' ').map(function(word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

export function formatSubtitle(chartConfig: ChartConfig, unitSymbol: string, updateName: string, updateType: string = "auto"): string {
    let update: string = chartConfig.update;
    if (chartConfig.update != "Latest Update") {
        if (updateType == "auto") {
            update = new Date(chartConfig.update).toLocaleTimeString();
        } else {
            update = updateName;
        }
    }

    return `${truncateString(chartConfig.dataSourceName)} // ${truncateString(update)} // ${unitSymbol}`;
}

function truncateString(str: string,): string {
    const num = 20;
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}