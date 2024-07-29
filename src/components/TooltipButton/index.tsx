import { Tooltip } from "@mui/material";
import { ButtonWithIcon } from "components";
import { FC, useEffect, useState } from "react";
import { OnButtonClickType, TooltipButtonProps as PROPS } from "interfaces";

const TooltipButton: FC<PROPS> = ({
  onClick,
  tooltipText,
  icon,
  iconColor,
  iconSize,
  text,
  ...buttonProps
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alertTimeOut: string | number | NodeJS.Timeout | undefined;
    if (open === true) {
      alertTimeOut = setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
    return () => clearTimeout(alertTimeOut);
  }, [open]);

  const onButtonClick = (e: OnButtonClickType) => {
    e.stopPropagation();
    setOpen(true);
    onClick(e);
  };

  return (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      onClose={() => setOpen(false)}
      open={open}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={tooltipText}
    >
      <div style={{ width: "fit-content" }}>
        <ButtonWithIcon
          {...buttonProps}
          onClick={onButtonClick}
          icon={icon}
          iconSize={iconSize}
          iconColor={iconColor}
          text={text}
        />
      </div>
    </Tooltip>
  );
};

export default TooltipButton;
