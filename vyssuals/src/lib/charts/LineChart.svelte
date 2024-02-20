<script lang="ts">
  import type { ChartConfig, DataSource } from "../types";
  import { chartConfigs, dataset, dataSources } from "../store";
  import { Line } from "svelte-chartjs";
  import { formatTitle, titleCase } from "../utils/textUtils";
  import { createChartData, getLastTimestamp } from "../utils/dataUtils";
  import { onMount, afterUpdate } from "svelte";

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler,
  } from "chart.js";

  export let index: number;
  let data: any;
  let config: ChartConfig;

  $: {
    config = $chartConfigs[index];
    let filteredDataset = $dataset.filter(
      (item) => item.dataSource === config.dataSource
    );
    config.groupBy = "timestamp";
    let dataSource: DataSource | undefined = $dataSources.find(
      (item) => item.name === config.dataSource
    );
    if (dataSource) {
      data = createChartData(dataSource, filteredDataset, config);
    }
    data.datasets[0].borderColor = config.startColor;
    data.datasets[0].tension = 0.5;
    data.datasets[0].fill = true;
    data.datasets[0].pointRadius = 2;
    data.datasets[0].pointHoverRadius = 5;
    data.datasets[0].pointBackgroundColor = config.startColor;

    data.datasets[0].backgroundColor = `${config.endColor}20`;

    console.log("data", data);
  }

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler
  );

  let options = {
    responsive: false,
    maintainAspectRatio: true,
    aspectRatio: 2,
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
            return label.length > 8 ? `${label.slice(0, 6)}...` : label;
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

<h1 class="chart-title" style="width: 550px">
  {titleCase(config.showValues)} Timeline
</h1>
<h3>{config.unitSymbol}</h3>

<Line {data} {options} style="height: 310px; width: 595px" />
