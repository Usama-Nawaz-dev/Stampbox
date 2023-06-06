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

const InitialState = {
  currentUser: {},
  email_verified: false,
  modal_visible: false,
  activity: false,
  selected_images: [],
  stampItemDetail: {},
  filter_img: null,
  filter_index: 0,
  history: {},
  store: null,
  cart: [],
  show_loader: false,
  currentEvents: null,
  searchFeeds: null,
  collectionType: null,
  users_list: null,
  showBottomTabs: true,
};

const DataReducer = (state = InitialState, action) => {
  switch (action.type) {
    case STAMP_ITEMS_DETAIL:
      return {
        ...state,
        stampItemDetail: action.payload,
      };
    case USER_INFO:
      return {
        ...state,
        currentUser: action.payload,
      };
    case EMAIL_VERIFIED:
      return {
        ...state,
        email_verified: action.payload,
      };
    case MODAL_VISIBLE:
      return {
        ...state,
        modal_visible: action.payload,
      };
    case APP_LOADER:
      return {
        ...state,
        show_loader: action.payload,
      };
    case ACTIVITY_MODAL:
      return {
        ...state,
        activity: action.payload,
      };
    case PICKED_IMAGES:
      return {
        ...state,
        selected_images: action.payload,
      };
    case FILTER_IMG:
      return {
        ...state,
        filter_img: action.payload,
      };
    case CART_PRODUCTS:
      return {
        ...state,
        cart: action.payload,
      };
    case SEARCH_FEEDS:
      return {
        ...state,
        searchFeeds: action.payload,
      };
    case FILTER_INDEX:
      return {
        ...state,
        filter_index: action.payload,
      };
    case FILTER_HISTORY:
      return {
        ...state,
        history: action.payload,
      };
    case STOREDATA:
      return {
        ...state,
        store: action.payload,
      };
    case CURRENT_EVENTS:
      return {
        ...state,
        currentEvents: action.payload,
      };
    case COLLECTION_TYPE:
      return {
        ...state,
        collectionType: action.payload,
      };
    case HIDE_TABS:
      return {
        ...state,
        showBottomTabs: action.payload,
      };
    case USERS_ONLINE_STATUS:
      return {
        ...state,
        users_list: action.payload,
      };

    case EMPTY:
      return {
        ...state,
        currentUser: {},
        email_verified: false,
        modal_visible: false,
        selected_images: [],
        filter_img: null,
        filter_index: 0,
        history: {},
        store: {},
        show_loader: false,
        currentEvents: null,
        searchFeeds: null,
        collectionType: null,
        users_list: null,
      };
    default:
      return state;
  }
};

export default DataReducer;
