import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import FuzzySet from "fuzzyset.js";
import type { DataSource, Item, Header, DataPayload, Update, Versions, Attributes, ColumnType, UnitSymbol } from "../types";

export function loadCSVFile(file: File): Promise<DataPayload> {
    return new Promise((resolve, reject) => {
        if (!file) {
            throw new Error("No file to load");
        }
        console.log(`Loading file: ${file.name}`);

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function (results: ParseResult<Record<string, any>>) {
                const timestamp: string = new Date().toISOString();
                let update: Update = { timestamp, type: "auto", name: file.name, visibleItemIds: [] };
                let data: Item[] = [];
                let metadata: Header[] = [];

                let columns: Record<string, Set<string | number>> = {}; // Store the unique values of each column

                data = results.data.map((row: Record<string, any>, index: number): Item => {
                    // Remove the property with the empty or null key
                    delete row[""];

                    Object.entries(row).forEach(([key, value]) => {
                        key = String(key);
                        if (!columns[key]) {
                            columns[key] = new Set();
                        }
                        // convert value to number or string
                        if (typeof value === "number") {
                            columns[key].add(value);
                        } else {
                            value = String(value); // convert to string, also saves value as string to database
                            columns[key].add(value);
                        }
                    });

                    const id = String(index);
                    const attributes: Attributes = { Id: id, Count: 1, ...row, Timestamp: timestamp };
                    const versions: Versions = { timestamp: attributes };

                    return {
                        id,
                        versions,
                    };
                });

                metadata = Object.entries(columns).map(([key, value]): Header => {
                    return makeHeader(key, value);
                });

                metadata.push({ name: "Timestamp", type: "string", unitSymbol: "# Unique Items" });
                metadata.push({ name: "Count", type: "number", unitSymbol: "# Items" });

                update.visibleItemIds = data.map((item) => item.id);

                const dataPayload: DataPayload = { update, data, metadata };
                resolve(dataPayload);
            },
            error: function (err) {
                reject(err);
            },
        });
    });
}

function makeHeader(name: string, data: Set<string | number>): Header {
    const type = majorityType(Array.from(data));
    const unitSymbol = determineUnitSymbol(name, FuzzySet(Object.keys(keywordToUnitSymbol)));

    const header: Header = {
        name,
        type,
        unitSymbol,
    };
    return header;
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

function determineUnitSymbol(showValues: string, fuzzySet: FuzzySet): UnitSymbol {
    // Replace underscores with spaces and split into words
    const words = showValues.replace(/_/g, " ").split(" ");

    // Find the best match for each word
    const matches = words.map((word) => fuzzySet.get(word));

    // Filter out null results
    const validMatches = matches.filter((match): match is [number, string][] => match !== null && match !== undefined);

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
