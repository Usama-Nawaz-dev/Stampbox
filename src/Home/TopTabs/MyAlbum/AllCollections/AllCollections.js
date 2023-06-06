import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Alert,
  Switch,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";

import { styles } from "./styles";
import Btn from "../../../../../components/Btn";
import colors from "../../../../../constant/colors";
import AppText from "../../../../../components/AppText";
import BorderBtn from "../../../../../components/BorderBtn";
import { images } from "../../../../../assets/images/Images";

import { SimpleHeader } from "../../../../../components";
import AlbumCard from "../../../../../components/AlbumCard";
import OnlyDropDown from "../../../../../components/OnlyDropDown";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";
import ThemeContext from "../../../../Context/ThemeContext";

const pageValues = [
  { label: "Show 10", value: "10" },
  { label: "Show 25", value: "25" },
  { label: "Show 50", value: "50" },
  { label: "Show 100", value: "100" },
  { label: "Show 250", value: "250" },
];

// For Step by Step Walkthrough
import { copilot, walkthroughable, CopilotStep } from "react-native-copilot";

const AllCollections = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const collectionType = useSelector(
    (state) => state.DataReducer.collectionType
  );

  const [albumList, setAlbumList] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  const isFocused = useIsFocused();
  const [firstRender, setRen] = useState(true);
  // pagination states
  const [isLoading, setIsLoading] = useState(false);
  const [nextApiUrl, setNextApiUrl] = useState(null);

  const { theme, mood } = useContext(ThemeContext);

  useEffect(() => {
    showAlbumGuide();
  }, []);

  const showAlbumGuide = async () => {
    let albumGuide = await Helper.getData("showAGuide");
    if (!albumGuide) {
      props.start();
      await Helper.storeData("showAGuide", "false");
    }
  };

  //Making a WalkthroughableTouchableOpacity
  const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);

  useEffect(() => {
    if (isFocused) {
      (async () => {
        await getAlbums();
      })();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!firstRender) {
      getAlbums();
    } else {
      setRen(false);
    }
  }, [isEnabled, pageSize]);

  const searchData = (x) => {
    let text = x.toLowerCase();
    if (x) {
      let filteredData = albumList.filter((item) => {
        return item.name.toLowerCase().match(text);
      });
      setAlbumList(filteredData);
    } else {
      setAlbumList(currentData);
    }
  };

  const getAlbums = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.paramUrl(
        `albums`,
        `?type=${collectionType}&user_id=${
          currentUser?.id
        }&page_size=${pageSize}
        &order_by=${isEnabled ? "StampItemsCounts" : null}`
      )
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      console.log(response?.data?.result);
      const total = response?.data?.result?.paginated_items?.total;
      setTotalItem(total);
      const nextPageUrl =
        response?.data?.result?.paginated_items?.next_page_url;
      setAlbumList(_data);
      setCurrentData(_data);
      setNextApiUrl(nextPageUrl);
    } else {
      alert("Sever Error.");
    }
  };

  const getNextAlbums = async () => {
    try {
      if (nextApiUrl !== null) {
        setIsLoading(true);
        const response = await MindAxios.get(
          nextApiUrl +
            `&type=${collectionType}&user_id=${
              currentUser?.id
            }&page_size=${pageSize}
        &order_by=${isEnabled ? "StampItemsCounts" : null}`
        );
        setIsLoading(false);
        // console.log("response getAlbum", response);
        if (response?.status == 200) {
          let {
            data: {
              result: {
                paginated_items: { data: _data },
              },
            },
          } = response;
          let nextPageUrl =
            response?.data?.result?.paginated_items?.next_page_url;
          // console.log(nextPageUrl);
          setNextApiUrl(nextPageUrl);
          setAlbumList([...albumList, ..._data]);
          setCurrentData([...currentData, ..._data]);
        } else {
          setIsLoading(false);
          setNextApiUrl(null);
          alert("Sever Error.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 10 }}
        />
      </View>
    ) : null;
  };

  const renderItem = ({ item, index }) => {
    const isEnd = index === albumList.length - 1;
    return (
      <View
        style={{
          marginRight: wp(3),
          marginTop: hp(1.5),
          marginBottom: isEnd ? hp(3) : 0,
          marginLeft: index % 2 == 0 ? 2 : 0,
        }}
      >
        <AlbumCard
          ItemDetail={item}
          onEdit={() =>
            navigation.navigate("CreateAlbum", {
              type: collectionType,
              ItemDetail: item,
            })
          }
          onDelete={() => removeAlbumAlert(item.id)}
          onViewAlbum={() =>
            navigation.navigate("AlbumDetails", { Item: item })
          }
        />
      </View>
    );
  };

  const onDeleteAlbum = async (id) => {
    dispatch(allActions.DataAction.AppLoader(true));
    let { headers } = await MindAxios.formdataConfig();
    fetch(Env.paramUrl("albums", `${id}`), {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.success) {
          dispatch(allActions.DataAction.AppLoader(false));
          Helper.showToastMessage(
            `${collectionType} Deleted Successfully`,
            colors.green
          );
          getAlbums();
        }
      })
      .catch((error) => {
        dispatch(allActions.DataAction.AppLoader(false));
        alert(error);
      });
  };

  const removeAlbumAlert = (id) =>
    Alert.alert(
      `Delete ${collectionType} ?`,
      `Are you sure you want to delete this ${collectionType} ?`,
      [{ text: "Cancel" }, { text: "OK", onPress: () => onDeleteAlbum(id) }]
    );

  const hideAdd =
    currentUser?.user_permissions?.includes(
      "my_collection.create_album.upto_five"
    ) && albumList?.length === 5;

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SimpleHeader
        showSearch={true}
        showFilter={false}
        title={`My ${collectionType}s`}
        onChangeValue={(text) => searchData(text)}
        onPressBack={() => navigation.goBack()}
      />
      {currentUser?.user_permissions?.includes(
        "my_collection.create_album.upto_five"
      ) && (
        <View style={styles.permissionCard}>
          <AppText style={styles.limitText}>
            Album Limit({albumList?.length}/5)
          </AppText>
          <View style={styles.rowSection}>
            <AppText style={styles.limitInfo}>
              <AppText style={styles.subText}>
                {hideAdd ? "Limit full ! " : null}
              </AppText>
              You can increase number of albums by
            </AppText>
            <AppText
              style={styles.upgradeBtn}
              onPress={() => navigation.navigate("Subscriptions")}
            >
              Upgrade
            </AppText>
          </View>
        </View>
      )}
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          <AppText>{collectionType}s</AppText>
          {!hideAdd && (
            <CopilotStep
              text="Create a new album."
              order={3}
              name="thirdUniqueKey"
            >
              <WalkthroughableTouchableOpacity
                onPress={() =>
                  navigation.navigate("CreateAlbum", {
                    type: collectionType,
                    ItemDetail: null,
                  })
                }
              >
                <FastImage
                  source={images.Add}
                  style={{ width: hp(2.5), height: hp(2.5) }}
                />
              </WalkthroughableTouchableOpacity>
            </CopilotStep>
          )}
        </View>
        <CopilotStep
          text="View all items to add in the album."
          order={1}
          name="firstUniqueKey"
        >
          <WalkthroughableTouchableOpacity>
            <BorderBtn
              bold={false}
              fontSize={10}
              height={hp(3)}
              width={wp(42)}
              borderWidth={1}
              color={"lightgrey"}
              label={"View All Items"}
              fontColor={colors.lightText}
              onPress={() => navigation.navigate("MyItems")}
            />
          </WalkthroughableTouchableOpacity>
        </CopilotStep>
      </View>
      <View style={styles.topSection}>
        <View style={styles.checkSection}>
          <AppText style={{ marginRight: wp(5) }}>Most Recent</AppText>
          <Switch
            trackColor={{ false: "#767577", true: `${colors.theme}50` }}
            thumbColor={isEnabled ? colors.theme : "#f4f3f4"}
            ios_backgroundColor="lightgrey"
            onValueChange={() => {
              setIsEnabled(!isEnabled);
              // getAlbums();
            }}
            value={isEnabled}
          />
          <AppText style={{ marginLeft: wp(5) }}>Most Item</AppText>
        </View>
        <CopilotStep
          text="Filter albums by number."
          order={2}
          name="secondUniqueKey"
        >
          <WalkthroughableTouchableOpacity>
            <OnlyDropDown
              data={pageValues}
              value={pageSize}
              onChangeText={(value) => setPageSize(value)}
              dropdownOffset={hp(0.1)}
              position={-5.2}
              width="40%"
              left={wp(15)}
              icon={() => (
                <FastImage
                  source={images.Option}
                  style={{ width: hp(2.5), height: hp(2.5) }}
                />
              )}
            />
          </WalkthroughableTouchableOpacity>
        </CopilotStep>
      </View>
      {albumList?.length ? (
        <AppText style={styles.showText}>
          Showing <AppText style={styles.numText}>{albumList?.length}</AppText>{" "}
          of <AppText style={styles.numText}>{totalItem}</AppText>
        </AppText>
      ) : null}
      {albumList?.length === 0 ? (
        <View style={styles.addSection}>
          <AppText style={styles.itemText}>
            You have no Item listed at this time
          </AppText>
          <Btn
            label={`Create an ${collectionType}`}
            fontSize={12}
            height={hp(5)}
            width={wp(40)}
            style={{ marginTop: hp(1.5) }}
            iconLeft={
              <SimpleLineIcons
                name="plus"
                size={hp(2.5)}
                color="#fff"
                style={{ marginRight: 5 }}
              />
            }
            onPress={() =>
              navigation.navigate("CreateAlbum", {
                ItemDetail: null,
                type: collectionType,
              })
            }
          />
        </View>
      ) : (
        <FlatList
          numColumns={2}
          data={albumList}
          renderItem={renderItem}
          onEndReached={getNextAlbums}
          style={{ paddingHorizontal: wp(5) }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

export default copilot({
  animated: true, // Can be true or false
  overlay: "svg", // Can be either view or svg
})(AllCollections);
