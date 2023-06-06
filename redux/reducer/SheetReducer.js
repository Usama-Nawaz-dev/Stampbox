import {
  SHEET_REF,
  STAMP_IDS,
  INITIAL_ROUTE,
  GROUP_MEMBERS,
  USERCHAT,
  EVENT_TYPE,
  FLAG_TYPE,
  FLAGINFO,
  CHAT_TAB,
  GROUPS,
} from "../types";
const InitialState = {
  sheet_ref: {},
  stampIds: [],
  members: [],
  otherUser: {},
  initialRoute: null,
  eventType: null,
  flagType: null,
  flagInfo: null,
  chat_tab: "chats",
  groups_data: null
};

const SheetReducer = (state = InitialState, action) => {
  switch (action.type) {
    case SHEET_REF:
      return {
        ...state,
        sheet_ref: action.payload,
      };
    case STAMP_IDS:
      return {
        ...state,
        stampIds: action.payload,
      };
    case GROUP_MEMBERS:
      return {
        ...state,
        members: action.payload,
      };
    case INITIAL_ROUTE:
      return {
        ...state,
        initialRoute: action.payload,
      };
    case USERCHAT:
      return {
        ...state,
        otherUser: action.payload,
      };
    case EVENT_TYPE:
      return {
        ...state,
        eventType: action.payload,
      };
    case FLAG_TYPE:
      return {
        ...state,
        flagType: action.payload,
      };
    case FLAGINFO:
      return {
        ...state,
        flagInfo: action.payload,
      };
      case GROUPS:
      return {
        ...state,
        groups_data: action.payload,
      };
    case CHAT_TAB:
      return {
        ...state,
        chat_tab: action.payload,
      };
    default:
      return state;
  }
};

export default SheetReducer;
