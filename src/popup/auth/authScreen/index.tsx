import { useState } from "react";

import Step1 from "../../../components/Passwords/Step1";
import Step2 from "../../../components/Passwords/Step2";
import Step3 from "../../../components/Passwords/Step3";
import Step4 from "../../../components/Passwords/Step4";
import Login from "../../../components/Passwords/Login";
import Main from "../../../components/Passwords/main";
import { useAppSelector } from "store/store";

const Auth = () => {
  const { isUserExists } = useAppSelector((state) => state.app);

  const [currentStep, setCurrentStep] = useState(1);

  const ContentArray = [
    isUserExists
      ? {
          content: <Login currentStep={currentStep} />,
        }
      : {
          content: (
            <Step1
              changeStep={(step) => setCurrentStep(step)}
              currentStep={currentStep}
            />
          ),
        },
    {
      content: (
        <Step2
          changeStep={(step) => setCurrentStep(step)}
          currentStep={currentStep}
        />
      ),
    },
    {
      content: (
        <Step3
          changeStep={(step) => setCurrentStep(step)}
          currentStep={currentStep}
        />
      ),
    },
    {
      content: (
        <Step4
          changeStep={(step) => setCurrentStep(step)}
          currentStep={currentStep}
        />
      ),
    },
  ];

  // console.log({ ContentArray });
  return <Main ContentArray={ContentArray} currentStep={currentStep} />;
};

export default Auth;
