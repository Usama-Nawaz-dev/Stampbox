import React, { useState, useEffect, useRef, useContext } from "react";

import {
  Image,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
  FlatList,
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
  MainHeader,
  FloatingInput,
  GradBtn,
  BottomSheet,
  Tag,
  DatePickerTime,
} from "../../../components";

import InputButton from "../../../components/InputButton";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import allActions from "../../../redux/actions";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
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

export const EditSupply = (props) => {
  const ItemDetail = useSelector((state) => state.DetailReducer.supplyDetail);
  // console.log(ItemDetail)
  const dateTime = ItemDetail?.published_at
    ? Helper.utcToLocalTime(ItemDetail?.published_at).split(" ")
    : null;

  const dispatch = useDispatch();
  const [shipping, setShipping] = useState(ItemDetail?.shipping_instructions);
  const [condition, setCondition] = useState(
    ItemDetail?.productable?.condition
  );

  const [subTitle, setSubTitle] = useState(ItemDetail?.productable?.sub_title);
  const [itemName, setItemName] = useState(ItemDetail?.name);

  const [shippingOption, setShippingOption] = useState(
    ItemDetail?.shiping_option
  );
  const [policy, setPolicy] = useState(ItemDetail?.return_policy);
  const [description, setDescription] = useState(
    ItemDetail?.productable?.description
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const selectedImages = useSelector(
    (state) => state.DataReducer.selected_images
  );
  const [date, setDate] = useState(dateTime?.length ? dateTime[0] : null);
  const [time, setTime] = useState(dateTime?.length ? dateTime[1] : null);
  const [errMsgs, setErrMsgs] = useState({});
  const [check, setCheck] = useState(true);

  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState(ItemDetail?.tags);
  const {
    myState: { language },
  } = useContext(AuthContext);

  let initialNewValues = {
    association: ItemDetail?.productable?.donate?.association,
    percentage: ItemDetail?.productable?.donate?.percentage
      ? ItemDetail?.productable?.donate?.percentage.toString()
      : null,
    price: ItemDetail?.regular_price,
    sale: ItemDetail?.sale_price,
    quantity: ItemDetail?.quantity.toString(),
    sku: ItemDetail?.sku,
    weight: ItemDetail?.parcel_detail?.weight,
    length: ItemDetail?.parcel_detail?.length,
    height: ItemDetail?.parcel_detail?.height,
    width: ItemDetail?.parcel_detail?.width,
    acceptOffer: ItemDetail?.accepting_best_offer ? true : false,
    onDiscount: ItemDetail?.sale_price ? true : false,
  };
  const [newValues, setNewVal] = useState(initialNewValues);

  const [categories, setCategories] = useState([]);
  const { theme, mode } = useContext(ThemeContext);
  const mediaSheetRef = useRef();
  const categorySheetRef = useRef();
  const [publishNow, setPublishNow] = useState(false);

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
        Env.createUrl("categories?type=supplies")
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

  const categoryChecker = () => {
    if (filterCategory?.length == 1) {
      return filterCategory[0]?.name;
    } else if (filterCategory?.length > 1) {
      return `${filterCategory[0]?.name} & more`;
    } else {
      return "Select category of interest";
    }
  };

  const reset = () => {
    setCondition("");
    setShipping("");
    setSubTitle("");
    setItemName("");
    setNewVal(initialNewValues);
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
            tempArray.splice(index, 1);
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

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };

  const checkValidations = async (check) => {
    let isValid = true;
    if (!selectedImages?.length) {
      handleError("Media is required", "mediaErrMessage");
      isValid = false;
    }
    if (!itemName) {
      handleError("Item name is required.", "itemNameErrMessage");
      isValid = false;
    } else if (itemName.charAt(0) == " ") {
      handleError("Item name can not start with space", "nameErrMessage");
      isValid = false;
    }
    if (!subTitle) {
      handleError("Sub title is required.", "nameErrMessage");
      isValid = false;
    } else if (subTitle.charAt(0) == " ") {
      handleError("Sub title can not start with space", "nameErrMessage");
      isValid = false;
    }
    if (!shippingOption) {
      handleError("Shipping option is Required.", "optionErrMessage");
      isValid = false;
    }
    if (!policy) {
      handleError("Return policy is Required.", "policyErrMessage");
      isValid = false;
    }
    if (publishNow) {
      const utcString = moment().utc().format("YYYY-MM-DD hh:mm:ss");
      const currentTime = utcString.split(" ");
      setDate(currentTime[0]);
      setTime(currentTime[1]);
    } else if (!time && !date) {
      handleError("Date and time is Required.", "dateErrMessage");
      isValid = false;
    } else if (!date) {
      handleError("Date is Required.", "dateErrMessage");
      isValid = false;
    } else if (!time) {
      handleError("Time is Required.", "dateErrMessage");
      isValid = false;
    }
    if (!condition) {
      handleError("Condition is required.", "condtionErrMessage");
      isValid = false;
    }
    // if (!newValues.association || !newValues?.percentage) {
    //   handleError("All Donation fields are required.", "donationErrMessage");
    //   isValid = false;
    // }
    if (!newValues.acceptOffer) {
      if (!newValues.price) {
        handleError("Price field is required.", "pricingErrMessage");
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

    if (!isValid) {
      alert("Please select all the required fileds.");
    } else {
      // console.log("Validation Checked");
      let UtcDate;
      if (publishNow) {
        UtcDate = Helper.changeDateTimeToUTCZero(new Date());
      } else {
        UtcDate = Helper.changeDateTimeToUTCZero(`${date}T${time}`);
      }

      let body = {
        id: ItemDetail?.id,
        store_id: ItemDetail?.store?.id,
        name: itemName,
        description: description,
        published_at: UtcDate,
        is_published: check ? 1 : 0,
        sku: newValues.sku,
        quantity: newValues.quantity,
        shipping_instructions: shipping,
        return_policy: policy,
        shiping_option: shippingOption,
        productable_type: "Supply",
        productable: {
          id: ItemDetail?.productable?.id,
          name: itemName,
          sub_title: subTitle,
          condition: condition,
          category_ids: filterCategory.map((item) => item.id),
          media_ids: selectedImages.map((item) => item.id),
          // year_issued: yearIssued,
          donate: {
            percentage: newValues.percentage,
            association: newValues.association,
          },
          description: description,
        },

        tags: tagList.map((item) => item.name),
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
      }
      // console.log("------------>>>>>>>>", body);
      dispatch(allActions.DataAction.AppLoader(true));
      const response = await MindAxios.post(
        // Store Supply -> Edit
        Env.paramUrl("products", ItemDetail?.id),
        body
      );
      //   dispatch(allActions.DataAction.SelectedImg([]));
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("------------>>>>>>>>", response);
      if (response.status == 200) {
        dispatch(allActions.DataAction.SelectedImg([]));
        Helper.showToastMessage("Supply updated successfully", colors.green);
        props.navigation.goBack();
      }
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.white }}>
      <MainHeader
        title="Edit Supply"
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
          label="Sub Title*"
          value={subTitle}
          onChangeText={(text) => {
            handleError(null, "nameErrMessage");
            setSubTitle(text);
          }}
          error={errMsgs.nameErrMessage ? errMsgs.nameErrMessage : false}
        />
        {/* <InputButton
                    onPress={() => {
                        handleError(null, "dateErrMessage")
                        setIsDatePickerVisible(true);
                    }}
                    label="Publish At*"
                    placeHolder={date ? `${date} ${time ? time : ""}` : "Publish At"}
                    selected={date}
                />
                <ErrorMessage
                    visible={errMsgs.dateErrMessage ? true : false}
                    error={errMsgs.dateErrMessage}
                /> */}
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
          label={condition ? "Condition*" : "Select Condtion*"}
          position={-4}
          onChangeText={(value) => {
            handleError(null, "condtionErrMessage");
            setCondition(value);
          }}
        />
        <ErrorMessage
          visible={errMsgs.condtionErrMessage ? true : false}
          error={errMsgs.condtionErrMessage}
        />
        <CustomDropDown
          data={shippingData}
          value={shippingOption}
          label={
            shippingOption ? "Shipping Option*" : "Select Shipping Option*"
          }
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
              ? language?.Return_Policy + "*"
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
        <InputsRow
          theme={theme}
          keyboardType="default"
          title="Donation"
          label1="Association"
          label2="Value(%)"
          value1={newValues.association}
          value2={newValues.percentage}
          onChange1={(text) => {
            handleError(null, "donationErrMessage");
            setNewVal({ ...newValues, association: text });
          }}
          onChange2={(text) => {
            handleError(null, "donationErrMessage");
            setNewVal({ ...newValues, percentage: text });
          }}
        />
        <ErrorMessage
          visible={errMsgs.donationErrMessage ? true : false}
          error={errMsgs.donationErrMessage}
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
        <FloatingInput
          label={language?.shippingInstructions}
          value={shipping}
          onChangeText={(text) => {
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
                      item={item.name}
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <BorderBtn
            label="Draft"
            color="lightgrey"
            backgroundColor="transparent"
            fontColor={colors.btnText}
            radius={5}
            width="45%"
            height={45}
            onPress={() => checkValidations(false)}
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
      <BottomSheet
        ref={mediaSheetRef}
        sheetHeight={hp(35)}
        ChildComponent={
          <MediaSheet
            label3={language?.myItems}
            onSelectPhone={() => {
              mediaSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("AddItem", { isStamp: 0 });
              }, 300);
            }}
            onSelectStampbox={() => {
              mediaSheetRef?.current?.close();
              setTimeout(() => {
                props.navigation.navigate("StampboxMedia", { isStamp: 0 });
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
            onValueChange={(selected, index) => toggleCategory(selected, index)}
          />
        }
      />
    </View>
  );
};
