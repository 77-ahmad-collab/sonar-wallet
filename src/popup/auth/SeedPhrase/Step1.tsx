import { FC } from "react";

import { SeedPhraseS1Props as PROPS } from "interfaces";

import { SeedPhraseView } from "components";
import { useSeedPhraseStep1 } from "hooks";

const Step1: FC<PROPS> = ({ setStep }) => {
  const { mnemonic, handleOnSave } = useSeedPhraseStep1(setStep);
  return (
    <SeedPhraseView
      mnemonic={mnemonic}
      handleonSave={handleOnSave}
      isManageWallets={false}
    />
  );
};
export default Step1;
