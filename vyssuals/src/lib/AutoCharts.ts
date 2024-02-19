import type {
  ChartConfig,
  DataSource,
  UnitSymbol,
} from "./types";

export function autoChart(
    dataSource: DataSource,
    amount: number,
    startColor: string,
    endColor: string
): ChartConfig[] {
    let headerDataCopy = dataSource.headerData.slice();
    const chartConfigs: ChartConfig[] = [];
    for (let i = 0; i < amount; i++) {
        const showValues: string =
            headerDataCopy.find((header) => header.type === "number")?.name || "";
        const groupBy: string =
            headerDataCopy.find((header) => header.type === "string")?.name || "";

        // If showValues or groupBy is an empty string, break the loop
        if (showValues === "" || groupBy === "") {
            break;
        }

        // use showValues header type to determine unitSymbol
        const unitSymbol: UnitSymbol =
            headerDataCopy.find((header) => header.name === showValues)?.unit ||
            "Count";

        // Remove the used headers from the headerDataCopy array
        headerDataCopy = headerDataCopy.filter(
            (header) => header.name !== showValues && header.name !== groupBy
        );

        chartConfigs.push({
            id: Math.random().toString(36).slice(2, 11).toString(),
            dataSource: dataSource.name,
            chartType: "bar",
            showValues,
            groupBy,
            unitSymbol,
            startColor: startColor.toString(),
            endColor: endColor.toString(),
        });
    }
    return chartConfigs;
}