import Step1 from "./Step1";
import Step2 from "./Step2";
import { useSeedPhrase } from "hooks";
import { WrapperBackground } from "components";

const Seedphrase = () => {
  const { step, setStep } = useSeedPhrase();

  return (
    <WrapperBackground boxHeight="100vh" style={{ position: "relative" }}>
      {step === 1 ? <Step1 setStep={setStep} /> : <Step2 />}
    </WrapperBackground>
  );
};
export default Seedphrase;
