import { FC } from "react";
import { motion } from "framer-motion";

import "./Components.css";
import { useAppSelector } from "store/store";

const Background: FC = () => {
  const { isLoggedIn } = useAppSelector((state) => state.app);

  return (
    <motion.div
      transition={{ duration: 1.1, ease: "easeInOut" }}
      layout
      className={`bg__container_${isLoggedIn ? "loggedin" : "loggedout"}`}
    >
      <motion.div
        layout
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className="blob blob-one"
      ></motion.div>
    </motion.div>
  );
};

export default Background;
