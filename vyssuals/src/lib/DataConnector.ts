import { dataset, dataSources, dataSourcesWebsocket } from "./store";
import type {
  ColumnType,
  DataItem,
  DataSource,
  HeaderData,
  UnitSymbol,
} from "./types";
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
            attributes: { Count: 1, ...row, Timestamp: timestampString },
          })
        );
        dataset.update((prev) => [...prev, ...data]);
        dataSource.lastUpdate = timestamp;
        applyHeaderData(dataSource, getHeaderData(data));
      },
    });
  } else {
    console.log("No file to load");
  }
}

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

function applyHeaderData(dataSource: DataSource, headerData: HeaderData[]) {
  const newHeaderData: HeaderData[] = [];

  for (const newHeader of headerData) {
    let existingHeader = dataSource.headerData?.find(
      (header) => header.name === newHeader.name
    );
    if (existingHeader) {
      // Preserve the existing type and unitSymbol
      const { type, unitSymbol } = existingHeader;
      // Override the header with the new data
      Object.assign(existingHeader, newHeader);
      // Restore the original type and unitSymbol
      existingHeader.type = type;
      existingHeader.unitSymbol = unitSymbol;
    } else {
      // If the header does not exist, add it
      existingHeader = newHeader;
    }
    newHeaderData.push(existingHeader);
  }

  // Assign the new header data to dataSource.headerData
  dataSource.headerData = newHeaderData;
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
        unitSymbol: unit,
        type,
        uniqueValues,
        cardinalityRatio,
      });
    }
  }
  return headerData;
}

const majorityType = (values: any[]): ColumnType => {
  const typeCounts: { [key: string]: number } = { string: 0, number: 0 };

  values.forEach((value) => {
    if (value === "" || value === null) return; // Skip empty strings

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

  // Filter out null results
  const validMatches = matches.filter(
    (match): match is [number, string][] =>
      match !== null && match !== undefined
  );

  // If there are no valid matches, return "Unknown"
  if (validMatches.length === 0) {
    return "Unknown";
  }

  // Sort matches by score
  const sortedMatches = validMatches.sort((a, b) => {
    // Since we've filtered out null and undefined, we can safely access the properties
    const scoreA = a[0][0];
    const scoreB = b[0][0];

    return scoreB - scoreA;
  });

  // Use the unit symbol of the best match
  const bestMatch = sortedMatches[0];
  const unitSymbol = keywordToUnitSymbol[bestMatch[0][1]];

  return unitSymbol;
}

// Define a mapping of keywords to unit symbols
const keywordToUnitSymbol: { [key: string]: UnitSymbol } = {
  "unique items of": "# Unique Items",
  "unique items": "# Unique Items",
  unique: "# Unique Items",
  category: "# Unique Items",
  id: "# Items",
  index: "# Items",
  count: "# Items",
  counts: "# Items",
  number: "# Items",
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
