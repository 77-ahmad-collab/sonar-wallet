import { NavigateFunction } from "react-router";

class Navigator {
  navigate: NavigateFunction = () => {};
}

const navigationService = new Navigator();

export default navigationService;
