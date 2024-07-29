import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  InputBase,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  ToggleButtonGroup,
  styled,
} from "@mui/material";
import { AccordionProps } from "@mui/material/Accordion";
import { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import { isActive } from "../../interfaces";
import { motion } from "framer-motion";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import common from "../../utils/common";
import { CSSProperties } from "react";

export const RainbowBoxDiv = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "borderWidth" && prop !== "borderRadius" && prop !== "fullWidth",
})<{
  borderWidth: string;
  borderRadius: string;
  fullWidth?: boolean | undefined;
}>(({ borderWidth, borderRadius, fullWidth }) => ({
  padding: borderWidth,
  borderRadius: borderRadius,
  overflow: "hidden",
  width: fullWidth ? "100%" : "fit-content",
  height: "fit-content",
}));

export const RainbowBackground = styled("div", {
  shouldForwardProp: (prop) => prop !== "visible",
})<{ visible: boolean }>(({ visible }) => ({
  position: "relative",
  zIndex: 1,
  "&&:after": {
    content: '""',
    position: "absolute",
    left: "calc(-50rem + 50%)",
    top: "calc(-50rem + 50%)",
    zIndex: 0,
    width: "100rem",
    height: "100rem",
    backgroundRepeat: "no-repeat",
    backgroundImage:
      visible === true
        ? "conic-gradient(from 0.31turn,rgb(90, 71, 211),rgb(53, 223, 75) 0.18turn,rgb(255, 178, 0) 0.47turn,rgb(239, 24, 174) 0.67turn,rgb(90, 71, 211))"
        : "none",
    animation: "1s linear 0s infinite normal none running rotate",
  },
  "@keyframes rotate": {
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

export const BackgroundShadow = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "borderwidth" &&
    prop !== "borderradius" &&
    prop !== "height" &&
    prop !== "width" &&
    prop !== "height" &&
    prop !== "shadow" &&
    prop !== "visible",
})<{
  borderwidth: string;
  borderradius: string;
  visible: boolean;
  height: number;
  width: number;
  shadow: boolean;
}>(({ borderradius, borderwidth, visible, width, height, shadow }) => ({
  width: width,
  height: height,
  padding: borderwidth,
  borderRadius: borderradius,
  position: "absolute",
  backgroundImage:
    visible === true
      ? "conic-gradient(from 0.31turn,rgb(90, 71, 211),rgb(53, 223, 75) 0.18turn,rgb(255, 178, 0) 0.47turn,rgb(239, 24, 174) 0.67turn,rgb(90, 71, 211))"
      : "none",
  filter: visible === true ? `blur(10px)` : "none",
  zIndex: 0,
  opacity: "1",
  display: shadow ? "block" : "none",
}));

export const GenericBox = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "Heightstyle",
})<{
  Heightstyle?: CSSProperties;
}>(({ Heightstyle }) => ({
  padding: "14px",
  width: "fit-content",
  boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.0367952)",
  borderRadius: "16px",
  // background:
  //   "linear-gradient(180deg, rgba(0, 255, 93, 0.02) 0%, rgba(0, 0, 0, 0.0061462) 100%), rgba(255, 255, 255, 0.05);",
  fontWeight: "bold",
  fontSize: "12px",
  textAlign: "center",
  cursor: "pointer",
  // fontFamily:"Inter",
  color: "#FFFFFF",
  margin: "auto",
  // "&:hover": {
  //   background:
  //     "linear-gradient(202.26deg, rgba(232, 142, 255, 0.096) -15.35%, rgba(0, 254, 224, 0.141346) 118.93%);",
  // },
  transitionTimingFunction: "cubic-bezier(0, 0.45, 0.36, 1)",
  transitionDuration: "0.3s",
  ...common.c_c_sb,
  ...Heightstyle,
}));

export const ImageContentBox = styled("img", {
  shouldForwardProp: (prop) =>
    prop !== "top" && prop !== "Opacity" && prop !== "Logo" && prop !== "Size",
})<{
  top?: boolean;
  Opacity?: boolean;
  Logo?: boolean;
  Size?: CSSProperties;
}>(({ top, Opacity, Logo, Size }) =>
  top
    ? { width: "7px", height: "13px" }
    : Opacity
    ? {
        fontWeight: 900,
        fontSize: "24px",
        lineHeight: "24px",
      }
    : Logo
    ? {
        height: "30px",
        width: "30px",
        borderRadius: "30px",
        marginRight: "5px",
      }
    : { width: "12px", height: "12px", ...Size }
);

export const ChartButtonGroup = styled(ToggleButtonGroup)(() => ({
  borderRadius: 0,
  "& .MuiToggleButton-root:not(:last-of-type)": {
    marginRight: "4px",
  },
  height: "72px",
  padding: "20px 20px 20px 20px",
  background: "rgba(236, 255, 239, 0.05)",
}));
export const ChartHeader = styled("div")(() => ({
  width: "100%",
  marginTop: "10px",
  marginBottom: "10px",
  ...common.r_c_sb,
}));
export const DefaultItemSpan = styled("span")<{
  FontSize?: CSSProperties;
  DisableNumber?: boolean;
  marginPlusColor?: boolean;
  LargeDisable?: boolean;
  OpcaityRight?: boolean;
  noMargin?: boolean;
}>(
  ({
    theme,
    DisableNumber,
    marginPlusColor,
    LargeDisable,
    OpcaityRight,
    noMargin,
    FontSize,
  }) =>
    DisableNumber
      ? { color: "#FFFF", marginRight: "2px" }
      : marginPlusColor
      ? {
          color: "rgba(255, 255, 255, 0.3)",
          fontSize: "10px",
          marginLeft: "2px",
          marginTop: "7px",
        }
      : noMargin
      ? {
          fontWeight: 400,
          fontSize: "13px",

          color: "#FFFFFF",
        }
      : LargeDisable
      ? {
          fontWeight: 400,
          fontSize: "13px",

          color: "rgba(255, 255, 255, 0.4)",
        }
      : OpcaityRight
      ? {
          color: "rgba(255, 255, 255, 0.37)",
          marginRight: "5px",
          fontWeight: 200,
          fontSize: "11px",
          letterSpacing: "0.5px",
          ...FontSize,
        }
      : {
          width: "100px",
          height: "20px",
          margin: "0 3px 0 0",
          opacity: "0.8",
          fontfamily: "SFProText",
          fontSize: "15px",
          fontWeight: 500,
          fontStretch: "normal",
          fontStyle: "normal",
          lineHeight: "normal",
          letterSpacing: " -0.41px",
          color: theme.palette.text.blackForest,
        }
);
export const SwitchTabDiv = styled(Tabs)(() => ({
  display: "flex",
  color: "#FFFF",
  backgroundColor: "transparent",
  position: "relative",
  overflow: "visible",
  // "& button:hover": { backgroundColor: "blue" },
  "& *": {
    overflow: "visible !important",
    animation: "none",
  },
}));

export const SwitchTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== "active",
})<isActive>(({ active }) => ({
  color: "rgba(0,0,0,0.4)",
  fontFamily: "PPMori",
  textTransform: "capitalize",
  padding: "12px",
  "& div": active
    ? { color: "black", backgroundColor: "rgba(0,0,0,0.2)" }
    : { color: "rgba(0,0,0,0.4)" },
  ...(!active && {
    "&:hover div": { backgroundColor: "rgba(0,0,0,0.1)", color: "white" },
  }),
}));

export const TabsWrapper = styled(Box)(() => ({
  width: "100%",
  flex: 1,
  minHeight: "40%",
  overflowY: "scroll",
  paddingTop: "15px",
}));

export const FlexBox = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "FlexStart" &&
    prop !== "onlyFlex" &&
    prop !== "paddingTrue" &&
    prop !== "Padding",
})<{
  FlexStart?: boolean;
  onlyFlex?: boolean;
  paddingTrue?: boolean;
  Padding?: boolean;
}>(({ FlexStart, onlyFlex, paddingTrue, Padding }) =>
  FlexStart
    ? { ...common.r_fs_fs }
    : onlyFlex
    ? {
        display: "flex",
      }
    : paddingTrue
    ? {
        padding: "0px",
        ...common.r_fs_sb,
      }
    : Padding
    ? {
        paddingBottom: "13px",
      }
    : {
        padding: "0px",
        position: "static",
        width: "225px",
        height: "44px",
        left: "102px",
        ...common.r_c_fe,
      }
);

export const DataBarContainer = styled("div")(() => ({
  paddingTop: "5px",
  ...common.r_c_c,
}));

export const Text = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "size" &&
    prop !== "weight" &&
    prop !== "primary" &&
    prop !== "dim" &&
    prop !== "lineHeight" &&
    prop !== "customColor" &&
    prop !== "opacity" &&
    prop !== "align" &&
    prop !== "customStyle" &&
    prop !== "isClickable",
})<{
  size?: number;
  weight?: number;
  primary?: boolean;
  dim?: boolean;
  lineHeight?: number | string;
  customColor?: string;
  customStyle?: CSSProperties;
  isNumber?: boolean;
  opacity?: number;
  align?: CSSProperties["textAlign"];
  isClickable?: boolean;
}>(
  ({
    theme,
    size = 15,
    weight = 500,
    primary = true,
    dim = false,
    lineHeight = "normal",
    customColor,
    opacity = 1,
    align = "left",
    customStyle,
    isClickable = false,
  }) => ({
    fontFamily: "PPMori", // this is working now
    fontWeight: weight,
    fontSize: size,
    lineHeight: lineHeight,
    opacity: dim ? 0.5 : opacity,
    textAlign: align,

    userSelect: isClickable ? "unset" : "none",
    WebkitUserSelect: isClickable ? "unset" : "none",
    MozUserSelect: isClickable ? "unset" : "none",
    msUserSelect: isClickable ? "unset" : "none",
    color: customColor
      ? customColor
      : primary
      ? dim
        ? theme.palette.text.dimPrimary
        : theme.palette.text.primary
      : dim
      ? theme.palette.text.dimSecondary
      : theme.palette.text.secondary,
    ...customStyle,
  })
);

export const UnStyledModal = styled(ModalUnstyled)<{
  top?: React.CSSProperties["top"];
}>(({ top }) => ({
  position: "fixed",
  zIndex: 1300,
  right: 0,
  bottom: 0,
  top: top || 0,
  left: 0,
  outline: "none",
  border: "none",

  ...common.r_c_c,
}));

export const Backdrop = styled("div")(() => ({
  position: "fixed",
  zIndex: -1,
  right: 0,
  bottom: 0,
  top: 0,
  left: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  WebkitTapHighlightColor: "transparent",
}));

export const AccordionSummaryStyled = styled(AccordionSummary)(({ theme }) => ({
  borderTop: "1.5px solid rgba(255,255,255,0.1)",
  backgroundColor: theme.palette.background.modal,
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(0deg)",
  },
  padding: "0px 0px 0px 8px",
}));

export const AccordionStyled = styled(Accordion)(() => ({
  boxShadow: "none",
}));

export const AccordionDetailsStyled = styled(AccordionDetails)(({ theme }) => ({
  color: "black",
  padding: 0,
  backgroundColor: theme.palette.background.modal,
}));

export const BottomLayoutStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "boxHeight",
})<{
  boxHeight?: number;
}>(({ theme, boxHeight }) => ({
  color: "white",
  zIndex: 2,
  height: boxHeight || "555px",
  border: "2px solid rgba(255,255,255,0.03)",
  outline: "none",
  borderRadius: "20px 20px 0px 0px",
  mixBlendMode: "normal",
  boxSizing: "border-box",
  boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.70206)",
  width: "100%",
  marginTop: "0px",

  paddingTop: "0px",
  background: theme.palette.background.bottomLayout,
  backgroundSize: "cover",
  overflowY: "hidden",
  position: "relative",
}));

export const PasswordBackStyled = styled("div")(() => ({
  backgroundColor: "rgba(255,255,255, 0.1)",
  width: "100%",
  height: 55,
}));

export const ConnectionBoxStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "initiallyAnimated",
})<{
  initiallyAnimated?: boolean;
}>(({ initiallyAnimated }) => ({
  position: "absolute",
  right: initiallyAnimated ? "-50px" : "15px",
  top: "15px",
}));

export const DashboardContainerStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "initiallyAnimated",
})<{
  initiallyAnimated?: boolean;
}>(({ initiallyAnimated }) => ({
  position: "fixed",
  top: initiallyAnimated ? 0 : -40,
  zIndex: 4,
  maxHeight: 40,
  height: 40,
  width: "100%",
  padding: "0px 10px",
  ...common.r_c_sb,
}));

export const ScreenHeaderStyled = styled(motion.div)(() => ({
  height: 50,
  padding: "0px 15px",
  position: "relative",
  overflow: "hidden",
  ...common.r_c_sb,
}));

export const PasswordBackdropStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "currentStep",
})<{
  currentStep?: number;
}>(({ currentStep }) => ({
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  height: "67%",
  width: "100%",
  position: "absolute",
  bottom: 0,
  opacity:
    currentStep === 2 || currentStep === 3 || currentStep === 4 ? 0.4 : 0.8,
}));

export const AnimatorStyled = styled(motion.div)(() => ({
  position: "absolute",
  width: "100%",
  bottom: -230,
  opacity: 0,
}));

export const PasswordInputStyled = styled("div")(() => ({
  backgroundColor: "rgba(0,0,0,0.2)",
  height: 50,
  borderRadius: 12,
  padding: "13px 20px",
  marginTop: "40px",
  width: "70%",
  ...common.r_c_fs,
}));

export const SwitchStyled = styled(Switch, {
  shouldForwardProp: (prop) => prop !== "isEditlist",
})<{
  isEditlist?: boolean;
}>(({ isEditlist }) => ({
  width: isEditlist ? 40 : 58,
  height: isEditlist ? 20 : 43,
  padding: isEditlist ? "0px" : "12px 5px 12px 12px",
  "& .MuiSwitch-switchBase": {
    margin: isEditlist ? 0 : 1,
    padding: isEditlist && "0px",
    "&.Mui-checked": {
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#2f2f34",
      },
    },
    "&.Mui-disabled": {
      "& + .MuiSwitch-track": {
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#2f2f34",
    borderRadius: isEditlist ? 20 / 2 : 43 / 2,
  },
}));

export const ModalParentBoxStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "width" && prop !== "height",
})<{
  width: CSSProperties["width"];
  height?: CSSProperties["height"];
}>(({ theme, width, height }) => ({
  backgroundColor: theme.palette.background.default,
  width,
  height,
  outline: "none",
  borderRadius: 12,
  padding: "10px 10px",
  border: "2px solid rgba(255,255,255,0.1)",
  overflow: "hidden",
}));

export const WrapperBackgroundStyled = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,

  ...common.c_c_fs,
}));
export const Search = styled("div", {
  shouldForwardProp: (prop) => prop !== "isFocused" && prop !== "lightMode",
})<{
  isFocused?: boolean;
  lightMode?: boolean;
}>(({ theme, isFocused, lightMode }) => ({
  position: "relative",
  borderRadius: "12px",
  backgroundColor: lightMode ? "transparent" : theme.palette.background.Box,
  width: "100%",
  fontSize: "16px",
  color: "#fff",
  border: isFocused
    ? `2px solid ${lightMode ? "black" : "#3E41C7"}`
    : `2px solid ${
        lightMode ? "rgba(0,0,0,0.08) " : "rgba(255, 255, 255, 0.08)"
      } `,
  padding: "6px 4px",
}));

export const DerivationPathOption = styled("div", {
  shouldForwardProp: (prop) => prop !== "isFocused" && prop !== "lightMode",
})<{
  isFocused?: boolean;
  lightMode?: boolean;
}>(({ theme, isFocused, lightMode }) => ({
  position: "relative",
  borderRadius: "12px",
  backgroundColor: lightMode ? "transparent" : theme.palette.background.Box,
  width: "100%",
  fontSize: "16px",
  color: "#fff",
  border: isFocused
    ? `2px solid ${lightMode ? "black" : "#3E41C7"}`
    : `2px solid ${
        lightMode ? "rgba(0,0,0,0.08) " : "rgba(255, 255, 255, 0.08)"
      } `,
  padding: "10px",
}));

export const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) =>
    prop !== "padding" && prop !== "inputStyle" && prop !== "lightMode",
})<{
  padding?: number;
  lightMode?: boolean;
  inputStyle?: CSSProperties;
}>(({ padding = 6, inputStyle, lightMode }) => ({
  color: lightMode ? "black" : "white",
  width: "100%",
  borderRadius: "12px",
  fontSize: "14px",
  fontFamily: "PPMori",
  fontWeight: "500",

  "& .MuiInputBase-input": {
    padding: `${padding}px`,
    width: "100%",
    fontFamily: "PPMori",
    ...inputStyle,
  },
  "& .MuiInputBase-input::placeholder": {
    color: lightMode ? "rgba(0,0,0,0.7)" : "#fff",
    fontSize: "13px",
    fontWeight: "400",
  },
}));

export const GenericBackgroundBox = styled("div", {
  shouldForwardProp: (prop) => prop !== "margintop",
})<{ margintop: number }>(({ margintop }) => ({
  width: "100%",
  height: "50px",
  borderRadius: "12px",
  margin: "auto",
  alignItems: "center",
  marginTop: `${margintop}px`,
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  textAlign: "start",
  display: "flex",
  alignSelf: "center",
}));

export const WrapperStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "value",
})<{ value: boolean }>(({ value }) => ({
  opacity: value ? 0.3 : 1,
  pointerEvents: value ? "none" : "all",
  overflowY: "scroll",
  width: "100%",
  flex: 1,
}));
export const StartAdornmentStyled = styled("span")(() => ({
  ...common.r_c_c,
  marginLeft: "10px",
}));
export const ButtonStyled = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "customColor" && prop !== "marginTop" && prop !== "customStyle",
})<{
  customColor: string;
  marginTop?: number;
  customStyle?: CSSProperties;
}>(({ customColor, marginTop, customStyle }) => ({
  background: customColor,
  width: "100%",
  margin: "auto",
  height: "40px",
  cursor: "pointer",
  borderRadius: "12px",
  marginTop: `${marginTop}px`,
  ...common.r_c_c,
  ...customStyle,
}));

export const AddressInsertionStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "height",
})<{
  height?: number;
}>(({ theme, height }) => ({
  backgroundColor: theme.palette.background.modal,
  width: "90%",
  height: height ?? "unset",
  outline: "none",
  borderRadius: 12,
  padding: "10px 10px",
  fontSize: "10px",
  background:
    "linear-gradient(64.47deg, rgba(255, 104, 133, 0.1) 0%, rgba(255, 104, 133, 0) 53.05%), linear-gradient(154.83deg, rgba(0, 81, 66, 0.2) 0%, rgba(0, 0, 0, 0) 97.87%), #181621",
}));

export const SearchLayout = styled("div")(() => ({
  maxWidth: "155px",
  paddingTop: "20px",
  height: "auto",

  ...common.c_c_c,
}));

export const StyledAmountInput = styled("input")(() => ({
  color: "#fff",
  fontSize: "32px",
  fontWeight: "500",
  textDecoration: "underline",
  paddingLeft: "0px !important",
  outline: "none",
  border: "none",
  textAlign: "center",
  background: "none",
  width: "90%",
  textDecorationColor: "#46454E",
  textUnderlineOffset: "5px",
  position: "relative",
  fontFamily: "PPMori",
  // borderBottom: "2px solid rgba(255,255,255,0.6)",
  "&::placeholder": {
    color: "#fff",
  },
}));

export const PanelBoxStyled = styled("div")(() => ({
  height: "60px",
  padding: "10px 0px",
  width: "100%",
  backgroundColor: "transparent",
  fontWeight: "400",
  ...common.c_fs_fs,
}));

export const SingleBoxStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "border",
})(() => ({
  width: "100%",

  ...common.r_c_sb,
}));
export const TransactionFeeStyled = styled("div")(() => ({
  width: "100%",
  margin: "auto",
  height: "220px",
  padding: "0px 0px",

  background: "#1a1a1a",
  borderRadius: "24px 24px 0px 0px",
  "&:focus-visible": {
    outline: "none",
  },
  ...common.c_c_c,
}));

export const RejectButtonStyled = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "width" && prop !== "left" && prop !== "isDim",
})<{
  width: number;
  left?: number;
  isDim?: boolean;
}>(({ width, left, isDim }) => ({
  backgroundColor: "none",

  width: width,
  padding: "0px 15px",
  color: "#70677A",
  marginRight: "auto",

  borderRadius: "10px",
  cursor: "pointer",
  marginLeft: `${left}px` || "20px",
  height: "44px",
  border: "2px solid rgba(255, 255, 255, 0.08)",
  opacity: isDim ? 0.3 : 1,
  "&:hover": {
    opacity: isDim ? 0.3 : 0.8,
  },
  ...common.r_c_c,
}));

export const AdvanceOptionStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "height",
})<{
  height: CSSProperties["height"];
}>(({ theme, height }) => ({
  width: "100%",
  height: height,
  background: theme.palette.background.darkColorModal,
  border: "none",
  outline: "none",
  color: "#fff",
  padding: "18px 20px",
  borderTopLeftRadius: "18px",
  borderTopRightRadius: "18px",
}));
export const BackgroundBoxStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "customColor" && prop !== "marginTop",
})<{
  height: number;
  marginTop?: number;
}>(({ height, marginTop }) => ({
  width: "100%",
  height: `${height}px`,
  backgroundColor: "#1e1a22",
  padding: "10px 4px",
  borderRadius: "17px",
  marginTop: `${marginTop}px`,
  marginBottom: "10px",
  ...common.r_c_sa,
}));
export const OptionBoxStyled = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ active }) => ({
  width: "max-content",
  height: "auto",
  padding: "8px 10px",
  cursor: "pointer",
  backgroundColor: `${active ? "rgba(255, 255, 255, 0.04)" : "none"}`,
  borderRadius: "12px",
  ...common.c_c_c,
}));
export const FooterStyled = styled("div")(() => ({
  ...common.r_c_fs,
}));

export const CustomBox = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "customColor" &&
    prop !== "marginTop" &&
    prop !== "backgroundColor" &&
    prop !== "borderRadius",
})<{
  height?: string;
  margin?: string;
  width?: string;
  padding?: string;
  backgroundColor?: string;
  borderRadius?: string;
}>(({ height, margin, padding, backgroundColor, borderRadius, width }) => ({
  width,
  height,
  backgroundColor,
  padding,
  borderRadius,
  margin,
}));

export const SwapTokenBoxStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "marginTop",
})<{ marginTop?: number }>(({ theme, marginTop }) => ({
  width: "100%",
  margin: "auto",
  marginTop: `${marginTop}px`,
  textAlign: "start",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
  // padding: "8px",
  paddingRight: "4px",
  ...common.r_c_fs,
}));

export const TokenValueBoxStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "boxWidth",
})<{ boxWidth: number }>(() => ({
  // width: `${boxWidth}%`,
  width: "auto",
  height: "100%",
  ...common.c_fs_sa,
  minWidth: "120px",
  maxWidth: "200px",
  paddingBottom: "0px",
  outline: "none",
  border: "none",
}));

export const TokenSelectionBoxStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "disabled",
})<{ disabled: boolean }>(({ disabled }) => ({
  cursor: "pointer",
  height: 40,
  marginLeft: "auto",
  borderRadius: "12px",
  padding: "0px 8px",
  maxWidth: "200px",
  alignSelf: "stretch",
  // minWidth: "120px",
  width: "min-content",
  backgroundColor: "rgba(255,255,255,0.04)",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  pointerEvents: disabled ? "none" : "auto",
  opacity: disabled ? 0.4 : 1,
  ...common.r_c_fe,
}));

export const BalanceBoxStyled = styled("div")(({ theme }) => ({
  width: "100%",
  margin: "auto",
  paddingTop: "10px",
  borderBottomLeftRadius: "14px",
  borderBottomRightRadius: "14px",
  ...common.r_c_sb,
}));

export const AccountSelectionModalStyled = styled("div")(() => ({
  height: "310px",
  width: "100%",
  border: "none",
  outline: "none",
  borderTopLeftRadius: "18px",
  borderTopRightRadius: "18px",
  background: "#191A22",
  overflowY: "scroll",
}));

export const SwapTokenFlipper = styled("div", {
  shouldForwardProp: (prop) => prop !== "disabled",
})<{ disabled: boolean }>(({ disabled }) => ({
  backgroundColor: "rgba(255,255,255,0.8)",
  padding: "7px 8px",
  borderRadius: 16,
  border: "4px solid black",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#37FE87",
  },
  pointerEvents: disabled ? "none" : "auto",
  opacity: disabled ? 0.4 : 1,
}));

export const AccordianWrapper = styled("div")(() => ({
  padding: "0px",
  width: "95%",
  margin: "auto",
  borderRadius: "20px",
  overflow: "hidden",
  marginTop: "20px",
}));

export const AccountSelectionAccordian = styled(Accordion)(() => ({
  boxShadow: "none",
  background: "none",
  width: "100%",
  "& 	.Mui-expanded": {
    minHeight: "55px !important",
  },
}));

export const AccountSelectionAccordionSummary = styled(AccordionSummary)(
  () => ({
    backgroundColor: "#24242C",
    minHeight: 40,
    maxHeight: 40,
    borderTopLeftRadius: "14px",
    borderTopRightRadius: "14px",
    borderBottom: " 2px solid rgba(255, 255, 255, 0.05)",
    "& 	.Mui-expanded": {
      minHeight: 30,
      maxHeight: 35,
      width: "100%",
      ...common.r_c_sb,
      borderBottomRightRadisu: "0px",
    },
  })
);

export const AccountSelectionAccordionDetails = styled(AccordionDetails)(
  () => ({
    backgroundColor: "#24242C",
    padding: 0,
  })
);

export const LeftBox = styled("div")(() => ({
  ...common.c_fs_c,
}));
export const RightBox = styled("div")(() => ({
  marginLeft: "auto",
  ...common.c_fe_c,
}));

export const ButtonDefault = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "onDarkBack" && prop !== "toggled" && prop !== "bright",
})<{
  onDarkBack?: boolean;
  bright?: boolean;
  dark?: boolean;
  toggled?: boolean;
  width?: number | string;
  height?: number | string;
  margin?: number | string;
  padding?: number | string;
  disabled?: boolean;
}>(({ onDarkBack, bright, dark, toggled, width, height, margin, padding }) => {
  let colorCode = "255,255,255";
  let colorOpacity = "0.04";
  if (onDarkBack) {
    if (toggled) {
      colorOpacity = "1";
    } else if (bright) {
      colorOpacity = "0.12";
    } else if (dark) {
      colorOpacity = "0.3";
      colorCode = "0,0,0";
    } else {
      colorOpacity = "0.08";
    }
  } else {
    if (toggled) {
      colorOpacity = "1";
    } else if (bright) {
      colorOpacity = "0.08";
    } else if (dark) {
      colorOpacity = "0.3";
      colorCode = "0,0,0";
    }
  }
  return {
    margin: margin ?? "0px",
    width: width ?? "100%",
    height: height,
    border: onDarkBack && dark ? "2px solid rgba(255,255,255,0.06)" : "none",
    backgroundColor: `rgba(${colorCode}, ${colorOpacity})`,
    borderRadius: "12px",
    padding: padding ?? "8px 12px",
    fontSize: "15px",
    fontWeight: 500,
    color: toggled ? "black" : "white",
    cursor: "pointer",
    boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.0367952)",
    textAlign: "center",
    ...common.r_c_c,
  };
});

export const AmountPercentageBtns = styled(ButtonDefault)(
  ({ toggled, disabled }) => ({
    padding: "6px 7px 4px 7px",
    borderRadius: 8,
    marginRight: 5,
    ...(!toggled && {
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.1)",
      },
    }),
    pointerEvents: disabled ? "none" : "auto",
    opacity: disabled ? 0.4 : 1,
  })
);

export const ListItemStyled = styled("div")(({ theme }) => ({
  width: "100%",
  padding: "10px 5px",
  borderRadius: "10px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.listItem,
  ...common.r_c_fs,
  "&:hover": {
    backgroundColor: theme.palette.background.listItemHoverColor,
  },
}));
export const ListItemValueBoxStyled = styled("div")(() => ({
  marginLeft: "auto",
  marginRight: "3px",
  ...common.r_c_c,
}));

export const NameBoxStyled = styled("div")(() => ({
  ...common.c_c_c,
}));

export const HeadingBox = styled("div")(() => ({
  height: "20px",
  ...common.r_c_c,
}));

export const ArrowStyled = styled("span", {
  shouldForwardProp: (prop) => prop !== "isExpanded",
})<{ isExpanded: boolean }>(({ theme, isExpanded }) => ({
  borderRadius: "50%",
  width: "22px",
  height: "22px",
  marginLeft: "12px",
  backgroundColor: "#2d2d32",
  transform: isExpanded ? "rotate(180deg)" : "unset",
  ...common.r_c_c,
  "&:hover": {
    backgroundColor: theme.palette.background.listItemHoverColor,
  },
}));

export const ChainHeading = styled("div")(({ theme }) => ({
  width: "100%",
  margin: "auto",
  padding: "0px 10px",
  height: "25px",
  borderRadius: "12px",
  cursor: "pointer",
  ...common.r_c_sb,
  "&:hover": {
    backgroundColor: theme.palette.background.listItemHoverColor,
  },
}));

export const TokenDetailBoxStyled = styled("div")(() => ({
  width: "100%",
  margin: "25px 0px 15px 0px",

  ...common.c_fs_c,
}));

export const PriceChangeStyled = styled("span", {
  shouldForwardProp: (prop) => prop !== "success",
})<{
  success: boolean;
}>(({ theme, success }) => ({
  color: success ? theme.palette.text.success : "red",
  opacity: 1.5,
}));
export const ButtonWrapper = styled("div")(() => ({
  width: "90%",
  margin: "auto",

  ...common.r_c_fs,
}));
export const ButtonBoxStyled = styled("button")(({ theme }) => ({
  backgroundColor: "rgba(255,255,255,0.04)",
  outline: "none",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  padding: "10px",
  margin: "5px 10px 5px 0px",
  ...common.r_c_fs,
  "&:hover": {
    backgroundColor: theme.palette.background.buttonHoverColor,
  },
}));

export const TitleStyled = styled("div")(() => ({
  width: "95%",
  margin: "auto",
  marginBottom: "15px",
  marginTop: "20px",
  ...common.c_fs_c,
}));

export const TxHistoryWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "height",
})<{
  height?: CSSProperties["height"];
}>(({ height }) => ({
  height: height,
  paddingTop: 10,
  paddingBottom: 20,
  overflowY: "scroll",
}));

export const StatsSection = styled("div")(() => ({
  height: "100%",
  width: "60%",
  ...common.c_fs_sa,
}));

export const ButtonSection = styled("div")(() => ({
  margin: "auto",
  marginTop: "10px",
  width: "90%",
  marginBottom: "10px",

  ...common.r_c_sb,
}));

export const RainbowButtonStyled = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "width" && prop !== "left" && prop !== "loading",
})<{
  width?: number;
  left?: number;
  loading?: boolean;
}>(({ width, left, loading }) => ({
  width: width ? width : "100%",
  marginLeft: `${left}px` || "0px",
  height: 44,
  padding: "2px",
  borderRadius: "14px",
  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.396689)",
  mixBlendMode: "normal",
  rotate: "360deg",
  cursor: "pointer !important",
  pointerEvents: loading ? "none" : "auto",
  opacity: loading ? 0.4 : 1,
  background:
    "conic-gradient(from 90deg at 50% 50%, #EF18AE -9.1deg, #5A47D3 8.59deg, #35DF4B 171.41deg, #FFB200 188.48deg, #EF18AE 350.9deg, #5A47D3 368.59deg)",
  ...common.r_c_c,
}));

export const ApproveButtonStyled = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "width" && prop !== "left" && prop !== "loading",
})<{
  width?: number;
  left?: number;
  loading?: boolean;
}>(({ width, left, loading }) => ({
  width: width ? width : "100%",
  marginLeft: `${left}px` || "0px",
  height: 44,
  padding: "2px",
  borderRadius: "14px",
  cursor: "pointer !important",
  pointerEvents: loading ? "none" : "auto",
  opacity: loading ? 0.4 : 1,
  background: "rgba(255, 255, 255, 0.04)",
  ...common.r_c_c,
}));

export const SpanOpacityStyled = styled("span", {
  shouldForwardProp: (prop) => prop !== "opacity",
})<{
  opacity: number;
}>(({ opacity }) => ({
  opacity: opacity,
}));

export const InternalRainbowBoxStyled = styled("div")<{
  isHoldFinish?: boolean;
}>(({ isHoldFinish }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "12px",
  position: "relative",
  cursor: "pointer",
  overflow: "hidden",
  background: `linear-gradient(225deg,rgba(123, 0, 254, 0.120144) 0%, rgba(166, 246, 0, 0.0962751) 100%), ${
    isHoldFinish ? "#191721" : "#191721d4"
  }`,
}));

export const WalletWrapperStyled = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.walletWrapper,
  borderRadius: "12px",
  padding: "5px",
  marginBottom: "10px",
  // border: "2px red solid",
}));

export const AddressBox = styled("div", {
  shouldForwardProp: (prop) => prop !== "iscopied",
})<{
  iscopied: boolean;
}>(({ theme, iscopied }) => ({
  fontSize: "12px",
  fontWeight: 400,
  borderRadius: "10px",
  padding: "5px",
  backgroundColor: iscopied ? "#fff" : theme.palette.background.listItem,
  cursor: "pointer",
  color: iscopied ? "#000" : "#fff",
  opacity: 0.9,
}));

export const TestnetSwitchButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "isTestnet",
})<{ isTestnet: boolean }>(({ isTestnet }) => ({
  outline: "none",
  border: "none",
  borderRadius: "10px",
  backgroundColor: isTestnet ? "#fff" : "rgba(255,255,255,0.08)",
  padding: "10px",
  paddingTop: "6px",
  paddingBottom: "6px",
  fontSize: "14px",
  weight: 400,
  color: isTestnet ? "#000" : "#fff",
  marginTop: "10px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
  marginRight: "auto",
  fontFamily: "PPMori !important",
}));

export const IconAvatar = styled(Avatar)(() => ({
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  width: 45,
  height: 45,
  marginBottom: "16px",
}));
export const TokenStatusLabelStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "isModal",
})<{
  isModal?: boolean;
}>(() => ({
  borderBottom: "2px solid rgba(255,255,255,0.1)",
  marginLeft: "0px",
  marginRight: "0px",
  paddingTop: "24px",
  paddingBottom: "12px",
}));
export const ListWrapper = styled("div")(() => ({
  width: "100%",
  margin: "auto",
  marginTop: "10px",
  cursor: "pointer",
  height: "350px",
  overflowY: "scroll",
}));

export const BoxRow = styled("div", {
  shouldForwardProp: (prop) => prop !== "disabled",
})<{
  disabled?: boolean;
}>(({ theme, disabled }) => ({
  background: "rgba(255, 255, 255, 0.04)",
  padding: "10px",
  borderRadius: "12px",
  margin: "15px 0px",
  height: "50px",
  cursor: "pointer",
  pointerEvents: disabled ? "none" : "auto",
  opacity: disabled ? 0.5 : 1,
  "&:hover": {
    background: theme.palette.background.boxRowHoverColor,
  },
  ...common.r_c_sb,
}));

export const AccountScreenWrapper = styled("div")(() => ({
  width: "95%",
  margin: "auto",
  ...common.c_fs_fs,
}));

export const NewBottomLayout = styled("div")(() => ({
  zIndex: 100,
  borderTopLeftRadius: "20px",
  borderTopRightRadius: "20px",
  width: "100%",
  backgroundColor: "#121212",
  overflowY: "auto",
  padding: "0px 15px",
  position: "relative",
  height: "100%",
  ...common.c_fs_fs,
  // boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.7)",
}));

export const RevealModalWrapper = styled("div")(() => ({
  width: "100%",
  margin: "auto",
  outline: "none",
}));
export const AccountsAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(() => ({
  // "&:not(:first-of-type)": {
  //   borderBottom: 0,
  //   paddingBottom: 10,
  // },
  "&:before": {
    display: "none",
  },
  backgroundColor: "transparent",
  paddingTop: 10,
  cursor: "pointer",
}));
export const AccountsAccordionDetails = styled(AccordionDetails)(() => ({
  padding: "0px 7px",
}));

export const TokensAccordion = styled(
  (props: AccordionProps & { myref: any }) => {
    const { myref, ...others } = props;

    return (
      <Accordion disableGutters elevation={0} square {...others} ref={myref} />
    );
  }
)(() => ({
  overflow: "hidden",

  "&:first-of-type": {
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  },
  "&:last-child": {
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
  },
  "&:not(:last-child)": {
    borderBottom: 0,
    marginBottom: 1,
  },
  "&:before": {
    display: "none",
  },
  backgroundColor: "transparent",
  boxShadow: "0px 16px 24px rgba(0, 0, 0, 0.1)",
}));

export const TokensAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary {...props} />
))(() => ({
  padding: 0,
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
}));
export const TokensAccordionDetails = styled(AccordionDetails)(() => ({
  padding: "0px 0px 10px 0px",
  backgroundColor: "rgba(255,255,255,0.04)",
}));
export const ChainAccordion = styled((props: AccordionProps) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(() => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  backgroundColor: "transparent",
  margin: "10px 0",
}));
export const ChainAccordionSummary = styled((props: AccordionSummaryProps) => (
  <AccordionSummary {...props} />
))(() => ({
  padding: 0,
  backgroundColor: "transparent",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
  borderRadius: "10px",
  minHeight: "10px",
}));
export const ChainAccordionDetails = styled(AccordionDetails)(() => ({
  padding: 0,
  marginTop: 5,
}));
export const StyledSnackBar = styled(Snackbar)(({ theme }) => ({
  "&.MuiSnackbar-root": {
    background: theme.palette.background.snackbar,
    transition: "all  0.5s",
    width: "380px",
    margin: "auto",
    left: "0px",
    bottom: "-3px",
    color: "#fff",
    borderRadius: "24px 24px 0px 0px",
  },
}));
export const SnackBarWrapper = styled("div")(() => ({
  width: "380px",
  height: "100%",
  borderRadius: "24px 24px 0px 0px",
}));
export const DarkBackgroundStyled = styled("div")(() => ({
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  backgroundColor: "black",
  position: "relative",
}));
export const SnackbarTopLayoutStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "height",
})<{ height: number }>(({ height }) => ({
  width: "100%",
  height: height,
  paddingTop: "0px",
  borderRadius: "24px 24px 0px 0px",
}));
export const SnackBarHeaderStyled = styled("div")(() => ({
  width: "100%",
  height: "50px",
  padding: "0px 15px",
  borderRadius: "24px 24px 0px 0px",
}));
export const RainbowStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "height" && prop !== "width",
})<{
  height?: number;
  width?: number;
}>(({ height, width }) => ({
  background:
    "conic-gradient(from 90deg at 50% 50%, #EF18AE -9.1deg, #5A47D3 8.59deg, #35DF4B 171.41deg, #FFB200 188.48deg, #EF18AE 350.9deg, #5A47D3 368.59deg)",
  width: width || "fit-content",
  height: height || "fit-content",
  borderRadius: "50%",
  padding: height ? "0px" : "3px",
  rotate: "360deg",
  ...common.r_c_c,
  animation: "1s linear 0s infinite normal none running rotate",
  "@keyframes rotate": {
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

export const CrossIconWrapper = styled("div")(({ theme }) => ({
  padding: "0px",
  borderRadius: "12px",
  width: "40px",
  height: "40px",
  cursor: "pointer",
  background: theme.palette.background.listItem,
  ...common.r_c_c,
}));

export const GradientDivider = styled("div")(() => ({
  background:
    "linear-gradient(90deg, #5A47D3 0%, #35DF4B 25%, #FFB200 47.92%, #EF18AE 71.35%, #5A47D3 100%)",
  width: "100%",
  height: "5px",
  rotate: "360deg",

  animation: "1s linear 0s infinite translate",
  position: "relative",

  "@keyframes translate": {
    "0%": {
      transform: "translate(0,0)",
    },
    "100%": {
      transform: "translate(-100%,0)",
    },
  },
}));
export const GradientDivider2 = styled("div")(() => ({
  background:
    "linear-gradient(90deg, #5A47D3 0%, #35DF4B 25%, #FFB200 47.92%, #EF18AE 71.35%, #5A47D3 100%)",
  width: "100%",
  height: "5px",
  rotate: "360deg",
  position: "absolute",
  top: "0px",
  animation: "1s linear  infinite translate1",

  "@keyframes translate1": {
    "0%": {
      transform: "translate(100%,0)",
    },
    "100%": {
      transform: "translate(0,0)",
    },
  },
}));
export const SnackBarBottomLayoutStyled = styled("div")(() => ({
  width: "90%",
  height: "auto",
  margin: "auto",
  marginTop: "10px",
}));

export const TokenChipBoxWrapper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.tokenChipBox,
  width: "100%",
  padding: "6px 12px",
  borderRadius: "8px",
  ...common.r_c_sb,
}));
export const TokenBoxWrapper = styled("div")(() => ({
  width: "100%",
  margin: "auto",
  padding: "5px 0px",
  ...common.r_c_c,
}));
export const StyledButton = styled(Button)(() => ({
  color: "#fff",
  borderRadius: "12px",
  border: "none",
  backgroundColor: "rgba(255, 255, 255, 0.1)",

  fontWeight: "400",
  marginRight: "10px",
  cursor: "pointer",
  fontFamily: "PPMori",
}));
export const SnackBarHeaderCompletedStateWrapper = styled("div")(() => ({
  height: "67px",
  borderRadius: "24px 24px 0px 0px",
  paddingLeft: "10px",
  background:
    "linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(42.64% 34.19% at 8.41% 18.15%, #F3A63B 0%, rgba(128, 219, 157, 0) 100%),radial-gradient(76.14% 150.51% at 100% 100%, #484EEC 0%, rgba(96, 210, 133, 0) 100%), radial-gradient(61.59% 49.39% at 80% 13.09%, #60D285 51.56%, #EA88BC 100%),linear-gradient(91.52deg, #F3A63B 24.67%, rgba(103, 107, 239, 0) 63.45%, rgba(72, 78, 236, 0) 82.57%)",
  ...common.r_c_fs,
}));
export const AmountBoxStyled = styled("div")(() => ({
  // paddingTop: "10px",

  width: "100%",
  ...common.r_c_fs,
}));
export const ActivityBoxWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  margin: "1px auto",

  borderRadius: "12px",
  background: theme.palette.background.listItem,
  cursor: "pointer",
}));
export const MarginWrapper = styled("div")(() => ({
  padding: "0px 12px 12px",
}));

export const TransactionFeeBodyLayout = styled("div")(() => ({
  height: "70%",
  width: "90%",
  margin: "auto",
  marginTop: "20px",
  ...common.r_c_sa,
}));

export const CodeButton = styled("button")(() => ({
  width: "28px",
  height: "28px",
  background: "#000000",
  borderRadius: "50%",
  padding: "4px 3px 4px 3px",
  position: "absolute",
  top: "-13px",
  right: "104px",
  border: "none",
  outline: "none",
  cursor: "pointer",
  boxShadow: "0px 4px 4px 0px #00000040",
  ...common.r_c_c,
}));

export const EditButton = styled("button")(() => ({
  width: "64px",
  height: "28px",
  background: "#BFBFBF",
  borderRadius: "24px",
  padding: "4px 3px 4px 3px",
  position: "absolute",
  top: "-13px",
  right: "28px",
  border: "none",
  outline: "none",
  cursor: "pointer",
  boxShadow: `0px 6px 6px 0px #00000080`,
  ...common.r_c_sa,
}));

export const ChartWrapper = styled("div")(
  ({ showGraph }: { showGraph: boolean }) => ({
    marginLeft: -15,
    height: showGraph ? 127 : 0,
    opacity: showGraph ? 1 : 0,
  })
);

export const HexDataWrapper = styled("div")(() => ({
  width: "100%",
  height: "70%",
  margin: "auto",
  textAlign: "center",
  padding: "0px 15px",
  ...common.c_fs_fs,
}));

export const DefaultButton = styled("button", {
  shouldForwardProp: (prop) =>
    prop !== "lightMode" && prop !== "contained" && prop !== "isHover",
})<{
  lightMode?: boolean;
  contained?: boolean;
  isHover?: boolean;
}>(({ lightMode = false, contained = false, isHover = true }) => ({
  width: "fit-content",
  height: "40px",
  padding: "0px 12px",
  outline: "none",
  borderRadius: "12px",
  fontFamily: "PPMori",
  color: lightMode ? "#000" : "#fff",
  cursor: "pointer",
  ...(contained
    ? {
        background: "transparent",
        border: "1px solid rgba(0,0,0,0.3)",
      }
    : {
        background: lightMode
          ? "rgba(0, 0, 0, 0.08)"
          : "rgba(255, 255, 255, 0.04)", //
        border: "1px solid rgba(255, 255, 255, 0.04)",
      }),
  ...common.r_c_c,
  "&:hover": isHover
    ? {
        background: lightMode
          ? "rgba(0, 0, 0, 0.4) !important"
          : "rgba(255, 255, 255, 0.1) !important",
      }
    : {},
}));

export const BottomBasicStyledModal = styled("button", {
  shouldForwardProp: (prop) => prop !== "gradient",
})<{
  gradient?: boolean;
}>(({ gradient = false }) => ({
  background: gradient
    ? "linear-gradient(180deg, rgba(255, 55, 94, 0.2) 0%, rgba(255, 55, 94, 0) 54.21%), #DEDEDE"
    : "#DEDEDE",
  width: "100%",
  height: "auto",
  borderRadius: "20px 20px 0px 0px",
  padding: "15px",
  border: "none",
  outline: "none",
  bottom: "0px",
  position: "absolute",
}));

export const ContentEditableBox = styled("input")(() => ({
  background: "rgba(0, 0, 0, 0.04)",
  borderRadius: "12px",
  padding: "12px",
  color: "#000000",
  marginTop: "12px",
  textAlign: "start",
  width: "100%",
  outline: "none",
  fontFamily: "PPMori",
}));

export const TokenTileWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "ActiveTokenInEditList",
})<{
  ActiveTokenInEditList?: boolean;
}>(({ ActiveTokenInEditList = false }) => ({
  width: "100%",
  padding: 10,
  // backgroundColor: `rgba(255, 255, 255, ${
  //   ActiveTokenInEditList ? 0.95 : 0.04
  // })`,
  backgroundColor: ActiveTokenInEditList
    ? "#DEDEDE"
    : "rgba(255, 255, 255, 0.04)",
  ...common.r_c_c,
}));

export const PlainColorBoxStyled = styled("div", {
  shouldForwardProp: (prop) => prop !== "lightMode",
})<{ lightMode: boolean }>(({ theme, lightMode }) => ({
  background: lightMode ? "#fff" : theme.palette.background.default,
  padding: "8px 24px",
  border: lightMode ? "2px solid #000" : "2px solid rgba(255,255,255,0.2)",
  width: "100%",
  height: "85px",
  cursor: "pointer",
  borderRadius: "12px",
  zIndex: 1,

  ...common.c_fs_c,
}));

export const NoteTextStyled = styled(motion.div)(() => ({
  margin: "auto",
  marginTop: "0px",
  color: "#fff",
  width: "90%",
  opacity: "0.5",
  lineHeight: "1.5",
}));

export const HoverableButton = styled("button")<{
  isButtonDisabled?: boolean;
}>(({ theme, isButtonDisabled }) => ({
  padding: "12px 16px",
  zIndex: 1,

  borderRadius: "12px",
  outline: "none",
  background: "#fff",
  cursor: isButtonDisabled ? "not-allowed" : "pointer",
  border: "1px solid #fff",
  opacity: isButtonDisabled ? 0.3 : 1,
  color: theme.palette.text.black,
  fontFamily: "PPMori",
  ...(!isButtonDisabled && {
    ":hover": {
      background: "transparent",
      color: theme.palette.text.white,
    },
  }),
  ...common.r_c_c,
}));

export const TickerBackgroundStyled = styled(motion.div)(() => ({
  position: "absolute",
  top: "0",
  width: "100%",
  height: "100%",
  background: " rgba(34, 255, 149, 0.8)",
  borderRadius: "12px",
  ...common.r_c_c,
  zIndex: -1,
}));

export const Circle = styled("div")(() => ({
  background: "#fff",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  ...common.r_c_c,
}));

export const DefaultWalletBoxWrapper = styled("div")(() => ({
  border: "2px solid rgba(255,255,255,0.2)",
  width: "100%",
  borderRadius: "12px",
  padding: "8px 12px",
}));
export const TextArea = styled("textarea")(({ theme }) => ({
  height: "125px",
  width: "100%",
  border: "none",
  outline: "none",
  borderRadius: "12px",
  padding: "12px 16px",
  background: "rgba(255, 255, 255, 0.1)",
  color: theme.palette.text.white,
  resize: "none",
  marginBottom: "30px",
  lineHeight: 2.5,
  position: "relative",
  fontFamily: "PPmori ",
}));

export const DisclaimerWrapper = styled("div")(({ theme }) => ({
  padding: "12px 16px",
  background: "#320010",
  height: "600px",
  overflowY: "scroll",
  ...common.c_fs_fs,
}));

export const EmptyAddressStyled = styled("div")(({ theme }) => ({
  width: "100%",
  paddingTop: "40px",
  ...common.c_c_c,
}));
