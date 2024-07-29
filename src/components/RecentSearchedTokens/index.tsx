import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

import { Text } from "@styled";
import { useAppDispatch, useAppSelector } from "store/store";
import { SetStateStringType } from "interfaces";
import { deleteRecentSearchedKeywords } from "@slices/appSlice";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

type Props = {
  setValue: SetStateStringType;
};

const RecentSearchedTokens = ({ setValue }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { recentSearchedKeywords } = useAppSelector((state) => state.app);

  const handleDelete = (chipToDelete: string) => {
    dispatch(deleteRecentSearchedKeywords(chipToDelete));
  };

  const handleClick = (chipToSearch: string) => {
    setValue(chipToSearch);
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: "15px",
      }}
    >
      <Text
        className="f-body-sm "
        dim={true}
        style={{ margin: "auto", width: "95%" }}
      >
        Recent
      </Text>

      <Paper
        sx={{
          display: "flex",
          justifyContent: "start",
          flexWrap: "wrap",
          listStyle: "none",
          p: "4px 0px",
          m: 0,
          mb: 0.5,
          backgroundColor: theme.palette.background.bottomLayout,
          background: theme.palette.background.bottomLayout,
        }}
        component="ul"
        elevation={0}
      >
        {recentSearchedKeywords.slice(0, 7).map((label, index) => {
          return (
            <ListItem key={index}>
              <Chip
                className="f-body"
                label={label.toUpperCase()}
                onDelete={() => {
                  handleDelete(label);
                }}
                size="small"
                clickable
                onClick={() => {
                  handleClick(label);
                }}
                style={{ fontFamily: "PPMori" }}
              />
            </ListItem>
          );
        })}
      </Paper>
    </div>
  );
};

export default RecentSearchedTokens;
