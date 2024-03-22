import type { ChartConfig, ChartType, Header } from "../types";
import FuzzySet from "fuzzyset.js";

// Check if a word matches a list of words
function matchWord(word: string, filterWords: string[]): boolean {
    // Create a new FuzzySet with your filter words
    const filterWordsSet = FuzzySet(filterWords);

    // Find the best match for the word
    const match = filterWordsSet.get(word);

    // If a match was found and the score is above a certain threshold, return true
    // Otherwise, return false
    return !!(match && match.length > 0 && match[0][0] > 0.8);
}

export function autoChart(
    dataSourceName: string,
    headers: Header[],
    amount: number,
    startColor: string,
    endColor: string,
    update: string = "Latest Update"
): ChartConfig[] {
    let chartConfigs: ChartConfig[] = [];

    let showValuesHeaders: Header[];
    let groupByHeaders : Header[];

    // List of words to filter out
    const filterShowValuesWords = ["id", "token", "timestamp", "date", "time"];
    const filterGroupByWords = ["id", "token", "value", "count"];

    showValuesHeaders = headers.filter((header) => {
        // Exclude headers that match any of the filterShowValuesWords
        const doesNotMatchFilterWords = !filterShowValuesWords.some((filterWord) => matchWord(header.name, filterShowValuesWords));

        // Include only headers that are of type number
        const isTypeNumber = header.type === "number";

        return doesNotMatchFilterWords && isTypeNumber;
    });
    if (showValuesHeaders.length === 0) return [];

    groupByHeaders = headers.filter((header) => {
        // Exclude headers that are in showValuesHeaders
        const isNotInShowValuesHeaders = !showValuesHeaders.some((showValuesHeader) => showValuesHeader.name === header.name);

        // Exclude headers that match any of the filterGroupByWords
        const doesNotMatchFilterWords = !filterGroupByWords.some((filterWord) => matchWord(header.name, filterGroupByWords));

        // Exclude headers based on cardinality and unique values
        const passesCardinalityCheck = header.uniqueValues && header.cardinalityRatio && (
            (header.uniqueValues !== 1) &&
            (header.uniqueValues <= 10) &&
            (header.uniqueValues <= 5 || header.cardinalityRatio < 0.2)
        );

        return isNotInShowValuesHeaders && doesNotMatchFilterWords && passesCardinalityCheck;
    });
    if (groupByHeaders.length === 0) return [];

    // limit the amount to the length of the groupByHeaders
    amount = Math.min(amount, groupByHeaders.length);

    let showValuesIndex, groupByIndex;
    let showValues: string, groupBy: string;
    const chartTypes = ["bar", "doughnut", "total"];
    let chartType: ChartType;

    for (let i = 0; i < amount; i++) {
        // randomly select a chart type
        chartType = chartTypes[Math.floor(Math.random() * chartTypes.length)] as ChartType;

        showValuesIndex = Math.floor(Math.random() * showValuesHeaders.length);
        showValues = showValuesHeaders[showValuesIndex]?.name || "";

        groupByIndex = Math.floor(Math.random() * groupByHeaders.length);
        groupBy = groupByHeaders[groupByIndex]?.name || "";

        // If showValues or groupBy is an empty string, break the outer loop
        if (showValues === "" || groupBy === "") {
            break;
        }

        // Remove used headers
        groupByHeaders.splice(groupByIndex, 1);

        chartConfigs.push({
            id: Math.random().toString(36).slice(2, 12).toString(),
            index: -1,
            dataSourceName,
            chartType,
            showValues,
            groupBy,
            startColor: startColor.toString(),
            endColor: endColor.toString(),
            update
        });
    }
    //   console.log("chartConfigs", chartConfigs);
    // notify user if no charts were generated
    if (chartConfigs.length === 0) {
        alert("Sorry, could not interpret dataset, no charts were generated.");
    }

    // remove duplicates from chartConfigs
    chartConfigs = chartConfigs.filter((chartConfig, index, self) => {
        // If the chart type is 'total', only keep it if it's the first occurrence with the same showValues
        if (chartConfig.chartType === 'total') {
            const firstOccurrenceIndex = self.findIndex((t) => t.showValues === chartConfig.showValues && t.chartType === 'total');
            return firstOccurrenceIndex === index;
        }

        // For other chart types, keep all occurrences
        const firstOccurrenceIndex = self.findIndex((t) => t.showValues === chartConfig.showValues && t.groupBy === chartConfig.groupBy);
        return firstOccurrenceIndex === index;
    });
    return chartConfigs;
}
