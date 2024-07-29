import { FC, useEffect } from "react";

import { Text } from "@styled";
import { PasswordStepProps as PROPS } from "interfaces";
import { useAppSelector } from "store/store";

const Step1: FC<PROPS> = ({ changeStep }) => {
  /* global-state */

  const { welcomeMessage } = useAppSelector((state) => state.app);
  /* local-state */

  /* hooks */

  /* functions */

  /* effects */
  useEffect(() => {
    const time = setTimeout(() => changeStep(2), 2000);
    return () => clearTimeout(time);
  }, []);

  return (
    <Text size={18} weight={400} align="center" data-testid="password-step1">
      {welcomeMessage}
    </Text>
  );
};

export default Step1;
