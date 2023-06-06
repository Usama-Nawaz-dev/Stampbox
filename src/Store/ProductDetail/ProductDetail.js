import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  GradBtn,
  HtmlTag,
  BottomSheet,
  FloatingInput,
  EventHeader,
  ImageListSlider,
  ImageZoomViewer,
} from "../../../components";

import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import { styles } from "./styles";
import Btn from "../../../components/Btn";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import AuthContext from "../../Context/AuthContext";
import { ProductReview, SimilarTab } from "../ProductTabs";
import { createMaterialTopTabNavigator } from "../../../CustomPackages/material-top-tabs";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from "../../../constant/colorsConfig";

const Tab = createMaterialTopTabNavigator();
export const ProductDetail = (props) => {
  const sliderComp = useRef();
  const dispatch = useDispatch();
  const focused = useIsFocused();
  //Redux States
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const cartProducts = useSelector((state) => state.DataReducer.cart);
  const detail = useSelector((state) => state.DetailReducer.stampDetail);

  const [offers, setOffers] = useState();
  const [mediaUri, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addToCart, setAddtoCart] = useState(false);
  const [stampsList, setStampList] = useState(null);
  const [ItemDetail, setItemDetail] = useState(detail);
  const [isFav, setisFav] = useState(ItemDetail?.is_wishable ? true : false);

  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  const [offerItem, setOfferItem] = useState(null);
  const [offerPrice, setOfferPrice] = useState(null);
  const [description, setDescription] = useState("");
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [imageViewer, setImageViewer] = useState(false);
  const [imageViewerData, setImageViewerData] = useState([]);
  const [imageViewerInitialIndex, setImageViewerInitialIndex] = useState(0);

  const offerSheetRef = useRef();
  const placeOfferRef = useRef();
  const owner = currentUser?.store?.id === ItemDetail?.store_id;

  useEffect(() => {
    if (cartProducts) {
      let check = cartProducts.some((item) => item.product_id == detail?.id);
      setAddtoCart(check);
    } else {
      setAddtoCart(false);
    }
    if (focused) {
      fetchSingle();
      getOffersApi();
    }
  }, [focused]);

  const fetchSingle = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(`products/${detail?.id}`)
    );
    dispatch(allActions.DataAction.AppLoader(false));
    if (response.status === 200) {
      const _data = response?.data?.result?.item;
      let tempArray = [];
      _data?.productable?.medias?.map((x, index) => {
        tempArray.push({ url: x.media_url });
      });
      sliderComp?.current?.refresh(_data?.productable?.medias);
      setImageViewerData([...tempArray]);
      setItemDetail(_data);
    } else {
      Helper.showToastMessage(response?.data?.message);
    }
  };

  const getStoreAddress = async () => {
    const response = await MindAxios.get(
      Env.createUrl(`stores/${detail?.store_id}`)
    );
    console.log("res", response);
    if (response.status === 200) {
      let {
        data: {
          result: {
            store: {
              address: storeAddress,
              owner: { full_name, email, phone },
            },
          },
        },
      } = response;
      let store_address = Helper.deepCopy(storeAddress);
      store_address.name = full_name;
      store_address.phone = phone;
      store_address.email = email;
      console.log("add", store_address);
      return store_address;
    } else {
      return null;
    }
  };

  const getOffersApi = async () => {
    // console.log(detail?.id);
    // dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(
      Env.createUrl(`product-offers?product_id=${detail?.id}`)
    );
    // console.log("response....", response);
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const offers_data = response?.data?.result?.paginated_items?.data;
      // console.log("offers....", offers_data);
      setOffers(offers_data);
    } else {
      alert(language?.serverError);
    }
  };

  const removeEventAlert = () =>
    Alert.alert(
      `Delete Product ?`,
      `Are you sure you want to delete this product?`,
      [{ text: "Cancel" }, { text: "OK", onPress: () => onDeleteProduct() }]
    );

  const onDeleteProduct = async () => {
    dispatch(allActions.DataAction.AppLoader(true));
    let { headers } = await MindAxios.formdataConfig();
    fetch(Env.paramUrl("products", `${ItemDetail?.id}`), {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.success) {
          dispatch(allActions.DataAction.AppLoader(false));
          props.navigation.goBack();
        }
      })
      .catch((error) => {
        dispatch(allActions.DataAction.AppLoader(false));
        alert(error);
      });
  };
  const onEditProduct = () => {
    if (ItemDetail?.productable_type === "Supply") {
      dispatch(
        allActions.DataAction.SelectedImg(ItemDetail?.productable?.medias)
      );
      dispatch(allActions.DetailAction.SupplyDetail(ItemDetail));
      props.navigation.navigate("EditSupply");
    } else {
      dispatch(
        allActions.DataAction.SelectedImg(ItemDetail?.productable?.medias)
      );
      dispatch(allActions.DetailAction.StampDetail(ItemDetail));
      props.navigation.navigate("EditStoreStamp");
    }
  };

  const toggleFav = async (id) => {
    setisFav(!isFav);
    let body = {
      wishable_type: "Product",
      wishable_id: ItemDetail?.id,
    };
    const response = await MindAxios.post(Env.createUrl("wishlists"), body);
    if (response?.status == 200) {
      if (!isFav) {
        Helper.showToastMessage("Product added to favourite", colors.green);
      } else {
        Helper.showToastMessage("Product remove from favourite", colors.green);
      }
    } else {
      Helper.showToastMessage(
        "Thers's some issue while adding product to favourite",
        colors.danger
      );
      setisFav(!isFav);
    }
  };

  const checkTheOffer = (item) => {
    let owned = currentUser?.id == item?.user_id;
    // console.log("owned", currentUser?.id, item?.user_id, item)
    if (item?.product?.is_offer_accepted == 0 && owned) {
      return (
        <Btn
          label="Delete"
          height={30}
          width="80%"
          fontWeight="400"
          bg={colors.red}
          onPress={() => delete_offer(item)}
        />
      );
    } else if (owner && item?.product?.is_offer_accepted == 0) {
      return (
        <Btn
          label={language?.accept}
          height={30}
          width="80%"
          fontWeight="400"
          bg={colors.green}
          onPress={() => {
            // accept_offer(item)}
            setOfferItem(item);
            offerSheetRef?.current?.open();
          }}
        />
      );
    }
  };

  const cartButtonChecker = () => {
    if (!owner) {
      if (!detail?.accepting_best_offer) {
        return (
          <GradBtn
            label={addToCart ? "Remove from Cart" : "Add to Cart"}
            height={45}
            style={styles.cartButton}
            loading={loading}
            onPress={cartFunc}
          />
        );
      } else {
        if (offers?.length > 0) {
          let check = (obj) => obj?.product?.is_offer_accepted == 1;
          let exists = offers?.some(check);
          // console.log("exists", exists);
          if (exists) {
            return (
              <GradBtn
                label={addToCart ? "Remove from Cart" : "Add to Cart"}
                height={45}
                style={styles.cartButton}
                loading={loading}
                onPress={cartFunc}
              />
            );
          } else {
            return (
              <GradBtn
                label={"Place Offer"}
                height={45}
                style={styles.cartButton}
                loading={loading}
                onPress={() => placeOfferRef?.current?.open()}
              />
            );
          }
        } else {
          return (
            <GradBtn
              label={"Place Offer"}
              height={45}
              style={styles.cartButton}
              loading={loading}
              // onPress={place_offer}
              onPress={() => {
                placeOfferRef?.current?.open();
              }}
            />
          );
        }
      }
    }
  };

  const delete_offer = async (item) => {
    dispatch(allActions.DataAction.ActivityModal(true));
    let res = await MindAxios.delete(
      Env.createUrl(`product-offers/${item?.id}`)
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    // console.log("res", res);
    if (res?.status == 200) {
      Helper.showToastMessage("Offer deleted successfully", "green");
      await getOffersApi();
    }
  };

  const accept_offer = async (item, status) => {
    dispatch(allActions.DataAction.ActivityModal(true));
    let body = {
      status: status,
      action_reason: "I like your offer",
    };
    let res = await MindAxios.post(
      Env.createUrl(`product-offers/${item?.id}`),
      body
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    // console.log("res", res);
    if (res?.status == 200) {
      Helper.showToastMessage("Offer accepted successfully", "green");
      await getOffersApi();
    }
  };

  const place_offer = async () => {
    let valid = true;
    if (!offerPrice) {
      setError("Please enter the price!");
      valid = false;
    }
    if (!description) {
      setError2("Please enter the description!");
      valid = false;
    }
    if (valid) {
      let body = {
        amount: Number(offerPrice),
        description: description,
        product_id: detail?.id,
      };
      // console.log("body", body);
      setLoading(true);
      let res = await MindAxios.post(Env.createUrl("product-offers"), body);
      setLoading(false);
      // console.log("res", res);
      if (res?.status == 200) {
        Helper.showToastMessage("Offer Placed Succesfully", "green");
        await getOffersApi();
        setOfferPrice(null);
        setDescription("");
      } else {
        Helper.showToastMessage("Something went wrong", "red");
      }
    }
  };
  // const cartFunc = async () => {
  //   console.log("detail", detail);
  // };

  const cartFunc = async () => {
    // console.log("details", detail)
    // Helper.showToastMessage("Coming Soon");
    setLoading(true);
    let cart = await Helper.getObj("cart");
    // console.log("cart 1", cart);
    if (addToCart) {
      let remove = cart.filter((item) => item.product_id !== detail?.id);
      // console.log("remove", remove);
      if (remove?.length > 0) {
        await Helper.setObj("cart", remove);
        dispatch(allActions.DataAction.cart_products(remove));
        setAddtoCart(false);
        setLoading(false);
      } else {
        Helper.removeLocal("cart");
        Helper.cancelScheduled(1);
        dispatch(allActions.DataAction.cart_products([]));

        setAddtoCart(false);
        setLoading(false);
      }
    } else {
      // console.log("detail==>", detail);
      let storeInfo = await getStoreAddress();
      let dataObj = {
        store_id: detail?.store_id,
        quantity: detail?.quantity,
        from_address: storeInfo,
        store_name: detail?.store?.name,
        product_name: detail?.name,
        product_id: detail?.id,
        product_img: ItemDetail?.productable?.medias?.length
          ? ItemDetail?.productable?.medias[0]?.media_url
          : null,
        parcel: {
          parcel_details: detail?.parcel_detail,
          quantity: detail?.quantity,
        },
        sale_price: detail?.sale_price
          ? Number(detail?.sale_price)
          : Number(detail?.regular_price),
      };
      getStoreAddress();
      Helper.scheduleReminder(
        1,
        "Cart",
        "You have items in your cart waiting for you.",
        2
      );
      // console.log("dataObj==>", dataObj);
      if (cart?.length == 0 || !cart) {
        // console.log("cart 2", cart);
        let cartItems = [];
        cartItems.push(dataObj);
        await Helper.setObj("cart", cartItems);
        dispatch(allActions.DataAction.cart_products(cartItems));
        setAddtoCart(true);
        setLoading(false);
      } else {
        // let check = cart.some((item) => item.product_id == detail?.id);
        // console.log("check");
        cart.push(dataObj);
        await Helper.setObj("cart", cart);
        dispatch(allActions.DataAction.cart_products(cart));
        setAddtoCart(true);
        setLoading(false);
      }
    }
  };

  const renderOffers = ({ item, index }) => {
    return (
      <ImageBackground
        style={styles.offerCard}
        source={require("../../../assets/images/board1.png")}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0, 0.3)",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.offCardTextView}>
              <AppText style={styles.offCardText}>{item?.status}</AppText>
            </View>
            <AppText
              style={[
                styles.offCardText,
                { color: "#fff", fontWeight: "900", fontSize: 18 },
              ]}
            >
              ${item?.amount}
            </AppText>
          </View>
          {checkTheOffer(item)}
        </View>
      </ImageBackground>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <EventHeader
        title={"Product Detail"}
        rightIcon={owner}
        onEdit={onEditProduct}
        onDelete={removeEventAlert}
        onPressBack={() => {
          setOffers([]);
          dispatch(allActions.DetailAction.StampDetail([]));
          props.navigation.goBack();
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mediaSection}>
          <ImageListSlider
            ref={sliderComp}
            data={ItemDetail?.productable?.medias}
            timer={2000}
            imageKey={"media_url"}
            width={wp(100)}
            height={hp(26)}
            local={false}
            separator={0}
            loop={false}
            autoscroll={false}
            indicator
            animation
            onPress={(i, data) => {
              setImageViewerInitialIndex(i);
              setImageViewer(true);
            }}
          />
        </View>
        <View style={styles.detailsSection}>
          <AppText style={styles.title}>{ItemDetail?.name}</AppText>
          <InfoItem
            item={language?.sku}
            value={ItemDetail?.sku ? ItemDetail?.sku : "N/A"}
          />
          <InfoItem
            item={language?.created_at}
            value={moment(ItemDetail?.created_at).format(
              "YYYY-MM-DD [at] h:mmA"
            )}
          />
          <InfoItem
            item={language?.updated_at}
            value={moment(ItemDetail?.updated_at).format(
              "YYYY-MM-DD [at] h:mmA"
            )}
          />
          <InfoItem
            item={"Displayed Item"}
            value={
              ItemDetail?.productable?.medias[0]?.type
                ? ItemDetail?.productable?.medias[0]?.type
                : "N/A"
            }
          />
          <InfoItem
            item={language?.returnPolicy}
            value={ItemDetail?.return_policy}
          />
          <InfoItem
            item={"Shipping Option"}
            value={
              ItemDetail?.shiping_option ? ItemDetail?.shiping_option : "N/A"
            }
          />
          {ItemDetail?.productable?.country && (
            <InfoItem
              item={language?.country}
              value={
                ItemDetail?.productable?.country
                  ? ItemDetail?.productable?.country
                  : "N/A"
              }
            />
          )}
          {ItemDetail?.productable?.year_issued && (
            <InfoItem
              item={"Year"}
              value={
                ItemDetail?.productable?.year_issued
                  ? ItemDetail?.productable?.year_issued
                  : "N/A"
              }
            />
          )}
          <InfoItem
            item={"Condition"}
            value={
              ItemDetail?.productable?.condition
                ? ItemDetail?.productable?.condition
                : "N/A"
            }
          />
          {ItemDetail?.productable?.color && (
            <InfoItem
              item={"Color"}
              value={
                ItemDetail?.productable?.color
                  ? ItemDetail?.productable?.color
                  : "N/A"
              }
            />
          )}
          {ItemDetail?.productable?.status?.length && (
            <InfoItem
              item={"Status"}
              value={
                ItemDetail?.productable?.status?.length
                  ? ItemDetail?.productable?.status[0]
                  : "N/A"
              }
            />
          )}
          {ItemDetail?.productable?.issue_type && (
            <InfoItem
              item={language?.typeOfIssue}
              value={
                ItemDetail?.productable?.issue_type
                  ? ItemDetail?.productable?.issue_type
                  : "N/A"
              }
            />
          )}
          <View style={styles.parcelDetail}>
            <ParcelDetail
              name={"Length"}
              val={ItemDetail?.parcel_detail?.length}
            />
            <ParcelDetail
              name={"Width"}
              val={ItemDetail?.parcel_detail?.width}
            />
            <ParcelDetail
              name={"Height"}
              val={ItemDetail?.parcel_detail?.height}
            />
            <ParcelDetail
              name={"Weight"}
              val={ItemDetail?.parcel_detail?.weight}
            />
          </View>
          {ItemDetail?.description !== null && (
            <HtmlTag
              style={[styles.description, { color: theme?.darkGrey }]}
              description={ItemDetail?.description}
            />
          )}
        </View>
        <View style={styles.cardHeader}>
          {detail?.accepting_best_offer == 1 ? (
            <Text style={[styles.shippingText, { color: theme?.theme }]}>
              {ItemDetail?.sale_price ? (
                <Text style={[styles.priceText, { color: theme?.theme }]}>
                  ${ItemDetail?.sale_price}{" "}
                </Text>
              ) : (
                <Text style={{ fontSize: 12, color: theme.theme }}>
                  Accepting best offers{" "}
                </Text>
              )}
              (Shipping Not Included)
            </Text>
          ) : (
            <Text style={[styles.priceText, { color: theme?.theme }]}>
              $
              {ItemDetail?.sale_price
                ? ItemDetail?.sale_price
                : ItemDetail?.regular_price}{" "}
              <Text style={[styles.shippingText, { color: theme?.theme }]}>
                (Shipping Not Included)
              </Text>
            </Text>
          )}

          {!owner && (
            <View style={styles.rowSection}>
              <TouchableOpacity
                onPress={toggleFav}
                style={{ marginRight: wp(2) }}
              >
                <Ionicons
                  name={isFav ? "heart" : "heart-outline"}
                  color={isFav ? theme?.theme : theme?.lightGrey}
                  size={28}
                />
              </TouchableOpacity>

              {ItemDetail?.productable_type === "StampItem" && (
                <Pressable
                  onPress={() => {
                    if (!owner) {
                      props.navigation.navigate("Flagging", {
                        id: ItemDetail?.productable_id,
                      });
                    }
                  }}
                >
                  <Ionicons
                    name="flag-outline"
                    size={24}
                    color={theme?.theme}
                  />
                  <View style={styles.counter}>
                    <AppText style={styles.counterText}>
                      {ItemDetail?.productable?.flag_tickets_count}
                    </AppText>
                  </View>
                </Pressable>
              )}
            </View>
          )}
        </View>
        {offers?.length > 0 ? (
          <View style={{ backgroundColor: colors.background, padding: 10 }}>
            <AppText
              style={[
                styles.itemHeading,
                { marginBottom: 10, color: theme?.darkGrey },
              ]}
            >
              Offers Received
            </AppText>
            <FlatList
              data={offers}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderOffers}
            />
          </View>
        ) : null}
        {cartButtonChecker()}
        <View style={{ minHeight: hp(84) }}>
          <Tab.Navigator
            initialRouteName="Shop"
            tabBarOptions={{
              activeTintColor: theme?.theme,
              inactiveTintColor: theme?.lightText,
              labelStyle: styles.labelStyle,
            }}
            screenOptions={{
              //use this config
              tabBarIndicatorStyle: { backgroundColor: theme?.theme },
              tabBarStyle: { backgroundColor: theme?.white },
            }}
          >
            <Tab.Screen
              name="Find Similar"
              component={SimilarTab}
              options={{ tabBarLabel: "Find Similar" }}
            />
            <Tab.Screen
              name="Reviews"
              component={ProductReview}
              options={{ tabBarLabel: "Reviews" }}
            />
          </Tab.Navigator>
        </View>
      </ScrollView>
      <BottomSheet
        // onPressClose={() => {
        //   termsSheetRef?.current?.close();
        //   // props.closeOpenedSheets();
        // }}
        ref={offerSheetRef}
        sheetHeight={hp(30)}
        ChildComponent={
          <View style={{ alignItems: "center", padding: 10 }}>
            <AppText
              style={{
                fontSize: 18,
                fontWeight: "700",
                alignSelf: "flex-start",
                marginBottom: 20,
              }}
            >
              Are you sure you want to accept this offer?
            </AppText>

            <Btn
              label={language?.accept}
              height={40}
              // width="80%"
              fontWeight="400"
              style={{ marginBottom: 10 }}
              bg={colors.lightTheme}
              onPress={() => {
                accept_offer(offerItem, "Accepted");
                offerSheetRef?.current?.close();
              }}
            />
            <Btn
              label={language?.reject}
              height={40}
              // width="80%"
              fontWeight="400"
              bg={colors.background}
              style={{ marginBottom: 20 }}
              textStyle={{ color: colors.black }}
              onPress={() => {
                accept_offer(offerItem, "Rejected");
                offerSheetRef?.current?.close();
              }}
            />
            <TouchableOpacity onPress={() => offerSheetRef?.current?.close()}>
              <AppText style={{ fontSize: 14, fontWeight: "700" }}>
                Cancle
              </AppText>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Image Zoom Modal */}
      <ImageZoomViewer
        onPressClose={() => {
          setImageViewer(false);
        }}
        visible={imageViewer}
        images={imageViewerData}
        index={imageViewerInitialIndex}
      />
      {/* Offers Sheet */}
      <BottomSheet
        ref={placeOfferRef}
        sheetHeight={hp(40)}
        ChildComponent={
          <View style={{ padding: 15 }}>
            <AppText
              style={{ fontSize: 18, fontWeight: "700", marginBottom: 20 }}
            >
              My Best Offer
            </AppText>
            <FloatingInput
              label={`Price($)`}
              value={offerPrice}
              keyboardType="numeric"
              width="95%"
              onChangeText={(text) => {
                setError(false);
                setOfferPrice(text);
              }}
              error={error}
            />
            <FloatingInput
              label={`Description`}
              value={description}
              width="95%"
              onChangeText={(text) => {
                setError2(false);
                setDescription(text);
              }}
              error={error2}
            />

            <Btn
              label={language?.submit}
              height={40}
              width="95%"
              fontWeight="400"
              style={{ marginBottom: 10, marginTop: 30, alignSelf: "center" }}
              bg={colors.lightTheme}
              onPress={() => {
                place_offer();
                placeOfferRef?.current?.close();
              }}
            />
          </View>
        }
      />
    </View>
  );
};

const InfoItem = (props) => {
  const { item, value } = props;
  // console.log(key)
  return (
    <View style={styles.rowSection}>
      <AppText style={styles.keyText}>{item}:</AppText>
      <AppText style={styles.valueText}>{value}</AppText>
    </View>
  );
};

const ParcelDetail = ({ name, val }) => {
  return (
    <View>
      <AppText style={styles.parcelValue}>{val}</AppText>
      <AppText style={styles.parcelValue}>{name}</AppText>
    </View>
  );
};
