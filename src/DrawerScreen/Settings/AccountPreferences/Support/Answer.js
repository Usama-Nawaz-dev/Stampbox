import { Text, View } from "react-native";
import React, { useContext } from "react";
import { styles } from "./styles";
import ThemeContext from "../../../../Context/ThemeContext";
import { User } from "./User";
import { helpDescription } from "./utils";
import { Reply } from "./Reply";
import { Ask } from "./Ask";
import colors from "../../../../../constant/colors";

export const Answer = ({ show, prev, last }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={{
        backgroundColor: prev ? theme.cardColorLight : theme.cardColor,
        borderTopLeftRadius: prev ? 0 : 10,
        borderTopRightRadius: prev ? 0 : 10,
      }}
    >
      <User top={10} left={13} />
      <View
        style={{
          //   height: 150,
          width: "84%",
          alignSelf: "flex-end",
          paddingRight: 10,
          //   backgroundColor: theme.cardColor,
        }}
      >
        <Text
          style={[
            styles.txtBody,
            {
              color: theme.davyGrey,
              textAlign: "left",
              paddingHorizontal: 0,
              //   marginTop: 5,
              //   fontWeight: "400",
              fontSize: 13,
            },
          ]}
        >
          {helpDescription}
        </Text>
        {show ? (
          <>
            <Reply theme={theme} />
            <Ask theme={theme} />
          </>
        ) : (
          <Text style={{ marginTop: 10, fontSize: 12, color: theme.black }}>
            Reply
          </Text>
        )}
      </View>
      {prev && !last ? (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: theme.cardColor,
            marginTop: 5,
          }}
        />
      ) : (
        <View
          style={{
            height: 10,
            backgroundColor: "transparent",
            // overflow: "hidden",
          }}
        />
      )}
    </View>
  );
};
