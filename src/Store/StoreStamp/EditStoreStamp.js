import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";

import {
  Image,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  View,
  Pressable,
  FlatList,
  Modal,
  Switch,
} from "react-native";

import { styles } from "./styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Octicons from "react-native-vector-icons/Octicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import colors from "../../../constant/colors";
import moment from "moment";
import CustomDropDown from "../../../components/CustomDropDown";

import ErrorMessage from "../../forms/ErrorMessage";

import {
  countries,
  stampItemStatuses,
  newTopics,
  stampShapes,
  stampColors,
  stampIssueTypes,
  stampGrades,
  stampFormatTypes,
  qualityData,
} from "../../../constant/staticData";

import {
  MainHeader,
  FloatingInput,
  MultiPicker,
  GradBtn,
  BottomSheet,
  Tag,
  DatePickerTime,
} from "../../../components";

import InputButton from "../../../components/InputButton";
import PickModal from "../../../components/PickModal";
import MonthPicker from "react-native-month-year-picker";
// REDUX
import { useSelector, useDispatch } from "react-redux";
import Env from "../../../api/Env";
import allActions from "../../../redux/actions";
import MindAxios from "../../../api/MindAxios";
import AppText from "../../../components/AppText";

import { MediaSheet, SelectionSheet } from "../../Sheets";

import ThemeContext from "../../Context/ThemeContext";
import Helper from "../../Helper";
import InputsRow from "./InputsRow";
import BorderBtn from "../../../components/BorderBtn";
import DateAndTime from "../../../components/DateAndTime";
import AuthContext from "../../Context/AuthContext";

const shippingData = [
  { value: "Pickup Only" },
  { value: "Shipping Local/Domestic Only (Country)" },
  { value: "Shipping International" },
];

const policyData = [
  { value: "Domestic Returns Accepted" },
  { value: "International Returns Accepted" },
];

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
        // console.log(el.name, '----------' , el2.name)
        if (el.name == el2.name) {
          el.isSelected = true;
        }
      });
    }
  });
};

const otherData = [{ value: "Mix" }, { value: "N/A" }];

export const EditStoreStamp = (props) => {
  const ItemDetail = useSelector((state) => state.DetailReducer.stampDetail);
  // console.log(ItemDetail)
  const dateTime = ItemDetail?.published_at
    ? Helper.utcToLocalTime(ItemDetail?.published_at).split(" ")
    : null;

  const data = Helper.deepCopy(stampItemStatuses)?.map((item) => {
    item.isSelected = false;
    return item;
  });
  arrayChecker(data, ItemDetail?.productable?.status);
  const myData = qualityData.map((item) => {
    item.isSelected = false;
    return item;
  });
  arrayChecker(myData, ItemDetail?.productable?.quality);
  const dispatch = useDispatch();
  // console.log("data-->", stampShapes);

  const [Data, setData] = useState(data);
  const [qData, setQData] = useState(myData);
  const [type1, setType1] = useState(
    ItemDetail?.productable?.catalogue_number[0]?.type
  );
  const [type2, setType2] = useState(
    ItemDetail?.productable?.catalogue_number[1]?.type
  );
  const [type3, setType3] = useState(
    ItemDetail?.productable?.catalogue_number[2]?.type
  );
  const [num1, setNum1] = useState(
    ItemDetail?.productable?.catalogue_number[0]?.number?.toString()
  );
  const [num2, setNum2] = useState(
    ItemDetail?.productable?.catalogue_number[1]?.number?.toString()
  );
  const [num3, setNum3] = useState(
    ItemDetail?.productable?.catalogue_number[2]?.number?.toString()
  );
  const [catalogue1, setCatalogue1] = useState(
    ItemDetail?.productable?.catalogue_number[0]?.value?.toString()
  );
  const [catalogue2, setCatalogue2] = useState(
    ItemDetail?.productable?.catalogue_number[1]?.value?.toString()
  );
  const [catalogue3, setCatalogue3] = useState(
    ItemDetail?.productable?.catalogue_number[2]?.value?.toString()
  );
  const [customValue1, setCustomValue1] = useState(
    ItemDetail?.productable?.catalogue_number[0]?.custom_value
  );
  const [customValue2, setCustomValue2] = useState(
    ItemDetail?.productable?.catalogue_number[1]?.custom_value
  );
  const [customValue3, setCustomValue3] = useState(
    ItemDetail?.productable?.catalogue_number[2]?.custom_value
  );
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [date3, setDate3] = useState(new Date());
  const [show, setShow] = useState(false);
  const [year, setYear] = useState(
    ItemDetail?.productable?.catalogue_number[0]?.year
  );
  const [year2, setYear2] = useState(
    ItemDetail?.productable?.catalogue_number[1]?.year
  );
  const [year3, setYear3] = useState(
    ItemDetail?.productable?.catalogue_number[2]?.year
  );
  const [picker, setPicker] = useState("");
  const [shape, setShape] = useState(ItemDetail?.productable?.shape);
  const [issueType, setIssueType] = useState(
    ItemDetail?.productable?.issue_type
  );
  const [condition, setCondition] = useState(
    ItemDetail?.productable?.condition
  );
  const [grade, setGrade] = useState(ItemDetail?.productable?.grade);
  const [selectColor, setSelectColor] = useState(
    ItemDetail?.productable?.color
  );
  const [shipping, setShipping] = useState(ItemDetail?.shipping_instructions);
  const [check, setCheck] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    ItemDetail?.productable?.country
  );
  const [name, setName] = useState(ItemDetail?.productable?.name);
  const [itemName, setItemName] = useState(ItemDetail?.name);
  const [yearIssued, setYearIssued] = useState(
    ItemDetail?.productable?.year_issued
  );

  const [appriseYear, setAppriseYear] = useState(
    `${ItemDetail?.productable?.estimated_catalogue_year}`
  );
  const [faceInput, setFaceInput] = useState(
    ItemDetail?.productable?.denomination
  );
  const [perforation, setPerforation] = useState(
    ItemDetail?.productable?.perforation
  );
  const [q_mint, setQ_mint] = useState(
    `${ItemDetail?.productable?.quantity_owned?.mint}`
  );
  const [q_used, setQ_used] = useState(
    `${ItemDetail?.productable?.quantity_owned?.used}`
  );
  const [totalStamps, setTotalStamps] = useState(
    `${ItemDetail?.productable?.total_stamps_issued}`
  );
  const [fullSetNum, setFullSetNum] = useState(
    `${ItemDetail?.productable?.related_set_stamps_count}`
  );
  const [coinVal, setCoinVal] = useState(
    `${ItemDetail?.productable?.coins_value}`
  );
  const [estCatalogueVal, setEstCatalogueVal] = useState("");
  const [description, setDescription] = useState(ItemDetail?.description);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const selectedImages = useSelector(
    (state) => state.DataReducer.selected_images
  );

  const [date, setDate] = useState(dateTime ? dateTime[0] : "");
  const [time, setTime] = useState(dateTime ? dateTime[1] : "");

  const currentUser = useSelector((state) => state.ApiReducer.user);

  const [topicSelectedList, setTopicSelectedList] = useState(false);
  const [selectedTopicIds, setSelectedTopicIds] = useState(null);
  const [errMsgs, setErrMsgs] = useState({});
  const [quality, setQuality] = useState(false);
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState(ItemDetail?.tags);
  const [intCategory, setIntCategory] = useState("");
  const [policy, setPolicy] = useState(ItemDetail?.return_policy);
  const [shippingOption, setShippingOption] = useState(
    ItemDetail?.shiping_option
  );
  const {
    myState: { language },
  } = useContext(AuthContext);

  let initialNewValues = {
    price: ItemDetail?.regular_price,
    sale: ItemDetail?.sale_price,
    quantity: ItemDetail?.quantity?.toString(),
    sku: ItemDetail?.sku,
    weight: ItemDetail?.parcel_detail?.weight,
    length: ItemDetail?.parcel_detail?.length,
    height: ItemDetail?.parcel_detail?.height,
    width: ItemDetail?.parcel_detail?.width,
    acceptOffer: ItemDetail?.accepting_best_offer ? true : false,
    onDiscount: ItemDetail?.sale_price ? true : false,
  };

  const [newValues, setNewVal] = useState(initialNewValues);
  // const newTopics = topics.map((item) => {
  //   item.isSelected = false;
  //   return item;
  // });

  const topicsArrStr = JSON.stringify(newTopics);
  const topicsArrDeepCopy = JSON.parse(topicsArrStr);
  const [currentTopics, setCurrentTopics] = useState(topicsArrDeepCopy);
  const [itemFormat, setItemFormat] = useState(ItemDetail?.productable?.format);
  const [countriesList, setCountriesList] = useState(
    ItemDetail?.productable?.format === "Lot"
      ? [...otherData, ...countries]
      : countries
  );
  const [categories, setCategories] = useState([]);
  const { theme, mode } = useContext(ThemeContext);
  const mediaSheetRef = useRef();
  const categorySheetRef = useRef();
  const statusSheetRef = useRef();
  const qualitySheetRef = useRef();
  const [publishNow, setPublishNow] = useState(false);

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
    arrayChecker1(categories, ItemDetail?.productable?.categories);
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
      return language?.selectQuality;
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
    return (
      <View
        style={[
          styles.editStampCard,
          {
            marginRight: index == selectedImages?.length - 1 ? hp(10) : null,
            borderColor: theme.theme,
            backgroundColor: theme.white,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            let tempArray = [...selectedImages];
            tempArray.splice(index, 1),
              dispatch(allActions.DataAction.SelectedImg([...tempArray]));
          }}
        >
          <EvilIcons
            name="close"
            size={18}
            style={[styles.crossIcon, { color: theme.davyGrey }]}
          />
        </TouchableOpacity>
        <Image
          style={styles.stampImg}
          source={{ uri: item?.uri ? item?.uri : item?.media_url }}
        />
      </View>
    );
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
  const checkValidations = async (check) => {
    let isValid = true;

    if (!selectedImages?.length) {
      handleError("Media is required", "mediaErrMessage");
      isValid = false;
    }

    if (!itemName) {
      handleError("Please enter item name.", "itemNameErrMessage");
      isValid = false;
    } else if (itemName.charAt(0) == " ") {
      handleError("Item name can not start with space.", "nameErrMessage");
      isValid = false;
    }
    if (!name) {
      handleError("Please enter stamp name.", "nameErrMessage");
      isValid = false;
    } else if (name.charAt(0) == " ") {
      handleError("Stamp name can not start with space.", "nameErrMessage");
      isValid = false;
    }
    if (!coinVal || coinVal <= 0) {
      handleError("Coin value must be greater then 0", "coinValErrMessage");
      isValid = false;
    }

    if (publishNow) {
      // const utcString = new Date().toISOString();
      // const currentTime = moment().format("HH:mm:ss");
      // const currentDate = moment().format("yyyy:MM:DD");
      // setDate(currentDate);
      // setTime(currentTime);
    } else if (!time && !date) {
      handleError("Date and Time are Required.", "dateErrMessage");
      isValid = false;
    } else if (!date) {
      handleError("Date is Required.", "dateErrMessage");
      isValid = false;
    } else if (!time) {
      handleError("Time is Required.", "dateErrMessage");
      isValid = false;
    } else {
      handleError(null, "dateErrMessage");
    }

    if (filterStatus?.length == 0) {
      handleError("Please select the status", "statusErrMessage");
      isValid = false;
    }

    if (!newValues.acceptOffer) {
      if (!newValues.price) {
        handleError("All Pricing fields are required.", "pricingErrMessage");
        isValid = false;
      }
    }
    if (newValues.onDiscount) {
      if (!newValues.sale) {
        handleError("Discount field is required.", "saleErrMessage");
        isValid = false;
      } else if (Number(newValues.sale) >= Number(newValues.price)) {
        handleError(
          "Discounted price must be less than sale price.",
          "saleErrMessage"
        );
        isValid = false;
      }
    }

    // if (!newValues.quantity || !newValues?.sku) {
    //   handleError("All Inventory fields are required.", "inventoryErrMessage");
    //   isValid = false;
    // }
    if (!newValues.quantity) {
      handleError("Supply quantity is required.", "inventoryErrMessage");
      isValid = false;
    } else if (Number(newValues?.quantity) < 1) {
      handleError(
        "Supply quantity must be greater then 0.",
        "inventoryErrMessage"
      );
      isValid = false;
    }

    if (
      !newValues.weight ||
      !newValues?.length ||
      !newValues?.height ||
      !newValues?.width
    ) {
      handleError("All Parcel detail fields are required.", "parcelErrMessage");
      isValid = false;
    }

    if (!policy) {
      handleError("Return policy is Required.", "policyErrMessage");
      isValid = false;
    }
    if (!itemFormat) {
      handleError("Item format is Required.", "formatErrMessages");
      isValid = false;
    }

    if (filterStatus?.length == 0) {
      handleError("Please select the status", "statusErrMessage");
      isValid = false;
    }

    if (!faceInput) {
      handleError("Please set face input value", "faceValueErrMessage");
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

    if (isValid == false) {
      alert("Please select all the required fileds.");
    } else {
      let catalogueList = [];
      if (type1) {
        catalogueList.push({
          type: type1,
          number: num1,
          value: catalogue1,
          year: year,
          custom_value: customValue1,
        });
      }
      if (type2) {
        catalogueList.push({
          type: type2,
          number: num2,
          value: catalogue2,
          year: year2,
          custom_value: customValue2,
        });
      }
      if (type3) {
        catalogueList.push({
          type: type3,
          number: num3,
          value: catalogue3,
          year: year3,
          custom_value: customValue3,
        });
      }

      let UtcDate;
      if (publishNow) {
        UtcDate = Helper.changeDateTimeToUTCZero(new Date());
      } else {
        UtcDate = Helper.changeDateTimeToUTCZero(`${date}T${time}`);
      }

      let body = {
        id: ItemDetail?.id,
        store_id: currentUser?.store?.id,
        name: itemName,
        description: description,
        published_at: UtcDate,
        is_published: check ? 1 : 0,
        sku: newValues.sku,
        quantity: newValues.quantity,
        shipping_instructions: shipping,
        return_policy: policy,
        productable_type: "StampItem",
        productable: {
          id: ItemDetail?.productable?.id,
          name: name,
          condition: condition,
          category_ids: filterCategory.map((item) => item.id),
          media_ids: selectedImages.map((item) => item.id),
          price: newValues.price,
          shiping_option: shipping,
          year_issued: yearIssued,
          coins_value: coinVal == "null" ? null : coinVal,
          color: selectColor,
          condition: condition,
          country: selectedCountry,
          denomination: faceInput,
          catalogue_number: catalogueList,
          format: itemFormat,
          grade: grade,
          shape: shape,
          issue_type: issueType,
          perforation: perforation,
          total_stamps_issued: totalStamps == "null" ? null : totalStamps,
          related_set_stamps_count: fullSetNum == "null" ? null : fullSetNum,
          quantity_owned: {
            used: q_used !== "null" ? q_used : null,
            mint: q_mint !== "null" ? q_mint : null,
          },
          status: filterStatus.map((item) => item.key),
          quality: filterQuality.map((item) => item.key),
        },

        tags: tagList?.map((item) => item.name),
        parcel_details: {
          length: newValues.length,
          width: newValues.width,
          height: newValues.height,
          weight: newValues.weight,
        },
      };

      if (newValues.acceptOffer) {
        body.accepting_best_offer = 1;
      } else {
        body.regular_price = newValues.price;
        body.sale_price = newValues.sale;
        body.accepting_best_offer = 0;
      }
      // console.log("------------>>>>>>>>", body);
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        // Store Stamp -> Create
        Env.paramUrl("products", ItemDetail?.id),
        body
      );
      //   dispatch(allActions.DataAction.SelectedImg([]));
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("------------>>>>>>>>", response?.data?.result?.product);
      if (response.status == 200) {
        dispatch(allActions.DataAction.SelectedImg([]));
        dispatch(
          allActions.DetailAction.StampDetail(response?.data?.result?.product)
        );
        Helper.showToastMessage("StampItem updated successfully", colors.green);
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
        style={styles.scroll}
      >
        <View style={styles.mediaSection}>
          <AppText style={[styles.mediaText, { color: theme.darkGrey }]}>
            {language?.selectMedia}
          </AppText>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[
                styles.addStampCard,
                {
                  backgroundColor: theme.cardColor,
                  shadowColor: theme.black,
                },
              ]}
              onPress={() => mediaSheetRef?.current?.open()}
            >
              <Octicons name="plus" size={44} color={theme.theme} />
            </TouchableOpacity>
            <View style={{ marginLeft: 5 }}>
              <FlatList
                data={selectedImages}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={renderSelectedImages}
              />
            </View>
          </View>
        </View>
        <View style={styles.checkSection}>
          <Switch
            trackColor={{ false: "#767577", true: `${colors.theme}50` }}
            thumbColor={publishNow ? colors.theme : "#f4f3f4"}
            ios_backgroundColor="lightgrey"
            onValueChange={() => {
              setPublishNow(!publishNow);
              if (publishNow) {
                setDate(null), setTime(null);
              }
            }}
            value={publishNow}
          />
          <AppText style={styles.buyText}>Immediately</AppText>
        </View>
        {!publishNow && (
          <View style={{ marginTop: hp(2) }}>
            <DatePickerTime
              label={language?.Publish}
              date={date}
              time={time}
              setDate={setDate}
              setTime={setTime}
            />
            <ErrorMessage
              visible={errMsgs.dateErrMessage ? true : false}
              error={errMsgs.dateErrMessage}
            />
          </View>
        )}
        <CustomDropDown
          height={hp(25)}
          data={stampFormatTypes}
          value={itemFormat}
          label={
            itemFormat ? language?.items_Format : language?.selectFormat + "*"
          }
          onChangeText={(value) => {
            setErrMsgs({});
            setItemFormat(value);
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
        <ErrorMessage
          visible={errMsgs.fromatErrMessage ? true : false}
          error={errMsgs.fromatErrMessage}
        />
        <FloatingInput
          label={language?.itemName + "*"}
          value={itemName}
          onChangeText={(text) => {
            handleError(null, "itemNameErrMessage");
            setItemName(text);
          }}
          error={
            errMsgs.itemNameErrMessage ? errMsgs.itemNameErrMessage : false
          }
        />
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
        {/* <InputButton
                    onPress={() => {
                        handleError(null, "dateErrMessage")
                        setIsDatePickerVisible(true);
                    }}
                    label="Publish At*"
                    placeHolder={date ? `${date} ${time ? time : ""}` : "Publish At*"}
                    selected={date}
                />
                <ErrorMessage
                    visible={errMsgs.dateErrMessage ? true : false}
                    error={errMsgs.dateErrMessage}
                /> */}
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
          label={language?.catalogue_1_NameNumber}
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
          //   setValue={setCatalogue1}
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
          label={language?.catalogue_1_ValueValueYear}
        />
        <ErrorMessage
          visible={errMsgs.catalogueErrMsg ? true : false}
          error={errMsgs.catalogueErrMsg}
        />
        {type1 === "Other" && (
          <FloatingInput
            label={language?.customValue}
            value={customValue1}
            onChangeText={(text) => {
              setCustomValue1(text);
            }}
          />
        )}
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
        {type2 === "Other" && (
          <FloatingInput
            label={language?.customValue}
            value={customValue2}
            onChangeText={(text) => {
              setCustomValue2(text);
            }}
          />
        )}
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
        {type3 === "Other" && (
          <FloatingInput
            label={language?.customValue}
            value={customValue3}
            onChangeText={(text) => {
              setCustomValue3(text);
            }}
          />
        )}
        <InputButton
          onPress={() => {
            handleError(null, "statusErrMessage");
            statusSheetRef?.current?.open();
          }}
          label="Status"
          placeHolder={checker()}
          selected={filterStatus[0]?.key ? filterStatus[0]?.key : null}
        />
        {
          <ErrorMessage
            visible={errMsgs.statusErrMessage ? true : false}
            error={errMsgs.statusErrMessage}
          />
        }
        <InputButton
          onPress={() => {
            handleError(null, "qualityErrMessage");
            qualitySheetRef?.current?.open();
          }}
          label="Quality"
          placeHolder={qualityChecker()}
          selected={filterQuality[0]?.key ? filterQuality[0]?.key : null}
        />
        <ErrorMessage
          visible={errMsgs.qualityErrMessage ? true : false}
          error={errMsgs.qualityErrMessage}
        />
        <InputButton
          onPress={() => {
            categorySheetRef?.current?.open();
          }}
          label={language?.categoriesOfInterest}
          placeHolder={categoryChecker()}
          selected={filterCategory[0]?.name ? filterCategory[0]?.name : null}
        />
        <CustomDropDown
          data={[{ value: "Mint" }, { value: "Used" }, { value: "N/A" }]}
          value={condition}
          label={condition ? "Condition" : "Select Condtion"}
          position={-4}
          onChangeText={(value) => {
            setCondition(value);
            handleError(null, "conditionErrMessage");
          }}
        />
        <ErrorMessage
          visible={errMsgs.conditionErrMessage ? true : false}
          error={errMsgs.conditionErrMessage}
        />
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
          height={hp(25)}
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
        {/* <FloatingInput
          label={language?.catalogueValueAppriseYear}
          value={
            appriseYear == "undefined" || appriseYear == "null"
              ? null
              : appriseYear
          }
          keyboardType="numeric"
          onChangeText={(text) => {
            setAppriseYear(text);
          }}
        /> */}
        <FloatingInput
          label="Suggested Coin Value"
          value={
            coinVal == "undefined" || coinVal == "null"
              ? null
              : coinVal.toString()
          }
          keyboardType="numeric"
          onChangeText={(text) => {
            setCoinVal(text);
          }}
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
        <CustomDropDown
          data={shippingData}
          value={shippingOption}
          label={shippingOption ? "Shipping Option" : "Select Shipping Option*"}
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
          data={policyData}
          value={policy}
          label={
            policy
              ? language?.Return_Policy
              : language?.selectReturnPolicy + "*"
          }
          position={-3}
          width="60%"
          onChangeText={(value) => {
            handleError(null, "policyErrMessage");
            setPolicy(value);
          }}
        />
        <ErrorMessage
          visible={errMsgs.policyErrMessage ? true : false}
          error={errMsgs.policyErrMessage}
        />
        <FloatingInput
          label={language?.shippingInstructions}
          value={shipping}
          onChangeText={(text) => {
            // handleError(null, "peforationErrMessage");
            setShipping(text);
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
        <AppText style={styles.priceHead}>Pricing</AppText>
        <View style={[styles.checkSection, { alignSelf: "flex-start" }]}>
          <Switch
            trackColor={{ false: "#767577", true: `${colors.theme}50` }}
            thumbColor={false ? colors.theme : "#f4f3f4"}
            ios_backgroundColor="lightgrey"
            onValueChange={() => {
              handleError(null, "pricingErrMessage");
              setNewVal({
                ...newValues,
                sale: null,
                price: null,
                onDiscount: false,
                acceptOffer: !newValues.acceptOffer,
              });
            }}
            value={newValues.acceptOffer}
          />
          <AppText style={styles.buyText}>Accepting Best Offers</AppText>
        </View>
        <FloatingInput
          value={newValues.price}
          label={"Price (US$)"}
          keyboardType={"numeric"}
          editable={!newValues?.acceptOffer}
          onChangeText={(text) => {
            handleError(null, "pricingErrMessage");
            setNewVal({ ...newValues, price: text });
          }}
        />
        <ErrorMessage
          visible={errMsgs.pricingErrMessage ? true : false}
          error={errMsgs.pricingErrMessage}
        />
        <View style={[styles.checkSection, { alignSelf: "flex-start" }]}>
          <Switch
            trackColor={{ false: "#767577", true: `${colors.theme}50` }}
            thumbColor={false ? colors.theme : "#f4f3f4"}
            ios_backgroundColor="lightgrey"
            disabled={newValues?.acceptOffer}
            onValueChange={() => {
              handleError(null, "saleErrMessage");
              setNewVal({
                ...newValues,
                sale: null,
                onDiscount: !newValues.onDiscount,
              });
            }}
            value={newValues.onDiscount}
          />
          <AppText style={styles.buyText}>Item is on discount</AppText>
        </View>
        <FloatingInput
          value={newValues.sale}
          label={"Discounted Price"}
          keyboardType={"numeric"}
          editable={newValues?.onDiscount}
          onChangeText={(text) => {
            handleError(null, "saleErrMessage");
            setNewVal({ ...newValues, sale: text });
          }}
        />
        <ErrorMessage
          visible={errMsgs.saleErrMessage ? true : false}
          error={errMsgs.saleErrMessage}
        />
        {/* <InputsRow
          theme={theme}
          title="Pricing*"
          label1="Price(US$)"
          label2="Sale Price"
          value1={newValues.price}
          value2={newValues.sale}
          acceptOffer={newValues.acceptOffer}
          onChange1={(text) => {
            handleError(null, "pricingErrMessage");
            setNewVal({ ...newValues, price: text });
          }}
          onChange2={(text) => {
            handleError(null, "pricingErrMessage");
            setNewVal({ ...newValues, sale: text });
          }}
          onToggle={() => {
            handleError(null, "pricingErrMessage");
            setNewVal({
              ...newValues,
              price: null,
              sale: null,
              acceptOffer: !newValues.acceptOffer,
            });
          }}
        />
        <ErrorMessage
          visible={errMsgs.pricingErrMessage ? true : false}
          error={errMsgs.pricingErrMessage}
        /> */}
        <InputsRow
          theme={theme}
          title="Inventory*"
          label1="Quantity"
          label2={language?.sku}
          value1={newValues.quantity}
          value2={newValues.sku}
          onChange1={(text) => {
            handleError(null, "inventoryErrMessage");
            setNewVal({ ...newValues, quantity: text });
          }}
          onChange2={(text) => {
            // handleError(null, "inventoryErrMessage");
            setNewVal({ ...newValues, sku: text });
          }}
        />
        <ErrorMessage
          visible={errMsgs.inventoryErrMessage ? true : false}
          error={errMsgs.inventoryErrMessage}
        />
        <InputsRow
          theme={theme}
          title={language?.parcelDetails + "*"}
          label1={language?.weight + "(" + language?.pounds + ")"}
          label2={language?.Length + "(cm)"}
          label3={language?.Height + "(cm)"}
          label4={language?.Width + "(cm)"}
          value1={newValues.weight}
          value2={newValues.length}
          value3={newValues.height}
          value4={newValues.width}
          onChange1={(text) => {
            handleError(null, "parcelErrMessage");
            setNewVal({ ...newValues, weight: text });
          }}
          onChange2={(text) => {
            handleError(null, "parcelErrMessage");
            setNewVal({ ...newValues, length: text });
          }}
          onChange3={(text) => {
            handleError(null, "parcelErrMessage");
            setNewVal({ ...newValues, height: text });
          }}
          onChange4={(text) => {
            handleError(null, "parcelErrMessage");
            setNewVal({ ...newValues, width: text });
          }}
        />
        <ErrorMessage
          visible={errMsgs.parcelErrMessage ? true : false}
          error={errMsgs.parcelErrMessage}
        />

        {/* <View style={{ height: hp(30), width: "100%" }} /> */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
            // alignSelf: 'center'
            // backgroundColor: "grey",
          }}
        >
          <BorderBtn
            onPress={() => checkValidations(false)}
            label="Draft"
            fontColor={colors.btnText}
            color="lightgrey"
            backgroundColor="transparent"
            radius={5}
            width="45%"
            height={45}
          />
          <GradBtn
            label={language?.Publish}
            height={45}
            width="45%"
            top={0.01}
            onPress={() => checkValidations(true)}
          />
        </View>
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
            label3={language?.myItems}
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
              mediaSheetRef?.current?.close();
              setTimeout(() => {}, 300);
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
};
