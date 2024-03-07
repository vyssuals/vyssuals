// export interface DataItem {
//   id: string;
//   dataSourceName: string;
//   timestamp: Date;
//   attributes: Record<string, any>; // Dictionary of key-value pairs
// }

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
    borderColor: string[];
  }[];
}

export type ChartType = "line" | "bar" | "doughnut" | "total";
export const CHART_TYPES: ChartType[] = ["line", "bar", "doughnut", "total"];
export type UnitSymbol =
  | "# Unique Items"
  | "# Items"
  | "m"
  | "m²"
  | "m³"
  | "ft"
  | "ft²"
  | "ft³"
  | "in"
  | "mi"
  | "mm"
  | "cm"
  | "km"
  | "oz"
  | "lb"
  | "mg"
  | "g"
  | "kg"
  | "fl oz"
  | "qt"
  | "gal"
  | "ml"
  | "l"
  | "ac"
  | "ha"
  | "USD"
  | "EUR"
  | "GBP"
  | "CHF"
  | "Unknown";

export const UNIT_SYMBOLS: UnitSymbol[] = [
  "# Unique Items",
  "# Items",
  "m",
  "m²",
  "m³",
  "ft",
  "ft²",
  "ft³",
  "in",
  "mi",
  "mm",
  "cm",
  "km",
  "oz",
  "lb",
  "mg",
  "g",
  "kg",
  "fl oz",
  "qt",
  "gal",
  "ml",
  "l",
  "ac",
  "ha",
  "USD",
  "EUR",
  "GBP",
  "CHF",
  "Unknown",
];

export interface ChartConfig {
  id: string;
  dataSourceName: string;
  chartType: ChartType;
  showValues: string;
  groupBy: string;
  startColor: string;
  endColor: string;
}

export type ColumnType = "string" | "number";
export const COLUMN_TYPES: ColumnType[] = ["string", "number"];

// export interface DataSource {
//   lastUpdate: Date;
//   headerData: HeaderData[];
//   file?: File;
//   name: string;
//   type: "file" | "websocket";
// }


export interface WebSocketMessage {
  type: string; // The type of the message, either 'data' or 'disconnect'
  timestamp: string; // The timestamp of the message sent by the server
  version: string; // The version of the message format
  sender: string; // the sender application
  senderVersion: string; // the sender application version like 2024
  senderName: string; // the name of the file openend in the sender application
  payload?: Payload; // The '?' makes this property optional, data messages will have it, disconnect messages won't
}

type Payload = DataPayload; // No need for DisconnectPayload anymore

export interface DataPayload {
  data: MessageItem[];
  metadata: HeaderData[];
}

export interface MessageItem {
  id: string;
  attributes: MessageAttributes;
}

interface MessageAttributes { 
  [key: string]: string; // Key is the Column Name, Value is the Column Value
}

export interface HeaderData {
  name: string;
  type: ColumnType;
  unitSymbol: UnitSymbol;
  uniqueValues?: number;
  cardinalityRatio?: number;
}

export interface Attributes {
  timestamp: string;
  count: 1;
  [key: string]: string | number; // Key is the Column Name, Value is the Column Value
}

export interface Item {
  id: string;
  versions: {
    [key: string]: Attributes; // Key is the Timestamp, Value is the Attributes at that Timestamp
  }
}

export interface Metadata {
  [key: string]: HeaderData; // Key is the Column Name, Value is the Column Metadata
}

export interface DataSource {
  data: {
    [key: string]: Item; // Key is the Item ID, Value is the Item
  };
  metadata: Metadata;
  lastUpdate: string; // used for filtering items included in the last update
  type: "file" | "websocket";
  file?: File;
  name: string;
}

export interface Store {
  dataSources: {
    [key: string]: DataSource; // Key is the DataSource Name, Value is the DataSource
  };
}