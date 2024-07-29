const Near = () => {};
export default Near;
// import React, { useEffect, useState } from "react";
// import { connect } from "near-api-js";
// import { PublicKey } from "near-api-js/lib/utils";
// import { useNavigate } from "react-router";

// import { Search } from "assets/Icons";
// import { SonarWalletLogo } from "assets/images";
// import {
//   WrapperBackground,
//   Background,
//   RainbowBox,
//   SearchBar,
//   StartAdornment,
// } from "components";
// import { PasswordBackStyled, Text } from "@styled";
// import {
//   CONFIG,
//   NEAR_MAINNET,
//   CHAINS,
//   ACCOUNTS,
//   SupportedChainId,
// } from "utils/constants";
// import { checkAccountStatus } from "utils";
// import { getStorageSyncValue, setStorageSyncValue } from "@constants";
// import { UserWallets } from "interfaces";
// import {
//   setAccountNumber,
//   setUserAddress,
//   setWalletNumber,
// } from "store/slices/appSlice";
// import { setNearAccountId } from "store/slices/walletSlice";
// import { useAppSelector, useAppDispatch } from "store/store";

// const Near = () => {
//   /* global-state */
//   const { nearAccountNetwork } = useAppSelector((state) => state.wallet);
//   const { walletNumber } = useAppSelector((state) => state.app);

//   /* local-state */
//   const [alert, setAlert] = useState({
//     message: "No message",
//     status: false,
//   });
//   const [value, setValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   /* hooks */
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   /* functions */
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value);
//   };

//   const createAccountID = async () => {
//     // eslint-disable-next-line no-useless-escape
//     const regularExpression = /^\w+([\.-]?\w+)*(\.\w{1,15})+$/;
//     console.log(regularExpression.test(value));
//     let networkOnNear = "";
//     if (value.length > 0) {
//       console.log("done");
//       let id = value;
//       // @ts-ignore

//       const near = await connect(
//         // @ts-ignore
//         // CONFIG[nearAccountNetwork as keyof typeof CONFIG]
//       );
//       if (!value.includes(".testnet" || ".near")) {
//         console.log("not include mainnet or testnet");
//         // if (nearAccountNetwork === SupportedChainId.NEAR) {
//           id = `${id}.near`;
//           networkOnNear = NEAR_MAINNET;
//         }
//         //  else {
//         //   id = `${id}.testnet`;
//         //   networkOnNear = NEAR_TESTNET;
//         // }
//       }
//       // if (nearAccountNetwork === SupportedChainId.NEAR) {
//         networkOnNear = NEAR_MAINNET;
//       }
//       // else {
//       //   networkOnNear = NEAR_TESTNET;
//       // }
//       console.log(id, NEAR_MAINNET);
//       const accountInfo = await near.account(id);
//       const state = await checkAccountStatus(accountInfo);
//       const userInfo = (await getStorageSyncValue("userInfo")) as UserWallets;

//       if (state) {
//         setAlert({
//           message: "Account with this name already present",
//           status: true,
//         });
//       } else {
//         setIsLoading(true);

//         const publicKey = Object.keys(
//           userInfo[`wallet${walletNumber}`].chains[networkOnNear][ACCOUNTS]
//         )[0] as any as PublicKey;
//         await near.createAccount(id, publicKey);
//         const accountAddress = publicKey.toString();
//         userInfo[`wallet${walletNumber}`][CHAINS][networkOnNear][ACCOUNTS][
//           accountAddress
//         ].address = id;
//         console.log(
//           userInfo[`wallet${walletNumber}`][CHAINS][networkOnNear][ACCOUNTS][
//             accountAddress
//           ].address,
//           "hereeeeeeee============================="
//         );
//         await setStorageSyncValue("userInfo", userInfo);

//         dispatch(setNearAccountId(id));
//         dispatch(setUserAddress(id));
//         // dispatch(
//         //   changeNetwork(
//             nearAccountNetwork,
//         //     Object.keys(NETWORKCHAIN).indexOf(oString())
//         //   )
//         // );
//         navigate("/index.html");
//       }
//     } else if (!regularExpression.test(value)) {
//       console.log(regularExpression.test(value));
//       setAlert({
//         message: "Enter id in the format example.testnet no symbols",
//         status: true,
//       });
//     } else {
//       setAlert({
//         message: "Please enter account id",
//         status: true,
//       });
//     }
//   };

//   /* effects */
//   useEffect(() => {
//     const alertTime = setTimeout(() => {
//       setAlert({
//         message: "no message",
//         status: false,
//       });
//     }, 3000);
//     return () => {
//       clearTimeout(alertTime);
//     };
//   }, [alert]);

//   return (
//     <WrapperBackground boxHeight="100vh" style={{ position: "relative" }}>
//       <Background />
//       <div className="r-c-c landing-sonar-logo">
//         <img
//           className="sonar-img"
//           src={SonarWalletLogo}
//           alt="SonarWalletLogo"
//         />
//       </div>
//       <div className="password-steps-wrapper">
//         {/* <AnimationGroup content={ContentArray} currentStep={currentStep} /> */}
//         <div className="c-c-c" style={{ pointerEvents: "all" }}>
//           <Text size={18} weight={400} customStyle={{ marginBottom: "20px" }}>
//             Create Account ID
//           </Text>
//           <SearchBar
//             StartAdornment={<StartAdornment Icon={Search} />}
//             placeholder="example.tesnet"
//             onChange={handleChange}
//             value={value}
//           />
//           <Text
//             size={14}
//             weight={400}
//             customColor="#f76684"
//             style={{ marginTop: 10, opacity: alert.status ? 1 : 0 }}
//             onClick={() => console.log("on Click")}
//           >
//             {alert.message}
//           </Text>
//           <div className="r-c-c">
//             <Text
//               className="r-c-c"
//               style={{
//                 background: "rgba(255,255,255,0.08)",
//                 borderRadius: 14,
//                 padding: "9px 16px",
//                 marginTop: 22,
//                 marginBottom: 25,
//                 marginRight: 10,
//                 cursor: "pointer",
//                 pointerEvents: isLoading ? "none" : "all",
//                 zIndex: 100,
//               }}
//               size={14}
//               onClick={() => {
//                 if (!isLoading) {
//                   dispatch(setWalletNumber(1));
//                   dispatch(setAccountNumber(0));
//                   navigate("/index.html");
//                 }
//               }}
//               customColor="rgba(255,255,255,0.7)"
//             >
//               Back
//             </Text>
//             <Text
//               className="r-c-c"
//               style={{
//                 background: "rgba(255,255,255,0.04)",
//                 borderRadius: 14,
//                 padding: "9px 16px",
//                 marginTop: 22,
//                 marginBottom: 25,
//                 cursor: "pointer",
//                 pointerEvents: isLoading ? "none" : "all",
//                 zIndex: 100,
//               }}
//               size={14}
//               customColor="rgba(255,255,255,0.7)"
//               onClick={createAccountID}
//             >
//               Create Account ID
//               <div style={{ marginLeft: "5px" }}>
//                 {isLoading ? (
//                   <RainbowBox>
//                     <div
//                       style={{
//                         width: "14px",
//                         height: "14px",
//                         borderRadius: "50%",
//                       }}
//                     ></div>
//                   </RainbowBox>
//                 ) : (
//                   ""
//                 )}
//               </div>
//             </Text>
//           </div>
//         </div>
//         <div className="chartline" />
//         <PasswordBackStyled />
//       </div>
//     </WrapperBackground>
//   );
// };

// export default Near;
