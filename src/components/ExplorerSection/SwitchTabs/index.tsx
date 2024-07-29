import { FC } from "react";

import { SwitchTab, SwitchTabDiv, Text } from "@styled";
import { SwitchTabProps } from "interfaces";

const SwitchTabs: FC<SwitchTabProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <SwitchTabDiv
      id="SwitchTabs-setActiveTab"
      onChange={(e, v) => setActiveTab(tabs[v])}
      value={tabs.indexOf(activeTab)}
      TabIndicatorProps={{
        style: {
          display: "none",
          marginLeft: "2px",
        },
      }}
    >
      {tabs.map((e, i) => {
        return (
          <SwitchTab
            id={`SwitchTab-${i}`}
            key={i}
            label={
              <Text
                className="f-body-lg"
                style={{
                  padding: "3px 7px",
                  borderRadius: 8,
                }}
              >
                {e}
              </Text>
            }
            disableRipple
            active={e === activeTab}
          />
        );
      })}
    </SwitchTabDiv>
  );
};

export default SwitchTabs;
