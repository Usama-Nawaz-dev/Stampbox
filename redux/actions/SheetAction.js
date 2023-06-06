import {
  GROUP_MEMBERS,
  SHEET_REF,
  STAMP_IDS,
  USERCHAT,
  INITIAL_ROUTE,
  EVENT_TYPE,
  FLAG_TYPE,
  FLAGINFO,
  CHAT_TAB,
  GROUPS,
} from "../types";

export const SheetRef = (x) => {
  return {
    type: SHEET_REF,
    payload: x,
  };
};

export const checkStamps = (x) => {
  return {
    type: STAMP_IDS,
    payload: x,
  };
};

export const initialRoute = (x) => {
  return {
    type: INITIAL_ROUTE,
    payload: x,
  };
};

export const groupMembers = (x) => {
  return {
    type: GROUP_MEMBERS,
    payload: x,
  };
};
export const user_chat = (x) => {
  return {
    type: USERCHAT,
    payload: x,
  };
};
export const EventType = (x) => {
  return {
    type: EVENT_TYPE,
    payload: x,
  };
};
export const FlagType = (x) => {
  return {
    type: FLAG_TYPE,
    payload: x,
  };
};
export const FlagInfo = (x) => {
  return {
    type: FLAGINFO,
    payload: x,
  };
};
export const chatTab = (x) => {
  return {
    type: CHAT_TAB,
    payload: x,
  };
};
export const getGroups = (x) => {
  return {
    type: GROUPS,
    payload: x,
  };
};
export default {
  SheetRef,
  checkStamps,
  groupMembers,
  user_chat,
  initialRoute,
  EventType,
  FlagType,
  FlagInfo,
  chatTab,
  getGroups
};
