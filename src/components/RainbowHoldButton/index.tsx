import { FC } from "react";
import { motion } from "framer-motion";

import { RainbowHoldButtonProps as PROPS } from "interfaces";
import { InternalRainbowBoxStyled, RainbowButtonStyled, Text } from "@styled";
import useLongPress from "../../hooks/useLongPress";
import { useAppDispatch, useAppSelector } from "store/store";
import { setSlideAnimation } from "@slices/appSlice";

const RainbowHoldButton: FC<PROPS> = ({
  onHoldComplete = () => {},
  width,
  ButtonTitle,
  loading,
  left,
}) => {
  const { isHoldFinish, slideAnimation } = useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();

  const longPress = useLongPress(
    () => {},
    1000,
    () => {
      dispatch(setSlideAnimation("expand"));
    },
    () => {
      dispatch(setSlideAnimation("contract"));
    }
  );

  return (
    <RainbowButtonStyled
      {...longPress}
      width={width}
      left={left}
      loading={loading}
    >
      <InternalRainbowBoxStyled isHoldFinish={isHoldFinish} className="r-c-c">
        {!isHoldFinish && (
          <motion.div
            id="RainbowHoldButton-onHoldComplete"
            // onClick={() => {
            //   if (isSlideAnimationCompleted === true)
            //     setSlideAnimation("expand");
            // }}
            animate={slideAnimation}
            onAnimationComplete={() => {
              if (slideAnimation === "expand" && !loading) {
                // dispatch(setSlideAnimationCompletionStatus(true));
                onHoldComplete();
              }
            }}
            variants={{ expand: { width: "100%" }, contract: { width: "0%" } }}
            initial={{ width: "0%" }}
            className="onHold-loading"
            transition={{ duration: 1, ease: "linear", staggerDirection: -1 }}
          />
        )}

        <Text
          className="f-body-lg"
          weight={500}
          style={{
            width: "100%",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          {ButtonTitle}
        </Text>
      </InternalRainbowBoxStyled>
    </RainbowButtonStyled>
  );
};

export default RainbowHoldButton;
