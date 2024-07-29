import { setIsDappRoutes } from "@slices/appSlice";
import { useApp } from "hooks";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router";
import AppFlowRoutes from "routes/app";
import AuthFlowRoutes from "routes/auth";
import { useAppDispatch, useAppSelector } from "store/store";
import { AUTHSCREENS } from "theme/constants";

const Routes = ({ seedPhraseRoute }: { seedPhraseRoute: string }) => {
  const { isUserExists } = useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useApp();

  useEffect(() => {
    if (!isLoggedIn) {
      if (seedPhraseRoute) {
        navigate(seedPhraseRoute);
      } else if (isUserExists) {
        navigate(AUTHSCREENS.auth);
      } else {
        navigate(AUTHSCREENS.landing);
      }
    }
    dispatch(setIsDappRoutes(false));
  }, []);

  return isLoggedIn ? <AppFlowRoutes /> : <AuthFlowRoutes />;
};

export default memo(Routes);
