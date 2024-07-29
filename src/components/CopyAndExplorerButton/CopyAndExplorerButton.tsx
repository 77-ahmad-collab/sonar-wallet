import { FC, useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { StyledButton } from "@styled";
import { faCopy, faMicroscope } from "@fortawesome/pro-light-svg-icons";
import { CopyAndExplorerButtonProps as PROPS } from "interfaces";
import { useAppSelector } from "store/store";

const CopyAndExplorerButton: FC<PROPS> = ({ transactionHash, chainId }) => {
  const [open, setOpen] = useState(false);

  const { NETWORKCHAIN } = useAppSelector((state) => state.app);

  const handleCopyHash = () => navigator.clipboard.writeText(transactionHash);
  const handleToolTipOpen = () => setOpen(true);
  const handleTooltipClose = () => setOpen(false);

  useEffect(() => {
    let alertTimeOut: string | number | NodeJS.Timeout | undefined;
    if (open === true) {
      alertTimeOut = setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
    return () => clearTimeout(alertTimeOut);
  }, [open]);

  return (
    <div className="r-c-fs">
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={open}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title="Hash Copied"
      >
        <StyledButton
          onClick={(e) => {
            e.stopPropagation();
            handleCopyHash();
            handleToolTipOpen();
          }}
          variant="outlined"
          startIcon={
            <FontAwesomeIcon
              icon={faCopy}
              color="white"
              className="buttonIcon"
            />
          }
        >
          Copy Hash
        </StyledButton>
      </Tooltip>
      <StyledButton
        onClick={(e) => {
          e.stopPropagation();
          window.open(`${NETWORKCHAIN[chainId].SCAN_LINK}/${transactionHash}`);
        }}
        variant="outlined"
        startIcon={
          <FontAwesomeIcon
            icon={faMicroscope}
            color="white"
            className="buttonIcon"
          />
        }
      >
        See in Explorer
      </StyledButton>
    </div>
  );
};

export default CopyAndExplorerButton;
