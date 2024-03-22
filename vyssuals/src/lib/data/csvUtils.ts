import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import type { Item, Header, DataPayload, Update, Versions, Attributes } from "../types";
import { makeHeader } from "./headerUtils";

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
                        columns[key].add(value);
                    });

                    const id = String(index);
                    const attributes: Attributes = { Id: id, Count: 1, ...row, Timestamp: timestamp };
                    const versions: Versions = { [timestamp]: attributes };

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