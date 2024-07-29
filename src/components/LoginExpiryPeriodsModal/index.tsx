import { setExpirationTime, setLoginExpiryPeriod } from "@slices/appSlice";
import BottomBasicModal from "components/BottomBasicModal";
import ButtonWithIcon from "components/ButtonWithIcon";
import { DefaultButton, Text } from "components/styled";
import { useAppDispatch, useAppSelector } from "store/store";
import { faLock } from "@fortawesome/pro-light-svg-icons";
import { LOGIN_PERIODS } from "utils/constants";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const LoginExpiryPeriodsModals = ({ open, handleClose }: Props) => {
  const { loginExpiryPeriod } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const handlePeriodClick = (time: number) => {
    dispatch(setLoginExpiryPeriod(time));
    dispatch(setExpirationTime(new Date().getTime() + time));
    handleClose();
  };
  return (
    <BottomBasicModal open={open} handleClose={handleClose}>
      <>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          <ButtonWithIcon
            icon={faLock}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            isHover={false}
          />
          <Text className="f-title-sm " style={{ color: "black" }}>
            Select Login Expiry Time
          </Text>
        </div>
        <div>
          {Object.values(LOGIN_PERIODS).map((period, key) => (
            <LoginPeriodItem
              key={key}
              period={period}
              onClick={handlePeriodClick}
              selectedPeriod={loginExpiryPeriod}
            />
          ))}
        </div>
      </>
    </BottomBasicModal>
  );
};

const LoginPeriodItem = ({
  period,
  onClick,
  selectedPeriod,
}: {
  period: { name: string; time: number };
  onClick: (period: number) => void;
  selectedPeriod: number;
}) => {
  return (
    <DefaultButton
      style={{
        height: "unset",
        width: "100%",
        padding: "10px 10px",
        marginBottom: 10,
        border: selectedPeriod === period.time ? "2px solid black" : "none",
      }}
      lightMode
      contained={false}
      onClick={() => onClick(period.time)}
    >
      <Text style={{ color: "black" }}>{period.name}</Text>
    </DefaultButton>
  );
};

export default LoginExpiryPeriodsModals;
