export interface ChartConfig {
    id: string;
    dataSourceName: string;
    chartType: ChartType;
    showValues: string;
    groupBy: string;
    startColor: string;
    endColor: string;
}

export interface ChartData {
    config: ChartConfig;
    dataSource: DataSource;
    data: any;
    unitSymbol: string;
}

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
    data?: Item[];
    metadata?: Header[];
    update?: Update; // The IDs of the items that are visible in the sender application
}

export interface Header {
    name: string;
    type: "string" | "number"; // The type of the column, either 'string' or 'number'
    unitSymbol: UnitSymbol;
    uniqueValues?: number;
    cardinalityRatio?: number;
}

export interface Metadata {
    [key: string]: Header; // Key is the Column Name, Value is the Column Metadata
}

export interface DataSource {
    id: string;
    name: string;
    type: "file" | "websocket";
    lastUpdate: string;
    file?: File;
}

export interface Update {
    timestamp: string;
    type: "auto" | "manual";
    name: string;
    visibleItemIds: string[];
}

export interface Item {
    id: string;
    versions: Versions;
}

export interface Versions {
    [Key: string]: Attributes; // key is timestamp
}

export interface Attributes {
    id: string;
    timestamp: string;
    count: 1;
    [key: string]: string | number; // Key is the Column Name, Value is the Column Value
}

export interface Info {
    key: string;
    value: string;
}

export const COLUMN_TYPES = ["string", "number"];
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
