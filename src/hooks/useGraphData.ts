import { useAppDispatch } from "store/store";
import { setGraphData } from "@slices/appSlice";
import { setProfit } from "@slices/appSlice";
import { numFormatter } from "utils/formatters";
import { fetchGraphDataApi } from "utils/utils.api";
import { GRAPH_PERIODS } from "utils/constants";
import { GraphQueryData } from "interfaces";

export const useGraphData = () => {
  const dispatch = useAppDispatch();

  /**
   * fetch price fluctuations data from server of the given
   * tokens and set in redux state.
   * @param graphQueryData type GraphQueryData
   */
  const calculateGraphData = async (graphQueryData: GraphQueryData) => {
    try {
      // on default it is fetching monthly data
      const response = await fetchGraphDataApi(
        graphQueryData,
        GRAPH_PERIODS.monthly
      );
      if (response?.data) {
        dispatch(setGraphData(response.data.data));
        const profitAmount = numFormatter(response.data.profit);
        dispatch(setProfit(profitAmount));
      }
    } catch (error) {
      console.log("fetchGraphData error: ", error);
    }
  };

  return { calculateGraphData };
};
