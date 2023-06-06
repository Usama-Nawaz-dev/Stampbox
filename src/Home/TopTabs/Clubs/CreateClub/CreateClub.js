import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";

import { styles } from "./styles";
import CoverPhoto from "../../../../../components/CoverPhoto";
import AppText from "../../../../../components/AppText";

import { MainHeader, FloatingInput, GradBtn } from "../../../../../components";

import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import { useDispatch } from "react-redux";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import { SelectionSheet } from "../../../../Sheets";
import { BottomSheet } from "../../../../../components";
import { newTopics } from "../../../../../constant/staticData";

import Helper from "../../../../Helper";
import Env from "../../../../../api/Env";
import MindAxios from "../../../../../api/MindAxios";
import allActions from "../../../../../redux/actions";

import colors from "../../../../../constant/colors";
import AuthContext from "../../../../Context/AuthContext";
import ErrorMessage from "../../../../forms/ErrorMessage";
import InputButton from "../../../../../components/InputButton";
import SelectedItems from "../../../../../components/SelectedItems";
import CustomDropDown from "../../../../../components/CustomDropDown";
import ThemeContext from "../../../../Context/ThemeContext";

const arrayChecker = (arr1, arr2) => {
  arr1.forEach((el) => {
    if (arr2?.length) {
      arr2.forEach((el2) => {
        if (el.id == el2.id) {
          el.isSelected = true;
        }
      });
    }
  });
};

export const CreateClub = (props) => {
  const { Item } = props.route.params;

  const dispatch = useDispatch();
  const topicSheetRef = useRef();
  const categorySheetRef = useRef();

  const [imgModal, setImgModal] = useState(false);
  const [coverImage, setCoverImage] = useState({
    uri: Item ? Item?.image_url : null,
  });

  const [name, setName] = useState(Item ? Item?.name : null);
  const [description, setDescription] = useState(
    Item ? Item?.description : null
  );
  const [evenType, setEventType] = useState(Item ? Item?.privacy_type : null);
  const [rules, setRules] = useState(Item ? Item?.rule : null);
  const [categories, setCategories] = useState(null);
  const [listChanged, setListChanged] = useState(true);

  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const {
    myState: { language },
  } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const staticTopics = Helper.deepCopy(newTopics)?.map(
    ({ value: key, ...rest }) => ({
      key,
      ...rest,
    })
  );
  arrayChecker(staticTopics, Item?.topics);

  const [topicList, setTopicList] = useState(staticTopics);
  const [isEnabled, setIsEnabled] = useState(false);

  const filterTopics = topicList.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });

  const filterCategory = categories?.filter((item) => {
    if (item.isSelected == true) {
      return item;
    }
  });

  const placeHolderChecker = (item, placeHolder) => {
    if (item?.length == 1) {
      return item[0]?.key ? item[0]?.key : item[0]?.name;
    } else if (item?.length > 1) {
      return `${item[0]?.key ? item[0]?.key : item[0]?.name} & more`;
    } else {
      return placeHolder;
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
        arrayChecker(newData, Item?.categories);
        setCategories(newData);
      }
    })();
  }, []);

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
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          setCoverImage(images.assets[0]);
          setImgError(false);
        } else {
          // console.log("Cancled", images);
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };
  const captureImage = async (type) => {
    // console.log("Take Picture Function");
    launchCamera({
      multiple: false,
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    })
      .then((images) => {
        if (images.assets) {
          setCoverImage(images.assets[0]);
          setImgError(false);
        } else {
          // console.log("Cancelled");
        }
      })
      .catch((err) => {
        // console.log(err)
      });
  };

  const checkValidation = async () => {
    let isValid = true;
    if (!name) {
      setError(`Club name is required.`);
      isValid = false;
    }
    if (!coverImage?.uri) {
      setImgError(`Club photo is required.`);
      isValid = false;
    }
    if (!evenType) {
      setTypeError("Event type is required.");
      isValid = false;
    }

    if (isValid) {
      let { headers } = await MindAxios.formdataConfig();
      let fd = new FormData();

      const newFile = {
        uri: coverImage.uri,
        type: "image/png",
        name: "photo.png",
        filename: "imageName.png",
      };
      fd.append("name", name);
      fd.append("description", description);
      fd.append("image", newFile);
      fd.append("privacy_type", evenType);
      fd.append("rule", rules);
      filterTopics?.map((item, index) =>
        fd.append(`topic_ids[${index}]`, item?.id)
      );
      filterCategory?.map((item, index) =>
        fd.append(`category_ids[${index}]`, item?.id)
      );
      if (Item) {
        handleUpdate(headers, fd);
      } else {
        // console.log(fd)
        handleCreate(headers, fd);
      }
    }
  };

  const handleCreate = (headers, fd) => {
    dispatch(allActions.DataAction.AppLoader(true));
    fetch(Env.createUrl("clubs"), {
      method: "POST",
      headers: headers,
      body: fd,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res?.success) {
          dispatch(allActions.DataAction.AppLoader(false));
          Helper.showToastMessage("Club created Successfully.", colors.green);
          props.navigation.goBack();
        }
      })
      .catch((e) => {
        dispatch(allActions.DataAction.AppLoader(false));
        // console.log('e', e);
      });
  };

  const handleUpdate = (headers, fd) => {
    dispatch(allActions.DataAction.AppLoader(true));
    fetch(Env.createUrl(`clubs/${Item?.id}`), {
      method: "POST",
      headers: headers,
      body: fd,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res?.success) {
          dispatch(allActions.DataAction.AppLoader(false));
          Helper.showToastMessage("Club updated Successfully.", colors.green);
          fetchSingleClub();
        }
      })
      .catch((e) => {
        dispatch(allActions.DataAction.AppLoader(false));
        // console.log('e', e);
      });
  };

  const fetchSingleClub = async () => {
    const response = await MindAxios.get(Env.paramUrl(`clubs`, Item?.id));
    dispatch(allActions.DataAction.AppLoader(false));
    if (response?.status == 200) {
      const _data = response?.data?.result?.item;
      dispatch(allActions.DetailAction.ClubDetail(_data));
      props.navigation.goBack();
    } else {
      alert("Sever Error.");
    }
  };

  const toggleItem = (selected, i, data, setState) => {
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

  const renderSelected = ({ item, index }) => {
    // console.log('item-->', item)
    return (
      <SelectedItems
        item={item?.key ? item?.key : item?.name}
        remove={() => {
          item.isSelected = false;
          setListChanged(!listChanged);
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.white }]}>
      <MainHeader
        title={Item ? language?.editClub : language?.createClub}
        onPressBack={() => props.navigation.goBack()}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.coverSection}>
          <CoverPhoto
            btnText={language?.uploadClubPhoto}
            uri={coverImage ? coverImage.uri : null}
            onPress={() => setImgModal(!imgModal)}
            showEdit={true}
          />
          <ErrorMessage visible={imgError ? true : false} error={imgError} />
        </View>
        <FloatingInput
          label={`${language?.clubName}*`}
          value={name}
          onChangeText={(text) => {
            setError(false);
            setName(text);
          }}
          error={error}
        />
        <CustomDropDown
          value={evenType}
          data={[{ value: "Public" }, { value: "Private" }]}
          label={"Club Type*"}
          position={-3}
          onChangeText={(value) => {
            setTypeError(false);
            setEventType(value);
          }}
        />
        <ErrorMessage visible={typeError ? true : false} error={typeError} />
        {filterTopics?.length ? (
          <View style={{ marginTop: hp(1.5) }}>
            <FlatList
              horizontal={true}
              data={filterTopics}
              extraData={listChanged}
              renderItem={renderSelected}
              showsHorizontalScrollIndicator={true}
            />
          </View>
        ) : null}
        <InputButton
          style={{ marginTop: filterTopics?.length ? -10 : 0 }}
          onPress={() => topicSheetRef?.current?.open()}
          placeHolder={placeHolderChecker(filterTopics, language?.selectTopics)}
        />
        {filterCategory?.length ? (
          <View style={{ marginTop: hp(1.5) }}>
            <FlatList
              horizontal={true}
              data={filterCategory}
              extraData={listChanged}
              renderItem={renderSelected}
              showsHorizontalScrollIndicator={true}
            />
          </View>
        ) : null}
        <InputButton
          style={{ marginTop: filterCategory?.length ? -10 : 0 }}
          onPress={() => categorySheetRef?.current?.open()}
          placeHolder={placeHolderChecker(
            filterCategory,
            language?.selectCategories
          )}
        />
        <FloatingInput
          value={rules}
          label={`Club Rules`}
          onChangeText={(text) => setRules(text)}
        />
        <AppText style={[styles.inputText, { color: theme?.lightText }]}>
          Description
        </AppText>
        <TextInput
          placeholder={"Description..."}
          style={styles.descriptionInput}
          multiline
          value={description}
          color={theme?.lightText}
          onChangeText={(text) => setDescription(text)}
        />
        <GradBtn
          height={50}
          fontWeight={"500"}
          onPress={checkValidation}
          style={{ marginBottom: hp(2) }}
          label={Item ? "Update" : language?.createClub}
        />
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

      {/* Topic Sheet */}
      <BottomSheet
        ref={topicSheetRef}
        title={language?.selectTopics}
        onPressClose={() => topicSheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(60)}
        ChildComponent={
          <SelectionSheet
            Data={topicList}
            onValueChange={(selected, index) =>
              toggleItem(selected, index, topicList, setTopicList)
            }
          />
        }
      />
      {/* Categories Sheet */}
      <BottomSheet
        ref={categorySheetRef}
        title={language?.selectCategories}
        onPressClose={() => categorySheetRef?.current?.close()}
        dropDown={false}
        sheetHeight={hp(60)}
        ChildComponent={
          <SelectionSheet
            isEnabled={isEnabled}
            showImage={true}
            Data={categories}
            onSelectAll={(value) => {
              setIsEnabled(value);
              if (value) {
                const allSelected = categories?.map((item) => {
                  item.isSelected = true;
                  return item;
                });
                setCategories(allSelected);
              } else {
                const allUnSelected = categories?.map((item) => {
                  item.isSelected = false;
                  return item;
                });
                setCategories(allUnSelected);
              }
            }}
            onValueChange={(selected, index) =>
              toggleItem(selected, index, categories, setCategories)
            }
          />
        }
      />
    </View>
  );
};
