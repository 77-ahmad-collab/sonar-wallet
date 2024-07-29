import { AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";
import _ from "lodash";
import {
  faArrowLeft,
  faClipboard,
  faClockRotateLeft,
  faStar,
  faUser,
  faWallet,
} from "@fortawesome/pro-regular-svg-icons";

import { faCircleCheck } from "@fortawesome/pro-light-svg-icons";
import {
  AddressInsertionComponent,
  ButtonBox,
  CommonLayout,
  StartAdornment as CustomStartAdornment,
  GenericBackgroundBoxContent,
  SearchBar,
  SelectAccountModal,
  Switch,
  TitleComponent,
} from "components";
import { GenericBackgroundBox, Text, WrapperStyled } from "@styled";
import { formatAddress } from "utils/formatters";
import { useSelectAddress } from "hooks";
import { validateAddress } from "utils/validateAddresses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SelectAddress = () => {
  const {
    showModalAddressBook,
    handleCloseModalAddressBook,
    value,
    handleChange,
    isSwitchAddressBook,
    handleSwitchChange,
    onPasteHandler,
    addressBook,
    isAddressValid,
    onAddressSelect,
    onTopImageClick,
    handleSend,
    chainFamily,
    clipboardvalue,
    recentRecipients,
    showModalTransferBetweenAccounts,
    setShowModalTransferBetweenAccounts,
    ensAddress,
    filteredAccounts,
    token,
  } = useSelectAddress();

  const EndAdornment = () => {
    if (isAddressValid) {
      return (
        <span className="endAdornment">{`(${formatAddress(value)})`}</span>
      );
    }
    return <></>;
  };

  const StartAdornment = () => {
    return (
      <CustomStartAdornment
        Icon={value.length && isAddressValid ? faCircleCheck : faWallet}
        iconColor={value.length && isAddressValid ? "#00d67d" : "#ffffff66"}
      />
    );
  };

  return (
    <CommonLayout onTopImageClick={onTopImageClick} title="Send Tokens">
      <>
        <div className="r-c-fs">
          <FontAwesomeIcon
            id="SelectAddress-goback"
            onClick={onTopImageClick}
            icon={faArrowLeft}
            color="white"
            style={{
              fontSize: 20,
              marginLeft: "14px",
              marginRight: "12px",
              marginTop: "auto",
              marginBottom: "auto",
              cursor: "pointer",
            }}
          />

          <TitleComponent text="Select Recipient..." />
        </div>

        <AddressInsertionComponent
          open={showModalAddressBook}
          handleClose={handleCloseModalAddressBook}
          walletAddress={ensAddress ? ensAddress : value}
          onAddressSelect={onAddressSelect}
          ens={ensAddress ? value : ""}
        />

        <SearchBar
          id="SelectAddress-input"
          onChange={handleChange}
          placeholder="Type address or ENS..."
          value={value}
          StartAdornment={<StartAdornment />}
          EndAdornment={<EndAdornment />}
        />

        {!isAddressValid && !!value.length && (
          <Text
            id="SelectAddress-invalid-error"
            customColor={"red"}
            size={14}
            weight={500}
            lineHeight="30px"
            align="center"
          >
            Invalid Account address
          </Text>
        )}

        <AnimatePresence exitBeforeEnter>
          <div className="full-width">
            {isAddressValid && (
              <Box className="r-c-fs">
                <Switch
                  checked={isSwitchAddressBook}
                  handleSwitchChange={handleSwitchChange}
                />
                <Text
                  customColor={isSwitchAddressBook ? "#3DF2BC" : "#7B7A7F"}
                  size={15}
                  weight={500}
                >
                  Save to Address Book
                </Text>
              </Box>
            )}

            {isAddressValid && (
              <Box
                id="SelectAddress-handleSend"
                onClick={handleSend}
                style={{ cursor: "pointer" }}
              >
                <ButtonBox title="Send" customColor="#23212A" />
              </Box>
            )}
          </div>
        </AnimatePresence>

        <WrapperStyled
          value={value.length ? true : false}
          layout
          transition={{ ease: "easeInOut" }}
        >
          {/* Copy from clipboard */}
          <GenericBackgroundBox
            margintop={30}
            id="pasteButton"
            onClick={onPasteHandler}
          >
            <GenericBackgroundBoxContent
              imageSrc={faClipboard}
              title=" Paste from clipboard"
              isAddress={validateAddress(clipboardvalue, chainFamily)}
              address={formatAddress(clipboardvalue)}
            />
          </GenericBackgroundBox>

          {/* Transfer between accounts */}
          <GenericBackgroundBox
            id="SelectAddress-setShowModalTransferBetweenAccounts"
            margintop={10}
            onClick={() => setShowModalTransferBetweenAccounts(true)}
          >
            <GenericBackgroundBoxContent
              imageSrc={faUser}
              title=" Transfer between accounts"
              isAddress={false}
            />
          </GenericBackgroundBox>

          <SelectAccountModal
            open={showModalTransferBetweenAccounts}
            image={token.image}
            accountsList={filteredAccounts}
            handleClose={() => setShowModalTransferBetweenAccounts(false)}
            onAddressSelect={onAddressSelect}
            showIcon={false}
          />

          {!_.isEmpty(addressBook) && (
            <Text size={13} customColor="#5E5E64" className="addressBookStyle">
              From Address Book
            </Text>
          )}

          {Object.values(addressBook).map((contact, index) => {
            return (
              <GenericBackgroundBox
                id={`SelectAddress-addressBook-${index}`}
                key={index}
                style={{
                  opacity: validateAddress(contact.address, chainFamily)
                    ? 1
                    : 0.5,
                  pointerEvents: validateAddress(contact.address, chainFamily)
                    ? "auto"
                    : "none",
                }}
                margintop={10}
                onClick={() => onAddressSelect(contact.address)}
              >
                <GenericBackgroundBoxContent
                  imageSrc={faStar}
                  title={contact.name}
                  address={formatAddress(contact.address)}
                  isAddress={true}
                />
              </GenericBackgroundBox>
            );
          })}

          {!_.isEmpty(recentRecipients) && (
            <Text size={13} customColor="#5E5E64" className="addressBookStyle">
              Recent
            </Text>
          )}

          {recentRecipients.length > 0 &&
            recentRecipients.map(({ address, name, timeStamp }, index) => (
              <GenericBackgroundBox
                id={`SelectAddress-recentAddress-${index}`}
                margintop={10}
                style={{
                  opacity: validateAddress(address, chainFamily) ? 1 : 0.5,
                  pointerEvents: validateAddress(address, chainFamily)
                    ? "auto"
                    : "none",
                }}
                onClick={() => onAddressSelect(address)}
                key={index}
              >
                <GenericBackgroundBoxContent
                  imageSrc={faClockRotateLeft}
                  title={` ${name}`}
                  address={formatAddress(address)}
                  isAddress={true}
                  timeStamp={timeStamp}
                />
              </GenericBackgroundBox>
            ))}
        </WrapperStyled>
      </>
    </CommonLayout>
  );
};

export default SelectAddress;
