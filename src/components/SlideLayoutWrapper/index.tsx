import { FC } from "react";
import { motion } from "framer-motion";

import { SlideLayoutWrapperProps as Props } from "interfaces";

const SlideLayoutWrapper: FC<Props> = ({ children }) => (
  <motion.div
    className="trans-default bezier-out"
    initial={{ y: 20, opacity: 1 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    style={{ flex: 1, width: "100%", overflowY: "scroll" }}
  >
    {children}
  </motion.div>
);

export default SlideLayoutWrapper;
