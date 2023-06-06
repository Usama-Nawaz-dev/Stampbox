import {
  SUPPLY_DETAIL,
  STAMP_DETAIL,
  EMPTY,
  OTHER_USER,
  STAMP_LIST,
  TRADE_DETAIL,
  ORDER_DETAIL,
  STORE_DETAIL,
  EVENT_DETAIL,
  CLUB_DETAIL,
  BLOG_DETAIL,
  AUCTION_DETAIL,
  MY_STAMP,
  BOUNTY_DETAIL,
  AUCTION_COUNTERS,
} from "../types";

const InitialState = {
  stampDetail: {},
  supplyDetail: {},
  otherUser: {},
  stampsList: [],
  tradeDetail: {},
  orderDetail: [],
  storeDetail: {},
  eventDetail: {},
  clubDetail: {},
  blogDetail: {},
  auctionDetail: {},
  myStamp: null,
  bountyDetail: {},
  auctionCounters: {},
};

const DetailReducer = (state = InitialState, action) => {
  switch (action.type) {
    case STAMP_DETAIL:
      return {
        ...state,
        stampDetail: action.payload,
      };
    case SUPPLY_DETAIL:
      return {
        ...state,
        supplyDetail: action.payload,
      };
    case OTHER_USER:
      return {
        ...state,
        otherUser: action.payload,
      };
    case STAMP_LIST:
      return {
        ...state,
        stampsList: action.payload,
      };
    case TRADE_DETAIL:
      return {
        ...state,
        tradeDetail: action.payload,
      };
    case ORDER_DETAIL:
      return {
        ...state,
        orderDetail: action.payload,
      };
    case STORE_DETAIL:
      return {
        ...state,
        storeDetail: action.payload,
      };
    case EVENT_DETAIL:
      return {
        ...state,
        eventDetail: action.payload,
      };
    case CLUB_DETAIL:
      return {
        ...state,
        clubDetail: action.payload,
      };
    case BLOG_DETAIL:
      return {
        ...state,
        blogDetail: action.payload,
      };
    case AUCTION_DETAIL:
      return {
        ...state,
        auctionDetail: action.payload,
      };
    case MY_STAMP:
      return {
        ...state,
        myStamp: action.payload,
      };
    case BOUNTY_DETAIL:
      return {
        ...state,
        bountyDetail: action.payload,
      };
    case AUCTION_COUNTERS:
      return {
        ...state,
        auctionCounters: action.payload,
      };
    case EMPTY:
      return {
        ...state,
        supplyDetail: {},
        stampDetail: {},
        otherUser: {},
        stampsList: [],
        tradeDetail: {},
        orderDetail: [],
        storeDetail: {},
        eventDetail: {},
        clubDetail: {},
        blogDetail: {},
        auctionDetail: {},
        myStamp: null,
        bountyDetail: {},
        auctionCounters: {},
      };
    default:
      return state;
  }
};

export default DetailReducer;
