import React, { useContext, useState } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";

import {
  DrawerItem,
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import colors from "../../constant/colors";
import AppText from "../../components/AppText";
import { placeHolder } from "../../constant/Paths";
import DrawerBox from "../../components/DrawerBox";
import { GradBtn, StarRatings } from "../../components";
import DrawerCollapsible from "../../components/DrawerCollapsible";

import { useDispatch, useSelector } from "react-redux";

import Helper from "../Helper";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import allActions from "../../redux/actions";

import AuthContext from "../Context/AuthContext";
import ThemeContext from "../Context/ThemeContext";

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [aSearch, setASearch] = useState(false);
  const [showDasboard, setShowDasboard] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [showResources, setShowresources] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showTrades, setShowTrades] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const { theme } = useContext(ThemeContext);
  const { signOut, myState } = useContext(AuthContext);
  const { language } = myState;

  const logOut = async () => {
    dispatch(allActions.DataAction.ActivityModal(true));
    const res1 = await MindAxios.post(Env.createUrl("logout"));
    dispatch(allActions.DataAction.ActivityModal(false));
    signOut();
    Helper.showToastMessage("Logged out");
  };

  return (
    <DrawerContentScrollView
      style={{ backgroundColor: theme?.white }}
      {...props}
    >
      <View style={{ flex: 1, marginBottom: hp(2) }}>
        <View style={{ flex: 0.8 }}>
          <View style={styles.topSection}>
            <View style={styles.header}>
              <Image
                style={styles.userImg}
                source={
                  currentUser ? { uri: currentUser?.image_url } : placeHolder
                }
              />
              <View style={{ marginLeft: hp(1.5) }}>
                {currentUser?.full_name?.length < 20 ? (
                  <AppText style={{ fontWeight: "600", color: theme?.black }}>
                    {Helper.capitalizeFirstLetter(currentUser?.full_name)}
                  </AppText>
                ) : (
                  <AppText style={{ fontWeight: "600", color: theme?.black }}>
                    {Helper.capitalizeFirstLetter(currentUser?.first_name)}
                  </AppText>
                )}
                <AppText style={styles.text}>
                  {currentUser?.coins == null ? 0 : currentUser?.coins} Coins
                </AppText>
                <AppText style={[styles.text, { marginBottom: hp(0.2) }]}>
                  $
                  {currentUser?.wallet_balance == null
                    ? 0
                    : currentUser?.wallet_balance}
                </AppText>
                <View style={{ marginTop: hp(0.2), marginBottom: hp(1) }}>
                  <StarRatings
                    rating={currentUser?.rating > 0 ? currentUser?.rating : "0"}
                    ratingStyle={{ height: hp(1.8), width: hp(1.8) }}
                  />
                </View>
                <GradBtn
                  fontSize={12}
                  width={wp(26)}
                  height={hp(4)}
                  style={styles.viewBtn}
                  label={language?.viewProfile}
                  onPress={() => {
                    dispatch(allActions.SheetAction.initialRoute("MyProfile"));
                    props.navigation.reset({
                      index: 0,
                      routes: [{ name: "GeneralStack" }],
                    });
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.borderLine} />

          {/* <DrawerBox
            title={language?.feed}
            onPress={() => props.navigation.navigate("Home")}
          />
          <DrawerBox
            title={language?.marketplace}
            onPress={() => props.navigation.navigate("Market")}
          />
          <DrawerBox title={language?.scanStamp} /> */}
          <DrawerCollapsible
            title={language?.advanceSearch}
            toggle={aSearch}
            onPress={() => setASearch(!aSearch)}
          />
          {aSearch && (
            <View>
              <DrawerBox
                title={language?.memberDirectory}
                style={styles.subItems}
              />
              <DrawerBox title={language?.clubs} style={styles.subItems} />
              <DrawerBox
                title={language?.catalogue}
                style={styles.subItems}
                onPress={() => props.navigation.navigate("CatalogueStack")}
              />
              <DrawerBox title={language?.chapters} style={styles.subItems} />
              <DrawerBox title={language?.auctions} style={styles.subItems} />
              <DrawerBox title={language?.STORE} style={styles.subItems} />
            </View>
          )}
          <DrawerBox
            title={language?.allFlags}
            onPress={() => {
              // props.navigation.navigate("MainFlags");
              props.navigation.reset({
                index: 0,
                routes: [{ name: "MainFlags" }],
              });
            }}
          />
          {/* <DrawerBox title={language?.allNotifications} /> */}
          <DrawerBox
            title={language?.myWallet}
            onPress={() => props.navigation.navigate("MainWallet")}
          />
          <DrawerCollapsible
            title={language?.myDashboard}
            toggle={showDasboard}
            onPress={() => setShowDasboard(!showDasboard)}
          />
          {showDasboard && (
            <View>
              <DrawerBox
                title={language?.myStampbox}
                style={styles.subItems}
                onPress={() => props.navigation.navigate("StamBox")}
              />
              <DrawerBox
                title={language?.myCollection}
                style={styles.subItems}
              />
              <DrawerBox title={language?.myEvents} style={styles.subItems} />
              <DrawerBox title={language?.myNetwork} style={styles.subItems} />
              <DrawerBox title={language?.myAuctions} style={styles.subItems} />
              <DrawerBox title={language?.myWishlist} style={styles.subItems} />
              <DrawerBox title={language?.myProfile} style={styles.subItems} />
              <DrawerBox
                title={language?.lastActivity}
                style={styles.subItems}
              />
              <DrawerBox title={language?.myBounties} style={styles.subItems} />
            </View>
          )}
          {/* <DrawerBox title={language?.myRssFeed} />
          <DrawerBox title={language?.myMessages} /> */}
          <DrawerCollapsible
            title={language?.myCollection}
            toggle={showCollections}
            onPress={() => setShowCollections(!showCollections)}
          />
          {showCollections && (
            <View>
              <DrawerBox
                title={[language?.my, " ", language?.albums]}
                style={styles.subItems}
                onPress={() => {
                  dispatch(allActions.DataAction.CollectionType("Album"));
                  props.navigation.navigate("AlbumStack");
                }}
              />
              <DrawerBox
                title={language?.myItems}
                style={styles.subItems}
                onPress={() => props.navigation.navigate("MyItemStack")}
              />
              <DrawerBox
                style={styles.subItems}
                title={"Expert Evaluation"}
                onPress={() => props.navigation.navigate("ExpertStack")}
              />
              {/* <DrawerBox
                title={language?.myStamp}
                style={styles.subItems}
                onPress={() =>
                  props.navigation.navigate("AlbumStack", {
                    screen: "MyStamps",
                  })
                }
              /> */}
              <DrawerBox
                title={"My Inventory"}
                style={styles.subItems}
                onPress={() => props.navigation.navigate("MyInventory")}
              />
              <DrawerBox
                title={"My Reports"}
                style={styles.subItems}
                onPress={() => props.navigation.navigate("MyReports")}
              />
              <DrawerBox
                title={language?.mySets}
                style={styles.subItems}
                onPress={() => {
                  dispatch(allActions.DataAction.CollectionType("Set"));
                  props.navigation.navigate("AlbumStack");
                }}
              />
              <DrawerBox
                title={language?.myLots}
                style={styles.subItems}
                onPress={() => {
                  dispatch(allActions.DataAction.CollectionType("Lot"));
                  props.navigation.navigate("AlbumStack");
                }}
              />
            </View>
          )}
          <DrawerCollapsible
            title={language?.resources}
            toggle={showResources}
            onPress={() => setShowresources(!showResources)}
          />
          {showResources && (
            <View>
              <DrawerBox title={language?.news} style={styles.subItems} />
              <DrawerBox title={language?.websites} style={styles.subItems} />
              <DrawerBox
                title={language?.organizations}
                style={styles.subItems}
              />
              <DrawerBox
                title={language?.postalOffices}
                style={styles.subItems}
              />
              <DrawerBox
                title={language?.tipsandguides}
                style={styles.subItems}
              />
            </View>
          )}
          <DrawerCollapsible
            title={language?.myCommunity}
            toggle={showCommunity}
            onPress={() => setShowCommunity(!showCommunity)}
          />
          {showCommunity && (
            <View>
              <DrawerBox title={language?.myContacts} style={styles.subItems} />
              <DrawerBox title={language?.myClubs} style={styles.subItems} />
              <DrawerBox title={language?.following} style={styles.subItems} />
              <DrawerBox title={language?.followers} style={styles.subItems} />
              <DrawerBox title={language?.inviteNew} style={styles.subItems} />
              <DrawerBox
                style={styles.subItems}
                title={"Blogs"}
                onPress={() => props.navigation.navigate("BlogStack")}
              />
              <DrawerBox
                style={styles.subItems}
                title={"Forums"}
                onPress={() => props.navigation.navigate("ForumStack")}
              />
            </View>
          )}
          {/* <DrawerCollapsible
            title={language?.events}
            toggle={showEvents}
            onPress={() => setShowEvents(!showEvents)}
          />
          {showEvents && (
            <View>
              <DrawerBox title={language?.calendar} style={styles.subItems} />
              <DrawerBox
                title={language?.virtualAuctions}
                style={styles.subItems}
              />
              <DrawerBox
                title={language?.virtualExhibitions}
                style={styles.subItems}
              />
              <DrawerBox
                title={language?.virtualShows}
                style={styles.subItems}
              />
            </View>
          )} */}
          {/* <DrawerCollapsible
            title={language?.trades}
            toggle={showTrades}
            onPress={() => setShowTrades(!showTrades)}
          />
          {showTrades && (
            <View>
              <DrawerBox
                title={language?.myTrades}
                style={styles.subItems}
                onPress={() =>
                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: "TradeStack" }],
                  })
                }
              />
              <DrawerBox
                title={language?.tradeOffers}
                style={styles.subItems}
                onPress={() =>
                  props.navigation.reset({
                    index: 0,
                    routes: [{ name: "TradeStack" }],
                  })
                }
              />
            </View>
          )} */}
          <DrawerCollapsible
            title={language?.orders + " History"}
            toggle={showOrders}
            onPress={() => setShowOrders(!showOrders)}
          />
          {showOrders && (
            <View>
              <DrawerBox
                title={language?.auctionOrders}
                style={styles.subItems}
                onPress={() =>
                  props.navigation.navigate("OrderStack", {
                    screen: "AuctionOrders",
                  })
                }
              />
              <DrawerBox
                title={language?.tradeOrders}
                style={styles.subItems}
                onPress={() =>
                  props.navigation.navigate("OrderStack", {
                    screen: "TradeOrders",
                  })
                }
              />
              <DrawerBox
                title={"Sold Orders"}
                style={styles.subItems}
                onPress={() => {
                  if (currentUser?.store) {
                    dispatch(
                      allActions.DetailAction.StoreDetail(currentUser?.store)
                    );
                    props.navigation.navigate("MyStoreStack", {
                      screen: "MyStore",
                    });
                  } else {
                    Helper.showToastMessage(
                      "Store not created.",
                      colors.blueTheme
                    );
                  }
                }}
              />
              <DrawerBox
                title={language?.myOrders}
                style={styles.subItems}
                onPress={() =>
                  props.navigation.navigate("OrderStack", {
                    screen: "MyOrders",
                  })
                }
              />
            </View>
          )}
          <View style={{ marginVertical: hp(1) }}>
            {/* <DrawerBox
              title={language?.help}
              onPress={() =>
                Helper.showToastMessage("Coming Soon.", colors.blueTheme)
              }
            />
            <DrawerBox
              title={language?.activity}
              onPress={() =>
                Helper.showToastMessage("Coming Soon.", colors.blueTheme)
              }
            />
            <DrawerBox
              title={language?.about}
              onPress={() =>
                Helper.showToastMessage("Coming Soon.", colors.blueTheme)
              }
            /> */}
            <DrawerBox
              title={"Settings"}
              onPress={() => props.navigation.navigate("SettingStack")}
            />
            <DrawerBox
              title={"Customer Support"}
              onPress={() => props.navigation.navigate("CustomerSupport")}
            />
          </View>
          <View style={{ marginLeft: wp(3) }}>
            <Pressable
              style={styles.conditions}
              onPress={() => props.navigation.navigate("PrivacyPolicy")}
            >
              <AppText style={styles.subItems}>
                {language?.privacyPolicy}
              </AppText>
            </Pressable>
            <Pressable
              style={styles.conditions}
              onPress={() => props.navigation.navigate("Terms")}
            >
              <AppText style={styles.subItems}>
                {language?.termsAndConditions}
              </AppText>
            </Pressable>
          </View>
          <GradBtn
            fontSize={12}
            width={wp(22)}
            height={hp(4)}
            onPress={logOut}
            style={styles.logoutBtn}
            label={language?.logout}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;

const styles = StyleSheet.create({
  topSection: {
    height: hp(20),
    width: "100%",
  },
  header: {
    margin: hp(2),
    flexDirection: "row",
    marginVertical: hp(3),
  },
  userImg: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(10),
  },
  text: {
    marginTop: hp(0.3),
  },
  subItems: {
    fontSize: 14,
    fontWeight: "400",
  },
  conditions: {
    marginTop: hp(1),
  },
  borderLine: {
    height: 1,
    width: wp(100),
    marginVertical: hp(0.5),
    backgroundColor: colors.borderColor,
  },
  logoutBtn: {
    marginTop: hp(1.5),
    marginBottom: hp(1),
    alignSelf: "flex-start",
    marginHorizontal: wp(3),
  },
  viewBtn: {
    marginTop: hp(0.5),
  },
});
