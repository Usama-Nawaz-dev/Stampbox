import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Switch,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { styles } from "./styles";
import AppText from "../../../../components/AppText";
import {
  MainHeader,
  FloatingInput,
  BottomSheet,
  CustomButton,
  GradBtn,
} from "../../../../components";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Octicons from "react-native-vector-icons/Octicons";

import ErrorMessage from "../../../forms/ErrorMessage";
import ThemeContext from "../../../Context/ThemeContext";
import PickModal from "../../../../components/PickModal";
import InputButton from "../../../../components/InputButton";
import CustomDropDown from "../../../../components/CustomDropDown";

import { useSelector, useDispatch } from "react-redux";
import allActions from "../../../../redux/actions";
import MindAxios from "../../../../api/MindAxios";
import Env from "../../../../api/Env";
import Helper from "../../../Helper";

import {
  countries,
  stampGrades,
  stampFormatTypes,
  qualityData,
} from "../../../../constant/staticData";

const staticCondition = [
  { key: "Mint", isSelected: false },
  { key: "Used", isSelected: false },
  { key: "N/A", isSelected: false },
];

import { MediaSheet, SelectionSheet } from "../../../Sheets";
import AuthContext from "../../../Context/AuthContext";

export const CreateBounty = (props) => {
  const selectedImages = useSelector(
    (state) => state.DataReducer.selected_images
  );
  const dispatch = useDispatch();
  const mediaSheetRef = useRef();
  const qualitySheetRef = useRef();
  const conditionSheetRef = useRef();
  const gradeSheetRef = useRef();
  const formatSheetRef = useRef();
  const { theme, mode } = useContext(ThemeContext);
  const {
    myState: { language },
  } = useContext(AuthContext);

  // const staticCountries = Helper.deepCopy(countries)?.map(({
  //     value: key,
  //     ...rest
  // }) => ({
  //     key,
  //     ...rest,
  //     isSelected: false,
  //     id: countryId++
  // }));

  const staticGrades = Helper.deepCopy(stampGrades)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
      isSelected: false,
    })
  );

  const staticFormat = Helper.deepCopy(stampFormatTypes)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
      isSelected: false,
    })
  );

  const myData = qualityData.map((item) => {
    item.isSelected = false;
    return item;
  });

  const [title, setTilte] = useState("");
  const [errMsgs, setErrMsgs] = useState({});
  const [yearIssued, setYearIssued] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [itemFormat, setItemFormat] = useState(staticFormat);
  const [condition, setCondition] = useState(staticCondition);
  const [rewardOption, setRewardOption] = useState("");
  const [grade, setGrade] = useState(staticGrades);
  const [qData, setQData] = useState(myData);
  const [isLocal, setIsLocal] = useState(false);
  const [coinVal, setCoinVal] = useState("");
  const [amount, setAmount] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const handleError = (error, input) => {
    setErrMsgs((errMsgs) => ({ ...errMsgs, [input]: error }));
  };

  const filterFormat = itemFormat?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
  const filterGrade = grade?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
  const filterCondition = condition.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
  const filterQuality = qData?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });
  const qualityChecker = () => {
    if (filterQuality?.length == 1) {
      return filterQuality[0]?.key;
    } else if (filterQuality?.length > 1) {
      return `${filterQuality[0]?.key} & more`;
    } else {
      return language?.selectQuality;
    }
  };
  const conditionChecker = () => {
    if (filterCondition?.length == 1) {
      return filterCondition[0]?.key;
    } else if (filterCondition?.length > 1) {
      return `${filterCondition[0]?.key} & more`;
    } else {
      return language?.selectCondition;
    }
  };
  const formatChecker = () => {
    if (filterFormat?.length == 1) {
      return filterFormat[0]?.key;
    } else if (filterFormat?.length > 1) {
      return `${filterFormat[0]?.key} & more`;
    } else {
      return language?.selectFormat;
    }
  };
  const gradeChecker = () => {
    if (filterGrade?.length == 1) {
      return filterGrade[0]?.key;
    } else if (filterGrade?.length > 1) {
      return `${filterGrade[0]?.key} & more`;
    } else {
      return language?.selectGrade;
    }
  };

  const toggle = (selected, i, data, setState) => {
    if (selected) {
      var res = data.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: false,
          };
        } else {
          return item;
        }
      });
      setState(res);
    } else {
      var res = data.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            isSelected: true,
          };
        } else {
          return item;
        }
      });
      setState(res);
    }
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

  const checkValidations = async (check) => {
    let isValid = true;
    if (!selectedImages?.length) {
      return alert("Please attach at least one media");
    }
    if (!title) {
      handleError("Please enter stamp name.", "titleErrMessage");
      isValid = false;
    } else if (title.charAt(0) == " ") {
      handleError("Stamp name can not start with space.", "titleErrMessage");
      isValid = false;
    }

    if (!rewardOption) {
      handleError("Reward option is required", "optionErrMessage");
      isValid = false;
    }

    if (rewardOption === "Both") {
      if (!coinVal && !amount) {
        handleError("This filed is required", "coinErrMessage");
        handleError("This field is required", "amountErrMessage");
        isValid = false;
      } else if (parseFloat(coinVal) < 1) {
        handleError(
          "Please enter a value greater than or equal to 1",
          "coinErrMessage"
        );
        isValid = false;
      }
    } else if (rewardOption === "In Coins") {
      if (!coinVal) {
        handleError("This field is required", "coinErrMessage");
        isValid = false;
      }
      if (parseInt(coinVal) < 1) {
        handleError(
          "Please enter a value greater than or equal to 1",
          "coinErrMessage"
        );
        isValid = false;
      }
    } else if (rewardOption === "Money Only") {
      if (!amount) {
        handleError("This field is required", "amountErrMessage");
        isValid = false;
      }
      if (parseInt(amount) < 1) {
        handleError(
          "Please enter a value greater than or equal to 1",
          "amountErrMessage"
        );
        isValid = false;
      }
    }

    if (isValid === false) {
      alert("Please select all the required fileds.");
    } else {
      // console.log("Validation Checked");
      dispatch(allActions.DataAction.AppLoader(true));
      let body = {
        title: title,
        country: selectedCountry,
        year_issued: yearIssued,
        grade: filterGrade.map((item) => item.key),
        condition: filterCondition.map((item) => item.key),
        quality: filterQuality.map((item) => item.key),
        format: filterFormat.map((item) => item.key),
        offered_coins: coinVal === "NaN" ? 0 : coinVal,
        offered_amount: amount,
        description: description,
        status: check ? "Active" : "Draft",
        media_ids: selectedImages.map((item) => item.id),
        is_local: isLocal,
      };
      // console.log("------------>>>>>>>>", body);
      const response = await MindAxios.post(
        // Store Bounty -> Create
        Env.createUrl("bounties"),
        body
      );
      dispatch(allActions.DataAction.AppLoader(false));
      // console.log("------------>>>>>>>>", response);
      if (response.status == 200) {
        dispatch(allActions.DataAction.SelectedImg([]));
        props.navigation.goBack();
        // props.navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'MyStoreStack' }],
        // })
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title="Create Bounty"
        onPressBack={() => {
          dispatch(allActions.DataAction.SelectedImg([]));
          // props.navigation.reset({
          //     index: 0,
          //     routes: [{ name: 'MyStoreStack' }],
          // })
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
        <AppText
          style={[
            styles.mediaText,
            {
              color: theme.darkGrey,
              marginTop: 10,
              marginBottom: -10,
            },
          ]}
        >
          Stamp Detail
        </AppText>
        <FloatingInput
          label="Stamp Name*"
          value={title}
          onChangeText={(text) => {
            handleError(null, "titleErrMessage");
            setTilte(text);
          }}
          error={errMsgs.titleErrMessage ? errMsgs.titleErrMessage : false}
        />
        <FloatingInput
          label={language?.yearIssued}
          value={yearIssued}
          keyboardType="numeric"
          onChangeText={(text) => setYearIssued(text)}
        />
        <InputButton
          onPress={() => {
            setModalVisible(true);
          }}
          label={language?.country}
          placeHolder={
            selectedCountry ? selectedCountry : language?.selectCountry
          }
          selected={selectedCountry}
        />
        <InputButton
          onPress={() => {
            formatSheetRef?.current?.open();
          }}
          label="Item's Format Desired"
          placeHolder={formatChecker()}
          selected={filterFormat[0]?.key ? filterFormat[0]?.key : null}
        />
        <InputButton
          onPress={() => {
            gradeSheetRef?.current?.open();
          }}
          label="Grade/Centring Desired"
          placeHolder={gradeChecker()}
          selected={filterGrade[0]?.key ? filterGrade[0]?.key : null}
        />
        <InputButton
          onPress={() => {
            conditionSheetRef?.current?.open();
          }}
          label="Condition Desired"
          placeHolder={conditionChecker()}
          selected={filterCondition[0]?.key ? filterCondition[0]?.key : null}
        />
        <InputButton
          onPress={() => {
            qualitySheetRef?.current?.open();
          }}
          label="Quality Desired"
          placeHolder={qualityChecker()}
          selected={filterQuality[0]?.key ? filterQuality[0]?.key : null}
        />
        <CustomDropDown
          data={[
            { value: "In Coins" },
            { value: "Money Only" },
            { value: "Both" },
          ]}
          label={rewardOption ? "Reward Option" : "Select Reward Option*"}
          position={-4}
          onChangeText={(value) => {
            handleError(null, "optionErrMessage");
            setCoinVal("0");
            setAmount("0");
            setRewardOption(value);
          }}
        />
        <ErrorMessage
          visible={errMsgs.optionErrMessage ? true : false}
          error={errMsgs.optionErrMessage}
        />
        {(rewardOption === "Money Only" || rewardOption === "Both") && (
          <FloatingInput
            label="Offered Amount(US$)"
            value={amount}
            keyboardType="numeric"
            onChangeText={(text) => {
              setAmount(text);
              handleError(null, "amountErrMessage");
              rewardOption === "Both" && handleError(null, "coinErrMessage");
              rewardOption === "Both" &&
                setCoinVal(`${(parseFloat(text) * 100).toFixed(0)}`);
            }}
            error={errMsgs.amountErrMessage ? errMsgs.amountErrMessage : false}
          />
        )}
        {(rewardOption === "In Coins" || rewardOption === "Both") && (
          <FloatingInput
            label="Offered Coins"
            value={coinVal == "NaN" ? "0" : coinVal}
            keyboardType="numeric"
            onChangeText={(text) => {
              handleError(null, "coinErrMessage");
              rewardOption === "Both" && handleError(null, "amountErrMessage");
              setCoinVal(text);
            }}
            error={errMsgs.coinErrMessage ? errMsgs.coinErrMessage : false}
          />
        )}
        <FloatingInput
          label="Description"
          value={description}
          description={true}
          multiline
          onChangeText={(text) => {
            setDescription(text);
          }}
        />
        <View style={styles.checkSection}>
          <AppText style={styles.buyText}>Bounty Option Local</AppText>
          <Switch
            trackColor={{ false: "#767577", true: `${theme.theme}50` }}
            thumbColor={isLocal ? theme.theme : "#f4f3f4"}
            ios_backgroundColor="lightgrey"
            onValueChange={() => setIsLocal(!isLocal)}
            value={isLocal}
          />
        </View>
        <View style={styles.btnSection}>
          <CustomButton
            bg={theme.white}
            style={{ borderWidth: 1, borderColor: theme.lightGrey }}
            label="Draft"
            textColor={theme.dovGray}
            fontWeight="600"
            width={wp(45)}
            height={45}
            fontSize={16}
            onPress={() => checkValidations(false)}
          />
          <GradBtn
            label="Active"
            height={45}
            width={wp(42)}
            style={{ marginTop: 0 }}
            fontWeight="600"
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
          modalData={countries}
          placeholder={language?.searchCountries}
          onPress={(item) => {
            setSelectedCountry(item?.value);
            setModalVisible(false);
          }}
        />
      </Modal>
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
        ref={qualitySheetRef}
        title={language?.selectQuality}
        onPressClose={() => qualitySheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(50)}
        ChildComponent={
          <SelectionSheet
            Data={qData}
            onValueChange={(selected, index) =>
              toggle(selected, index, qData, setQData)
            }
          />
        }
      />
      <BottomSheet
        ref={formatSheetRef}
        title={language?.selectFormat}
        onPressClose={() => formatSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(50)}
        ChildComponent={
          <SelectionSheet
            Data={itemFormat}
            onValueChange={(selected, index) =>
              toggle(selected, index, itemFormat, setItemFormat)
            }
          />
        }
      />
      <BottomSheet
        ref={gradeSheetRef}
        title={language?.selectGrade}
        onPressClose={() => gradeSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(50)}
        ChildComponent={
          <SelectionSheet
            Data={grade}
            onValueChange={(selected, index) =>
              toggle(selected, index, grade, setGrade)
            }
          />
        }
      />
      <BottomSheet
        ref={conditionSheetRef}
        title={"Select Condtion"}
        onPressClose={() => conditionSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(30)}
        ChildComponent={
          <SelectionSheet
            Data={condition}
            onValueChange={(selected, index) =>
              toggle(selected, index, condition, setCondition)
            }
          />
        }
      />
    </View>
  );
};
