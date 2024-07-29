import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { renderHook } from "@testing-library/react";
import { FC } from "react";
import { Provider } from "react-redux";

import { useGraphData } from "../useGraphData";
import { store as DevStore } from "store/store";
import * as appActions from "../../store/slices/appSlice/index";

const wrapper: FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <Provider store={DevStore}>{children}</Provider>;
};

// export const shouldBehaveLikeAUseGraphDataHook = () =>
  describe("useGraphData", () => {
    it("should dispatch setGraphData and  setProfit", async () => {
      
      // await act(async () => {
        const setGraphData = jest.spyOn(appActions, "setGraphData");
        const setProfit = jest.spyOn(appActions, "setProfit");

        const { result } = renderHook(() => useGraphData(), { wrapper });
        console.log("🤑 ~ file: 8_useGraphData.test.tsx:27 ~ awaitact ~ result:", result)
        
        const { calculateGraphData } = result.current;

        await calculateGraphData({
          tether: 100,
          dai: 10,
        });

        expect(setGraphData).toHaveBeenCalled();
        expect(setProfit).toHaveBeenCalled();
      // })
  }, );
    console.log("==========GRAPH DATA DONE")
  
  });
