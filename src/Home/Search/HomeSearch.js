import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useRef, useContext } from "react";
import {
  FloatingInput,
  MainHeader,
  SearchHeader,
  SimpleHeader,
} from "../../../components";
import { styles } from "../styles";
import OutsideView from "../../../components/OutsideView";
import InputButton from "../../../components/InputButton";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import OnlyYearPicker from "../../../components/OnlyYearPicker";
import CustomDropDown from "../../../components/CustomDropDown";
import BiPicker from "./BiPicker";
import {
  categories,
  countries,
  format_types,
  newTopics,
  quality_Data,
  stampColors,
  stampFormatTypes,
  stampGrades,
  stampItemStatuses,
  stamp_Status,
} from "../../../constant/staticData";
import AuthContext from "../../Context/AuthContext";
import FastImage from "react-native-fast-image";
import { images } from "../../../assets/images/Images";
import colors from "../../../constant/colors";
import Btn from "../../../components/Btn";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import MindAxios from "../../../api/MindAxios";
import Env from "../../../api/Env";
import { useDispatch } from "react-redux";
import allActions from "../../../redux/actions";
import Helper from "../../Helper";
import { TouchableWithoutFeedback } from "react-native";

const condition_data = [
  { value: "Mix" },
  { value: "Mint" },
  { value: "Used" },
  { value: "N/A" },
];
const shippingData = [
  { value: "Pickup Only" },
  { value: "Shipping Local/Domestic Only (Country)" },
  { value: "Shipping International" },
];
const offers = [
  { id: 1, value: "Coins" },
  { id: 2, value: "Stamps" },
  { id: 3, value: "Both" },
];
const filterItems = [
  { id: 2, value: "Product" },
  { id: 3, value: "Supply" },
  { id: 4, value: "Bounty" },
  { id: 5, value: "Auction" },
  { id: 6, value: "Trade" },
  { id: 1, value: "StampItem" },
];
const stampCatalogNumberTypes = [
  { id: 1, value: "Scott" },
  { id: 2, value: "Stanly Gibson" },
  { id: 3, value: "Michael’s" },
  { id: 4, value: "Yvert et Tellier" },
  { id: 5, value: "Other" },
  { id: 6, value: "N/A" },
];
// const Data = [...Array(5).keys()];
const Data = [1, 2, 3, 4, 5];
const r_s = (myString) => {
  myString = myString.toString();
  let myNewString = myString?.replace(/ /g, "+");
  return myNewString;
};
function l_f(string) {
  return string?.charAt(0)?.toLowerCase() + string?.slice(1);
}
export const HomeSearch = ({ navigation }) => {
  const {
    myState: { language },
  } = useContext(AuthContext);
  //   const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const topicsArrStr = JSON.stringify(newTopics);
  const topicsArrDeepCopy = JSON.parse(topicsArrStr);
  const [currentTopics, setCurrentTopics] = useState(topicsArrDeepCopy);
  const [topicSelectedList, setTopicSelectedList] = useState(false);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedYearTo, setSelectedYearTo] = useState();
  const [memberId, setMemberId] = useState();
  const [storeId, setStoreId] = useState();
  const [faceInput, setFaceInput] = useState();
  const [picker, showPicker] = useState(false);
  const [picker2, showPicker2] = useState(false);
  const [condition, setCondition] = useState();
  const [selectColor, setSelectColor] = useState();
  const [quality, setQuality] = useState();
  const [itemFormat, setItemFormat] = useState();
  const [grade, setGrade] = useState();
  const [status, setStatus] = useState();
  const [category, setCategory] = useState();
  const [catalogue, setCatalogue] = useState();
  const [location, setLocation] = useState();
  const [search, setSearch] = useState();
  // const [disable, setDisable] = useState(false);
  const inputRef = useRef();
  const [selected, setSelected] = useState(2);
  const [shippingOption, setShippingOption] = useState(null);
  const [accpt_offer, setOffer] = useState(null);
  const [queryUrl, setQueryUrl] = useState("searchable_type=Product");
  // "search/all?searchable_type=StampItem&page_size=20"

  const q_c = (word, rep, myQuery) => {
    let str = myQuery ? myQuery : queryUrl;
    if (str?.includes(`${word}`)) {
      let arr = str.split("&");
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes(`${word}`)) {
          let index = arr[i].indexOf("=") + 1;
          let val = arr[i].substring(index, arr[i].length);
          arr[i] = `${word}=${rep}`;
        }
      }
      str = arr.join("&");
      return str;
    } else {
      return null;
    }

    // console.log(str);
  };
  const renderFilterItem = ({ item, index }) => {
    return (
      <>
        {item.id !== 1 ? (
          <Pressable
            onPress={() => {
              if (selected == item?.id) {
              } else {
                setSelected(item?.id);
                resetFilters();
              }
            }}
            style={styles.radioItems}
          >
            {selected == item?.id ? (
              <Ionicons name="checkbox" color={colors.lightTheme} size={22} />
            ) : (
              <View style={[styles.uncheck, { borderColor: "lightgrey" }]} />
            )}
            <Text style={{ marginLeft: 10 }}>{item?.value}</Text>
          </Pressable>
        ) : null}
      </>
    );
  };
  const resetFilters = () => {
    setCurrentTopics(topicsArrDeepCopy);
    setSelectedYear();
    setSelectedYearTo();
    setMemberId();
    setStoreId();
    setFaceInput();
    setCondition("");
    setSelectColor();
    setQuality(null);
    setItemFormat();
    setGrade();
    setStatus();
    setCategory();
    setCatalogue();
    setLocation();
    // setSearch("");
    // inputRef?.current?.clear();
    // inputRef?.current?.blur();
    setShippingOption();
    setOffer();
  };
  const renderCatalogueItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          if (catalogue == item?.id) {
            setCatalogue(null);
          } else {
            setCatalogue(item?.id);
          }
        }}
        style={styles.radioItems}
      >
        {catalogue == item?.id ? (
          <Ionicons name="checkbox" color={colors.lightTheme} size={22} />
        ) : (
          <View style={[styles.uncheck, { borderColor: "lightgrey" }]} />
        )}
        <Text style={{ marginLeft: 10 }}>{item?.value}</Text>
      </Pressable>
    );
  };
  const renderOffer = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          if (accpt_offer == item?.id) {
            setOffer(null);
          } else {
            setOffer(item?.id);
          }
        }}
        style={styles.radioItems}
      >
        {accpt_offer == item?.id ? (
          <Ionicons name="checkbox" color={colors.lightTheme} size={22} />
        ) : (
          <View style={[styles.uncheck, { borderColor: "lightgrey" }]} />
        )}
        <Text style={{ marginLeft: 10 }}>{item?.value}</Text>
      </Pressable>
    );
  };
  const renderItem2 = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <Pressable
        onPress={() => {
          currentTopics[index].isSelected = !currentTopics[index].isSelected;
          // console.log("currentTopics", currentTopics);
          setCurrentTopics(currentTopics);
          setTopicSelectedList(!topicSelectedList);
        }}
        style={{ flexDirection: "row" }}
      >
        <View
          style={[
            styles.topicChips,
            { borderColor: item?.isSelected ? colors.theme : "transparent" },
          ]}
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
  const getTopicsQuery = () => {
    let topicsQuery;
    let filtered = currentTopics?.filter((item) => item.isSelected);
    // console.log("filtered", filtered);
    if (filtered?.length) {
      for (let i of filtered) {
        // console.log(i);
        topicsQuery = topicsQuery
          ? `${topicsQuery}&topic_id[]=${i.id}`
          : `topic_id[]=${i.id}`;
      }
      // console.log("topics", topicsQuery);
      return topicsQuery;
    } else {
      return null;
    }
  };
  const applyAdvSearch = async () => {
    // console.log(topicSelectedList);
    let query;

    if (catalogue) {
      for (let i of stampCatalogNumberTypes) {
        if (catalogue == i.id) {
          let type = i.value;
          query = `${queryUrl}&catalogue_number=${r_s(type)}`;
        }
      }
    }

    if (accpt_offer) {
      // console.log(accpt_offer);
      for (let i of offers) {
        if (accpt_offer == i.id) {
          let type = i.value == "Both" ? "coins_and_stamps" : l_f(i.value);
          query = `${queryUrl}&accepting_offer=${r_s(type)}`;
        }
      }
    }

    for (let i of filterItems) {
      if (selected == i.id) {
        // console.log("query", query);
        let type = i.value;
        let qr = q_c("searchable_type", r_s(type), query);
        // console.log("qr", qr);
        if (qr) {
          query = qr;
        } else {
          query = `searchable_type=${r_s(type)}&${queryUrl}`;
        }
      }
    }
    let topic_q = getTopicsQuery();
    if (topic_q) {
      query = `${queryUrl}&${topic_q}`;
    }
    if (search) {
      query = `search=${r_s(l_f(search))}&${query}`;
    }

    console.log("this-->", `search/all?${query}&page_size=20`);

    dispatch(allActions.DataAction.ActivityModal(true));
    const response = await MindAxios.get(
      Env.createUrl(`search/all?${query}&page_size=20`)
    );
    dispatch(allActions.DataAction.ActivityModal(false));
    console.log("res", response);
    const { e } = response;
    const error = e?.response?.data;
    if (response?.status == 200) {
      let paginated = response?.data?.result?.data;
      dispatch(allActions.DataAction.search_feeds(paginated));
      console.log("res", paginated);
      navigation.navigate("SearchResults");
    }
  };

  return (
    <View style={styles.advContainer}>
      <SearchHeader
        title="Advance Search"
        onPressBack={() => navigation.goBack()}
        rightIcon={
          <TouchableOpacity
            onPress={() => {
              resetFilters();
              setSearch("");
              inputRef?.current?.clear();
              inputRef?.current?.blur();
              setSelected(2);
              setQueryUrl("searchable_type=Product");
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 18 }}>
              Clear Filters
            </Text>
          </TouchableOpacity>
        }
      />
      <View style={[styles.searchContainer, { justifyContent: "center" }]}>
        <View
          style={[
            styles.searchSection,
            {
              width: wp(90),
            },
          ]}
        >
          <FastImage
            source={images.Search}
            style={{ width: hp(2), height: hp(2) }}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Contains word..."
            onChangeText={(text) => {
              // console.log(text);
              setSearch(text);
            }}
            placeholderTextColor={colors.placeholderText}
          />
        </View>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        // style={{ width: "90%", alignSelf: "center", marginBottom: hp(2) }}
      >
        <View style={styles.mainFilters}>
          <FlatList
            data={filterItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
            //   horizontal={true}
            renderItem={renderFilterItem}
          />
        </View>
        {selected == 5 || selected == 6 ? (
          <>
            <Text style={styles.filterTitle}>Catalogues</Text>
            <View style={styles.mainFilters}>
              <FlatList
                data={stampCatalogNumberTypes}
                keyExtractor={(item) => item.id}
                numColumns={2}
                //   horizontal={true}
                renderItem={renderCatalogueItem}
              />
            </View>
          </>
        ) : null}

        {selected == 6 ? (
          <>
            <Text style={styles.filterTitle}>Accepting Offers</Text>
            <View style={styles.mainFilters}>
              <FlatList
                data={offers}
                keyExtractor={(item) => item.id}
                numColumns={2}
                //   horizontal={true}
                renderItem={renderOffer}
              />
            </View>
          </>
        ) : null}
        {selected !== 3 && selected !== 4 ? (
          <>
            <BiPicker
              data2={countries}
              value2={location}
              label2={location ? "Location" : "Select Location"}
              onChange2={(val) => {
                console.log("val", val);
                setLocation(val);
                let qr = q_c("country[]", r_s(val));
                if (qr) {
                  setQueryUrl(qr);
                } else {
                  setQueryUrl(`${queryUrl}&country[]=${r_s(val)}`);
                }
              }}
              data={format_types}
              label={itemFormat ? "Item's Format" : "Select Format"}
              value={itemFormat}
              onChange={(val) => {
                setItemFormat(val);
                let qr = q_c("format", r_s(val));
                if (qr) {
                  setQueryUrl(qr);
                } else {
                  setQueryUrl(`${queryUrl}&format=${r_s(val)}`);
                }
              }}
            />
            <BiPicker
              data={stampColors}
              label={selectColor ? "Color" : language?.selectColor}
              value={selectColor}
              onChange={(val) => {
                setSelectColor(val);
                let qr = q_c("color", r_s(val));
                if (qr) {
                  setQueryUrl(qr);
                } else {
                  setQueryUrl(`${queryUrl}&color=${r_s(val)}`);
                }
              }}
              data2={quality_Data}
              label2={quality ? "Quality" : "Select Quality"}
              value2={quality}
              onChange2={(val) => {
                setQuality(val);
                let qr = q_c("quality", r_s(val));
                if (qr) {
                  setQueryUrl(qr);
                } else {
                  setQueryUrl(`${queryUrl}&quality=${r_s(val)}`);
                }
              }}
            />
            <BiPicker
              data={categories}
              value={category}
              label={category ? "Categories" : "Select Categories"}
              onChange={(val) => {
                setCategory(val);
                for (let i of categories) {
                  if (val == i.value) {
                    let qr = q_c("category_id", r_s(i.id));
                    if (qr) {
                      setQueryUrl(qr);
                    } else {
                      setQueryUrl(`${queryUrl}&category_id=${r_s(i.id)}`);
                    }
                  }
                }
              }}
              data2={condition_data}
              value2={condition}
              label2={condition ? "Condition" : "Select Condtion"}
              onChange2={(val) => {
                setCondition(val);
                if (val !== "N/A") {
                  let qr = q_c("condition", r_s(val));
                  if (qr) {
                    setQueryUrl(qr);
                  } else {
                    setQueryUrl(`${queryUrl}&condition=${r_s(val)}`);
                  }
                }
              }}
              height2={hp(20)}
            />
            <BiPicker
              data={stampGrades}
              value={grade}
              label={grade ? language?.Grade_Centring : language?.selectGrade}
              onChange={(val) => {
                setGrade(val);
                let qr = q_c("grade", r_s(val));
                if (qr) {
                  setQueryUrl(qr);
                } else {
                  setQueryUrl(`${queryUrl}&grade=${r_s(val)}`);
                }
              }}
              data2={stamp_Status}
              value2={status}
              label2={status ? "Status" : "Select Status"}
              onChange2={(val) => {
                setStatus(val);
                let qr = q_c("status", r_s(val));
                if (qr) {
                  setQueryUrl(qr);
                } else {
                  setQueryUrl(`${queryUrl}&status=${r_s(val)}`);
                }
              }}
              // height2={hp(20)}
            />
            <View style={styles.biView}>
              <InputButton
                onPress={() => {
                  showPicker2(false);
                  showPicker(true);
                }}
                fontSize={13}
                style={{ width: "45%" }}
                label={"Year Issued from"}
                placeHolder={selectedYear ? selectedYear : "Year Issued from"}
                selected={selectedYear ? true : false}
                showIcon={false}
              />
              <InputButton
                onPress={() => {
                  showPicker(false);
                  showPicker2(true);
                }}
                fontSize={13}
                style={{ width: "45%" }}
                label={"Year Issued to"}
                placeHolder={selectedYearTo ? selectedYearTo : "Year Issued to"}
                selected={selectedYearTo ? true : false}
                showIcon={false}
              />
            </View>
          </>
        ) : (
          <>
            {selected !== 4 ? (
              <BiPicker
                data={categories}
                value={category}
                label={category ? "Categories" : "Select Categories"}
                onChange={(val) => {
                  setCategory(val);
                  for (let i of categories) {
                    if (val == i.value) {
                      let qr = q_c("category_id", r_s(i.id));
                      if (qr) {
                        setQueryUrl(qr);
                      } else {
                        setQueryUrl(`${queryUrl}&category_id=${r_s(i.id)}`);
                      }
                    }
                  }
                }}
                data2={condition_data}
                value2={condition}
                label2={condition ? "Condition" : "Select Condtion"}
                onChange2={(val) => {
                  setCondition(val);
                  if (val !== "N/A") {
                    let qr = q_c("condition", r_s(val));
                    if (qr) {
                      setQueryUrl(qr);
                    } else {
                      setQueryUrl(`${queryUrl}&condition=${r_s(val)}`);
                    }
                  }
                }}
                height2={hp(20)}
              />
            ) : null}
          </>
        )}

        <View style={styles.biView}>
          <FloatingInput
            label={language?.denomination}
            value={faceInput}
            width={wp(40)}
            keyboardType="numeric"
            onChangeText={(text) => {
              setFaceInput(text);
              let qr = q_c("denomination", r_s(text));
              if (qr) {
                setQueryUrl(qr);
              } else {
                setQueryUrl(`${queryUrl}&denomination=${r_s(text)}`);
              }
            }}
          />
          {selected == 4 ? (
            <CustomDropDown
              data={countries}
              value={location}
              label={location ? "Location" : "Select Location"}
              // width={ wp(40)}
              height={hp(25)}
              left={55}
              style={{ width: "48%", top: 4 }}
              // onChangeText={setLocation}
              onChangeText={(val) => {
                console.log("val", val);
                setLocation(val);
                setQueryUrl(`${queryUrl}&country[]=${r_s(val)}`);
              }}
            />
          ) : null}
          {selected == 5 || selected == 6 ? (
            <FloatingInput
              label="Member ID"
              width={wp(40)}
              keyboardType="numeric"
              value={memberId}
              onChangeText={(text) => {
                setMemberId(text);
                let qr = q_c("member_id", r_s(text));
                if (qr) {
                  setQueryUrl(qr);
                } else {
                  setQueryUrl(`${queryUrl}&member_id=${r_s(text)}`);
                }
              }}
            />
          ) : null}
          {selected == 2 || selected == 3 ? (
            <FloatingInput
              label="Store ID"
              width={wp(40)}
              keyboardType="numeric"
              value={storeId}
              onChangeText={(text) => {
                setStoreId(text);
                let qr = q_c("store_id", r_s(text));
                if (qr) {
                  setQueryUrl(qr);
                } else {
                  setQueryUrl(`${queryUrl}&store_id=${r_s(text)}`);
                }
              }}
            />
          ) : null}
        </View>
        {selected !== 1 && selected !== 4 && selected !== 6 ? (
          <BiPicker
            data={shippingData}
            value={shippingOption}
            label={"Shipping Option"}
            onChange={(val) => {
              setShippingOption(val);
              let qr = q_c("shiping_option", r_s(val));
              if (qr) {
                setQueryUrl(qr);
              } else {
                setQueryUrl(`${queryUrl}&shiping_option=${r_s(val)}`);
              }
            }}
            height={hp(18)}
            width={wp(43)}
            position={-4}
          />
        ) : null}
        {selected !== 3 && selected !== 4 ? (
          <>
            <View style={styles.topicContainer}>
              <Text style={[styles.inputText, { color: "#585755" }]}>
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
          </>
        ) : null}

        <View style={{ height: hp(5) }} />
      </KeyboardAwareScrollView>
      <Btn onPress={applyAdvSearch} label="Search" style={styles.searchBtn} />

      <OnlyYearPicker
        // ref={childRef}
        selectedYear={picker ? selectedYear : selectedYearTo}
        setSelectedYear={(val) => {
          if (picker) {
            let qr = q_c("year_from", r_s(val));
            if (qr) {
              setQueryUrl(qr);
            } else {
              setQueryUrl(`${queryUrl}&year_from=${val}`);
            }
            setSelectedYear(val);
          } else {
            let qr = q_c("year_to", r_s(val));
            if (qr) {
              setQueryUrl(qr);
            } else {
              setQueryUrl(`${queryUrl}&year_to=${val}`);
            }
            setSelectedYearTo(val);
          }
        }}
        show={picker || picker2}
        showPicker={picker ? showPicker : showPicker2}
      />
    </View>
  );
};
