<script lang="ts">
  import type { ChartConfig, DataSource } from "../types";
  import { Doughnut } from "svelte-chartjs";
  import { formatTitle } from "../utils/textUtils";
  import { createChartData, getLastTimestamp } from "../data/dataUtils";
  import { chartConfigs, dataset, dataSources } from "../store";

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
  } from "chart.js";

  export let index: number;
  let data: any;
  let config: ChartConfig;
  let unitSymbol: string;

  $: {
    config = $chartConfigs[index];
    let filteredDataset = $dataset.filter(
      (item) => item.dataSourceName === config.dataSourceName
    );
    const timestamp = getLastTimestamp(filteredDataset);
    if (timestamp) {
      filteredDataset = filteredDataset.filter(
        (item) => item.timestamp === timestamp
      );
    }
    let dataSource: DataSource | undefined = $dataSources.find(
      (item) => item.name === config.dataSourceName
    );
    if (dataSource) {
      data = createChartData(dataSource, filteredDataset, config);
      unitSymbol = dataSource.headerData.find(
        (item) => item.name === config.showValues
      )?.unitSymbol || "";
    }
  }

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

  let options = {
    responsive: false,
    plugins: {
      legend: {
        labels: {
          generateLabels: (chart: any) =>
          chart.data.labels.map((l: string, i: number) => ({
            datasetIndex: 0,
            index: i,
            text: l?.length > 8 ? `${l.slice(0, 6)}...` : l,
            fillStyle: chart.data.datasets[0].backgroundColor[i],
            strokeStyle: chart.data.datasets[0].backgroundColor[i],
            hidden: false,
            fontColor: "#666666",
            })),
        },
        position: "bottom",
      },
    },
  };
</script>

<h1 class="chart-title" style="width: 350px">{formatTitle(config)}</h1>
<h3 title="You can edit the unit symbol in the settings of this datasource.">{unitSymbol}</h3>
<Doughnut {data} {options} style="height: 310px; width: 380px" />
