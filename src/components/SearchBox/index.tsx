import { FC, useState } from "react";

import { SearchBarProps as PROPS } from "interfaces";
import { Search, StyledInputBase } from "@styled";
import { useAppDispatch } from "store/store";
import { setSelectedInputId } from "@slices/appSlice";

const SearchBar: FC<PROPS> = ({
  placeholder,
  onChange,
  value,
  customPadding,
  StartAdornment,
  EndAdornment,
  name,
  disable,
  containerStyle = {},
  type = "text",
  id,
  lightMode = false,
  autoFocus,
}) => {
  const [isFieldFocused, setIsFieldFocused] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <Search
      style={containerStyle}
      lightMode={lightMode}
      isFocused={isFieldFocused}
    >
      <StyledInputBase
        id={id}
        placeholder={placeholder}
        onFocusCapture={() => dispatch(setSelectedInputId(id ?? ""))}
        type={type}
        inputProps={{
          "aria-label": "search",
          maxLength: "300",
        }}
        value={value}
        name={name}
        onChange={onChange}
        padding={customPadding}
        lightMode={lightMode}
        startAdornment={StartAdornment}
        endAdornment={EndAdornment}
        autoComplete="off"
        readOnly={disable}
        onBlur={() => {
          setIsFieldFocused(false);
        }}
        onFocus={() => {
          setIsFieldFocused(true);
        }}
        autoFocus={autoFocus}
      />
    </Search>
  );
};

export default SearchBar;
