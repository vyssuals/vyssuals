<script lang="ts">
  import type { ChartConfig, DataSource } from "../types";
  import { chartConfigs, dataset, dataSources } from "../store";
  import { Bar } from "svelte-chartjs";
  import { formatTitle } from "../utils/textUtils";
  import { createChartData, getLastTimestamp } from "../utils/dataUtils";

  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from "chart.js";

  export let index: number;
  let data: any;
  let config: ChartConfig;

  $: {
    config = $chartConfigs[index];
    let filteredDataset = $dataset.filter(
      (item) => item.dataSource === config.dataSource
    );
    const timestamp = getLastTimestamp(filteredDataset);
    if (timestamp) {
      filteredDataset = filteredDataset.filter(
        (item) => item.timestamp === timestamp
      );
    }
    let dataSource: DataSource | undefined = $dataSources.find(
      (item) => item.name === config.dataSource
    );
    if (dataSource) {
      data = createChartData(dataSource, filteredDataset, config);
    }
  }

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  let options = {
    responsive: false,
    maintainAspectRatio: false,
    // aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value: any): string {
            let label = this.getLabelForValue(value);
            return label?.length > 8 ? `${label.slice(0, 6)}...` : label;
          },
        },
        grid: {
          display: true,
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
      y: {
        grid: {
          display: true,
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
    },
  };
</script>

<h1 class="chart-title" style="width: 550px">{formatTitle(config)}</h1>
<h3>{config.unitSymbol}</h3>
<Bar {data} {options} style="height: 310px; width: 595px" />
