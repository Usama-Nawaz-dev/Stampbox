import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import colors from "../../../../constant/colors";
import { MainHeader, HtmlTag } from "../../../../components";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import TimeAgo from "../../../../components/TimeAgo";
import ThemeContext from "../../../Context/ThemeContext";
// import { dark as theme } from "../../../../constant/colorsConfig";
import AppText from "../../../../components/AppText";

export function ActivityLogScreen(props) {
  const [logsData, setLogsData] = useState(null);

  // pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchLogs();
  }, []);
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const fetchLogs = async () => {
    const response = await MindAxios.get(Env.createUrl(`logs`));
    // console.log("response????????", response?.data?.result);
    if (response?.status == 200) {
      let logs = response?.data?.result?.logs?.data;
      const nextPageUrl = response?.data?.result?.logs?.next_page_url;
      setLogsData(logs);
      console.log("data", logs);
      setNextApiUrl(nextPageUrl);
    }
  };

  const getNextApiUrl = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(nextApiUrl);
      setIsLoading(false);
      if (response?.status == 200) {
        const _data = response?.data?.result?.logs?.data;
        const nextPageUrl = response?.data?.result?.logs?.next_page_url;
        setLogsData([...logsData, ..._data]);
        setNextApiUrl(nextPageUrl);
      } else {
        setNextApiUrl(null);
        setIsLoading(false);
        alert("Sever Error..");
      }
    }
  };
  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 20, bottom: hp(5) }}
        />
      </View>
    ) : null;
  };
  const LogCard = (item, index) => {
    let isEnd = logsData.length - 1 === index;
    return (
      <>
        <View
          style={[
            styles.cardView,
            {
              marginBottom: isEnd ? hp(10) : 0,
              backgroundColor: theme?.cardColor,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <AppText style={styles.cardText}>{item?.log_name} </AppText>
            <HtmlTag
              description={item?.description}
              style={{ fontSize: 15, color: theme?.black, fontWeight: "bold" }}
            />
            <AppText> in {item?.causer_type}</AppText>
          </View>

          <TimeAgo
            time={item?.created_at}
            style={[styles.cardText, { alignSelf: "flex-end", marginTop: 12 }]}
          />
        </View>
      </>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Activity Logs"
        onPressBack={() => props.navigation.goBack()}
      />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            getNextApiUrl();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={{ alignItems: "center" }}>
          {logsData ? (
            logsData?.map((item, index) => LogCard(item, index))
          ) : (
            <View
              style={{
                height: hp(80),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText>No log found.</AppText>
            </View>
          )}
        </View>
        {renderFooter()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  cardView: {
    width: wp(95),
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    padding: 12,
    marginTop: 12,
    borderRadius: 5,
  },
  cardText: {
    fontSize: 14,
    // color: colors.cBlack,
  },
  htmlText: {
    fontSize: 15,
    color: colors.cBlack,
    fontWeight: "bold",
  },
});
