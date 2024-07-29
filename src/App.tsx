import navigationService from "classes/navigation";
import { useEffect } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";

import Routing from "routes/index";
import Theme from "./theme/index";

function App() {
  return (
    <Theme>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </Theme>
  );
}

export default App;
