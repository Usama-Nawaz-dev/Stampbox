import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  Text,
  View,
  Modal,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";

import AppText from "../../../components/AppText";
import CoverPhoto from "../../../components/CoverPhoto";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  Phone,
  GradBtn,
  BottomSheet,
  SimpleHeader,
  FloatingInput,
} from "../../../components";

import colors from "../../../constant/colors";
import { SelectionSheet } from "../../Sheets";
import { TimePickers } from "../../../components";
import ErrorMessage from "../../forms/ErrorMessage";
import InputButton from "../../../components/InputButton";
import CustomDropDown from "../../../components/CustomDropDown";
import { newTopics, countries } from "../../../constant/staticData";

import moment from "moment";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import allActions from "../../../redux/actions";
import MindAxios from "../../../api/MindAxios";

import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";

const shippingData = [
  { value: "Pickup Only" },
  { value: "Shipping Local/Domestic Only (Country)" },
  { value: "Shipping International" },
];

const formatData = [
  { value: "Virtual" },
  { value: "Building" },
  { value: "Building and Virtual" },
];

const arrayChecker = (arr1, arr2) => {
  arr1.forEach((el) => {
    if (arr2?.length) {
      arr2.forEach((el2) => {
        if (el.key == el2.name) {
          el.isSelected = true;
        }
      });
    }
  });
};

const arrayChecker1 = (arr1, arr2) => {
  arr1.forEach((el) => {
    if (arr2?.length) {
      arr2.forEach((el2) => {
        // console.log(el.name, '----------' , el2.name)
        if (el.name == el2.name) {
          el.isSelected = true;
        }
      });
    }
  });
};

export const EditStore = (props) => {
  const storeDetail = useSelector((state) => state.DetailReducer.storeDetail);
  // console.log("Data------->>>>>>>", storeDetail);

  const dispatch = useDispatch();
  const time = storeDetail?.open_hours?.split("T");
  const [type, setType] = useState(storeDetail?.type);
  const [imgModal, setImgModal] = useState(false);
  const [coverImage, setCoverImage] = useState(
    storeDetail?.profile_media?.media_url
  );
  const [storeName, setStoreName] = useState(storeDetail?.name?.trim());
  const [description, setDescription] = useState(
    storeDetail?.description?.trim()
  );
  const [newImage, setNewImage] = useState(null);

  const categorySheetRef = useRef();
  const countrySheetRef = useRef();

  const dateToday = moment(new Date()).format("yyyy-MM-DD");

  // Local Time Conversions
  let localSTime = false;
  let localETime = false;
  if (time?.length) {
    localSTime = Helper.utcToLocalTime(`${dateToday} ${time[0]}`).split(" ");
    localETime = Helper.utcToLocalTime(`${dateToday} ${time[1]}`).split(" ");
  }

  const [check, setCheck] = useState(true);
  const [phoneError, setPhoneErr] = useState(false);
  const [web, setWeb] = useState(storeDetail?.website);

  const [openTime, setOpenTime] = useState(
    localSTime.length ? localSTime[1] : null
  );
  const [closeTime, setCloseTime] = useState(
    localETime.length ? localETime[1] : null
  );

  const [phone, setPhone] = useState(storeDetail?.phone);
  const [errMsgs, setErrMsgs] = useState({});

  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [categories, setCategories] = useState([]);
  const topicsArrStr = JSON.stringify(newTopics);
  // conver the string again to array of objects
  // using the JSON.parse() method
  const topicsArrDeepCopy = JSON.parse(topicsArrStr);
  const [current, setCurrent] = useState(topicsArrDeepCopy);
  const [listChanged, setListChanged] = useState(false);

  const [email, setEmail] = useState(storeDetail?.email);
  const [storeFormat, setStoreFormat] = useState(storeDetail?.store_format);
  const [shippingOption, setShippingOption] = useState(
    storeDetail?.shiping_option
  );
  
  // console.log("storeDetail", storeDetail);

  let countryId = 1;
  const staticCountries = Helper.deepCopy(countries)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
      isSelected: false,
      id: countryId++,
    })
  );
  arrayChecker(staticCountries, storeDetail?.countries);
  const [countriesData, setCountriesData] = useState(staticCountries);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setNewImage(null);
      };
    }, [])
  );

  if (categories?.length && check) {
    arrayChecker1(categories, storeDetail?.categories);
    setCheck(false);
  }
  const filterCategory = categories.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });

  const filterCountries = countriesData.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });

  const countryChecker = () => {
    if (filterCountries?.length == 1) {
      return filterCountries[0]?.key;
    } else if (filterCountries?.length > 1) {
      // console.log(filterCountries?.length);
      return `${filterCountries[0]?.key} & more`;
    } else {
      return language?.selectCountriesOfInterest;
    }
  };

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
      }
    })();
  }, []);

  const categoryChecker = () => {
    if (filterCategory?.length == 1) {
      return filterCategory[0]?.name;
    } else if (filterCategory?.length > 1) {
      return `${filterCategory[0]?.name} & more`;
    } else {
      return language?.selectCategoriesOfInterest;
    }
  };

  const toggleCategory = (selected, i) => {
    handleError(null, "categErrMessage");
    if (selected) {
      var result = categories.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: false,
          };
        } else {
          return item;
        }
      });
      setCategories(result);
    } else {
      var result = categories.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: true,
          };
        } else {
          return item;
        }
      });
      setCategories(result);
    }
  };

  const toggleCountries = (selected, i) => {
    handleError(null, "countryErrMessage");
    if (selected) {
      var res = countriesData.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: false,
          };
        } else {
          return item;
        }
      });
      setCountriesData(res);
    } else {
      var res = countriesData.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: true,
          };
        } else {
          return item;
        }
      });
      setCountriesData(res);
    }
  };

  useEffect(() => {
    if (storeDetail?.topics?.length) {
      current.filter((a) =>
        storeDetail?.topics?.some((b) => {
          if (a.id === b.id) {
            a.isSelected = true;
          }
        })
      );
    }
  }, []);

  const renderItem = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <Pressable
        onPress={() => {
          handleError(null, "topicErrMessage");
          current[index].isSelected = !current[index].isSelected;
          setCurrent(current);
          setListChanged(!listChanged);
        }}
        style={{ flexDirection: "row" }}
      >
        <View
          style={{
            height: 30,
            //   width: 100,
            maxWidth: 100,
            backgroundColor: "rgba(191, 114, 89, 0.2)",
            borderColor: item?.isSelected ? colors.theme : "transparent",
            borderWidth: 1.5,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 5,
          }}
        >
          <Text numberOfLines={1} style={{ color: "#BF7259" }}>
            {"  "}
            {item?.value}
            {"  "}
          </Text>
        </View>
      </Pressable>
    );
  };

  const handleError = (error, input, num) => {
    if (num !== undefined) {
      setPhoneErr(true);
    } else {
      setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
    }
  };

  const getTopicIds = () => {
    let ids = [];
    current?.filter((item) => {
      if (item.isSelected) {
        let id = item.id;
        ids.push(id);
      }
    });
    // console.log("ids", ids);
    return ids;
  };

  const Ids = getTopicIds();

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
        captureImage();
      } else {
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const chooseFile = async () => {
    launchImageLibrary({
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          setCoverImage(images.assets[0]);
          setNewImage(images?.assets[0]);
        } else {
        }
      })
      .catch((err) => {});
  };
  const captureImage = async (type) => {
    launchCamera({
      multiple: false,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          setCoverImage(images.assets[0]);
          setNewImage(images?.assets[0]);
        } else {
        }
      })
      .catch((err) => {});
  };

  const onUpdate = async () => {
    let isValid = true;
    if (!storeName) {
      setError("Store name is required.");
      isValid = false;
    }
    if (!filterCategory?.length && type === "Business") {
      handleError("Please select categories of Interest.", "categErrMessage");
      isValid = false;
    }

    if (!filterCountries?.length && type === "Business") {
      handleError("Please select countires of Interest.", "countryErrMessage");
      isValid = false;
    }

    if (!Ids?.length && type === "Business") {
      handleError("Please select tipics of Interest.", "topicErrMessage");
      isValid = false;
    }

    if (!phone?.length) {
      handleError("", "", "phone");
      isValid = false;
    }
    if (phone?.length < 7 || phoneError) {
      handleError("", "", "phone");
      isValid = false;
    }

    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var re = /^(?!.* )/;
    if (!email) {
      handleError(language?.email_is_missing, "emailErrMessage");
      isValid = false;
    } else if (reg.test(email.trim()) == false) {
      handleError(language?.please_enter_valid_email, "emailErrMessage");
      isValid = false;
    }

    if (!shippingOption) {
      handleError("Shipping option is Required.", "optionErrMessage");
      isValid = false;
    }

    if (!storeFormat) {
      handleError("Store format is Required.", "fromatErrMessage");
      isValid = false;
    }

    if (isValid) {
      if (newImage?.uri) {
        dispatch(allActions.DataAction.AppLoader(true));
        // console.log("Working...........till herer");
        let { headers } = await MindAxios.formdataConfig();
        let formdata = new FormData();
        formdata.append("is_stamp", "0");
        const newFile = {
          uri: newImage?.uri,
          type: "image/png",
          name: "photo.png",
          filename: "imageName.png",
        };
        formdata.append("media[]", newFile);
        fetch(Env.createUrl("medias"), {
          method: "POST",
          headers: headers,
          body: formdata,
        })
          .then((response) => response.json())
          .then((res) => {
            if (res?.success) {
              let mediaId = res?.result?.media[0]?.id;
              _updateStore(mediaId);
            } else {
              alert(language?.serverError);
            }
          })
          .catch((error) => {
            alert(error);
          });
      } else {
        _updateStore();
      }
    }
  };

  const _updateStore = async (mediaId) => {
    const myStartTime = Helper.changeDateTimeToUTCZero(
      `${dateToday}T${openTime}`
    ).split(" ");
    const myEndTime = Helper.changeDateTimeToUTCZero(
      `${dateToday}T${closeTime}`
    ).split(" ");

    if (mediaId !== undefined) {
      let body = {
        name: storeName,
        description: description,
        profile_media_id: mediaId ? mediaId : storeDetail?.profile_media_id,
        cover_media_id: null,
        type: type,
        open_hours: `${myStartTime[1]}T${myEndTime[1]}`,
        phone: phone,
        website: web,
        country_ids: filterCountries.map((item) => item.id),
        category_ids: filterCategory.map((item) => item.id),
        topic_ids: Ids,
        shiping_option: shippingOption,
        store_format: storeFormat,
        email: email,
      };
      // console.log("first----->>>>", body);
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        // STORE -> UPDATE
        Env.paramUrl("stores", storeDetail?.id),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      if (response.status == 200) {
        props.navigation.goBack();
        Helper.showToastMessage("Store Upated Successfully.", colors.green);
      } else {
        alert("Sever Error.");
      }
    } else {
      let body = {
        name: storeName,
        description: description,
        profile_media_id: mediaId ? mediaId : storeDetail?.profile_media_id,
        cover_media_id: null,
        type: type,
        open_hours: `${myStartTime[1]}T${myEndTime[1]}`,
        phone: phone,
        website: web,
        country_ids: filterCountries.map((item) => item.id),
        category_ids: filterCategory.map((item) => item.id),
        topic_ids: Ids,
        shiping_option: shippingOption,
        store_format: storeFormat,
        email: email,
      };
      // console.log("first----->>>>", body);
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        // STORE -> UPDATE
        Env.paramUrl("stores", storeDetail?.id),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      if (response.status == 200) {
        props.navigation.goBack();
        Helper.showToastMessage("Store Upated Successfully.", colors.green);
      } else {
        alert("Sever Error.");
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SimpleHeader
        title="Edit Store"
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView>
        <View style={styles.coverSection}>
          <CoverPhoto
            btnText={language?.uploadStoreLogo}
            uri={coverImage?.uri ? coverImage?.uri : coverImage}
            onPress={() => setImgModal(!imgModal)}
            showEdit={true}
          />
        </View>
        <View style={styles.inputSection}>
          <CustomDropDown
            position={-3}
            value={type}
            data={[{ value: "Indiviual" }, { value: "Business" }]}
            label={type ? language?.TypeofStore : language?.chooseType + "*"}
            style={[styles.dropdown, { width: "100%" }]}
            onChangeText={(value) => {
              setType(value);
            }}
          />
          <FloatingInput
            label={language?.storeName + "*"}
            value={storeName}
            onChangeText={(text) => {
              setError(false);
              setStoreName(text);
            }}
            error={error}
          />
          <FloatingInput
            value={email}
            label={language?.email}
            autoCapitalize={"none"}
            onChangeText={(text) => {
              handleError(null, "emailErrMessage");
              setEmail(text);
            }}
            error={errMsgs.emailErrMessage ? errMsgs.emailErrMessage : false}
          />
          <View style={{ marginVertical: 10 }}>
            <Phone
              phoneNumber={phone}
              setPhoneNumber={(val) => setPhone(val)}
              error={phoneError}
              setError={setPhoneErr}
            />
          </View>
          <CustomDropDown
            data={shippingData}
            value={shippingOption}
            label={
              shippingOption ? "Shipping Option" : "Select Shipping Option*"
            }
            left={15}
            position={-4}
            width="70%"
            onChangeText={(value) => {
              handleError(null, "optionErrMessage");
              setShippingOption(value);
            }}
          />
          <ErrorMessage
            visible={errMsgs.optionErrMessage ? true : false}
            error={errMsgs.optionErrMessage}
          />
          <CustomDropDown
            data={formatData}
            value={storeFormat}
            label={storeFormat ? "Store Format" : "Select Store Format*"}
            left={15}
            position={-4}
            width="70%"
            onChangeText={(value) => {
              handleError(null, "fromatErrMessage");
              setStoreFormat(value);
            }}
          />
          <ErrorMessage
            visible={errMsgs.fromatErrMessage ? true : false}
            error={errMsgs.fromatErrMessage}
          />

          {type == "Business" ? (
            <>
              <TimePickers
                time={openTime}
                date={dateToday}
                time1={closeTime}
                setTime={setOpenTime}
                setTime1={setCloseTime}
              />
              <FloatingInput
                label={language?.webUrl}
                value={web}
                autoCapitalize={"none"}
                onChangeText={(text) => setWeb(text)}
              />
              <InputButton
                onPress={() => {
                  categorySheetRef?.current?.open();
                }}
                label={language?.categoriesOfInterest}
                placeHolder={categoryChecker()}
                selected={
                  filterCategory[0]?.name ? filterCategory[0]?.name : null
                }
              />
              <ErrorMessage
                visible={errMsgs.categErrMessage ? true : false}
                error={errMsgs.categErrMessage}
              />
              <InputButton
                onPress={() => {
                  countrySheetRef?.current?.open();
                }}
                label={language?.countriesOfInterest}
                placeHolder={countryChecker()}
                selected={
                  filterCountries[0]?.key ? filterCountries[0]?.key : null
                }
              />
              <ErrorMessage
                visible={errMsgs.countryErrMessage ? true : false}
                error={errMsgs.countryErrMessage}
              />
              <AppText style={styles.inputText}>
                {language?.selectTopicsOfInterest}
              </AppText>
              <View style={{ marginTop: hp(1) }}>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={current}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={listChanged}
                />
              </View>
              <ErrorMessage
                visible={errMsgs.topicErrMessage ? true : false}
                error={errMsgs.topicErrMessage}
              />
            </>
          ) : null}

          <FloatingInput
            label="Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <GradBtn
            height={50}
            label="Update Store"
            style={{ marginBottom: hp(2) }}
            onPress={onUpdate}
          />
        </View>
      </KeyboardAwareScrollView>
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
      {/* Categories Sheets */}
      <BottomSheet
        ref={categorySheetRef}
        title={language?.selectCategoriesOfInterest}
        onPressClose={() => categorySheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(60)}
        ChildComponent={
          <SelectionSheet
            Data={categories}
            showImage={true}
            onValueChange={(selected, index) => toggleCategory(selected, index)}
          />
        }
      />
      {/* Countries Sheet */}
      <BottomSheet
        ref={countrySheetRef}
        title={language?.selectCountriesOfInterest}
        onPressClose={() => countrySheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(55)}
        ChildComponent={
          <SelectionSheet
            Data={countriesData}
            onValueChange={(selected, index) =>
              toggleCountries(selected, index)
            }
          />
        }
      />
    </View>
  );
};
