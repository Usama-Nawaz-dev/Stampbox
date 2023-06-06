import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";

//Api Call
import Env from "../../../../api/Env";
import MindAxios from "../../../../api/MindAxios";

import { ShopBtn } from "./ShopBtn";
import { ShopSubtab } from "./ShopSubtab";
import HeaderTabs from "../../../../components/HeaderTabs";

import AuthContext from "../../../Context/AuthContext";
import ThemeContext from "../../../Context/ThemeContext";
import allActions from "../../../../redux/actions";

const headers = ["Published", "Draft"];
export const ShopTab = (props) => {
  const dispatch = useDispatch();
  const focused = useIsFocused();

  //Redux Data
  const currentUser = useSelector((state) => state.ApiReducer.user);
  const storeDetail = useSelector((state) => state.DetailReducer.storeDetail);

  const showAdd = currentUser?.id === storeDetail?.user_id;

  //Pagination States
  const [nextApiUrl, setNextApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nextStampUrl, setNextStapmUrl] = useState(null);
  const { theme } = useContext(ThemeContext);

  const {
    myState: { language },
  } = useContext(AuthContext);

  const [stampItems, setStampItems] = useState({
    published: null,
    draft: null,
  });
  const [supplies, setSupplies] = useState({
    published: null,
    draft: null,
  });
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (focused) {
      fetchListing();
    }
  }, [focused]);

  const fetchListing = async () => {
    dispatch(allActions?.DataAction.AppLoader(true));
    await getSupplies();
    await getStamps();
    dispatch(allActions?.DataAction.AppLoader(false));
  };

  const getSupplies = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(
        `products`,
        `?store_id=${storeDetail?.id}&productable_type=Supply`
      )
    );
    // console.log("response", response);
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      // console.log("<><><><><>", nextPageUrl);
      let published = _data.filter((item) => item.is_published == 1);
      let draft = _data.filter((item) => item.is_published == 0);
      //  console.log('published', published)
      setSupplies({ published: published, draft: draft });
      setNextApiUrl(nextPageUrl);
      // setFetch({ ...fetchedData, supplies: _data });
    }
  };

  const getNextSuppliesData = async () => {
    if (nextApiUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextApiUrl + `&store_id=${storeDetail?.id}&productable_type=Supply`
      );
      setIsLoading(false);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        // console.log("next data...", _data);
        let published = _data.filter((item) => item.is_published == 1);
        let draft = _data.filter((item) => item.is_published == 0);
        setSupplies({
          ...supplies,
          published: [...supplies?.published, ...published],
          draft: [...supplies?.draft, ...draft],
        });
        setNextApiUrl(nextPageUrl);
      } else {
        setIsLoading(false);
        setNextApiUrl(null);
        alert("Sever Error.");
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          // animation={loder}
          size={"large"}
          color={theme?.theme}
          style={{ marginBottom: 20 }}
        />
      </View>
    ) : null;
  };

  const getStamps = async () => {
    const response = await MindAxios.get(
      Env.paramUrl(
        `products`,
        `?store_id=${storeDetail?.id}&productable_type=StampItem`
      )
    );
    // console.log("response", response);
    if (response?.status == 200) {
      let {
        data: {
          result: {
            paginated_items: { data: _data },
          },
        },
      } = response;
      console.log("res --> stamps", _data);
      let published = _data.filter((item) => item.is_published == 1);
      let draft = _data.filter((item) => item.is_published == 0);
      let nextPageUrl = response?.data?.result?.paginated_items?.next_page_url;
      console.log("published", nextPageUrl);
      setStampItems({ published: published, draft: draft });
      setNextStapmUrl(nextPageUrl);

      // setStampItems(_data);
      // setFetch({ ...fetchedData, stamps: _data });
    }
  };

  const getNextStampsData = async () => {
    if (nextStampUrl !== null) {
      setIsLoading(true);
      const response = await MindAxios.get(
        nextStampUrl + `&store_id=${storeDetail?.id}&productable_type=StampItem`
      );
      setIsLoading(false);
      // console.log(">>>", response);
      if (response?.status == 200) {
        let _data = response?.data?.result?.paginated_items?.data;
        let nextPageUrl =
          response?.data?.result?.paginated_items?.next_page_url;
        console.log("next data...", _data);
        let published = _data.filter((item) => item.is_published == 1);
        let draft = _data.filter((item) => item.is_published == 0);
        setStampItems({
          ...stampItems,
          published: [...stampItems?.published, ...published],
          draft: [...stampItems?.draft, ...draft],
        });
        setNextStapmUrl(nextPageUrl);
      } else {
        setIsLoading(false);
        setNextStapmUrl(null);
        alert("Sever Error.");
      }
    }
  };

  const onPressAdd = () => {
    !isSelected
      ? props.navigation.navigate("StoreStamp")
      : props.navigation.navigate("StoreSupply");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme?.white }}>
      <ShopBtn setIsSelected={setIsSelected} isSelected={isSelected} />
      {showAdd && (
        <TouchableOpacity style={styles.addBtn} onPress={onPressAdd}>
          <Ionicons name="add-circle-outline" size={26} />
        </TouchableOpacity>
      )}
      <HeaderTabs
        headers={headers}
        renderList={({ item, index }) => {
          switch (index) {
            case 0:
              return (
                <ShopSubtab
                  tab="Published"
                  showAdd={showAdd}
                  language={language}
                  onPressAdd={onPressAdd}
                  ListFooterComponent={renderFooter}
                  data={!isSelected ? stampItems.published : supplies.published}
                  onEndReached={
                    !isSelected ? getNextStampsData : getNextSuppliesData
                  }
                />
              );
            case 1:
              return (
                <ShopSubtab
                  tab="Draft"
                  showAdd={showAdd}
                  language={language}
                  onPressAdd={onPressAdd}
                  ListFooterComponent={renderFooter}
                  data={!isSelected ? stampItems.draft : supplies.draft}
                  onEndReached={
                    !isSelected ? getNextStampsData : getNextSuppliesData
                  }
                />
              );
          }
        }}
      />
    </View>
  );
};
