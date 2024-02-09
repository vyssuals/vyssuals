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