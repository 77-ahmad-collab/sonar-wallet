import { FC } from "react";
import ReactApexChart from "react-apexcharts";

import { STATIC_STRAIGHTLINE_GRAPH } from "theme/constants";
import { options } from "./mock";

const ApexChart: FC<{ graphData?: number[] }> = ({ graphData }) => {
  return (
    <ReactApexChart
      options={options}
      series={[
        {
          name: "Series1",
          data: graphData ?? STATIC_STRAIGHTLINE_GRAPH,
        },
      ]}
      type="line"
      height={228}
      width={380}
      style={{
        filter: "drop-shadow(rgba(255,255,255,0.5) 0px 0px 8px)",
      }}
    />
  );
};

export default ApexChart;
