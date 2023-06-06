import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Modal,
  Image,
  FlatList,
  Clipboard,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { styles } from "./styles";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import {
  UserInfo,
  Shortcuts,
  SellerInfo,
  StatusComp,
  SelectStamp,
  ProfileHeader,
  CustomButton,
  UserAlbumCard,
  ProficiencyComp,
} from "../../../components";

import { images } from "../../../assets/images/Images";
import { placeHolder } from "../../../constant/Paths";
import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
// import { dark as theme } from '../../../constant/colorsConfig';

export const MyProfile = (props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { theme, mode } = useContext(ThemeContext);
  const { closeSheet, openPermissionSheet } = useContext(AuthContext);
  // Redux values
  const currentUser = useSelector((state) => state.ApiReducer.user);
  // const otherUser = useSelector((state) => state.DetailReducer.otherUser);
  const [userData, setUserData] = useState(null);

  const [isStampScreen, setIsStampScreen] = useState(true);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isCollection, setIsCollection] = useState(false);

  const [profile, setProfile] = useState(null);
  const [imgModal, setImgModal] = useState(false);
  const [isProfile, setISProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroungImage, setBackgorundImage] = useState(
    currentUser?.cover_image_url
  );

  const [stampList, setStampList] = useState(null);
  const [wishlist, setWishlist] = useState(null);
  const [collections, setCollections] = useState(null);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const subscription = userData?.subscriptions
    ? userData?.subscriptions[0]?.subscription_plan
    : null;

  useEffect(() => {
    if (isFocused) {
      setUserData(currentUser);
      setProfile(currentUser?.image_url);
      getStamps();
      getWishlist();
      getCollections();
    }
  }, [isFocused]);

  useEffect(() => {
    setUserData(currentUser);
    setProfile(currentUser?.image_url);
  }, [currentUser]);

  //Image Picker
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Stampbox App Camera Permission",
          message:
            "Stambox needs access to your camera " +
            "so you can take pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can use the camera");
        captureImage();
      } else {
        // console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const uploadApi = async (item, field) => {
    let { headers } = await MindAxios.formdataConfig();
    let formdata = new FormData();
    formdata.append("field_name", field);
    const newFile = {
      uri: item.uri,
      type: "image/png",
      name: "photo.png",
      filename: "imageName.png",
    };
    formdata.append("media", newFile);

    fetch(Env.createUrl("users/update-profile-media"), {
      method: "POST",
      headers: headers,
      body: formdata,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result?.success) {
          dispatch(allActions.ApiAction.getUserApi());
        } else {
          alert(language?.serverError);
        }
      })
      .catch((error) => {
        // setLoading(false);
        alert(error);
      });

    // console.log('config', headers)
  };
  const chooseFile = () => {
    launchImageLibrary({
      multiple: false,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
      // selectionLimit: 10
    })
      .then(async (images) => {
        if (images.assets) {
          if (isProfile) {
            uploadApi(images.assets[0], "profile_image");
            setProfile(images.assets[0]?.uri);
          } else {
            // uploadApi(images.assets[0], "cover_image");
            // setBackgorundImage(images.assets[0]?.uri);
          }
          //   isProfile
          //     ? setProfile(images.assets[0]?.uri)
          //     : setBackgorundImage(images.assets[0]?.uri);
        } else {
          // console.log("Cancled", images);
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };
  const captureImage = async (type) => {
    // console.log("Take Picture Function")
    launchCamera({
      multiple: false,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          if (isProfile) {
            uploadApi(images.assets[0], "profile_image");
            setProfile(images.assets[0]?.uri);
          } else {
            uploadApi(images.assets[0], "cover_image");
            setBackgorundImage(images.assets[0]?.uri);
          }
        } else {
          // console.log("Cancelled");
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  const getStamps = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`stamp-items`, `?user_id=${currentUser?.id}`)
    );
    if (response?.status == 200) {
      setStampList(response?.data?.result?.paginated_items?.data);
    } else {
      alert(language?.serverError);
    }
  };

  const getWishlist = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`wishlists`, `?user_id=${currentUser?.id}&type=StampItem`)
    );
    if (response?.status == 200) {
      setWishlist(response?.data?.result?.paginated_items?.data);
    } else {
      alert(language?.serverError);
    }
  };

  const getCollections = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(`albums`, `?type=Album&user_id=${currentUser?.id}`)
    );
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      setCollections(_data);
    } else {
      alert("Sever Error.");
    }
  };

  const onPressDetail = async (stampId) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const response = await MindAxios.get(Env.paramUrl("stamp-items", stampId));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const data = response?.data?.result?.stamp_item;
      dispatch(allActions.DetailAction.StampDetail(data));
      props.navigation.navigate("StampDetail");
    } else {
      alert(language?.serverError);
    }
  };

  const renderStamps = ({ item, index }) => {
    return (
      <View style={{ marginBottom: hp(2) }}>
        <SelectStamp
          ItemDetail={item?.wishable ? item?.wishable : item}
          onPress={() =>
            onPressDetail(item?.wishable ? item?.wishable?.id : item?.id)
          }
        />
      </View>
    );
  };

  const renderCollections = ({ item, index }) => {
    return (
      <View
        style={{
          marginRight: wp(3),
          marginLeft: index == 0 ? wp(1) : 0,
          marginTop: hp(1),
          marginBottom: hp(2),
        }}
      >
        <UserAlbumCard
          ItemDetail={item}
          onViewAlbum={() =>
            props.navigation.navigate("AlbumDetails", { Item: item })
          }
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <ProfileHeader
        title="My Profile"
        onEdit={() => {
          if (userData?.user_permissions?.includes("my_account.profile.edit")) {
            props.navigation.navigate("EditProfile");
          } else {
            openPermissionSheet();
          }
        }}
        onChangePass={() => props.navigation.navigate("ChangePassword")}
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.userSection}>
        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: theme?.orangeSalmon }]}
          onPress={() => {
            // profile.avatar.image_editor
            if (
              userData?.user_permissions?.includes("my_account.profile.edit")
            ) {
              setImgModal(true);
              setISProfile(true);
            } else {
              openPermissionSheet();
            }
          }}
        >
          <Image
            source={images.Edit}
            resizeMode="contain"
            style={{ width: 13, height: 13 }}
          />
        </TouchableOpacity>
        <Image
          style={styles.userImage}
          source={profile ? { uri: profile } : placeHolder}
        />
      </View>
      <AppText style={[styles.userText, { color: theme?.black }]}>
        {userData?.full_name}
      </AppText>
      <View style={styles.userDetail}>
        <View style={styles.idSection}>
          <AppText style={[styles.userInfo, { color: theme?.black }]}>
            ID:{" "}
            <AppText style={[styles.valueText, { color: theme?.black }]}>
              {userData?.user_detail?.member_id}
            </AppText>
          </AppText>
          <TouchableOpacity
            style={{ marginLeft: wp(1) }}
            onPress={() => {
              Clipboard.setString(userData?.user_detail?.member_id);
              Helper.showToastMessage("Copied to Clipboard.", colors.green);
            }}
          >
            <Feather name="copy" size={hp(2)} color={theme.theme} />
          </TouchableOpacity>
        </View>

        <AppText style={[styles.userInfo, { color: theme?.black }]}>
          Scores:{" "}
          <AppText style={[styles.valueText, { color: theme?.black }]}>
            0 points
          </AppText>
        </AppText>
        <AppText style={[styles.userInfo, { color: theme?.black }]}>
          Sel:{" "}
          <AppText style={[styles.valueText, { color: theme?.black }]}>
            {userData?.mrs_badge}
          </AppText>
        </AppText>
      </View>
      <ScrollView style={{ marginBottom: hp(5), paddingTop: hp(1) }}>
        <View style={styles.followSection}>
          <Pressable
            style={styles.countSection}
            onPress={() => {
              dispatch(allActions.DetailAction.OtherUser(currentUser));
              props.navigation.navigate("MyNetwork", {
                initialRoute: "Follwers",
              });
            }}
          >
            <AppText style={[styles.countText, { color: theme?.black }]}>
              {userData?.followers_count}
            </AppText>
            <AppText style={[styles.followText, { color: theme?.black }]}>
              Followers
            </AppText>
          </Pressable>
          <View style={styles.verticleLine}></View>
          <Pressable
            style={styles.countSection}
            onPress={() => {
              dispatch(allActions.DetailAction.OtherUser(currentUser));
              props.navigation.navigate("MyNetwork", {
                initialRoute: "Following",
              });
            }}
          >
            <AppText style={[styles.countText, { color: theme?.black }]}>
              {userData?.following_count}
            </AppText>
            <AppText style={[styles.followText, { color: theme?.black }]}>
              {language?.following}
            </AppText>
          </Pressable>
          <View style={styles.verticleLine}></View>
          <View style={styles.countSection}>
            <AppText style={[styles.countText, { color: theme?.black }]}>
              {userData?.rating?.toFixed(1)}
            </AppText>
            <AppText style={[styles.followText, { color: theme?.black }]}>
              Rating
            </AppText>
          </View>
        </View>
        <View style={styles.planSection}>
          <CustomButton
            bg={colors.background}
            borderRadius={10}
            label="My Networks"
            textColor={colors.heading}
            width={wp(44.5)}
            height={hp(5)}
            fontSize={14}
            onPress={() => {
              dispatch(allActions.DetailAction.OtherUser(currentUser));
              props.navigation.navigate("MyNetwork", {
                initialRoute: "Follwers",
              });
            }}
          />
          <CustomButton
            bg={colors.background}
            borderRadius={10}
            label="Subscriptions"
            textColor={colors.heading}
            width={wp(44.5)}
            height={hp(5)}
            fontSize={14}
            onPress={() => props.navigation.navigate("Subscriptions")}
          />
        </View>
        <View style={{ marginTop: hp(3), paddingHorizontal: wp(3) }}>
          <StatusComp
            subscription={subscription}
            navigation={props.navigation}
            user={currentUser}
          />
        </View>
        <View style={{ marginTop: hp(3), paddingHorizontal: wp(3) }}>
          <ProficiencyComp
            selLevel={userData?.mrs_badge}
            cocaLeve={userData?.caco_level}
          />
        </View>
        <View style={{ marginVertical: hp(3), paddingHorizontal: wp(3) }}>
          <UserInfo userData={currentUser} />
        </View>
        <View style={{ marginBottom: hp(3), paddingHorizontal: wp(3) }}>
          <SellerInfo
            onPress={() => props.navigation.navigate("SavedSellers")}
          />
        </View>
        {/* <View style={{ marginBottom: hp(3), paddingHorizontal: wp(3) }}>
          <Shortcuts />
        </View> */}
        <View style={styles.otherSection}>
          <AppText style={[styles.title, { color: theme?.black }]}>
            Others
          </AppText>
          <View style={styles.tabSection}>
            <TouchableOpacity
              style={isStampScreen ? styles.selectedTab : styles.defaultTab}
              onPress={() => {
                setIsStampScreen(true);
                setIsWishlist(false);
                setIsCollection(false);
              }}
            >
              <AppText
                style={[
                  styles.tabText,
                  isStampScreen && { color: colors.cWhite },
                ]}
              >
                {language?.myStamp}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={isWishlist ? styles.selectedTab : styles.defaultTab}
              onPress={() => {
                setIsStampScreen(false);
                setIsWishlist(true);
                setIsCollection(false);
              }}
            >
              <AppText
                style={[styles.tabText, isWishlist && { color: colors.cWhite }]}
              >
                My Wishlist
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={isCollection ? styles.selectedTab : styles.defaultTab}
              onPress={() => {
                setIsStampScreen(false);
                setIsWishlist(false);
                setIsCollection(true);
              }}
            >
              <AppText
                style={[
                  styles.tabText,
                  isCollection && { color: colors.cWhite },
                ]}
              >
                Collections
              </AppText>
            </TouchableOpacity>
          </View>
          {isStampScreen &&
            (stampList?.length ? (
              <FlatList
                data={stampList}
                horizontal={true}
                style={{ paddingHorizontal: 2, marginVertical: hp(1.5) }}
                renderItem={renderStamps}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View style={styles.emptySection}>
                <AppText style={styles.emptyText}>
                  User don't have any Stamps.
                </AppText>
              </View>
            ))}
          {isWishlist &&
            (wishlist?.length ? (
              <FlatList
                data={wishlist}
                horizontal={true}
                style={{ paddingHorizontal: 2, marginVertical: hp(1.5) }}
                renderItem={renderStamps}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View style={styles.emptySection}>
                <AppText style={styles.emptyText}>
                  User don't have any wishlist Item.
                </AppText>
              </View>
            ))}
          {isCollection &&
            (collections?.length ? (
              <FlatList
                data={collections}
                horizontal={true}
                style={{ paddingHorizontal: 2, marginVertical: hp(1.5) }}
                renderItem={renderCollections}
                keyExtractor={(item) => item.id}
              />
            ) : (
              <View style={styles.emptySection}>
                <AppText style={styles.emptyText}>
                  User don't have any Collections.
                </AppText>
              </View>
            ))}
          <CustomButton
            bg={colors.color8}
            borderRadius={10}
            label="Show More"
            textColor={colors.cWhite}
            width={wp(50)}
            height={40}
            fontSize={14}
            style={{ alignSelf: "center" }}
            onPress={() => {
              if (isWishlist) {
                Helper.fbEvent("open_wishlist_from_profile_activity");
                dispatch(allActions.DetailAction.OtherUser(currentUser));
                props.navigation.navigate("MyWishlist");
              } else if (isCollection) {
                dispatch(allActions.DataAction.CollectionType("Album"));
                props.navigation.navigate("AllCollections");
              } else {
                props.navigation.navigate("MyItems");
              }
            }}
          />
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={imgModal}
        onRequestClose={() => {
          setImgModal(!imgModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <AppText style={styles.headingText}>Select Image</AppText>
            <TouchableOpacity
              onPress={() => {
                setImgModal(!imgModal);
                setTimeout(() => {
                  if (Platform.OS == "android") {
                    requestCameraPermission();
                  } else {
                    //   console.log("Take Picture clicked")
                    captureImage();
                  }
                }, 100);
              }}
            >
              <AppText style={styles.modalText}>{language?.takePhoto}</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setImgModal(!imgModal);
                setTimeout(() => {
                  chooseFile();
                }, 100);
              }}
            >
              <AppText style={styles.modalText}>
                {language?.chooseFromAlbums}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setImgModal(false)}>
              <AppText style={styles.cancelButton}>Cancel</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
