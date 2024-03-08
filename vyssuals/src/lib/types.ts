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
  data?: MessageItem[];
  metadata?: HeaderData[];
  visibleItems?: VisibleItems;
}

export interface MessageItem {
  id: string;
  attributes: Attributes;
}

export interface Attributes {
  timestamp: string;
  count: 1;
  [key: string]: string | number; // Key is the Column Name, Value is the Column Value
}

export class Item {
  id: string;
  private dict: { [timestamp: string]: number } = {};
  private list: Attributes[] = [];

  constructor(id: string);
  constructor(id: string, timestamp: string, version: Attributes);
  constructor(id: string, timestamp?: string, version?: Attributes) {
    this.id = id;
    if (timestamp && version) {
      this.addUpdate(timestamp, version);
    }
  }

  addUpdate(timestamp: string, version: Attributes): void {
    this.dict[timestamp] = this.list.length;
    this.list.push(this.setCountAndTimestamp(version, timestamp));
  }

  getUpdate(timestamp: string): Attributes {
    const index = this.dict[timestamp];
    return this.list[index];
  }

  getLastUpdate(): Attributes {
    return this.list[this.list.length - 1];
  }

  setCountAndTimestamp(attributes: Attributes, timestamp: string): Attributes {
    return {
      ...attributes,
      count: 1,
      timestamp: timestamp,
    };
  }
}

export interface HeaderData {
  name: string;
  type: ColumnType;
  unitSymbol: UnitSymbol;
  uniqueValues?: number;
  cardinalityRatio?: number;
}

export interface Metadata {
  [key: string]: HeaderData; // Key is the Column Name, Value is the Column Metadata
}

export type VisibleItems = [];

export class Updates {
  private dict: { [timestamp: string]: number } = {};
  private list: VisibleItems[] = [];

  addUpdate(timestamp: string, update: VisibleItems): void {
    this.dict[timestamp] = this.list.length;
    this.list.push(update);
  }

  getUpdate(timestamp: string): VisibleItems {
    const index = this.dict[timestamp];
    return this.list[index];
  }

  getLastUpdate(): VisibleItems {
    return this.list[this.list.length - 1];
  }
}

export class DataSource {
  data: {
    [key: string]: Item; // Key is the Item ID, Value is the Item
  };
  metadata: Metadata;
  lastUpdate: string; // used for filtering items included in the last update
  updates: Updates;
  type: "file" | "websocket";
  file?: File;
  name: string;

  constructor(type: "file" | "websocket", lastUpdate: string, name: string) {
    this.data = {};
    this.metadata = {};
    this.lastUpdate = lastUpdate;
    this.updates = new Updates();
    this.type = type;
    this.file = undefined;
    this.name = name;
  }
}

export interface Store {
  dataSources: {
    [key: string]: DataSource; // Key is the DataSource Name, Value is the DataSource
  };
}
