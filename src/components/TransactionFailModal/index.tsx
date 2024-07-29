import { Text } from "@styled";
import { BottomBasicModal, ButtonWithIcon } from "components";

import {
  faCheck,
  faCircleInfo,
  faExclamation,
  faX,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "store/store";
import { setFailedModalAlert } from "@slices/appSlice";

const TransactionFailModal = () => {
  /* global-state */
  const {
    failedModalAlert: { funds, gas, open, message },
  } = useAppSelector((state) => state.app);
  /* local-state */

  const dummydata = [
    {
      icon: faCheck,
      iconColor: "#00AF31",
      body: "Funds were not spent",
      value: `~${funds}`,
      token: "$",
    },
    {
      icon: faX,
      iconColor: "#FF4D00",
      body: "Some gas was spent",
      value: gas,
      token: "$",
    },
  ];

  /* hooks */
  const dispatch = useAppDispatch();
  /* functions */
  const handleClose = () => {
    dispatch(
      setFailedModalAlert({
        message: "",
        open: false,
        funds: 0,
        gas: 0,
      })
    );
  };
  /* effects */

  return (
    <BottomBasicModal open={open} handleClose={handleClose} gradient>
      <>
        <div style={{ width: "100%" }} className="r-c-fs mgb-lg">
          <ButtonWithIcon
            icon={faExclamation}
            lightMode={true}
            onClick={() => {}}
            text=""
            iconColor="rgba(0,0,0,0.7)"
            isHover={false}
          />
          <Text className="f-title-sm " style={{ color: "black" }}>
            Transaction Failed
          </Text>
        </div>

        <div>
          <div className="r-c-sb input-header">
            <Text size={14} weight={400} customColor={"#000000"}>
              {message}
            </Text>
          </div>
        </div>

        <div
          style={{
            padding: "10px 10px",
            width: "100%",
            border: "1px solid #00000080",
            borderRadius: "8px",
          }}
        >
          <div
            className="r-fe-fs"
            style={{ marginBottom: "15px", marginTop: "5px" }}
          >
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="infoIconTxFail"
              style={{ color: "black" }}
            />

            <Text
              size={12}
              weight={600}
              customColor={"#000000"}
              style={{ opacity: "0.6", marginRight: "8px" }}
            >
              What happened to funds?
            </Text>
          </div>

          <div>
            {dummydata.map((e) => {
              return (
                <div
                  className="r-c-sb"
                  key={e.body}
                  style={{ marginTop: "10px" }}
                >
                  <div className="r-c-fs" key={e.body}>
                    <FontAwesomeIcon
                      icon={e.icon}
                      className="AllIconsInTxFailModal"
                      style={{ color: e.iconColor }}
                    />

                    <Text
                      size={14}
                      weight={400}
                      customColor={"#000000"}
                      style={{ marginRight: "8px" }}
                    >
                      {e.body}
                    </Text>
                  </div>

                  <div className="r-c-fs">
                    <Text size={14} weight={400} customColor={"#000000"}>
                      {e.value}
                    </Text>

                    <Text
                      size={14}
                      weight={400}
                      customColor={"#000000"}
                      style={{ opacity: "0.6", marginLeft: "5px" }}
                    >
                      {e.token}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="r-c-fs">
          <ButtonWithIcon
            icon={faCheck}
            lightMode={true}
            style={{ marginTop: 20 }}
            onClick={handleClose}
            text="OK"
          />
        </div>
      </>
    </BottomBasicModal>
  );
};

export default TransactionFailModal;
