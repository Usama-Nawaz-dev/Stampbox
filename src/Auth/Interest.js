import {
  Text,
  View,
  Switch,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";

import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import { countries } from "../../constant/staticData";
import SelectedItems from "../../components/SelectedItems";

import Env from "../../api/Env";
import allActions from "../../redux/actions";
import MindAxios from "../../api/MindAxios";
import { useDispatch } from "react-redux";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import AuthContext from "../Context/AuthContext";
import { BoardingHeader, SearchFilter } from "../../components";
import ThemeContext from "../Context/ThemeContext";

const Interest = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  countries.map((item, index) => {
    item.id = index + 1;
  });

  const [current, setCurrent] = useState([]);
  const [Data, setData] = useState(countries);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedList, setSelectedList] = useState([]);

  const removeItem = (item) => {
    let filteredData = current.filter(function (el) {
      return el !== item;
    });
    setCurrent(filteredData);
  };

  const removeValues = (item) => {
    let filteredData = selectedList.filter(function (el) {
      return el !== item;
    });
    setSelectedList(filteredData);
    advanceSearch(filteredData);
  };

  const searchData = (x) => {
    let text = x.toLowerCase();

    let filteredName = countries.filter((item) => {
      return item.value.toLowerCase().match(text);
    });
    setData(filteredName);
  };

  const next = async () => {
    if (current?.length > 0) {
      dispatch(allActions.DataAction.AppLoader(true));
      var result = countries.filter(function (item1) {
        return current.some(function (item2) {
          return item1.value === item2; // return the ones with equal id
        });
      });
      let reqData = [];
      if (result?.length > 0) {
        result.forEach((item) => reqData.push(item.id));
      }
      let body = {
        country_ids: reqData,
      };
      const response = await MindAxios.post(
        Env.createUrl("countries/select"),
        body
      );
      // console.log("res", response);
      if (response?.status == 200) {
        dispatch(allActions.DataAction.AppLoader(false));
        navigation.navigate("follow");
      }
    } else {
      alert("Please Select at least 1 Country to go Next!");
    }
  };

  const letters = (() => {
    const caps = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));
    return caps;
  })();

  const otherSearch = (newItem) => {
    let valList = [];
    if (!selectedList.find((item) => item === newItem)) {
      valList = [...selectedList, newItem];
      setSelectedList(valList);
      advanceSearch(valList);
    }
  };

  const advanceSearch = (itemList) => {
    let myList = [];
    if (itemList.length) {
      for (let val of itemList) {
        let filteredName = countries.filter((item) => {
          if (item.value[0] === val) {
            return item;
          }
        });
        if (myList.length) {
          myList = [...myList, ...filteredName];
        } else {
          myList = [...filteredName];
        }
      }
      setData(myList);
    } else {
      setData(countries);
    }
  };

  useEffect(() => {
    handleNotification();
  }, [isEnabled]);

  const handleNotification = async () => {
    const body = {
      "notifications.interested-countries": isEnabled ? "1" : "0",
    };
    const response = await MindAxios.post(Env.createUrl("settings"), body);
    // console.log(response);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <View>
        <BoardingHeader
          onPressNext={next}
          title={language?.countries}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.checkSection}>
          <Switch
            trackColor={{ false: "#767577", true: `${colors.theme}50` }}
            thumbColor={isEnabled ? colors.theme : "#f4f3f4"}
            onValueChange={() => setIsEnabled(!isEnabled)}
            ios_backgroundColor="lightgrey"
            value={isEnabled}
          />
          <AppText style={styles.notifyText}>
            Send me notifications for selected countires.
          </AppText>
        </View>
        <SearchFilter
          onTermChange={(text) => {
            searchData(text);
          }}
          onTermSubmit={(text) => {
            searchData(text);
          }}
          onFilter={() => {
            setShowFilter(!showFilter);
          }}
          selectedList={selectedList}
          removeItem={removeValues}
        />
        {showFilter && (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            {letters?.map((item, index) => (
              <TouchableOpacity onPress={() => otherSearch(item)}>
                <Text style={styles.alphaBet}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {current?.length ? (
          <Text
            style={{
              fontSize: 15,
              marginLeft: wp(3),
              color: colors.heading,
              fontFamily: "IBMPlexSans-Medium",
              marginBottom: current?.length > 0 ? 0 : 10,
            }}
          >
            Your Selections
          </Text>
        ) : null}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            height: current?.length > 0 ? 50 : 0,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: wp(3),
          }}
        >
          {current.map((item, index) => (
            <SelectedItems
              key={index}
              countries={Data}
              item={item}
              remove={removeItem}
            />
          ))}
        </ScrollView>
        <Text
          style={{
            marginLeft: wp(3),
            marginBottom: 10,
            fontSize: 18,
            fontFamily: "IBMPlexSans-Medium",
            color: colors.heading,
          }}
        >
          {language?.countriesOfInterest}
        </Text>
      </View>
      <FlatList
        data={Data}
        numColumns={2}
        columnWrapperStyle={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: wp(3.5),
          backgroundColor: colors.cWhite,
        }}
        // style={styles.container}
        renderItem={({ item, index }) => (
          <Country
            title={item?.value}
            index={index}
            current={current}
            setCurrent={setCurrent}
          />
        )}
      />
    </View>
  );
};

export default Interest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  element: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  alphaBet: {
    fontSize: 14,
    paddingRight: wp(4.4),
    marginBottom: hp(0.5),
    color: colors.lightTheme,
  },
  list: {
    paddingHorizontal: wp(3),
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  checkSection: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingBottom: hp(2),
    paddingRight: wp(5),
  },
  notifyText: {
    fontSize: 12,
    fontWeight: "500",
    paddingLeft: wp(3),
  },
});

const Country = ({ title, index, current, setCurrent }) => {
  return (
    <Pressable
      onPress={() => {
        let array = [...current, title];
        let unique = array.filter((item, i, ar) => ar.indexOf(item) === i);
        setCurrent(unique);
      }}
      style={{
        height: 35,
        backgroundColor: colors.background,
        borderColor: current?.includes(title) ? colors.theme : "transparent",
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: "center",
        width: wp(45),
        marginBottom:
          index == countries.length - 1 || index == countries.length - 2
            ? 50
            : 15,
        marginRight: index % 2 == 0 ? wp(3) : 0,
        paddingLeft: 3,
      }}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          fontSize: 16,
          fontFamily: "Roboto-Regular",
          color: colors.btnText,
        }}
      >
        {" "}
        {title}{" "}
      </Text>
    </Pressable>
  );
};
