import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import SupportAxios from "../../support_apis/SupportAxios";

import { Alert } from "react-native";
import {
  END_LOADING,
  FEEDS,
  LOADING,
  NEXT_PG,
  EMPTY,
  USER,
  USER_FCM,
  SUPPORT_TOKEN,
} from "../types";
import Helper from "../../src/Helper";
import supportEnv from "../../support_apis/supportEnv";

export const getFeeds = (x, callback, type) => {
  return async (dispatch) => {
    if (x) {
      dispatch({
        type: FEEDS,
        payload: x,
      });
    } else {
      const response = await MindAxios.get(
        Env.createUrl(type ? `feeds?type=${type}` : "feeds")
      );
      const { e } = response;
      const error = e?.response?.data;
      if (response?.status == 200) {
        let next_page;
        let paginated = response?.data?.result?.paginated_items;
        // console.log("data--->", data);
        if (type) {
          next_page = paginated?.next_page_url;
          let currentPg = paginated?.current_page;
          let lastPg = paginated?.last_page;

          if (next_page) {
            next_page = next_page + "&type=" + type;
          }
        } else {
          next_page = paginated?.next_page_url;
        }

        dispatch({
          type: FEEDS,
          payload: paginated?.data,
        });
        dispatch({
          type: NEXT_PG,
          payload: next_page,
        });
        // console.log('nextPg-->', next_page)
        // setNextPg(next_page);
      } else if (error) {
        Alert.alert("Error", `${error?.message}`, [
          {
            text: "Sign out",
            onPress: () => {
              if (callback) {
                callback();
              }
            },
          },
        ]);
      }
    }
  };
};
export const setNextPg = (x) => {
  // console.log('nextPg-->', x)
  return {
    type: NEXT_PG,
    payload: x,
  };
};
export const setFeedLoad = (x) => {
  return {
    type: LOADING,
    payload: x,
  };
};
export const setFeedEndLoad = (x) => {
  return {
    type: END_LOADING,
    payload: x,
  };
};
export const getUserApi = (x) => {
  return async (dispatch) => {
    if (x) {
      dispatch({
        type: USER,
        payload: x,
      });
    } else {
      const userId = await Helper.getData("userId");
      // console.log('id--->', userId)
      if (userId) {
        const response = await MindAxios.get(Env.paramUrl("users", userId));
        // console.log("user res--->", response);
        if (response?.status == 200) {
          const {
            data: {
              result: { user },
            },
          } = response;
          dispatch({
            type: USER,
            payload: user,
          });
        }
      }
    }
  };
};
// const supportSysLogin = async (uid) => {
//   const { data, e } = await SupportAxios.post(
//     supportEnv.createUrl("login-by-id"),
//     {
//       uid: uid,
//     }
//   );
// };
export const setSupportToken = (user) => {
  return async (dispatch) => {
    console.log("user", user?.uid);
    // const spToken = await Helper.getData("supportToken");
    let spToken = null;
    if (!spToken) {
      const { data, e } = await SupportAxios.post(
        supportEnv.createUrl("login-by-id"),
        {
          uid: user?.uid,
        }
      );
      console.log("data", data);
      if (data?.success) {
        const {
          result: { token },
        } = data;
        await Helper.storeData("supportToken", token);
        dispatch({
          type: SUPPORT_TOKEN,
          payload: token,
        });
      } else {
        // console.log("error", { e });
        dispatch({
          type: SUPPORT_TOKEN,
          payload: null,
        });
      }
    } else {
      dispatch({
        type: SUPPORT_TOKEN,
        payload: spToken,
      });
    }
  };
};
export const setUserFcm = (x) => {
  return async (dispatch) => {
    if (x) {
      dispatch({
        type: USER_FCM,
        payload: x,
      });
    } else {
      const fcmToken = await Helper.getData("fcmToken");
      // console.log('id--->', userId)
      if (fcmToken) {
        let { headers } = await MindAxios.formdataConfig();
        let fd = new FormData();
        fd.append("fcm_token", fcmToken);
        fetch(Env.createUrl("users/create-fcm-token"), {
          method: "POST",
          headers: headers,
          body: fd,
        })
          .then((response) => response.json())
          .then((res) => {
            console.log("res", res);
            if (res?.success) {
              dispatch({
                type: USER_FCM,
                payload: fcmToken,
              });
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else {
        dispatch({
          type: USER_FCM,
          payload: null,
        });
      }
    }
  };
};
export const onSignout = () => {
  return {
    type: EMPTY,
  };
};

export default {
  getFeeds,
  setFeedLoad,
  setNextPg,
  setFeedEndLoad,
  onSignout,
  getUserApi,
  setUserFcm,
  setSupportToken,
};
