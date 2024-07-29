import { FC } from "react";

import { BottomModalLayout } from "components";
import { useAppDispatch, useAppSelector } from "store/store";
import { Text } from "@styled";
import { closeAlert } from "@slices/appSlice";

const AlertModal: FC<{
  handler?: () => void;
}> = ({ handler }) => {
  const dispatch = useAppDispatch();
  const handleConfirm = () => {
    dispatch(closeAlert());
    if (handler) handler();
  };
  const { alert } = useAppSelector((state) => state.app);
  return (
    <BottomModalLayout
      heading={alert.heading}
      open={alert.open}
      onConfirm={handleConfirm}
      showCancelBtn={handler && true}
      onCancel={() => dispatch(closeAlert())}
    >
      <Text customColor="#000000" className="f-body mgb-sm  mgt-sm">
        {alert.body}
      </Text>
    </BottomModalLayout>
  );
};

export default AlertModal;
