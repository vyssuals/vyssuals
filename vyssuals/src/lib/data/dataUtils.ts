import type {
  ChartConfig,
  Item,
  HeaderData,
  DataSource,
  WebSocketMessage,
  Store,
  MessageItem,
  Attributes
} from "../types";
import { createColorArray } from "../utils/colorUtils";
import { dataStore } from "../store";
import { getUniqueValuesForKeyAtLatestUpdate, getLatestAttributes } from "./getDataUtils";

// get all unique values of a specific attribute
// export function getUniqueAttributeValues(
//   attributes: Attributes[],
//   attribute: string
// ): string[] {
//   let resultSet: Set<string> = new Set();
//   dataset.forEach((item) => {
//     if (attribute in item.attributes) {
//       resultSet.add(item.attributes[attribute]);
//     }
//   });
//   return Array.from(resultSet);
// }

// function for checking if all attribute values are numbers
// export function allAttributeValuesAreNumbers(
//   dataset: DataItem[],
//   attribute: string
// ) {
//   for (let i = 0; i < dataset.length; i++) {
//     if (isNaN(Number(dataset[i].attributes[attribute]))) {
//       console.log(
//         "Not a number: ",
//         attribute,
//         dataset[i].attributes[attribute],
//         "at index",
//         i
//       );
//       return false;
//     }
//   }
//   return true;
// }

export const sumAttributeValues = (
  attributes: Attributes[],
  attribute: string
): number =>
  attributes.reduce(
    (total, item) => total + (Number(item[attribute]) || 0),
    0
  );

// aggregate values of a specific attribute,  inputs: attribute to aggregate, list of labels to aggregate by, attibute key of labels
export const sumAttributeBy = (
  dataset: Attributes[],
  aggregateAttribute: string,
  label: string,
  groupBy: string
): number =>
  dataset.reduce(
    (total, item) =>
      item[groupBy] === label && aggregateAttribute in item
        ? total + Number(item[aggregateAttribute])
        : total,
    0
  );

// function for creating chart data, returns chart data
export function createChartData(
  dataSource: DataSource,
  chartConfig: ChartConfig,
): any {
  const labels = getUniqueValuesForKeyAtLatestUpdate(dataSource, chartConfig.groupBy).sort();
  let data;

  if (dataSource.metadata[chartConfig.showValues].type === "number") {
    data = labels.map((label) =>
      sumAttributeBy(
        getLatestAttributes(dataSource),
        chartConfig.showValues,
        label,
        chartConfig.groupBy
      )
    );
  } else {
    // count unique values per label
    data = labels.map((label) => {
      return getUniqueValuesForKeyAtLatestUpdate(dataSource, label).length;
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
        backgroundColor: backgroundColor,
        borderWidth: 2,
        borderColor: "#ffffff00",
        borderRadius: 8,
        offset: 5,
      },
    ],
  };
}

// export function getLastTimestamp(dataset: DataItem[]): Date {
//   let lastTimestamp = new Date(0);
//   dataset.forEach((item) => {
//     if (item.timestamp > lastTimestamp) {
//       lastTimestamp = item.timestamp;
//     }
//   });
//   return lastTimestamp;
// }



