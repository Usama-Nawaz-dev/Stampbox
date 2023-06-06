import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Modal,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { styles } from "./styles";

import CustomDropDown from "../../../components/CustomDropDown";
import CoverPhoto from "../../../components/CoverPhoto";
import AppText from "../../../components/AppText";

import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import GooglePlaces from "../../../components/GooglePlaces";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import {
  FloatingInput,
  GradBtn,
  SimpleHeader,
  TimePickers,
  Phone,
  BottomSheet,
} from "../../../components";

import InputButton from "../../../components/InputButton";
import { newTopics, countries } from "../../../constant/staticData";

import { SelectionSheet } from "../../Sheets";
import colors from "../../../constant/colors";
import ErrorMessage from "../../forms/ErrorMessage";
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

export const CreateStore = (props) => {
  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [type, setType] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [Address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipcode: null,
    country: "",
  });

  const categorySheetRef = useRef();
  const countrySheetRef = useRef();

  const [imgModal, setImgModal] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [phoneError, setPhoneErr] = useState(false);
  const [description, setDescription] = useState(null);
  const [web, setWeb] = useState(null);
  const [openTime, setOpenTime] = useState(null);
  const [closeTime, setCloseTime] = useState(null);
  const [phone, setPhone] = useState(null);
  const [errMsgs, setErrMsgs] = useState({});
  const { theme } = useContext(ThemeContext);

  const [categories, setCategories] = useState([]);
  const topicsArrStr = JSON.stringify(newTopics);
  // conver the string again to array of objects
  // using the JSON.parse() method
  const topicsArrDeepCopy = JSON.parse(topicsArrStr);
  const [current, setCurrent] = useState(topicsArrDeepCopy);
  const [listChanged, setListChanged] = useState(false);

  const [email, setEmail] = useState(currentUser?.email);
  const [storeFormat, setStoreFormat] = useState(null);
  const [shippingOption, setShippingOption] = useState(null);

  let countryId = 1;
  const staticCountries = Helper.deepCopy(countries)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
      isSelected: false,
      id: countryId++,
    })
  );
  const [countriesData, setCountriesData] = useState(staticCountries);
  const dateToday = moment(new Date()).format("yyyy-MM-DD");

  const dispatch = useDispatch();
  const {
    myState: { language },
  } = useContext(AuthContext);

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
  const chooseFile = async () => {
    launchImageLibrary({
      multiple: false,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
      // selectionLimit: 10
    })
      .then((images) => {
        if (images.assets) {
          setCoverImage(images.assets[0]);
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
        } else {
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };

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
    return ids;
  };

  const Ids = getTopicIds();

  const checkValidation = () => {
    let isValid = true;

    if (!type) {
      handleError("Store type is Required.", "typeErrMessage");
      isValid = false;
    }

    if (!storeName) {
      handleError("Store name is Required.", "storeNameErrMessage");
      isValid = false;
    }

    if (!filterCategory?.length && type === "Busniess") {
      handleError("Please select categories of Interest.", "categErrMessage");
      isValid = false;
    }

    if (!filterCountries?.length && type === "Busniess") {
      handleError("Please select countires of Interest.", "countryErrMessage");
      isValid = false;
    }

    if (!Ids?.length && type === "Busniess") {
      handleError("Please select tipics of Interest.", "topicErrMessage");
      isValid = false;
    }

    if (!Address?.address) {
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
      // console.log(body)
      if (type === "Busniess") {
        createBusniessStore();
      } else {
        createIndiviualStore();
      }
    } else {
      alert("Please fill all the required fileds.");
    }
  };

  const createIndiviualStore = async () => {
    const userId = await Helper.getData("userId");
    if (coverImage) {
      let { headers } = await MindAxios.formdataConfig();
      let formdata = new FormData();
      formdata.append("is_stamp", "1");
      const newFile = {
        uri: coverImage?.uri,
        type: "image/png",
        name: "photo.png",
        filename: "imageName.png",
      };
      formdata.append("media[]", newFile);

      dispatch(allActions.DataAction.AppLoader(true));
      fetch(Env.createUrl("medias"), {
        method: "POST",
        headers: headers,
        body: formdata,
      })
        .then((response) => response.json())
        .then(async (res) => {
          const {
            success,
            result: {
              media: [{ id: media_id }],
            },
          } = res;
          if (success) {
            let body = {
              name: storeName,
              description: description,
              profile_media_id: media_id,
              cover_media_id: null,
              type: type,
              address: Address,
              shiping_option: shippingOption,
              store_format: storeFormat,
              email: email,
            };
            const response = await MindAxios.post(
              Env.createUrl("stores"),
              body
            );
            dispatch(allActions.DataAction.AppLoader(false));
            if (response?.status == 200) {
              if (userId) {
                const {
                  data: {
                    result: { user },
                  },
                } = await MindAxios.get(Env.paramUrl("users", userId));
                if (user) {
                  dispatch(allActions.ApiAction.getUserApi(user));
                  props.navigation.navigate("MyStoreStack", {
                    screen: "MyStore",
                  });
                  Helper.showToastMessage(
                    "Store Created Successfully.",
                    colors.green
                  );
                }
              }
            }
          }
        })
        .catch((error) => {
          dispatch(allActions.DataAction.AppLoader(false));
          // setLoading(false);
          alert(error);
        });
    } else {
      alert("Please upload store photo.");
    }
  };
  const createBusniessStore = () => {
    console.log(closeTime, openTime);
    if (closeTime && openTime) {
      const myStartTime = Helper.changeDateTimeToUTCZero(
        `${dateToday}T${openTime}`
      ).split(" ");
      const myEndTime = Helper.changeDateTimeToUTCZero(
        `${dateToday}T${closeTime}`
      ).split(" ");
      console.log(myStartTime, myEndTime);
      let time = `${myStartTime[1]}T${myEndTime[1]}`;
      create_BusniessStore(time);
    } else {
      console.log("no time");
      create_BusniessStore(null);
    }
  };
  const create_BusniessStore = async (time) => {
    // console.log("body-->", body);

    const userId = await Helper.getData("userId");
    if (coverImage) {
      dispatch(allActions.DataAction.AppLoader(true));
      let { headers } = await MindAxios.formdataConfig();
      let formdata = new FormData();
      formdata.append("is_stamp", "1");
      const newFile = {
        uri: coverImage?.uri,
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
        .then(async (res) => {
          const {
            success,
            result: {
              media: [{ id: media_id }],
            },
          } = res;
          if (success) {
            let body = {
              name: storeName,
              description: description,
              profile_media_id: media_id,
              cover_media_id: null,
              type: type,
              phone: phone,
              website: web,
              address: Address,
              open_hours: time ? time : null,
              country_ids: filterCountries.map((item) => item.id),
              category_ids: filterCategory.map((item) => item.id),
              topic_ids: Ids,
              shiping_option: shippingOption,
              store_format: storeFormat,
              email: email,
            };

            const response = await MindAxios.post(
              Env.createUrl("stores"),
              body
            );

            dispatch(allActions.DataAction.AppLoader(false));
            if (response?.status == 200) {
              if (userId) {
                const {
                  data: {
                    result: { user },
                  },
                } = await MindAxios.get(Env.paramUrl("users", userId));
                if (user) {
                  dispatch(allActions.ApiAction.getUserApi(user));
                  props.navigation.navigate("MyStoreStack", {
                    screen: "MyStore",
                  });
                }
              }
            }
          }
        })
        .catch((error) => {
          dispatch(allActions.DataAction.AppLoader(false));
          alert(error);
        });
    } else {
      alert("Please upload store Photo");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <SimpleHeader
        title={language?.createStore}
        onPressBack={() => {
          props.navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView>
        <View style={styles.coverSection}>
          <CoverPhoto
            btnText={language?.uploadStoreLogo}
            theme={theme}
            uri={coverImage ? coverImage.uri : null}
            onPress={() => setImgModal(!imgModal)}
          />
        </View>
        <View style={[styles.inputsSection, { width: "90%" }]}>
          <CustomDropDown
            position={-3}
            data={[{ value: "Indiviual" }, { value: "Busniess" }]}
            label={type ? language?.TypeofStore : language?.chooseType + "*"}
            style={[styles.dropdown, { width: "100%" }]}
            onChangeText={(value) => {
              handleError(null, "typeErrMessage");
              setType(value);
            }}
          />
          <ErrorMessage
            visible={errMsgs.typeErrMessage ? true : false}
            error={errMsgs.typeErrMessage}
          />
          <FloatingInput
            label={language?.storeName + "*"}
            value={storeName}
            onChangeText={(text) => {
              handleError(null, "storeNameErrMessage");
              setStoreName(text);
            }}
            error={
              errMsgs.storeNameErrMessage ? errMsgs.storeNameErrMessage : false
            }
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

          <GooglePlaces address={Address?.address} setAddress={setAddress} />

          <View style={styles.inputContainer}>
            <FloatingInput
              label={language?.Town_City + "*"}
              value={Address?.city}
              width={wp(40)}
              onChangeText={(text) => setAddress({ ...Address, city: text })}
            />

            <FloatingInput
              label={language?.State_Province + "*"}
              value={Address?.state}
              width={wp(40)}
              onChangeText={(text) => setAddress({ ...Address, state: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <FloatingInput
              label={language?.zipCode}
              width={wp(40)}
              value={Address?.zipcode?.toString()}
              onChangeText={(text) => setAddress({ ...Address, zipcode: text })}
            />

            <FloatingInput
              label={language?.country}
              width={wp(40)}
              value={Address?.country}
              onChangeText={(text) => setAddress({ ...Address, country: text })}
            />
          </View>

          <FloatingInput
            label={language?.description}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />

          {type == "Busniess" ? (
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

          <GradBtn
            onPress={checkValidation}
            label={language?.createStore}
            height={50}
            style={{ marginBottom: hp(3) }}
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
            <Text style={styles.headingText}>Select Image</Text>
            <TouchableOpacity
              onPress={() => {
                setImgModal(!imgModal);
                setTimeout(() => {
                  if (Platform.OS == "android") {
                    requestCameraPermission();
                  } else {
                    // console.log("Take Picture clicked");
                    captureImage();
                  }
                }, 100);
              }}
            >
              <Text style={styles.modalText}>{language?.takePhoto}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setImgModal(!imgModal);
                setTimeout(() => {
                  chooseFile();
                }, 100);
              }}
            >
              <Text style={styles.modalText}>{language?.chooseFromAlbums}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setImgModal(false)}>
              <Text style={styles.cancelButton}>{language?.cancel}</Text>
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
