import {
  USER_INFO,
  EMAIL_VERIFIED,
  MODAL_VISIBLE,
  ACTIVITY_MODAL,
  PICKED_IMAGES,
  EMPTY,
  STAMP_ITEMS_DETAIL,
  FILTER_IMG,
  FILTER_INDEX,
  FILTER_HISTORY,
  STOREDATA,
  CART_PRODUCTS,
  APP_LOADER,
  CURRENT_EVENTS,
  SEARCH_FEEDS,
  COLLECTION_TYPE,
  USERS_ONLINE_STATUS,
  HIDE_TABS,
} from "../types";

export const StampDetail = (x) => {
  return {
    type: STAMP_ITEMS_DETAIL,
    payload: x,
  };
};
export const User = (x) => {
  // console.log('from redux userInfo->', x);
  return {
    type: USER_INFO,
    payload: x,
  };
};
export const CheckEmail = (x) => {
  return {
    type: EMAIL_VERIFIED,
    payload: x,
  };
};
export const VerifyModal = (x) => {
  return {
    type: MODAL_VISIBLE,
    payload: x,
  };
};
export const ActivityModal = (x) => {
  return {
    type: ACTIVITY_MODAL,
    payload: x,
  };
};
export const AppLoader = (x) => {
  return {
    type: APP_LOADER,
    payload: x,
  };
};
export const SelectedImg = (x) => {
  return {
    type: PICKED_IMAGES,
    payload: x,
  };
};
export const onSignout = () => {
  return {
    type: EMPTY,
  };
};
export const recentFilter = (x) => {
  return {
    type: FILTER_IMG,
    payload: x,
  };
};
export const recentFilterIndex = (x) => {
  return {
    type: FILTER_INDEX,
    payload: x,
  };
};
export const recentFilterHistory = (x) => {
  return {
    type: FILTER_HISTORY,
    payload: x,
  };
};
export const storeData = (x) => {
  return {
    type: STOREDATA,
    payload: x,
  };
};
export const cart_products = (x) => {
  return {
    type: CART_PRODUCTS,
    payload: x,
  };
};
export const current_events = (x) => {
  return {
    type: CURRENT_EVENTS,
    payload: x,
  };
};
export const online_users = (x) => {
  return {
    type: USERS_ONLINE_STATUS,
    payload: x,
  };
};
export const search_feeds = (x) => {
  return {
    type: SEARCH_FEEDS,
    payload: x,
  };
};
export const show_tabs = (x) => {
  return {
    type: HIDE_TABS,
    payload: x,
  };
};
export const CollectionType = (x) => {
  return {
    type: COLLECTION_TYPE,
    payload: x,
  };
};
export default {
  StampDetail,
  User,
  CheckEmail,
  VerifyModal,
  ActivityModal,
  SelectedImg,
  onSignout,
  recentFilter,
  recentFilterIndex,
  recentFilterHistory,
  storeData,
  cart_products,
  AppLoader,
  current_events,
  search_feeds,
  CollectionType,
  online_users,
  show_tabs,
};
