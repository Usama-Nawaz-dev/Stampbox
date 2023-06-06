import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Empty from "../../../components/Empty";
import AppText from "../../../components/AppText";
import UserProfileIImage from "../../../components/UserProfileIImage";
import colors from "../../../constant/colors";
import ThemeContext from "../../Context/ThemeContext";

const { width } = Dimensions.get("window");

const TimelineCard = (props) => {
  const { tab, data } = props;
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  // let createdAt = moment(data?.created_at).format("YYYY-MM-DD [at] h:mmA");
  return (
    <View
      style={{
        width: width,
        // backgroundColor: name == "All" ? "orange" : "skyblue",
      }}
    >
      {data ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {data?.map((item, index) => {
              let createdAt = moment(item?.created_at).format(
                "DD-MM-YYYY [at] h:mmA"
              );
              let last = index == data?.length - 1;
              return (
                <>
                  {item?.activity ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          height: 30,
                          width: "45%",
                          // backgroundColor: "orange",
                          margin: 2,
                          justifyContent: "center",
                        }}
                      >
                        <AppText>{createdAt}</AppText>
                      </View>
                      <View
                        style={{
                          height: 30,
                          width: "10%",
                          // backgroundColor: "purple",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            borderStyle: "dashed",
                            borderWidth: 0.5,
                            borderRadius: 100,
                            height: 20,
                            width: 20,
                            borderColor: theme?.black,
                            // marginLeft: 10,
                          }}
                        />
                        {!last ? (
                          <View
                            style={{
                              height: 15,
                              position: "absolute",
                              borderStyle: "dashed",
                              borderWidth: 0.4,
                              borderColor: theme?.black,
                              top: 25,
                            }}
                          />
                        ) : null}
                      </View>

                      <View
                        style={{
                          marginLeft: 8,
                          width: "40%",
                          // backgroundColor: "pink",
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{ fontWeight: "600", color: theme?.black }}
                        >
                          {item?.activity}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <Empty />
      )}
    </View>
  );
};

export { TimelineCard };

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginTop: 10,
    width: wp(90),
  },
  innerContainer: {
    backgroundColor: colors.white,
    borderColor: colors.theme,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  typeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
});
