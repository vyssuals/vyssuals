import type { ChartConfig, DataItem } from "../types";
import { createColorArray } from "./colorUtils";

export function getUniqueAttributeKeys(dataset: DataItem[]): string[] {
  let result: string[] = [];
  dataset.forEach((item) => {
    Object.keys(item.attributes).forEach((key) => {
      if (!result.includes(key)) {
        result.push(key);
      }
    });
  });
  return result;
}

// get all unique values of a specific attribute
export function getUniqueAttributeValues(
  dataset: DataItem[],
  attribute: string
): string[] {
  let resultSet: Set<string> = new Set();
  dataset.forEach((item) => {
    if (attribute in item.attributes) {
      resultSet.add(item.attributes[attribute]);
    }
  });
  return Array.from(resultSet);
}

// function for checking if all attribute values are numbers
export function allAttributeValuesAreNumbers(
  dataset: DataItem[],
  attribute: string
) {
  for (let i = 0; i < dataset.length; i++) {
    if (isNaN(Number(dataset[i].attributes[attribute]))) {
      console.log(
        "Not a number: ",
        attribute,
        dataset[i].attributes[attribute],
        "at index",
        i
      );
      return false;
    }
  }
  return true;
}

export function sumAttributeValues(dataset: DataItem[], attribute: string) {
  let total = 0;
  for (let i = 0; i < dataset.length; i++) {
    total += Number(dataset[i].attributes[attribute]);
  }
  return total;
}

// aggregate values of a specific attribute,  inputs: attribute to aggregate, list of labels to aggregate by, attibute key of labels
export function sumAttributeBy(
  dataset: DataItem[],
  aggregateAttribute: string,
  label: string,
  groupBy: string
): number {
  let result = 0;
  dataset.forEach((item) => {
    if (item.attributes[groupBy] === label) {
      if (aggregateAttribute in item.attributes) {
        result += item.attributes[aggregateAttribute];
      }
    }
  });
  return result;
}

// function for creating chart data, returns chart data
export function createChartData(
  dataset: DataItem[],
  chartConfig: ChartConfig
): any {
  const labels = Array.from(
    new Set(dataset.map((item) => item.attributes[chartConfig.groupBy]))
  );

  labels.sort();

  let data;
  if (allAttributeValuesAreNumbers(dataset, chartConfig.showValues)) {
    data = labels.map((label) =>
      sumAttributeBy(
        dataset,
        chartConfig.showValues,
        label,
        chartConfig.groupBy
      )
    );
  } else {
    // count unique values per label
    data = labels.map((label) => {
      const filteredDataset = dataset.filter(
        (item) => item.attributes[chartConfig.groupBy] === label
      );
      return getUniqueAttributeValues(filteredDataset, chartConfig.showValues)
        .length;
    });
  }
  const backgroundColor = createColorArray(
    data.length,
    chartConfig.startColor,
    chartConfig.endColor
  );

  return {
    labels: labels,
    datasets: [
      {
        label: chartConfig.showValues,
        data: data,
        // backgroundColor: backgroundColor,
        borderWidth: 2,
        borderColor: "#ffffff00",
        borderRadius: 8,
        offset: 5,
      },
    ],
  };
}

export function getLastTimestamp(dataset: DataItem[]): Date {
  let lastTimestamp = new Date(0);
  dataset.forEach((item) => {
    if (item.timestamp > lastTimestamp) {
      lastTimestamp = item.timestamp;
    }
  });
  return lastTimestamp;
}
