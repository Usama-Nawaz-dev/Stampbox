import { debounce } from "lodash";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import Helper from "../Helper";

export const getUsers = async (x, y, z, otherUser) => {
  const response = await MindAxios.get(Env.createUrl(`users?page_size=100`));
  if (response?.status == 200) {
    let new_data = filterData(response, null, z, otherUser);
    x(new_data);
    y(new_data);
  }
};
export const filterData = (res, n, list, otherUser) => {
  let getdata = n?.length ? n : res?.data?.result?.users?.data;
  let mems = Helper.deepCopy(otherUser?.memberList);
  let len = mems?.length;
  let newData = len ? removeCommon(getdata, mems) : getdata;
  newData?.forEach((obj) => {
    // console.log(obj?.first_name, !selectedList?.includes(obj?.id));
    if (!list?.includes(obj?.id)) {
      obj.isSelected = false;
    } else {
      obj.isSelected = true;
    }
  });
  return newData;
};
function removeCommon(Arr1, Arr2) {
  let newArr = Arr2?.filter((n) => n);
  let result = Arr1.filter((k) => !newArr.some((p) => p.id == k.id));
  return result;
}

const INTERVAL = 1000;
export const searchItems = debounce(
  (x, loading, callback, data, list, otherUser) => {
    searchData(x, loading, callback, data, list, otherUser);
  },
  INTERVAL
);

export const searchData = async (
  x,
  loading,
  callback,
  data,
  list,
  otherUser
) => {
  let text = x.toLowerCase();
  // console.log("x-->", data);
  if (x) {
    loading(true);
    const response = await MindAxios.get(
      Env.createUrl(`users?page_size=100&search=${x}`)
    );
    // console.log("response", response?.data?.result?.users?.data);
    loading(false);
    if (response?.status == 200) {
      let new_data = filterData(response, null, list, otherUser);
      callback(new_data);
    }
  } else {
    let new_data = filterData(null, data, list, otherUser);
    callback(new_data);
  }
};

export const toggle = (selected, i, statusData, x, y) => {
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
    //   console.log("res", res);
    let filteredMap = res.map((n) => {
      if (n.isSelected == true) {
        return n.id;
      } else {
        return null;
      }
    });
    let filtered = filteredMap.filter((n) => n);
    console.log("selected", filtered);
    x(res);
    y(filtered);
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
    let filteredMap = res.map((n) => {
      if (n.isSelected == true) {
        return n.id;
      } else {
        return null;
      }
    });
    let filtered = filteredMap.filter((n) => n);
    console.log("selected", filtered);
    x(res);
    y(filtered);
  }
};

export default {
  getUsers,
  filterData,
  searchData,
  toggle,
  searchItems,
};
