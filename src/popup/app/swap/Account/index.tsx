import {
  SpanOpacityStyled,
  SwapTokenBoxStyled,
  Text,
  TokenValueBoxStyled,
} from "@styled";
import { ImageContent } from "components";
import { useAppSelector } from "store/store";
import { truncateName } from "utils";
import { formatAmount } from "utils/formatters";

const Account = () => {
  const {
    swapSelectedTokens: { account },
  } = useAppSelector((state) => state.newWallet);

  if (!account.address) {
    return null;
  }

  return (
    <>
      <Text
        weight={400}
        dim={true}
        style={{ opacity: 0.3, alignSelf: "flex-start", marginTop: 6 }}
        className="f-body-sm  mgb-sm"
      >
        From
      </Text>

      <SwapTokenBoxStyled
        marginTop={6}
        style={{
          height: "50px",
          borderRadius: "12px",
          padding: "0px 10px",
          backgroundColor: "#1a1a1a",
        }}
      >
        <TokenValueBoxStyled boxWidth={60}>
          <div className="r-c-c">
            <ImageContent
              src={account.image}
              Size={{ width: "30px", height: "30px", borderRadius: "50%" }}
            />
            <div className="walletHeading">
              <Text size={17} weight={500} style={{ opacity: 0.7 }}>
                {truncateName(account.name)}
              </Text>
              <Text size={14} weight={400} dim={true}>
                {truncateName(account.walletName)}
              </Text>
            </div>
          </div>
        </TokenValueBoxStyled>

        <Text
          style={{
            marginLeft: "auto",
            textAlign: "center",
          }}
          size={17}
        >
          {formatAmount(account.nativeTokenBalance)}
          <SpanOpacityStyled opacity={0.7}>
            {` `} {account.nativeTokenSymbol}
          </SpanOpacityStyled>
        </Text>
      </SwapTokenBoxStyled>
    </>
  );
};

export default Account;
