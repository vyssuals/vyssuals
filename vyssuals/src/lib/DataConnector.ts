import { dataset, dataSources, dataSourcesWebsocket } from "./store";
import type { DataItem, DataSource, HeaderData, UnitSymbol } from "./types";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import FuzzySet from "fuzzyset.js";

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
    // Create a new FuzzySet with your keywords
    const keywords = Object.keys(keywordToUnitSymbol);
    const fuzzySet = FuzzySet(keywords);
    for (const key of keys) {
      const values = data.map((item) => item.attributes[key]);
      const type = majorityType(values);
      let unit: UnitSymbol = "# Unique Items";
      if (type === "number") {
        unit = determineUnitSymbol(key, fuzzySet);
      }
      const uniqueValues = new Set(values).size;
      const cardinalityRatio = uniqueValues / data.length;
      headerData.push({
        name: key,
        unit,
        type,
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

function determineUnitSymbol(
  showValues: string,
  fuzzySet: FuzzySet
): UnitSymbol {
  // Replace underscores with spaces and split into words
  const words = showValues.replace(/_/g, " ").split(" ");

  // Find the best match for each word
  const matches = words.map((word) => fuzzySet.get(word));

  // Filter out null results and sort by score
  const sortedMatches = matches
    .filter(Boolean)
    .sort((a, b) => b[0][0] - a[0][0]);

  // If a match was found, use the corresponding unit symbol
  // Otherwise, use a default unit symbol
  return sortedMatches.length > 0
    ? keywordToUnitSymbol[sortedMatches[0][0][1]]
    : "Unknown";
}

// Define a mapping of keywords to unit symbols
const keywordToUnitSymbol: { [key: string]: UnitSymbol } = {
  "unique items of": "# Unique Items",
  "unique items": "# Unique Items",
  unique: "# Unique Items",
  category: "# Unique Items",
  count: "Count",
  counts: "Count",
  number: "Count",
  dollar: "USD",
  dollars: "USD",
  usd: "USD",
  meter: "m",
  meters: "m",
  metre: "m",
  height: "m",
  length: "m",
  width: "m",
  depth: "m",
  "m.": "m",
  m: "m",
  distance: "m",
  "square meter": "m²",
  "square meters": "m²",
  "square metre": "m²",
  area: "m²",
  "cubic meter": "m",
  "cubic meters": "m³",
  "cubic metre": "m³",
  foot: "ft",
  feet: "ft",
  "ft.": "ft",
  "square feet": "ft²",
  "sq ft": "ft²",
  "cubic foot": "ft",
  "cubic feet": "ft³",
  "cubic ft": "ft³",
  inch: "in",
  inches: "in",
  "in.": "in",
  in: "in",
  mile: "mi",
  miles: "mi",
  "mi.": "mi",
  mi: "mi",
  millimeter: "mm",
  millimeters: "mm",
  "mm.": "mm",
  mm: "mm",
  centimeter: "cm",
  centimeters: "cm",
  "cm.": "cm",
  cm: "cm",
  kilometer: "km",
  kilometers: "km",
  "km.": "km",
  km: "km",
  ounce: "oz",
  ounces: "oz",
  "oz.": "oz",
  oz: "oz",
  pound: "lb",
  pounds: "lb",
  "lb.": "lb",
  lb: "lb",
  milligram: "mg",
  milligrams: "mg",
  "mg.": "mg",
  mg: "mg",
  gram: "g",
  grams: "g",
  "g.": "g",
  g: "g",
  kilogram: "kg",
  kilograms: "kg",
  "kg.": "kg",
  "fluid ounce": "fl oz",
  "fluid ounces": "fl oz",
  "fl oz.": "fl oz",
  quart: "qt",
  quarts: "qt",
  "qt.": "qt",
  gallon: "gal",
  gallons: "gal",
  "gal.": "gal",
  milliliter: "ml",
  milliliters: "ml",
  "ml.": "ml",
  liter: "l",
  liters: "l",
  "l.": "l",
  "sq meter": "m²",
  "sq m": "m²",
  acre: "ac",
  acres: "ac",
  "ac.": "ac",
  hectare: "ha",
  hectares: "ha",
  "ha.": "ha",
  "us dollar": "USD",
  "us dollars": "USD",
  "usd.": "USD",
  euro: "EUR",
  euros: "EUR",
  "eur.": "EUR",
  "pound sterling": "GBP",
  "pounds sterling": "GBP",
  "gbp.": "GBP",
  "chf.": "CHF",
  "swiss franc": "CHF",
  "swiss francs": "CHF",
  "schweizer franken": "CHF",
};
