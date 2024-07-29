import { ApexOptions } from "apexcharts";
import { categoryInterface } from "interfaces";
import { STATIC_TIME_GRAPH_DATA } from "theme/constants";

const timeData: categoryInterface = {
  daycategory: STATIC_TIME_GRAPH_DATA,
  weekcategory: STATIC_TIME_GRAPH_DATA,
  monthcategory: STATIC_TIME_GRAPH_DATA,
};

const categories = timeData.daycategory;

export const options: ApexOptions = {
  chart: {
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: false,
        delay: 400,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 800,
      },
    },
    dropShadow: {
      enabled: true,
      enabledOnSeries: undefined,
      top: 5,
      left: 2,
      blur: 1,
      opacity: 0,
    },
    //header of chart disabled
    toolbar: {
      show: false,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: true,
        reset: true || '<img src="/static/icons/reset.png" width="20">',
        customIcons: [],
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    curve: "smooth",
    width: 3,
  },
  grid: {
    show: false, // you can either change hear to disable all grids
    row: {
      colors: undefined,
      opacity: 0.5,
    },
    column: {
      colors: undefined,
      opacity: 0.5,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 100,
      left: -9,
    },
    xaxis: {
      lines: {
        show: false, //or just here to disable only x axis grids
      },
    },

    yaxis: {
      lines: {
        show: false, //or just here to disable only y axis
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      shadeIntensity: 1,
      type: "horizontal",
      opacityFrom: 1,
      opacityTo: 1,
      inverseColors: true,
      colorStops: [
        [
          {
            offset: 0,
            color: "#A59BE7",
            opacity: 1,
          },
          {
            offset: 30,
            color: "#F681D3",
            opacity: 50,
          },
          {
            offset: 70,
            color: "#FFD574",
            opacity: 1,
          },
          {
            offset: 90,
            color: "#91EE9D",
            opacity: 1,
          },
        ],
      ],
    },
  },
  tooltip: {
    enabled: false,
    enabledOnSeries: undefined,
    shared: false,
    followCursor: false,
    intersect: false,
    inverseOrder: false,
    custom: undefined,
    fillSeriesColor: false,
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },
    onDatasetHover: {
      highlightDataSeries: false,
    },
    x: {
      show: false,
      format: "dd MMM",
      formatter: undefined,
    },
    marker: {
      show: false,
    },
    items: {
      display: "flex",
    },
    fixed: {
      enabled: false,
      position: "topLeft",
      offsetX: 0,
      offsetY: 0,
    },
  },
  xaxis: {
    type: "category",
    categories: categories,
    axisTicks: {
      show: false,
      borderType: "solid",
      color: "transparent",
      height: 6,
      offsetX: 0,
      offsetY: 0,
    },
    labels: {
      show: false,
    },
    axisBorder: {
      show: true,
      color: "transparent",
      offsetX: 0,
      offsetY: 0,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  // series: [2,5,6,7],
};
