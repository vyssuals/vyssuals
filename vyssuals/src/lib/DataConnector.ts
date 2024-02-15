import { dataset, dataSources } from "./store";
import type { DataItem } from "./types";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";

function toLocalISOString(date: Date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - offset * 60 * 1000);
  return date.toISOString().slice(0, 23).replace("T", " ");
}

export function loadFile(file: File) {
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
            attributes: { ...row, timestamp: timestampString },
          })
        );
        dataset.update((prev) => [...prev, ...data]);
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
        () => loadFile(source.file),
        source.interval * 1000
      );
      intervals.set(source.file.name, intervalId);
    }
  });
});
