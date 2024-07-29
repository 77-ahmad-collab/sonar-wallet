import { useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";

import { BoxRow, Text } from "@styled";
import {
  CommonLayout,
  ListItem,
  LoginExpiryPeriodsModal,
  RenderListContent,
  Switch,
} from "components";
import { useAppSelector } from "store/store";
import { LOGIN_PERIODS } from "utils/constants";

const Authentication = () => {
  const [isSwitch, setSwitch] = useState(false);
  const [isLoginExpiryModalOpen, setIsLoginExpiryModalOpen] = useState(false);
  const { loginExpiryPeriod } = useAppSelector((state) => state.app);

  const theme = useTheme();
  const navigate = useNavigate();

  const handleSwitchChange = () => {
    setSwitch(!isSwitch);
  };

  const List = [
    {
      text: "Password Auto-Lock",
      rightSideElement: (
        <Text size={14} weight={400} dim={true}>
          {LOGIN_PERIODS[loginExpiryPeriod].name}
        </Text>
      ),
      leftSideElement: <></>,
      onClick: () => setIsLoginExpiryModalOpen(true),
      disabled: false,
    },
    {
      text: "Change Password",
      rightSideElement: (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: theme.palette.text.secondary }}
        />
      ),
      leftSideElement: <></>,
      onClick: () => {},
      disabled: true,
    },
    {
      text: "Use Pin to Sign Transactions",
      rightSideElement: (
        <Switch checked={isSwitch} handleSwitchChange={handleSwitchChange} />
      ),
      leftSideElement: <></>,
      onClick: () => {},
      disabled: true,
    },
  ];

  return (
    <CommonLayout onTopImageClick={() => navigate(-1)} title="Settings">
      <div className="full-width">
        <Text size={14} weight={400} dim={true} style={{ margin: "10px 12px" }}>
          Authentication
        </Text>

        <RenderListContent List={List} />

        {isSwitch && (
          <AnimatePresence exitBeforeEnter>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ListItem
                leftSideElement={<></>}
                text="Change Pin"
                rightSideElement={
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    style={{ color: theme.palette.text.secondary }}
                  />
                }
                onClick={() => {}}
              />
            </motion.div>
          </AnimatePresence>
        )}

        <BoxRow className="boxStyleOverride" disabled>
          <div className="r-c-sb" style={{ width: "100%" }}>
            <Text size={15} weight={400} style={{ opacity: 0.9 }}>
              Share Usage Metrics
            </Text>
            <Switch checked={false} />
          </div>

          <Text size={13} weight={400} dim={true} lineHeight={1.3}>
            Help us improve the app by letting us track how you experience it.
            Collected data does NOT include account nor any private information.
          </Text>
        </BoxRow>
      </div>
      <LoginExpiryPeriodsModal
        open={isLoginExpiryModalOpen}
        handleClose={() => setIsLoginExpiryModalOpen(false)}
      />
    </CommonLayout>
  );
};

export default Authentication;
