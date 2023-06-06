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

const InitialState = {
  homeFeeds: undefined,
  feedLoad: false,
  next_pg: null,
  endLoad: false,
  user: null,
  fcm_res: null,
  support_token: null,
};

const ApiReducer = (state = InitialState, action) => {
  switch (action.type) {
    case FEEDS:
      return {
        ...state,
        homeFeeds: action.payload,
      };
    case NEXT_PG:
      return {
        ...state,
        next_pg: action.payload,
      };
    case LOADING:
      return {
        ...state,
        feedLoad: action.payload,
      };
    case END_LOADING:
      return {
        ...state,
        endLoad: action.payload,
      };
    case USER_FCM:
      return {
        ...state,
        fcm_res: action.payload,
      };
    case SUPPORT_TOKEN:
      return {
        ...state,
        support_token: action.payload,
      };
    case USER:
      return {
        ...state,
        user: action.payload,
      };
    case EMPTY:
      return InitialState;
    default:
      return state;
  }
};

export default ApiReducer;
