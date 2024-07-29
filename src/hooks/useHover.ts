import { useState } from "react";

export const useHover = (): [
  boolean,
  {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }
] => {
  const [hovering, setHovering] = useState(false);
  const onHoverProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  };
  return [hovering, onHoverProps];
};
