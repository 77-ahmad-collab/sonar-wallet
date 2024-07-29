import { ChangeEvent, FC, useMemo, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons";

import { ModalProps as PROPS, SecondaryHoldings } from "interfaces";
import {
  BasicModal,
  SearchBar,
  StartAdornment,
  Tokens,
  TopLayoutComponent,
} from "components";
import { BottomLayoutStyled } from "@styled";
import { UpArrow } from "assets/Icons";
import { getFilteredTokensList } from "utils/utils.holdings";


const TokenPanelModal: FC<PROPS> = ({
  open,
  handleClose,
  holdings,
  Title,
  onTokenSelect,
  showZeroHoldings,
}) => {
  const [value, setValue] = useState("");

  const onTopImageClick = () => handleClose();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const filteredHoldings: SecondaryHoldings = useMemo(() => {
    return getFilteredTokensList(value, holdings, showZeroHoldings, true);
  }, [value, holdings]);

  return (
    <BasicModal open={open} handleClose={handleClose} top={0}>
      <BottomLayoutStyled
        boxHeight={600}
        key="bottomLayout"
        style={{ border: "0px" }}
      >
        <TopLayoutComponent
          text="Swap Tokens"
          TopImage={`${UpArrow}`}
          onTopImageClick={onTopImageClick}
        />

        {Title}

        <SearchBar
          StartAdornment={<StartAdornment Icon={faMagnifyingGlass} />}
          placeholder="Search..."
          onChange={handleChange}
          value={value}
          containerStyle={{}}
        />
        <Tokens
          style={{ height: 428 }}
          onTokenSelect={onTokenSelect}
          customHolding={filteredHoldings}
          defaultExpanded={true}
        />
      </BottomLayoutStyled>
    </BasicModal>
  );
};

export default TokenPanelModal;
