import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

import { DefaultButton } from "@styled";
import { ButtonProps as PROPS } from "interfaces";

const ButtonWithIcon: FC<PROPS> = ({
  onClick,
  icon,
  lightMode = false,
  className,
  text,
  contained = false,
  style = {},
  iconSize = 18,
  iconColor = "#000",
  id = "",
  isHover,
}) => {
  return (
    <DefaultButton
      id={id}
      onClick={(e) => onClick(e)}
      className="f-body-md mgr-sm"
      lightMode={lightMode}
      contained={contained}
      style={style}
      isHover={isHover}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className={`${className} `}
          fontSize={iconSize}
          color={iconColor}
        />
      )}

      <span className={text && icon ? "mgl-sm" : ""}>{text}</span>
    </DefaultButton>
  );
};

export default ButtonWithIcon;
