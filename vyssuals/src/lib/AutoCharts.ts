import type { ChartConfig, ChartType, DataSource } from "./types";
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

export async function autoChart(
  dataSource: DataSource,
  amount: number,
  startColor: string,
  endColor: string
): Promise<ChartConfig[]> {
  const chartConfigs: ChartConfig[] = [];

  let showValuesHeaders;
  let groupByHeaders;

  // List of words to filter out
  const filterShowValuesWords = ["id", "token", "timestamp", "date", "time"];
  const filterGroupByWords = ["id", "token", "value", "count"];

  //   console.log("pre nlp showValuesHeaders", dataSource.headerData);
  // Filter out columns based on NLP
  showValuesHeaders = dataSource.headerData.filter((header) => {
    return !filterShowValuesWords.some((filterWord) =>
      matchWord(header.name, filterShowValuesWords)
    );
  });
  //   console.log("post nlp showValuesHeaders", showValuesHeaders);
  //   console.log("pre nlp groupByHeaders", dataSource.headerData);
  // Filter out columns based on NLP
  groupByHeaders = dataSource.headerData.filter((header) => {
    return !filterGroupByWords.some((filterWord) =>
      matchWord(header.name, filterGroupByWords)
    );
  });
  //   console.log("post nlp groupByHeaders", groupByHeaders);

  groupByHeaders = groupByHeaders.filter((header) => {
    const minUniqueValues = 5;
    if (header.uniqueValues === 1) {
      return false;
    }
    if (header.uniqueValues > 10) {
      return false;
    }
    // Include the column if it has fewer unique values than the threshold,
    // its cardinality ratio is less than 0.2, and not all values are the same
    return (
      header.uniqueValues <= minUniqueValues || header.cardinalityRatio < 0.2
    );
  });

  //   console.log("post cardinality groupByHeaders", groupByHeaders);

  let showValuesIndex, groupByIndex;
  let showValues: string, groupBy: string;
  const chartTypes = ["bar", "doughnut", "total"];
  let chartType: ChartType;

  for (let i = 0; i < amount; i++) {
    do {
      // randomly select a chart type
      chartType = chartTypes[
        Math.floor(Math.random() * chartTypes.length)
      ] as ChartType;

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
    showValuesHeaders.splice(showValuesIndex, 1);
    groupByHeaders.splice(groupByIndex, 1);

    chartConfigs.push({
      id: Math.random().toString(36).slice(2, 11).toString(),
      dataSourceName: dataSource.name,
      chartType,
      showValues,
      groupBy,
      startColor: startColor.toString(),
      endColor: endColor.toString(),
    });
  }
//   console.log("chartConfigs", chartConfigs);
// notify user if no charts were generated
  if (chartConfigs.length === 0) {
    alert("Sorry, could not interpret dataset, no charts were generated.");
  }
  return chartConfigs;
}
