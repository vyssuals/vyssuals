import { dataset, dataSources, dataSourcesWebsocket } from "./store";
import type { DataItem, DataSource, HeaderData, UnitSymbol } from "./types";
import { typeToUnit } from "./types";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";

export function toLocalISOString(date: Date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().slice(0, 23).replace("T", " ");
}

export function loadCSVFile(dataSource: DataSource) {
  const file = dataSource.file;
  if (file) {
    const timestamp: Date = new Date();
    const timestampString = toLocalISOString(timestamp);
    console.log(`Loading file: ${file.name}`);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results: ParseResult<Record<string, any>>) {
        console.log("Parsing complete:", results.data);

        const data: DataItem[] = results.data.map(
          (row: Record<string, any>, index: number) => ({
            id: String(index),
            dataSource: file.name,
            timestamp: timestamp,
            attributes: { count: 1, ...row, timestamp: timestampString },
          })
        );
        dataset.update((prev) => [...prev, ...data]);
        dataSource.lastUpdate = timestamp;
        dataSource.headerData = getHeaderData(data);
      },
    });
  } else {
    console.log("No file to load");
  }
}

// Store intervals in a Map, using file name as key
const intervals = new Map<string, NodeJS.Timeout>();

// React to changes in the dataSources store
dataSources.subscribe((sources) => {
  // Clear all intervals
  intervals.forEach((interval, file) => {
    clearInterval(interval);
    intervals.delete(file);
  });

  // Set new intervals
  sources.forEach((source) => {
    if (source.interval > 0) {
      const intervalId = setInterval(
        () => loadCSVFile(source),
        source.interval * 1000
      );
      intervals.set(source.name, intervalId);
    }
  });
});

export function parseWebsocketData(data: any) {
  const timestamp: Date = new Date();
  const timestampString = toLocalISOString(timestamp);
  const parsedData: DataItem[] = JSON.parse(data);
  parsedData.forEach((item: DataItem) => {
    item.timestamp = timestamp;
    item.attributes.timestamp = timestampString;
  });
  dataset.update((currentData) => [...currentData, ...parsedData]);

  if (parsedData?.length > 0) {
    const newDataSource = parsedData[0].dataSource;
    dataSourcesWebsocket.update((currentSources) => {
      if (!currentSources.includes(newDataSource)) {
        return [...currentSources, newDataSource];
      }
      return currentSources;
    });
  }
}

export function clearWebsocketData(dataSource: string) {
  dataset.update((currentData) =>
    currentData.filter((item) => item.dataSource !== dataSource)
  );
  dataSourcesWebsocket.update((currentSources) =>
    currentSources.filter((source) => source !== dataSource)
  );
}

function getHeaderData(data: DataItem[]): HeaderData[] {
  const headerData: HeaderData[] = [];
  if (data.length > 0) {
    // Get the unique keys from all items
    const keys = Array.from(
      new Set(data.map((item) => Object.keys(item.attributes)).flat())
    );
    for (const key of keys) {
      const values = data.map((item) => item.attributes[key]);
      const percentClean =
        values.filter((v) => v !== null).length / values.length;
      const type = majorityType(values);
      const unit: UnitSymbol = typeToUnit(type);
      const uniqueValues = new Set(values).size;
      const cardinalityRatio = uniqueValues / data.length;
      headerData.push({
        name: key,
        unit,
        type,
        percentClean,
        uniqueValues,
        cardinalityRatio,
      });
    }
  }
  return headerData;
}

const majorityType = (values: any[]): string => {
  const typeCounts: { [key: string]: number } = { string: 0, number: 0 };

  values.forEach((value) => {
    const valueType = typeof value;
    if (valueType === "number") {
      typeCounts["number"]++;
    } else {
      typeCounts["string"]++;
    }
  });

  return typeCounts["number"] > typeCounts["string"] ? "number" : "string";
};
