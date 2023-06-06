import {
  SUPPLY_DETAIL,
  STAMP_DETAIL,
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

export const StampDetail = (x) => {
  return {
    type: STAMP_DETAIL,
    payload: x,
  };
};
export const SupplyDetail = (x) => {
  return {
    type: SUPPLY_DETAIL,
    payload: x,
  };
};

export const OtherUser = (x) => {
  return {
    type: OTHER_USER,
    payload: x,
  };
};

export const StampsList = (x) => {
  return {
    type: STAMP_LIST,
    payload: x,
  };
};

export const TradeDetail = (x) => {
  return {
    type: TRADE_DETAIL,
    payload: x,
  };
};

export const OrderDetail = (x) => {
  return {
    type: ORDER_DETAIL,
    payload: x,
  };
};

export const StoreDetail = (x) => {
  return {
    type: STORE_DETAIL,
    payload: x,
  };
};

export const EventDetail = (x) => {
  return {
    type: EVENT_DETAIL,
    payload: x,
  };
};

export const ClubDetail = (x) => {
  return {
    type: CLUB_DETAIL,
    payload: x,
  };
};
export const BlogDetail = (x) => {
  return {
    type: BLOG_DETAIL,
    payload: x,
  };
};

export const AuctionDetail = (x) => {
  return {
    type: AUCTION_DETAIL,
    payload: x,
  };
};

export const MyStamp = (x) => {
  return {
    type: MY_STAMP,
    payload: x,
  };
};

export const BountyDetail = (x) => {
  return {
    type: BOUNTY_DETAIL,
    payload: x,
  };
};

export const AuctionCounters = (x) => {
  return {
    type: AUCTION_COUNTERS,
    payload: x,
  };
};

export default {
  StampDetail,
  SupplyDetail,
  OtherUser,
  StampsList,
  TradeDetail,
  OrderDetail,
  StoreDetail,
  EventDetail,
  ClubDetail,
  BlogDetail,
  AuctionDetail,
  MyStamp,
  BountyDetail,
  AuctionCounters,
};
