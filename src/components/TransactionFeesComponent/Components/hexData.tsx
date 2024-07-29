import { FC, useState } from "react";

import { HexDataProps as PROPS } from "interfaces";
import { HexDataWrapper, Text } from "@styled";

const HexData: FC<PROPS> = ({ hexData }) => {
  const [Hex, Data] = ["Hex", "Data"];
  const [activeTab, setActiveTab] = useState(Hex);

  const list = [Hex, Data];

  return (
    <HexDataWrapper>
      <div className="r-c-fs">
        {list.map((item, i) => {
          return (
            <Text
              className="f-body mgt-sm mgb-sm mgl-xs mgr-sm"
              dim={item === activeTab ? false : true}
              onClick={() => setActiveTab(item)}
              key={i}
            >
              {item}
            </Text>
          );
        })}
      </div>

      <div
        style={{
          overflowWrap: "break-word",
          overflowX: "hidden",
          overflowY: "scroll",
          color: "#fff",
          height: "100%",
          margin: "auto",
          marginBottom: "0px",
          width: "100%",
          border: "2px solid rgba(255,255,255,0.2)",
          padding: "8px",
          borderRadius: "12px",
        }}
      >
        {activeTab === Hex ? (
          hexData && hexData?.length > 0 ? (
            hexData
          ) : (
            <Text align="center">Transaction Hex is not available</Text>
          )
        ) : (
          <Text align="center">Transaction decoding is not available</Text>
        )}
      </div>
    </HexDataWrapper>
  );
};

export default HexData;
