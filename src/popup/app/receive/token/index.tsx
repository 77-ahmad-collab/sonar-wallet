import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import {
  ChainFamilyModal,
  CommonLayout,
  QrModal,
  SelectAccountModal,
} from "components";
import {
  Accounts,
  Location,
  ReceiveLocationState,
  SimpleTileinfoProps,
} from "interfaces";
import { ButtonDefault } from "@styled";
import { useAppSelector } from "store/store";
import { CHAIN_CATEGORIES } from "utils/constants";
import { DummyTokenImage } from "assets/Icons";
import { filterAccounts } from "utils/utils.wallets";
import { APPSCREENS } from "theme/constants";

const Token = () => {
  /* global-state */
  const {
    state: { tokenDetail },
  } = useLocation() as Location<ReceiveLocationState>;
  const {
    tokenSelected: { token },
  } = useAppSelector((state) => state.newWallet);
  const { NETWORKCHAIN } = useAppSelector((state) => state.app);

  /* local-state */
  const [selectedToken, setSelectedToken] = useState<
    SimpleTileinfoProps | undefined
  >(
    tokenDetail
      ? {
          NAME: token.name,
          LOGO: token.image,
          chain: {
            ...CHAIN_CATEGORIES[NETWORKCHAIN[token.chainId].chain],
          },
        }
      : undefined
  );
  const [account, setAccount] = useState<SimpleTileinfoProps>();
  const [chainFamily, setChainFamily] = useState<SimpleTileinfoProps | string>(
    tokenDetail
      ? {
          ...CHAIN_CATEGORIES[NETWORKCHAIN[token.chainId].chain],
        }
      : ""
  );
  const [isShowAccountModal, setIsShowAccountModal] = useState(
    tokenDetail ? true : false
  );
  const [accounts, setAccounts] = useState<Accounts["accAddress"][]>([]);

  const [amount, setAmount] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isChainFamilyModalOpen, setIsChainFamilyModalOpen] = useState(
    tokenDetail ? false : true
  );
  // const [receiveStep, setReceiveStep] = useState(
  //   2
  //   // location.state?.tokenDetail ? 2 : 0
  // );

  /* hooks */
  const navigate = useNavigate();

  /* functions */
  // const onTokenClick = (token: SimpleTileinfoProps) => {
  //   setSelectedToken(token);
  //   setReceiveStep(2);
  // };

  // const onDefaultTokenClick = (token: SimpleTileinfoProps) => {
  //   setSelectedToken(token);
  //   if (token.chain) setChainFamily(token.chain);
  //   setReceiveStep(2);
  // };

  // const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const text = e.target.value;
  //   if (text === "" || validator.isFloat(text)) {
  //     setAmount(text);
  //   }
  // };

  const onAccountClick = (account: SimpleTileinfoProps) => {
    setIsQrModalOpen(true);
    setAccount(account);
  };

  const onChainFamilyClick = (chainFamily: typeof CHAIN_CATEGORIES["x"]) => {
    setChainFamily(chainFamily);
    setIsChainFamilyModalOpen(false);
    setIsShowAccountModal(true);
  };

  const goback = () => {
    setChainFamily("");
    // setIsChainFamilyModalOpen(true);

    // if (receiveStep) {
    //   setReceiveStep(0);
    //   setAmount("");
    // } else {
    navigate("/index.html");
    // }
  };

  const handleNetworkModalClose = () => {
    // if (!chainFamily) {
    //   navigate(APPSCREENS.dashboard);
    // } else {
    navigate(APPSCREENS.dashboard);
    setIsChainFamilyModalOpen(false);
    // }
  };

  const getAccountsList = () => {
    console.log(chainFamily);
    const family = chainFamily as SimpleTileinfoProps;
    const accounts = filterAccounts({
      chainFamily: [family?.chain as string],
    });

    return accounts;
  };

  /* effects */
  useEffect(() => {
    const accounts = getAccountsList();
    setAccounts(accounts);
  }, [chainFamily]);

  return (
    <CommonLayout onTopImageClick={goback} title="Receive Tokens">
      <div className="full-width" style={{ height: "100%" }}>
        <div className="paddingTop">
          {/* <TitleComponent
            text={`Select ${
              isShowAccountModal ? "an account to receive token" : "the network"
            }`}
            containerStyle={{ margin: "10px 0px 20px 0px", width: "unset" }}
          /> */}

          {/* <AccountsList onAccountClick={onAccountClick} network={chainFamily} /> */}
        </div>

        <ChainFamilyModal
          isOpen={isChainFamilyModalOpen}
          handleClose={handleNetworkModalClose}
          onChainFamilyClick={onChainFamilyClick}
          network={chainFamily}
        />

        <SelectAccountModal
          open={isShowAccountModal}
          image={chainFamily.LOGO || DummyTokenImage}
          accountsList={accounts}
          handleClose={() => {
            setIsShowAccountModal(false);
            setIsChainFamilyModalOpen(true);
          }}
          onAccountClick={onAccountClick}
          showIcon={false}
          onAddressSelect={function (address: string): void {}}
        />
        <QrModal
          isModalOpen={isQrModalOpen}
          onClose={() => {
            setIsQrModalOpen(false);
          }}
          token={selectedToken}
          amount={amount}
          network={chainFamily as SimpleTileinfoProps}
          account={{
            NAME: account?.NAME ?? "",
            ADDRESS: account?.ADDRESS,
            LOGO: account?.LOGO ?? "",
            chain: account?.chain,
          }}
        />
      </div>
      <div className="r-c-c mgb-lg mgt-sm" style={{ width: "100%" }}>
        <ButtonDefault
          bright
          onDarkBack
          width={150}
          style={{ marginTop: 0 }}
          onClick={() => setIsChainFamilyModalOpen(true)}
        >
          Select Network
        </ButtonDefault>
      </div>
    </CommonLayout>
  );
};

export default Token;
