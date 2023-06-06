import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";

import { styles } from "./styles";

import Image from "react-native-fast-image";

import moment from "moment";
import InputButton from "../../../components/InputButton";
import PickModal from "../../../components/PickModal";

import colors from "../../../constant/colors";

import CustomDropDown from "../../../components/CustomDropDown";

import {
  genderData,
  languages,
  newTopics,
  countries,
} from "../../../constant/staticData";

import * as Yup from "yup";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import MonthPicker from "react-native-month-year-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import AppText from "../../../components/AppText";
import { useDispatch, useSelector } from "react-redux";
import allActions from "../../../redux/actions";
import Helper from "../../Helper";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
// import { dark as theme } from "../../../constant/colorsConfig";

import {
  ProfileHeader,
  FloatingInput,
  GradBtn,
  BottomSheet,
  Phone,
} from "../../../components";
import GooglePlaces from "../../../components/GooglePlaces";

import { SelectionSheet } from "../../Sheets";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Mininum 2 characters")
    .max(15, "Maximum 15 characters")
    .required("First name is required"),
  userName: Yup.string()
    .min(2, "Mininum 2 characters")
    .max(15, "Maximum 15 characters")
    .required("User name is required"),
  email: Yup.string().required().email().label("Email"),
  // phone: Yup.string()
  //   .required("required")
  //   .matches(phoneRegExp, "Phone number is not valid")
  //   .min(10, "to short")
  //   .max(14, "to long"),
  password: Yup.string()
    .min(6, "Mininum 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

const arrayChecker = (arr1, arr2) => {
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

import ThemeContext from "../../Context/ThemeContext";
import { images } from "../../../assets/images/Images";
import AuthContext from "../../Context/AuthContext";

const countriesChecker = (arr1, arr2) => {
  // console.log(arr1, arr2)
  arr1.forEach((el) => {
    el.value;
    if (arr2?.length) {
      arr2.forEach((el2) => {
        if (el.key == el2.name) {
          el.isSelected = true;
        }
      });
    }
  });
};

export const EditProfile = (props) => {
  const categorySheetRef = useRef();
  const countrySheetRef = useRef();
  // Redux values
  const user = useSelector((state) => state.ApiReducer.user);
  // console.log("user", user);
  let countryId = 1;
  const staticCountries = Helper.deepCopy(countries)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
      isSelected: false,
      id: countryId++,
    })
  );
  countriesChecker(staticCountries, user?.interested_in_countries);

  const [userData, setUserData] = useState(user);
  const [countriesData, setCountriesData] = useState(staticCountries);

  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [gender, setGender] = useState(user?.gender);
  const [selectedLang, setSelectedLang] = useState(user?.language);
  const [dob, setSelectedDob] = useState(user?.dob);
  //   user?.addresses ? user?.addresses[0]?.address : null
  // );
  const topicsArrStr = JSON.stringify(newTopics);
  // conver the string again to array of objects
  // using the JSON.parse() method
  const topicsArrDeepCopy = JSON.parse(topicsArrStr);
  const [current, setCurrent] = useState(topicsArrDeepCopy);
  const [listChanged, setListChanged] = useState(false);
  const { theme, mode } = useContext(ThemeContext);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [age, setAge] = useState(null);
  const [imgModal, setImgModal] = useState(false);
  const [profile, setProfile] = useState(user?.image_url);
  const [phoneError, setPhoneErr] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);

  const showPicker = useCallback((value) => setShow(value), []);

  const [categories, setCategories] = useState([]);
  const [checker, setChecker] = useState(true);

  const [values, setValues] = useState({
    firstName: user?.first_name,
    lastName: user?.last_name,
    userName: user?.username,
    phone: user?.phone,
    description: user?.description?.toString(),
  });

  const [address, setAddress] = useState({
    address: userData?.addresses[0]?.address,
    city: userData?.addresses[0]?.city,
    state: userData?.addresses[0]?.state,
    zipcode: userData?.addresses[0]?.zipcode,
    country: userData?.addresses[0]?.country,
  });
  const [errMsgs, setErrMsgs] = useState({});
  const [addressUpdate, setAddressUpdated] = useState(false);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
      let age = calculateAge(selectedDate);
      // console.log("age", age);
      setAge(age);
      setSelectedDob(moment(selectedDate).format("YYYY"));
    },
    [date, showPicker]
  );
  // calculate age
  const calculateAge = (birthday) => {
    // console.log("bith->", birthday);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  // const array = [
  //   { id: 1, interval: "Tuesday" },
  //   { id: 2, interval: "Wednesday" },
  //   { id: 3, interval: "Tuesday" },
  // ];
  // const required_result = [
  //   { id: 1, interval: "Tuesday", more: [{ id: 3, interval: "Tuesday" }] },
  //   { id: 2, interval: "Wednesday", more: [] }
  // ];
  useEffect(() => {
    if (user?.dob) {
      calculate();
    }
    if (user?.topics?.length) {
      current.filter((a) =>
        user?.topics?.some((b) => {
          if (a.id === b.id) {
            a.isSelected = true;
          }
        })
      );
      // console.log(current);
    }
  }, []);

  const calculate = () => {
    let birthday = new Date();
    birthday.setYear(user?.dob);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    let dateOfBirth = Math.abs(ageDate.getUTCFullYear() - 1970);
    setAge(dateOfBirth);
  };

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

  //Categories Api

  if (categories?.length && checker) {
    arrayChecker(categories, user?.categories);
    setChecker(false);
  }

  const filterCategory = categories.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
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

  const toggleCategory = (selected, i) => {
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
  const categoryChecker = () => {
    if (filterCategory?.length == 1) {
      return filterCategory[0]?.name;
    } else if (filterCategory?.length > 1) {
      return `${filterCategory[0]?.name} & more`;
    } else {
      return "Select category of interest";
    }
  };

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
  const chooseFile = async () => {
    launchImageLibrary({
      multiple: true,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
      // selectionLimit: 10
    })
      .then((images) => {
        if (images.assets) {
          setProfile(images.assets[0]?.uri);
        } else {
          // console.log("Cancled", images);
        }
      })
      .catch((err) => {
        //  console.log(err)
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
          setProfile(images.assets[0]?.uri);
        } else {
          // console.log("Cancelled");
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };
  const getTopicIds = () => {
    let ids = [];
    current.filter((item) => {
      if (item.isSelected) {
        let id = item.id;
        ids.push(id.toString());
      }
    });
    // console.log("ids", ids);
    return ids;
  };
  const handleConfirm = async () => {
    // console.log(dob)
    dispatch(allActions.DataAction.AppLoader(true));
    // setLoading(true);
    let { headers } = await MindAxios.formdataConfig();
    const userId = await Helper.getData("userId");
    let userObj = {
      first_name: values.firstName,
      last_name: values.lastName,
      username: values.userName,
      phone: values.phone,
      language: selectedLang,
      description: values.description,
      gender: gender,
      dob: dob,
      address: address,
      is_email_verified: "1",
    };
    let userAddress = userObj?.address;
    let body = {
      address: userAddress?.address?.address
        ? userAddress?.address?.address
        : userAddress?.address,
      city: userAddress?.city,
      state: userAddress?.state,
      zipcode: userAddress?.zipcode,
      country: userAddress?.country,
    };
    let category_ids = filterCategory.map((item) => item.id.toString());
    let country_ids = filterCountries.map((item) => item.id.toString());
    // console.log(category_ids)
    let Ids = getTopicIds();
    let formdata = new FormData();
    formdata.append("user_id", userId);
    formdata.append("user", JSON.stringify(userObj));
    formdata.append("topic_ids", JSON.stringify(Ids));
    formdata.append("category_ids", JSON.stringify(category_ids));
    formdata.append("interested_country_ids", JSON.stringify(country_ids));
    const newFileProfile = {
      uri: profile,
      type: "image/png",
      name: "photo21.png",
      filename: "imageName21.png",
    };
    formdata.append("profile_image", newFileProfile);
    // const newFileCover = {
    //   uri: backgroungImage,
    //   type: "image/png",
    //   name: "photo.png",
    //   filename: "imageName.png",
    // };
    // formdata.append("cover_image", newFileCover);

    if (addressUpdate) {
      const response = await MindAxios.post(
        // USER ADDRESS -> UPDATE
        Env.paramUrl("addresses", user?.addresses[0]?.id),
        body
      );
    }

    fetch(Env.createUrl("users/update"), {
      method: "POST",
      headers: headers,
      body: formdata,
    })
      .then((response) => response.json())
      .then(async (res) => {
        dispatch(allActions.DataAction.AppLoader(false));
        if (res?.success) {
          let { user } = res?.result;
          await dispatch(allActions.ApiAction.getUserApi());
          Helper.showToastMessage(
            "User Profile Updated Successfully",
            colors.green
          );
          props.navigation.goBack();
        } else {
          alert(language?.serverError);
        }
      })
      .catch((error) => {
        dispatch(allActions.DataAction.AppLoader(false));
        alert(error);
      });
  };
  const renderItem = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <Pressable
        onPress={() => {
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

  // const handleError = (error, input) => {
  //   setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  // };
  const handleError = (error, input, num) => {
    if (num !== undefined) {
      setPhoneErr(true);
    } else {
      setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
    }
  };

  const checkValidations = async () => {
    let isValid = true;
    if (!values.firstName) {
      handleError("First name is Required.", "firstNameErrMessage");
      isValid = false;
    }

    if (!values.userName) {
      handleError("User name is Required.", "userNameErrMessage");
      isValid = false;
    }

    if (address?.address == "") {
      alert("Please update your address.");
      // console.log(address)
      isValid = false;
    }

    if (isValid) {
      handleConfirm();
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.white }]}>
      <ProfileHeader
        title="Edit Profile"
        edit={false}
        onPressBack={() => props.navigation.goBack()}
      />
      <View style={styles.userSection}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setImgModal(true);
          }}
        >
          <Image
            source={images.Edit}
            resizeMode="contain"
            style={{ width: 13, height: 13 }}
          />
        </TouchableOpacity>
        <Image style={styles.userImage} source={{ uri: profile }} />
        {/* <Image style={styles.userImage} source={images.Profile} /> */}
      </View>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.inputsSection}>
          <View style={styles.inputContainer}>
            <FloatingInput
              label={language?.firstName + "*"}
              width={wp(40)}
              value={values.firstName}
              onChangeText={(text) => {
                handleError(null, "firstNameErrMessage");
                setValues({ ...values, firstName: text });
              }}
              error={
                errMsgs.firstNameErrMessage
                  ? errMsgs.firstNameErrMessage
                  : false
              }
            />
            <FloatingInput
              label={language?.lastName}
              width={wp(40)}
              value={values.lastName}
              onChangeText={(text) => setValues({ ...values, lastName: text })}
            />
          </View>
          <FloatingInput
            label={language?.userName + "*"}
            value={values.userName}
            autoCapitalize={"none"}
            onChangeText={(text) => {
              handleError(null, "userNameErrMessage");
              setValues({ ...values, userName: text });
            }}
            error={
              errMsgs.userNameErrMessage ? errMsgs.userNameErrMessage : false
            }
          />
          <InputButton
            onPress={() => showPicker(true)}
            label={language?.birthYear}
            placeHolder={dob ? dob : language?.dateOfBirth}
            selected={dob}
          />
          {age ? (
            <FloatingInput
              label={language?.age}
              value={`${age?.toString()} ${language?.years_old}`}
              autoCapitalize={"none"}
              editable={false}
            />
          ) : null}
          <CustomDropDown
            data={genderData}
            position={-4}
            value={gender}
            label={gender ? "Gender" : "Select Gender"}
            onChangeText={(value) => setGender(value)}
          />
          <GooglePlaces
            address={address?.address}
            setAddress={(address) => {
              setAddress({ ...address, address });
              setAddressUpdated(true);
            }}
          />
          <View style={styles.inputContainer}>
            <FloatingInput
              label={language?.Town_City}
              width={wp(40)}
              value={address?.city?.toString()}
              onChangeText={(text) => {
                setAddress({ ...address, city: text });
                setAddressUpdated(true);
              }}
            />

            <FloatingInput
              label={language?.State_Province}
              width={wp(40)}
              value={address?.state?.toString()}
              onChangeText={(text) => {
                setAddress({ ...address, state: text });
                setAddressUpdated(true);
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <FloatingInput
              label={language?.zipCode}
              width={wp(40)}
              value={address?.zipcode?.toString()}
              onChangeText={(text) => {
                setAddress({ ...address, zipcode: text });
                setAddressUpdated(true);
              }}
            />

            <FloatingInput
              label={language?.country}
              width={wp(40)}
              value={address?.country?.toString()}
              onChangeText={(text) => {
                setAddress({ ...address, country: text });
                setAddressUpdated(true);
              }}
            />
          </View>

          {/* <FloatingInput
            label="Phone Number"
            value={values.phone}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={"phone-pad"}
            onChangeText={(text) => setValues({ ...values, phone: text })}
          /> */}
          <Phone
            phoneNumber={values.phone}
            setPhoneNumber={(number) => setValues({ ...values, phone: number })}
            error={phoneError}
            setError={setPhoneErr}
          />
          <InputButton
            onPress={() => setModalVisible(true)}
            label="Preferred Language"
            placeHolder={selectedLang ? selectedLang : "Select Language"}
            selected={selectedLang}
          />
          <FloatingInput
            label="Description"
            value={values.description}
            autoCorrect={false}
            // keyboardType={"phone-pad"}
            onChangeText={(text) => setValues({ ...values, description: text })}
          />
          <InputButton
            onPress={() => {
              categorySheetRef?.current?.open();
            }}
            label={language?.categoriesOfInterest}
            placeHolder={categoryChecker()}
            selected={filterCategory[0]?.name ? filterCategory[0]?.name : null}
          />
          <InputButton
            onPress={() => {
              countrySheetRef?.current?.open();
            }}
            label={language?.countriesOfInterest}
            placeHolder={countryChecker()}
            selected={filterCountries[0]?.key ? filterCountries[0]?.key : null}
          />
          <AppText style={styles.inputText}>
            {language?.selectTopicsOfInterest}
          </AppText>
          <View style={{ marginBottom: hp(1), marginTop: hp(1) }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={current}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              extraData={listChanged}
            />
          </View>
          <GradBtn label="Continue" height={50} onPress={checkValidations} />
        </View>
      </KeyboardAwareScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <PickModal
          setModalVisible={() => setModalVisible(false)}
          modalData={languages}
          onPress={(item) => {
            setSelectedLang(item.value);
            setModalVisible(false);
          }}
        />
      </Modal>
      {/* {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          maximumDate={new Date()}
          locale="en"
          mode="full"
          autoTheme={false}
        />
      )} */}

      {/* DOB Picker */}
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        value={date}
        maximumDate={new Date()}
        display={"spinner"}
        onCancel={() => setShow(false)}
        onConfirm={(date) => {
          let age = calculateAge(date);
          setAge(age);
          setSelectedDob(moment(date).format("YYYY"));
          setShow(false);
        }}
      />

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
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
