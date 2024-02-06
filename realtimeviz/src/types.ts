export interface DataItem {
    id: string;
    attributes: Record<string, any>; // Dictionary of key-value pairs
}

export interface DiagramInfo {
    diagramNumber: number;
    groupBy: string;
    showValues: string;
}