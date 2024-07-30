import { ChatPrefsPayloadType } from "./Models";
import { getSessionStoragePrefs, setSessionStoragePrefs } from "./Storage";

export const TENANT_ID: string = (window as any).TENANT_ID;
export const CHANNEL_ID: string = (window as any).CHANNEL_ID;
export const CHANNEL_PREFS: string = (window as any).CHANNEL_PREFS;
export const VISITOR_UUID: string = (window as any).VISITOR_UUID;

export const SERVER_REQ_HOST_PATH: string =
  (window as any).SERVER_HOST_DOMAIN_URL || "https://sandbox.reacho.com/";

export const PARENT_WINDOW = (window as any).parent;
export const PARENT_WINDOW_LIVECHAT_REF = PARENT_WINDOW
  ? PARENT_WINDOW.EngageBay_Livechat
  : undefined;

// export const CHAT_PREFS: ChatPrefsPayloadType = PARENT_WINDOW_LIVECHAT_REF
//   ? PARENT_WINDOW_LIVECHAT_REF.ref.settings
//   : undefined;

const REQUEST_PREFIX_PATH = "api/support/jsclient/inbox";

export const NEW_SESSION_URL_PATH: string =
  REQUEST_PREFIX_PATH + "/new-conversation";

export const ADD_EMAIL_URL_PATH: string = REQUEST_PREFIX_PATH + "/add-email";

export const UPDATE_READ_URL_PATH: string =
  REQUEST_PREFIX_PATH + "/update-read";

export const MESSAGE_URL_PATH: string = REQUEST_PREFIX_PATH + "/new-message";

export const AGENTS_FETCH_URL_PATH: string =
  REQUEST_PREFIX_PATH + "/get-agents";

export const CONNECT_TO_AGENT_URL_PATH: string =
  "api/support/jsclient/widget/connect-to-agent/";
export const TICKETS_FETCH_URL: string =
  "jsapi/rest/get-tickets/" + VISITOR_UUID;

export const TICKET_FETCH_URL: string = "jsapi/rest/ticket/" + VISITOR_UUID;
export const USERS_FETCH_URL: string = "jsapi/rest/group/users/";
export const USER_FETCH_URL: string = "jsapi/rest/user/";
export const TICKET_CREATE_URL: string =
  "jsapi/rest/create-ticket/" + VISITOR_UUID;
export const NOTE_URL: string = "jsapi/rest/ticket-notes/" + VISITOR_UUID;
export const LAST_NOTE_URL: string = "jsapi/rest/last-note/";

export const KB_COLLECTION_URL_PATH: string = "jsapi/rest/hc/collections";
export const KB_COLLECTION_URL_PATH_BY_ID: string = "jsapi/rest/hc/collection/";
export const KB_ARTICLE_URL_PATH: string = "jsapi/rest/hc/article/";
export const KB_SEARCH_URL_PATH: string = "jsapi/rest/hc/search";

export const GPT_MESSAGE_SCORE_UPDATE_URL_PATH: string =
  "api/support/jsclient/widget/submit-gpt-message-feedback";

export const BOT_FETCH_URL_PATH: string = "";

export const CONVERSATIONS_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "/get-chat-conversations/" + VISITOR_UUID;

export const CHAT_FLOWS_FETCH_URL_PATH = REQUEST_PREFIX_PATH + "/chat-flows/";

export const START_FLOW_URL_PATH =
  REQUEST_PREFIX_PATH + "/flow/start/" + VISITOR_UUID;

export const EXECUTION_LIST_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "/flow/execution/";

export const EXECUTE_FLOW_NODE_URL_PATH = REQUEST_PREFIX_PATH + "/flow/execute";

export const CONVERSATION_MESSAGE_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "/get-chat-messages";

export const CHANNEL_PREFS_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "/channel/chat/" + CHANNEL_ID;

export const WEB_RULES_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "widget/web-rules";
export const TYPING_ALERT_URL_PATH =
  REQUEST_PREFIX_PATH + "widget/typing-alerts/VISITOR";
export const FILE_UPLOAD_URL_PATH =
  REQUEST_PREFIX_PATH + "panel/contentbox/repo/getFilePath";
export const GET_BIG_TEXT_URL_PATH =
  REQUEST_PREFIX_PATH + "widget/get-big-text/";

export const WINDOW_OPEN = "window-open";

export const OPENED_CHAT = "opened-chat";

export const OPENED_FLOW = "opened-flow";

export const OPERATORS = "operators";

export const WIDGET_ACTIVE_TAB = "widget_active_tab";

export const PROACTIVE_MESSAGE = "proactive-message";

export const FORM_DATA = "form_data";

export const TICKET_ACTIVE_ID = "ticket_active_id";

export const TICKET_ACTIVE_COMPONENT = "ticket_active_component";

export const HC_ACTIVE_ID = "hc_active_id";

export const HC_SEARCH_TEXT = "hc_search_text";

export const HC_ACTIVE_COMPONENT = "hc_active_component";

export const IS_NEW_SESSION: boolean = (function () {
  // console.log("Checkingup the session");

  let isNew = getSessionStoragePrefs("chat-session-loaded") ? false : true;
  if (isNew) {
    setSessionStoragePrefs("chat-session-loaded", true, 7);
  }
  // alert(isNew);
  return isNew;
  // return false;
})();

export const FooterTabs = [
  {
    tab: "Home",
    enable: true,
  },
  {
    tab: "Messages",
    enable: true,
  },
];
