export interface DataItem {
  id: string;
  dataSourceName: string;
  timestamp: Date;
  attributes: Record<string, any>; // Dictionary of key-value pairs
}

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

export interface DataSource {
  lastUpdate: Date;
  headerData: HeaderData[];
  file?: File;
  name: string;
  type: "file" | "websocket";
}

export interface HeaderData {
  name: string;
  type: ColumnType;
  unitSymbol: UnitSymbol;
  uniqueValues: number;
  cardinalityRatio: number;
}

export interface WebSocketMessage {
  type: string;
  timestamp: string;
  version: string;
  sender: string;
  senderVersion: string;
  senderName: string;
  payload?: Payload; // The '?' makes this property optional
}

type Payload = DataPayload; // No need for DisconnectPayload anymore

export interface DataPayload {
  data: DataItem[];
  metadata: HeaderData[];
}