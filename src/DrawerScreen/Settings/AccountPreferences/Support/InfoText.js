import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { styles } from "./styles";
import ThemeContext from "../../../../Context/ThemeContext";
import Helper from "../../../../Helper";

export const InfoText = ({
  title,
  body,
  fontWeight,
  fontSize,
  top,
  txtPadding,
  extraInfo,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Text
        style={[
          styles.txtBody,
          {
            color: theme.darkGrey,
            textAlign: "left",
            marginTop: !top ? 10 : 0,
            fontWeight: "500",
            fontSize: fontSize ? fontSize : 13,
            paddingHorizontal: txtPadding ? txtPadding : 10,
          },
        ]}
      >
        {title}
      </Text>
      {extraInfo ? (
        <Text
          style={[
            styles.txtBody,
            {
              color: theme.davyGrey,
              textAlign: "left",
              marginBottom: 5,
              fontWeight: fontWeight ? fontWeight : "400",
              fontSize: 11,
              paddingHorizontal: txtPadding ? txtPadding : 10,
            },
          ]}
        >
          540 views | 05 comments | 3 helpful
        </Text>
      ) : null}

      <Text
        style={[
          styles.txtBody,
          {
            color: theme.davyGrey,
            textAlign: "left",
            marginTop: 5,
            fontWeight: fontWeight ? fontWeight : "400",
            fontSize: fontSize ? fontSize : 13,
            paddingHorizontal: txtPadding ? txtPadding : 10,
          },
        ]}
      >
        {Helper.extarctStringFromHtml(body)}
      </Text>
    </>
  );
};
