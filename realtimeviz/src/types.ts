export interface DataItem {
    id: string;
    attributes: Record<string, any>; // Dictionary of key-value pairs
}


export interface Data {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
      borderColor: string[];
    }[];
  }

  export interface ChartConfig {
    type: string;
    data: Data;
    showValues: string;
    groupBy: string;
    options: Record<string, any>;
  }