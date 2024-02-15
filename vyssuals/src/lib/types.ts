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

  export interface ChartConfig {
    id: string;
    dataSource: string;
    chartType: string;
    showValues: string;
    groupBy: string;
    unitSymbol: string;
    startColor: string;
    endColor: string;
  }

  export interface DataSource {
    file: File;
    interval: number;
  }