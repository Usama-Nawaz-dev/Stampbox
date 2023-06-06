import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
} from "react-native";
import Image from "react-native-fast-image";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import allActions from "../../redux/actions";

import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import AuthContext from "../Context/AuthContext";
import { BoardingHeader } from "../../components";

import { useDispatch } from "react-redux";
import ThemeContext from "../Context/ThemeContext";

const Categories = ({ navigation }) => {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [listChang, setListChang] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      const response = await MindAxios.get(
        Env.createUrl("categories/?type=stamp_items")
      );
      if (response?.status == 200) {
        let data = response?.data?.result?.categories;
        let newData = data.map((item) => {
          item.isSelected = false;
          return item;
        });
        setCategories(newData);
      } else {
        alert("Unauthenticated");
      }
    })();
  }, []);

  useEffect(() => {
    handleNotification();
  }, [isEnabled]);

  const handleNotification = async () => {
    const body = {
      "notifications.interested-categories": isEnabled ? "1" : "0",
    };
    const response = await MindAxios.post(Env.createUrl("settings"), body);
    // console.log(response);
  };

  const renderItem = ({ item, index }) => {
    // console.log('item', item)
    let image = Env.mediaResource(`category-images/${item.image}`);
    // console.log('image->', image)
    return (
      <Pressable
        onPress={() => {
          categories[index].isSelected = !categories[index].isSelected;
          setCategories(categories);
          setListChang(!listChang);
        }}
        style={{
          width: 110,
          marginHorizontal: 10,
          marginBottom: index == categories?.length - 1 ? 200 : 20,
        }}
      >
        <View
          style={[
            styles.container,
            {
              borderColor: item.isSelected ? colors.theme : colors.borderColor,
            },
          ]}
        >
          <Image
            style={styles.img}
            source={{ uri: image }}
            resizeMode="contain"
          />
        </View>
        <Text
          numberOfLines={1}
          style={[styles.nameText, { color: theme?.darkGrey }]}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  const getCategoryIds = () => {
    let ids = [];
    categories.filter((item) => {
      if (item.isSelected) {
        ids.push(item.id);
      }
    });
    return ids;
  };

  const next = async () => {
    const category_ids = getCategoryIds();
    if (category_ids?.length > 0) {
      dispatch(allActions.DataAction.AppLoader(true));
      let ids = JSON.stringify(category_ids);
      let body = {
        category_ids: ids,
      };
      // console.log("body->", body);
      const response = await MindAxios.post(
        Env.createUrl("categories/select"),
        body
      );
      // console.log("res", response);
      dispatch(allActions.DataAction.AppLoader(false));
      if (response?.status == 200) {
        navigation.navigate("topic");
      }
    } else {
      alert("Please Select at least 1 Category to go Next!");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <BoardingHeader onPressNext={next} title={language?.categories} />
      <View style={styles.checkSection}>
        <Switch
          trackColor={{ false: "#767577", true: `${colors.theme}50` }}
          thumbColor={isEnabled ? colors.theme : "#f4f3f4"}
          onValueChange={() => setIsEnabled(!isEnabled)}
          ios_backgroundColor="lightgrey"
          value={isEnabled}
        />
        <AppText style={styles.notifyText}>Send me notifications for selected categories.</AppText>
      </View>
      <View style={styles.listView}>
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={3}
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={listChang}
        />
      </View>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 30,
    marginLeft: 15,
  },
  listView: {
    alignSelf: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    height: wp(27),
    width: wp(27),
  },
  img: {
    width: wp(15),
    height: wp(15),
    borderRadius: 5,
  },
  nameText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: colors.heading,
    textAlign: "center",
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
    fontWeight: '500',
    paddingLeft: wp(3)
  }
});
