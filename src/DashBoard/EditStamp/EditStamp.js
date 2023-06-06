import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

import {
  Image,
  Text,
  View,
  Modal,
  FlatList,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { styles } from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Octicons from "react-native-vector-icons/Octicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import Info from "../../../components/Info";
import colors from "../../../constant/colors";
import AppText from "../../../components/AppText";
import ErrorMessage from "../../forms/ErrorMessage";
import CustomDropDown from "../../../components/CustomDropDown";

import {
  countries,
  newTopics,
  stampShapes,
  stampColors,
  stampGrades,
  qualityData,
  stampIssueTypes,
  stampFormatTypes,
  stampItemStatuses,
} from "../../../constant/staticData";

import PickModal from "../../../components/PickModal";
import InputButton from "../../../components/InputButton";

import moment from "moment";
import MonthPicker from "react-native-month-year-picker";
import { useSelector, useDispatch } from "react-redux";

import Helper from "../../Helper";
import Env from "../../../api/Env";
import MindAxios from "../../../api/MindAxios";
import allActions from "../../../redux/actions";

import {
  Tag,
  GradBtn,
  StampMedia,
  MainHeader,
  MultiPicker,
  BottomSheet,
  FloatingInput,
} from "../../../components";

import AuthContext from "../../Context/AuthContext";
import ThemeContext from "../../Context/ThemeContext";
import { MediaSheet, SelectionSheet } from "../../Sheets";

const arrayChecker = (arr1, arr2) => {
  arr1.forEach((el) => {
    if (arr2?.length) {
      arr2.forEach((el2) => {
        if (el.key == el2) {
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
        if (el.name == el2.name) {
          el.isSelected = true;
        }
      });
    }
  });
};

const otherData = [{ value: "Mix" }, { value: "N/A" }];

export function EditStamps(props) {
  const { item } = props.route.params;
  const imgData = [{ id: item.id, uri: item.media_url }];

  const stampDetail = useSelector((state) => state.DataReducer.stampItemDetail);

  const data = Helper.deepCopy(stampItemStatuses)?.map((item) => {
    item.isSelected = false;
    return item;
  });
  arrayChecker(data, stampDetail?.status);
  const myData = Helper.deepCopy(qualityData)?.map((item) => {
    item.isSelected = false;
    return item;
  });
  arrayChecker(myData, stampDetail?.quality);
  // selectedImages.append(imgData);
  const dispatch = useDispatch();
  const [Data, setData] = useState(data);
  const [qData, setQData] = useState(myData);
  const [imgModal, setImgModal] = useState(false);
  const [type1, setType1] = useState(stampDetail?.catalogue_number[0]?.type);
  const [type2, setType2] = useState(stampDetail?.catalogue_number[1]?.type);
  const [type3, setType3] = useState(stampDetail?.catalogue_number[2]?.type);
  const [num1, setNum1] = useState(
    stampDetail?.catalogue_number[0]?.number
      ? `${stampDetail?.catalogue_number[0]?.number}`
      : null
  );
  const [num2, setNum2] = useState(
    stampDetail?.catalogue_number[1]?.number
      ? `${stampDetail?.catalogue_number[1]?.number}`
      : null
  );
  const [num3, setNum3] = useState(
    stampDetail?.catalogue_number[2]?.number
      ? `${stampDetail?.catalogue_number[2]?.number}`
      : null
  );
  const [catalogue1, setCatalogue1] = useState(
    `${stampDetail?.catalogue_number[0]?.value}`
  );
  const [catalogue2, setCatalogue2] = useState(
    `${stampDetail?.catalogue_number[1]?.value}`
  );
  const [catalogue3, setCatalogue3] = useState(
    `${stampDetail?.catalogue_number[2]?.value}`
  );
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [date3, setDate3] = useState(new Date());
  const [show, setShow] = useState(false);
  const [year, setYear] = useState(stampDetail?.catalogue_number[0]?.year);
  const [year2, setYear2] = useState(stampDetail?.catalogue_number[1]?.year);
  const [year3, setYear3] = useState(stampDetail?.catalogue_number[2]?.year);
  const [picker, setPicker] = useState("");
  const [shape, setShape] = useState(stampDetail?.shape);
  const [issueType, setIssueType] = useState(stampDetail?.issue_type);
  const [condition, setCondition] = useState(stampDetail?.condition);
  const [grade, setGrade] = useState(stampDetail?.grade);
  const [selectColor, setSelectColor] = useState(stampDetail?.color);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(stampDetail?.country);
  const [name, setName] = useState(stampDetail?.name);
  const [yearIssued, setYearIssued] = useState(stampDetail?.year_issued);

  const [appriseYear, setAppriseYear] = useState(
    `${stampDetail?.estimated_catalogue_year}`
  );
  const [faceInput, setFaceInput] = useState(stampDetail?.denomination);
  const [perforation, setPerforation] = useState(stampDetail?.perforation);
  const [q_mint, setQ_mint] = useState(`${stampDetail?.quantity_owned?.mint}`);
  const [q_used, setQ_used] = useState(`${stampDetail?.quantity_owned?.used}`);
  const [totalStamps, setTotalStamps] = useState(
    stampDetail?.total_stamps_issued
  );
  const [fullSetNum, setFullSetNum] = useState(
    stampDetail?.related_set_stamps_count
  );
  const [coinVal, setCoinVal] = useState(`${stampDetail?.coins_value}`);
  const [estCatalogueVal, setEstCatalogueVal] = useState("");
  const [description, setDescription] = useState(stampDetail?.description);
  const selectedImages = useSelector(
    (state) => state.DataReducer.selected_images
  );
  // console.log(selectedImages)
  // const selectedImages = [...storeImages, ...imgData];
  const [currentImages, setCurrentImages] = useState(stampDetail?.medias);
  const [uploadedImages, setUploadedImages] = useState(stampDetail?.medias);
  const [topicSelectedList, setTopicSelectedList] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState(null);
  const [errMsgs, setErrMsgs] = useState({});
  const [quality, setQuality] = useState(false);
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState(stampDetail?.tags);
  const [intCategory, setIntCategory] = useState("");
  // const newTopics = topics.map((item) => {
  //   item.isSelected = false;
  //   return item;
  // });
  const topicsArrStr = JSON.stringify(newTopics);
  const topicsArrDeepCopy = JSON.parse(topicsArrStr);
  const [currentTopics, setCurrentTopics] = useState(topicsArrDeepCopy);
  const [itemFormat, setItemFormat] = useState(stampDetail?.format);
  const [countriesList, setCountriesList] = useState(
    stampDetail?.format === "Lot" ? [...otherData, ...countries] : countries
  );
  const [categories, setCategories] = useState([]);
  const [check, setCheck] = useState(true);
  const { theme, mode } = useContext(ThemeContext);
  const mediaSheetRef = useRef();
  const categorySheetRef = useRef();
  const statusSheetRef = useRef();
  const qualitySheetRef = useRef();
  const {
    myState: { language },
  } = useContext(AuthContext);

  const filterStatus = Data.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });

  const filterQuality = qData.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });

  if (categories?.length && check) {
    arrayChecker1(categories, stampDetail?.categories);
    setCheck(false);
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
  // const [topicCheck, setTopicCheck] = useState(true)
  useEffect(() => {
    if (stampDetail?.topics?.length) {
      currentTopics.filter((a) =>
        stampDetail?.topics?.some((b) => {
          if (a.id === b.id) {
            a.isSelected = true;
          }
        })
      );
    }
  }, []);

  const onSubmitEdit = () => {
    setTags("");
    tags != "" && setTagList([...tagList, tags]);
  };

  const showPicker = useCallback((value) => setShow(value), []);

  const toggle = (selected, i, statusData, check) => {
    if (selected) {
      var res = statusData.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: false,
          };
        } else {
          return item;
        }
      });
      check ? setData(res) : setQData(res);
    } else {
      var res = statusData.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: true,
          };
        } else {
          return item;
        }
      });
      check ? setData(res) : setQData(res);
    }
  };

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

  const checker = () => {
    if (filterStatus?.length == 1) {
      return filterStatus[0]?.key;
    } else if (filterStatus?.length > 1) {
      // console.log(filterStatus?.length);
      return `${filterStatus[0]?.key} & more`;
    } else {
      return language?.selectStatus + "*";
    }
  };

  const qualityChecker = () => {
    if (filterQuality?.length == 1) {
      return filterQuality[0]?.key;
    } else if (filterQuality?.length > 1) {
      return `${filterQuality[0]?.key} & more`;
    } else {
      return language?.selectQuality + "*";
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

  const dateCheck = () => {
    if (picker == 1) {
      return date1;
    } else if (picker == 2) {
      return date2;
    } else {
      return date3;
    }
  };

  const renderItem2 = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <Pressable
        onPress={() => {
          currentTopics[index].isSelected = !currentTopics[index].isSelected;

          setCurrentTopics(currentTopics);
          setTopicSelectedList(!topicSelectedList);
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
            {item.value}
            {"  "}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderSelectedImages = ({ item, index }) => {
    const marginRight = index == selectedImages?.length - 1 ? hp(10) : null;
    return (
      <StampMedia
        item={item}
        marginRight={marginRight}
        onRemoveMedia={() => {
          let tempArray = [...selectedImages];
          let uploadedTemp = [...uploadedImages];
          tempArray.splice(index, 1), uploadedTemp.splice(index, 1);
          dispatch(allActions.DataAction.SelectedImg([...tempArray]));
          setUploadedImages([...tempArray]);
        }}
        onChangeType={(val, item) => changeMediaType(val, item)}
      />
    );
  };

  const changeMediaType = async (type, item) => {
    dispatch(allActions.DataAction.AppLoader(true));
    const res = await MindAxios.post(Env.createUrl("medias/update"), {
      id: item?.id,
      type: type,
    });
    dispatch(allActions.DataAction.AppLoader(false));
    if (res?.status === 200) {
      let tempArray = [...selectedImages];
      const dataList = tempArray?.map((md) => {
        if (md?.id == item.id) {
          md.type = type;
        }
        return md;
      });
      dispatch(allActions.DataAction.SelectedImg([...dataList]));
      Helper.showToastMessage("Media type updated.", colors.green);
    } else {
      Helper.showToastMessage(
        "There's some error while updating media type.",
        colors.danger
      );
    }
  };

  const onValueChange = (event, newDate) => {
    if (picker == 1) {
      let selectedDate = newDate || date1;
      // console.log("date", moment(selectedDate).format("YYYY"));
      showPicker(false);
      setDate1(selectedDate);
      setYear(moment(selectedDate).format("YYYY"));
    } else if (picker == 2) {
      let selectedDate = newDate || date2;
      // console.log("date", moment(selectedDate).format("YYYY"));
      showPicker(false);
      setDate2(selectedDate);
      setYear2(moment(selectedDate).format("YYYY"));
    } else {
      let selectedDate = newDate || date3;
      // console.log("date", moment(selectedDate).format("YYYY"));
      showPicker(false);
      setDate3(selectedDate);
      setYear3(moment(selectedDate).format("YYYY"));
    }
  };

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };
  const getTopicIds = () => {
    let ids = [];
    currentTopics.filter((item) => {
      if (item.isSelected) {
        ids.push(item.id);
      }
    });
    // setSelectedTopicIds(ids)
    return ids;
  };
  const checkValidations = async () => {
    let isValid = true;

    if (!selectedImages?.length) {
      handleError("Media is required", "mediaErrMessage");
      isValid = false;
    }

    if (!name) {
      handleError("Please enter stamp name", "nameErrMessage");
      isValid = false;
    } else if (name.charAt(0) == " ") {
      handleError("Stamp name can not start with space", "nameErrMessage");
      isValid = false;
    }

    if (filterStatus?.length == 0) {
      handleError("Please select the status", "statusErrMessage");
      isValid = false;
    }

    if (!itemFormat) {
      handleError("Please select item format", "formatErrMessage");
      isValid = false;
    }

    if (!coinVal || coinVal <= 0) {
      handleError("Coin value must be greater then 0", "coinValErrMessage");
      isValid = false;
    }

    if (type2) {
      if (!num2) {
        handleError("Please add catalogue2 number", "catalogue2ErrMessage");
        isValid = false;
      }
      if (!catalogue2 || !year2) {
        handleError(
          "Please add catalogue2 Ecv & Year value",
          "catalogue2ValErr"
        );
        isValid = false;
      }
    }

    if (type3) {
      if (!num3) {
        handleError("Please add catalogue3 number", "catalogue3ErrMessage");
        isValid = false;
      }
      if (!catalogue3 || !year3) {
        handleError(
          "Please add catalogue3 Ecv & Year value",
          "catalogue3ValErr"
        );
        isValid = false;
      }
    }

    if (
      ["Single", "Pair", "Strip", "Block", "Plate Block"].includes(itemFormat)
    ) {
      if (!selectedCountry) {
        handleError("Please enter select country name", "countryErrMessage"),
          (isValid = false);
      }

      if (yearIssued == "") {
        handleError("Please enter year issued", "issuedYearErrMessage");
        isValid = false;
      }

      if (type1 == "") {
        handleError("Please select catalogue1 type", "catalogueErrorMessage");
        isValid = false;
      } else if (num1 == "") {
        handleError("Please add catalogue1 number", "catalogueErrorMessage");
        isValid = false;
      }
      if (!catalogue1 || !year) {
        handleError("Please add Ecv & Year values", "catalogueErrMsg");
        isValid = false;
      }

      if (!condition) {
        handleError("Please select the condition", "conditionErrMessage");
        isValid = false;
      }

      if (!filterQuality?.length) {
        handleError("Please select the quality", "qualityErrMessage");
        isValid = false;
      }

      if (!faceInput) {
        handleError("Please set face input value", "faceValueErrMessage");
        isValid = false;
      }
    } else if (itemFormat === "Pane") {
      if (type1 == "") {
        handleError("Please select catalogue1 type", "catalogueErrorMessage");
        isValid = false;
      } else if (num1 == "") {
        handleError("Please add catalogue1 number", "catalogueErrorMessage");
        isValid = false;
      }
      if (!catalogue1 || !year) {
        handleError("Please add Ecv & Year values", "catalogueErrMsg");
        isValid = false;
      }

      if (!condition) {
        handleError("Please select the condition", "conditionErrMessage");
        isValid = false;
      }

      if (!filterQuality?.length) {
        handleError("Please select the quality", "qualityErrMessage");
        isValid = false;
      }

      if (!faceInput) {
        handleError("Please set face input value", "faceValueErrMessage");
        isValid = false;
      }
    } else if (itemFormat === "Miniature Sheet") {
      if (type1 == "") {
        handleError("Please select catalogue1 type", "catalogueErrorMessage");
        isValid = false;
      } else if (num1 == "") {
        handleError("Please add catalogue1 number", "catalogueErrorMessage");
        isValid = false;
      }
      if (!catalogue1 || !year) {
        handleError("Please add Ecv & Year values", "catalogueErrMsg");
        isValid = false;
      }
    } else if (
      [
        "Souvenir Sheet",
        "FDC–Cacheted",
        "FDC-Envelop",
        "Envelop",
        "Booklet",
      ].includes(itemFormat)
    ) {
      if (!selectedCountry) {
        handleError("Please enter select country name", "countryErrMessage"),
          (isValid = false);
      }

      if (type1 == "") {
        handleError("Please select catalogue1 type", "catalogueErrorMessage");
        isValid = false;
      } else if (num1 == "") {
        handleError("Please add catalogue1 number", "catalogueErrorMessage");
        isValid = false;
      }
      if (!catalogue1 || !year) {
        handleError("Please add Ecv & Year values", "catalogueErrMsg");
        isValid = false;
      }
    } else if (itemFormat === "Lot") {
      if (type1 == "") {
        handleError("Please select catalogue1 type", "catalogueErrorMessage");
        isValid = false;
      } else if (num1 == "") {
        handleError("Please add catalogue1 number", "catalogueErrorMessage");
        isValid = false;
      }
      if (!catalogue1 || !year) {
        handleError("Please add Ecv & Year values", "catalogueErrMsg");
        isValid = false;
      }

      if (!faceInput) {
        handleError("Please set face input value", "faceValueErrMessage");
        isValid = false;
      }

      if (!fullSetNum) {
        handleError("Total stamp count is required", "totalStampErrMessage");
        isValid = false;
      }

      if (!totalStamps) {
        handleError("Total issued stamp is required", "issuedStampErrMessage");
        isValid = false;
      }
    } else if (itemFormat === "Complete Set") {
      if (!selectedCountry) {
        handleError("Please enter select country name", "countryErrMessage"),
          (isValid = false);
      }

      if (type1 == "") {
        handleError("Please select catalogue1 type", "catalogueErrorMessage");
        isValid = false;
      } else if (num1 == "") {
        handleError("Please add catalogue1 number", "catalogueErrorMessage");
        isValid = false;
      }
      if (!catalogue1 || !year) {
        handleError("Please add Ecv & Year values", "catalogueErrMsg");
        isValid = false;
      }
    }

    const topicIds = getTopicIds();
    // console.log(topicIds)
    if (!isValid) {
      alert("Please select all the required fileds.");
    } else {
      let catalogueList = [];
      if (type1) {
        catalogueList.push({
          type: type1,
          number: num1,
          value: catalogue1,
          year: year,
        });
      }
      if (type2) {
        catalogueList.push({
          type: type2,
          number: num2,
          value: catalogue2,
          year: year2,
        });
      }
      if (type3) {
        catalogueList.push({
          type: type3,
          number: num3,
          value: catalogue3,
          year: year3,
        });
      }
      let body = {
        media_ids: selectedImages.map((item) => item.id),
        name: name,
        country: selectedCountry,
        year_issued: yearIssued,
        denomination: faceInput,
        perforation: perforation,
        color: selectColor,
        condition: condition,
        estimated_sc_value: 99,
        // estimated_catalogue_year: appriseYear, //aprise year
        grade: grade,
        format: itemFormat,
        total_stamps_issued: totalStamps == "null" ? null : totalStamps,
        coins_value: coinVal == "null" ? null : coinVal,
        related_set_stamps_count: fullSetNum == "null" ? null : fullSetNum, //full set no
        shape: shape,
        issue_type: issueType,
        description: description,
        catalogue_number: catalogueList,
        quantity_owned: {
          used: q_used !== "null" ? q_used : null,
          mint: q_mint !== "null" ? q_mint : null,
        },
        status: filterStatus.map((item) => item.key),
        quality: filterQuality.map((item) => item.key),
        topic_ids: topicIds,
        category_ids: filterCategory.map((item) => item.id),
        tags: tagList.map((item) => item.name),
      };
      // console.log(body);
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        // STAMP ITEM -> UPDATE
        Env.paramUrl("stamp-items", stampDetail?.id),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("res", response);
      if (response.status == 200) {
        // console.log('res------->', response);
        dispatch(allActions.DataAction.SelectedImg([]));
        props.navigation.goBack();
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.white }}>
      <MainHeader
        title="Edit Stamp"
        onPressBack={() => {
          dispatch(allActions.DataAction.SelectedImg([]));
          props.navigation.goBack();
        }}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "90%", alignSelf: "center", marginBottom: hp(2) }}
      >
        <View style={styles.mediaSection}>
          <Info
            key1={language?.created_at}
            val1={moment(stampDetail.created_at).format(
              "YYYY-MM-DD [at] h:mmA"
            )}
            width={"100%"}
            textStyle={[styles.textStyle, { color: theme.davyGrey }]}
            infoStyle={{ color: theme.dovGray }}
          />
          <Info
            key1={language?.updated_at}
            val1={moment(stampDetail.updated_at).format(
              "YYYY-MM-DD [at] h:mmA"
            )}
            width={"100%"}
            textStyle={[styles.textStyle, { color: theme.davyGrey }]}
            infoStyle={{ color: theme.dovGray }}
          />
          <AppText style={[styles.mediaText, { color: theme.darkGrey }]}>
            {language?.selectMedia}
          </AppText>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[
                styles.addStampCard,
                {
                  backgroundColor: theme.white,
                  shadowColor: theme.black,
                },
              ]}
              onPress={() => {
                handleError(null, "mediaErrMessage");
                mediaSheetRef?.current?.open();
              }}
            >
              <Octicons name="plus" size={44} color={theme.theme} />
            </TouchableOpacity>
            <View style={{ marginLeft: 5 }}>
              <FlatList
                // inverted={true}
                data={selectedImages}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={renderSelectedImages}
              />
            </View>
          </View>
        </View>
        <ErrorMessage
          visible={errMsgs.mediaErrMessage ? true : false}
          error={errMsgs.mediaErrMessage}
        />
        <CustomDropDown
          height={hp(25)}
          data={stampFormatTypes}
          label={itemFormat ? "Item's Format" : "Select Format"}
          value={itemFormat}
          onChangeText={(value) => {
            setErrMsgs({});
            setItemFormat(value);
            if (value === "Lot") {
              setCountriesList([...otherData, ...countries]);
            } else {
              setCountriesList(countries);
            }
            if (selectedCountry === "N/A" || selectedCountry === "Mix") {
              setSelectedCountry(null);
            }
          }}
        />
        {
          <ErrorMessage
            visible={errMsgs.formatErrMessage ? true : false}
            error={errMsgs.formatErrMessage}
          />
        }
        <FloatingInput
          label="Name*"
          value={name}
          onChangeText={(text) => {
            handleError(null, "nameErrMessage");
            setName(text);
          }}
          error={errMsgs.nameErrMessage ? errMsgs.nameErrMessage : false}
        />
        <FloatingInput
          label={language?.yearIssued}
          value={yearIssued}
          keyboardType="numeric"
          onChangeText={(text) => {
            handleError(null, "issuedYearErrMessage");
            setYearIssued(text);
          }}
          error={
            errMsgs.issuedYearErrMessage ? errMsgs.issuedYearErrMessage : false
          }
        />
        <InputButton
          onPress={() => {
            handleError(null, "countryErrMessage");
            setModalVisible(true);
          }}
          label={language?.country}
          placeHolder={
            selectedCountry ? selectedCountry : language?.selectCountry
          }
          selected={selectedCountry}
        />
        <ErrorMessage
          visible={errMsgs.countryErrMessage ? true : false}
          error={errMsgs.countryErrMessage}
        />
        <MultiPicker
          inp1={false}
          inp2={true}
          pickerLabel={type1 ? "" : language?.selectType}
          onChangeText={(value) => {
            handleError(null, "catalogueErrorMessage");
            setType1(value);
          }}
          value={num1 == "undefined" ? null : num1}
          value2={type1}
          onChangeValue={(text) => {
            handleError(null, "catalogueErrorMessage");
            setNum1(text);
          }}
          place2={language?.enter_number}
          label={language?.catalogue_1_NameNumber + "*"}
        />
        <ErrorMessage
          visible={errMsgs.catalogueErrorMessage ? true : false}
          error={errMsgs.catalogueErrorMessage}
        />
        <MultiPicker
          inp1={true}
          inp2={false}
          value={
            catalogue1 == "undefined" || catalogue1 == "null"
              ? null
              : catalogue1
          }
          setValue={(val) => {
            setCatalogue1(val);
            setCoinVal(val * 100);
            handleError(null, "catalogueErrMsg");
          }}
          year={year}
          onPress={() => {
            setPicker(1);
            showPicker(true);
            handleError(null, "catalogueErrMsg");
          }}
          place1={language?.est_Catalogue_value}
          label={language?.catalogue_1_ValueValueYear + "*"}
        />
        <ErrorMessage
          visible={errMsgs.catalogueErrMsg ? true : false}
          error={errMsgs.catalogueErrMsg}
        />
        <MultiPicker
          inp1={false}
          inp2={true}
          place2={language?.enter_number}
          value={num2 == "undefined" || num2 == "null" ? null : num2}
          value2={type2}
          setValue={(val) => {
            setNum2(val);
            handleError(null, "catalogue2ErrMessage");
          }}
          pickerLabel={type2 ? "" : language?.selectType}
          onChangeText={(value) => {
            setType2(value);
            handleError(null, "catalogue2ErrMessage");
          }}
          label={language?.catalogue_2_name_number}
        />
        <ErrorMessage
          visible={errMsgs.catalogue2ErrMessage ? true : false}
          error={errMsgs.catalogue2ErrMessage}
        />
        <MultiPicker
          inp1={true}
          inp2={false}
          value={
            catalogue2 == "undefined" || catalogue2 == "null"
              ? null
              : catalogue2
          }
          setValue={(val) => {
            setCatalogue2(val);
            handleError(null, "catalogue2ValErr");
          }}
          year={year2}
          onPress={() => {
            setPicker(2);
            showPicker(true);
            handleError(null, "catalogue2ValErr");
          }}
          place1={language?.est_Catalogue_value}
          label={language?.catalogue_2_Value_ValueYear}
        />
        <ErrorMessage
          visible={errMsgs.catalogue2ValErr ? true : false}
          error={errMsgs.catalogue2ValErr}
        />
        <MultiPicker
          inp1={false}
          inp2={true}
          value={num3 == "undefined" || num3 == "null" ? null : num3}
          value2={type3}
          setValue={(val) => {
            setNum3(val);
            handleError(null, "catalogue3ErrMessage");
          }}
          place2={language?.enter_number}
          label={language?.catalogue_3_name_number}
          pickerLabel={type3 ? "" : language?.selectType}
          onChangeText={(value) => setType3(value)}
        />
        <ErrorMessage
          visible={errMsgs.catalogue3ErrMessage ? true : false}
          error={errMsgs.catalogue3ErrMessage}
        />
        <MultiPicker
          inp1={true}
          inp2={false}
          value={
            catalogue3 == "undefined" || catalogue3 == "null"
              ? null
              : catalogue3
          }
          setValue={(val) => {
            setCatalogue3(val);
            handleError(null, "catalogue3ValErr");
          }}
          year={year3}
          onPress={() => {
            setPicker(3);
            showPicker(true);
            handleError(null, "catalogue3ValErr");
          }}
          place1={language?.est_Catalogue_value}
          label={language?.catalogue_3_Value_ValueYear}
        />
        <ErrorMessage
          visible={errMsgs.catalogue3ValErr ? true : false}
          error={errMsgs.catalogue3ValErr}
        />
        <InputButton
          onPress={() => {
            handleError(null, "statusErrMessage");
            statusSheetRef?.current?.open();
          }}
          label="Status*"
          placeHolder={checker()}
          selected={filterStatus[0]?.key ? filterStatus[0]?.key : null}
        />
        <ErrorMessage
          visible={errMsgs.statusErrMessage ? true : false}
          error={errMsgs.statusErrMessage}
        />
        <InputButton
          onPress={() => {
            handleError(null, "qualityErrMessage");
            qualitySheetRef?.current?.open();
          }}
          label="Quality"
          placeHolder={qualityChecker()}
          selected={filterQuality[0]?.key ? filterQuality[0]?.key : null}
        />
        {
          <ErrorMessage
            visible={errMsgs.qualityErrMessage ? true : false}
            error={errMsgs.qualityErrMessage}
          />
        }
        <CustomDropDown
          data={[
            { value: "Mix" },
            { value: "Mint" },
            { value: "Used" },
            { value: "N/A" },
          ]}
          value={condition}
          label={condition ? "Condition" : "Select Condtion*"}
          position={-5}
          onChangeText={(value) => {
            setCondition(value);
            handleError(null, "conditionErrMessage");
          }}
        />
        {
          <ErrorMessage
            visible={errMsgs.conditionErrMessage ? true : false}
            error={errMsgs.conditionErrMessage}
          />
        }
        <CustomDropDown
          height={hp(25)}
          data={stampGrades}
          value={grade}
          label={grade ? language?.Grade_Centring : language?.selectGrade}
          onChangeText={(value) => {
            setGrade(value);
          }}
        />
        <CustomDropDown
          height={hp(25)}
          data={stampColors}
          value={selectColor}
          label={selectColor ? "Color" : language?.selectColor}
          width="40%"
          onChangeText={(value) => {
            setSelectColor(value);
          }}
        />
        <CustomDropDown
          data={stampShapes}
          value={shape}
          label={shape ? language?.shape : language?.selectShape}
          onChangeText={(value) => setShape(value)}
          width="40%"
        />
        <CustomDropDown
          data={stampIssueTypes}
          value={issueType}
          label={
            issueType ? language?.typeOfIssue : language?.select_Issue_Type
          }
          onChangeText={(value) => setIssueType(value)}
          position={-4}
          width="40%"
        />
        <FloatingInput
          label={language?.denomination + "/" + language?.faceValue}
          value={faceInput}
          keyboardType="numeric"
          onChangeText={(text) => {
            handleError(null, "faceValueErrMessage");
            setFaceInput(text);
          }}
          error={
            errMsgs.faceValueErrMessage ? errMsgs.faceValueErrMessage : false
          }
        />
        <FloatingInput
          label={language?.perforation}
          value={perforation}
          keyboardType="numeric"
          onChangeText={(text) => {
            handleError(null, "peforationErrMessage");
            setPerforation(text);
          }}
        />
        <FloatingInput
          label={language?.totalStampsIssued}
          value={
            totalStamps == "undefined" || totalStamps == "null"
              ? null
              : totalStamps
          }
          keyboardType="numeric"
          onChangeText={(text) => {
            handleError(null, "issuedStampErrMessage");
            setTotalStamps(text);
          }}
          error={
            errMsgs.issuedStampErrMessage
              ? errMsgs.issuedStampErrMessage
              : false
          }
        />
        <FloatingInput
          label={language?.noInFullSet}
          value={
            fullSetNum == "undefined" || fullSetNum == "null"
              ? null
              : fullSetNum
          }
          keyboardType="numeric"
          onChangeText={(text) => {
            handleError(null, "totalStampErrMessage");
            setFullSetNum(text);
          }}
          error={
            errMsgs.totalStampErrMessage ? errMsgs.totalStampErrMessage : false
          }
        />

        <FloatingInput
          label={language?.suggestedCoinsValue + "*"}
          value={coinVal.toString()}
          keyboardType="numeric"
          onChangeText={(text) => {
            handleError(null, "coinValErrMessage");
            setCoinVal(text);
          }}
          error={errMsgs.coinValErrMessage ? errMsgs.coinValErrMessage : false}
        />

        <FloatingInput
          label={language?.quantityOwned + " " + "(" + language?.mint + ")"}
          value={q_mint == "undefined" || q_mint == "null" ? null : q_mint}
          keyboardType="numeric"
          onChangeText={(text) => {
            setQ_mint(text);
          }}
        />
        <FloatingInput
          label={language?.quantityOwned + " " + "(" + language?.used + ")"}
          value={q_used == "undefined" || q_used == "null" ? null : q_used}
          keyboardType="numeric"
          onChangeText={(text) => {
            setQ_used(text);
          }}
        />
        <FloatingInput
          label="Description"
          value={description}
          description={true}
          multiline
          onChangeText={(text) => {
            setDescription(text);
          }}
        />
        <View style={styles.itemPicker}>
          <AppText style={[styles.inputText, { color: theme.davyGrey }]}>
            Tags
          </AppText>
          <View style={styles.tagSection}>
            <ScrollView style={{ flex: 0.7 }}>
              <View style={styles.listSection}>
                {tagList.map((item, index) => {
                  // console.log(item?.name)
                  return (
                    <Tag
                      item={item?.name}
                      onPress={() => {
                        let tempArray = [...tagList];
                        tempArray.splice(index, 1);
                        setTagList([...tempArray]);
                      }}
                    />
                  );
                })}
              </View>
            </ScrollView>
            <View style={styles.inputSection}>
              <TextInput
                style={styles.tagInput}
                placeholderTextColor={colors.placeholderText}
                autoCapitalize={"none"}
                placeholder={language?.enter_new_tag + "..."}
                onChangeText={(text) => {
                  setTags({ name: text });
                }}
                onSubmitEditing={onSubmitEdit}
                value={tags}
              />
            </View>
          </View>
        </View>
        <InputButton
          onPress={() => categorySheetRef?.current?.open()}
          label={language?.categories}
          placeHolder={categoryChecker()}
          selected={filterCategory[0]?.name ? filterCategory[0]?.name : null}
        />

        <View style={styles.itemPicker}>
          <Text style={[styles.inputText, { color: theme.davyGrey }]}>
            {language?.selectTopicsOfInterest}
          </Text>

          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={currentTopics}
            renderItem={renderItem2}
            keyExtractor={(item, index) => index.toString()}
            extraData={topicSelectedList}
          />
        </View>
        <GradBtn label="Update" height={50} onPress={checkValidations} />
      </KeyboardAwareScrollView>

      {/* Picker Modal */}
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
          modalData={countriesList}
          placeholder={language?.searchCountries}
          onPress={(item) => {
            setSelectedCountry(item?.value);
            setModalVisible(false);
          }}
        />
      </Modal>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={dateCheck()}
          maximumDate={new Date()}
          locale="en"
          mode="short"
          autoTheme={false}
        />
      )}
      <BottomSheet
        ref={mediaSheetRef}
        sheetHeight={hp(35)}
        ChildComponent={
          <MediaSheet
            showStampBtn={false}
            onSelectPhone={() => {
              mediaSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("AddItem", { isStamp: 1 });
              }, 300);
            }}
            onSelectStampbox={() => {
              mediaSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("StampboxMedia", { isStamp: 1 });
              }, 300);
            }}
            onPressCancel={() => {
              setTimeout(() => {
                mediaSheetRef?.current?.close();
              }, 300);
            }}
          />
        }
      />
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
        ref={statusSheetRef}
        title={language?.selectStatus}
        onPressClose={() => statusSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(55)}
        ChildComponent={
          <SelectionSheet
            Data={Data}
            onValueChange={(selected, index) =>
              toggle(selected, index, Data, true)
            }
          />
        }
      />
      <BottomSheet
        ref={qualitySheetRef}
        title={language?.selectQuality}
        onPressClose={() => qualitySheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(55)}
        ChildComponent={
          <SelectionSheet
            Data={qData}
            onValueChange={(selected, index) =>
              toggle(selected, index, qData, false)
            }
          />
        }
      />
    </View>
  );
}
