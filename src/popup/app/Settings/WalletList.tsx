import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTheme } from "@mui/material";
import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CommonLayout, RenderListContent } from "components";
import { APPSCREENS } from "theme/constants";
import { useAppSelector } from "store/store";

const WalletList = () => {
  /* global-state */
  const { pathname } = useLocation();
  const theme = useTheme();
  const { allWallets } = useAppSelector((state) => state.newWallet);

  /* local-state */

  /* hooks */
  const navigate = useNavigate();

  /* functions */
  const handleWalletClick = (walletId: string) =>
    navigate(`${pathname}/${APPSCREENS.info}`, { state: { walletId } });

  const walletsList = useMemo(
    () =>
      Object.values(allWallets).map((wallet) => ({
        text: wallet.name,
        leftSideElement: <></>,
        rightSideElement: (
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{ color: theme.palette.text.secondary }}
            className="f-body-lg"
          />
        ),
        onClick: () => handleWalletClick(wallet.walletId),
      })),
    [allWallets]
  );

  /* effects */

  return (
    <CommonLayout onTopImageClick={() => navigate(-1)} title="Wallets">
      <div className="full-width">
        {/* <Text
            size={14}
            weight={400}
            dim={true}
            style={{ marginLeft: "12px" }}
          >
            Wallets
          </Text> */}
        <RenderListContent List={walletsList} />
      </div>
    </CommonLayout>
  );
};

export default WalletList;
