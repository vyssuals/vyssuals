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
    const chartConfigs: ChartConfig[] = [];

    let showValuesHeaders;
    let groupByHeaders;

    // List of words to filter out
    const filterShowValuesWords = ["id", "token", "timestamp", "date", "time"];
    const filterGroupByWords = ["id", "token", "value", "count"];

    //   console.log("pre nlp showValuesHeaders", dataSource.header);
    // Filter out columns based on NLP
    showValuesHeaders = headers.filter((header) => {
        return !filterShowValuesWords.some((filterWord) => matchWord(header.name, filterShowValuesWords));
    });

    // filter out columns that are not type number
    showValuesHeaders = showValuesHeaders.filter((header) => {
        return header.type === "number";
    });

    //   console.log("post nlp showValuesHeaders", showValuesHeaders);
    //   console.log("pre nlp groupByHeaders", dataSource.header);
    // Filter out columns based on NLP
    groupByHeaders = headers.filter((header) => {
        return !filterGroupByWords.some((filterWord) => matchWord(header.name, filterGroupByWords));
    });
    //   console.log("post nlp groupByHeaders", groupByHeaders);

    groupByHeaders = groupByHeaders.filter((header) => {
        if (!header.cardinalityRatio || !header.uniqueValues) return;

        const minUniqueValues = 5;
        if (header.uniqueValues === 1) {
            return false;
        }
        if (header.uniqueValues > 10) {
            return false;
        }
        // Include the column if it has fewer unique values than the threshold,
        // its cardinality ratio is less than 0.2, and not all values are the same
        return header.uniqueValues <= minUniqueValues || header.cardinalityRatio < 0.2;
    });

    //   console.log("post cardinality groupByHeaders", groupByHeaders);

    let showValuesIndex, groupByIndex;
    let showValues: string, groupBy: string;
    const chartTypes = ["bar", "doughnut", "total"];
    let chartType: ChartType;

    for (let i = 0; i < amount; i++) {
        do {
            // randomly select a chart type
            chartType = chartTypes[Math.floor(Math.random() * chartTypes.length)] as ChartType;

            showValuesIndex = Math.floor(Math.random() * showValuesHeaders.length);
            showValues = showValuesHeaders[showValuesIndex]?.name || "";

            groupByIndex = Math.floor(Math.random() * groupByHeaders.length);
            groupBy = groupByHeaders[groupByIndex]?.name || "";

            // If showValues or groupBy is an empty string, break the loop
            if (showValues === "" || groupBy === "") {
                break;
            }
        } while (showValues === groupBy); // Repeat if showValues and groupBy are the same

        // If showValues or groupBy is an empty string, break the outer loop
        if (showValues === "" || groupBy === "") {
            break;
        }

        // Remove used headers
        groupByHeaders.splice(groupByIndex, 1);

        chartConfigs.push({
            id: Math.random().toString(36).slice(2, 12).toString(),
            index: 0,
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
    return chartConfigs;
}
