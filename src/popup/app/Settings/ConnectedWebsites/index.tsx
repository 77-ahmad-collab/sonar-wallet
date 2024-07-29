import { Button } from "@mui/material";
import { CommonLayout } from "components";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { selectAllowedPages } from "store/selectors";
import { useAppSelector } from "store/store";

const ConnectedWebsites = () => {
  const navigate = useNavigate();

  const allowedPages = useAppSelector(selectAllowedPages);
  const dappsByOrigin = useMemo(() => {
    const seen = new Set();

    return allowedPages.filter((permission) => {
      if (seen.has(permission.origin)) return false;

      seen.add(permission.origin);

      return true;
    });
  }, [allowedPages]);

  console.log("allowedPages", allowedPages);
  console.log("dappsByOrigin", dappsByOrigin);

  return (
    <CommonLayout
      onTopImageClick={() => navigate(-1)}
      title="Connected websites"
    >
      <div className="full-width">
        <h1>{JSON.stringify(dappsByOrigin)}</h1>

        {dappsByOrigin.length > 0 &&
          dappsByOrigin.map((per, key) => {
            return <Button key={key}>{per.origin}</Button>;
          })}
      </div>
    </CommonLayout>
  );
};

export default ConnectedWebsites;
