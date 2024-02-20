export interface DataItem {
  id: string;
  dataSource: string;
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
export const ColumnTypes = ["numnber", "string"];

export interface ChartConfig {
  id: string;
  dataSource: string;
  chartType: ChartType;
  showValues: string;
  groupBy: string;
  unitSymbol: UnitSymbol;
  startColor: string;
  endColor: string;
}

export interface DataSource {
  lastUpdate: Date;
  headerData: HeaderData[];
  interval: number; // will have no effect on websocket data sources, should be 0 for consistency
  file?: File;
  name: string;
}

export interface DataSourceFile extends DataSource {}

export interface DataSourceWebsocket extends DataSource {}

export interface HeaderData {
  name: string;
  type: string;
  unit: UnitSymbol;
  uniqueValues: number;
  cardinalityRatio: number;
}
