import { ChatPrefsPayloadType } from "./Models";
import { getSessionStoragePrefs, setSessionStoragePrefs } from "./Storage";

export const TENANT_ID: string = (window as any).TENANT_ID;
export const CHANNEL_ID: string = (window as any).CHANNEL_ID;
export const API_KEY: string = (window as any).API_KEY;

export function getReachoModule() {
  let prefs;
  try {
    prefs = (window as any).parent.reachoModulesObject;
  } catch (e) {}
  return prefs;
}

let prefs;
try {
  prefs = getReachoModule().ChatPrefs[CHANNEL_ID];
} catch (e) {}
export const CHANNEL_PREFS: ChatPrefsPayloadType = (window as any).CHANNEL_PREFS
  ? (window as any).CHANNEL_PREFS
  : undefined;

export const VISITOR_UUID: string = (window as any).VISITOR_UUID;

export const SERVER_REQ_HOST_PATH: string =
  (window as any).SERVER_HOST_DOMAIN_URL ||
  (getReachoModule() && getReachoModule().mode
    ? "https://" + getReachoModule().mode + ".reacho.com/"
    : "https://live.reacho.com/");

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

export const VALIDATE_CUSTOMER_PATH =
  REQUEST_PREFIX_PATH + "/validate-customer";

export const ADD_EMAIL_URL_PATH: string = REQUEST_PREFIX_PATH + "/add-email";

export const UPDATE_READ_URL_PATH: string =
  REQUEST_PREFIX_PATH + "/update-read";

export const MESSAGE_URL_PATH: string = REQUEST_PREFIX_PATH + "/new-message";

export const KB_COLLECTION_CHILDREN_BY_ID: string = "jsapi/rest/hc/collections";
export const KB_ARTICLE_GET_PATH: string = "jsapi/rest/help-center/article";

export const AGENTS_FETCH_URL_PATH: string =
  "/user/get-users?tid=5943959859757056";

export const CONNECT_TO_AGENT_URL_PATH: string =
  "api/support/jsclient/widget/connect-to-agent/";
export const TICKETS_FETCH_URL: string =
  "jsapi/rest/get-tickets/" + VISITOR_UUID;

export const TICKET_FETCH_URL: string = "jsapi/rest/ticket/" + VISITOR_UUID;

export const ORDERS_FETCH_URL: string =
  "api/support/jsclient/inbox/get-store-orders";
export const ORDER_FETCH_URL: string =
  "api/support/jsclient/inbox/get-store-order";

export const USERS_FETCH_URL: string =
  "https://eb-webhooks.engagebay.com/user/get-users?tid=" + TENANT_ID;

export const USER_FETCH_URL: string = "jsapi/rest/user/";
export const TICKET_CREATE_URL: string =
  "jsapi/rest/create-ticket/" + VISITOR_UUID;
export const NOTE_URL: string = "jsapi/rest/ticket-notes/" + VISITOR_UUID;
export const LAST_NOTE_URL: string = "jsapi/rest/last-note/";

export const KB_COLLECTION_URL_PATH: string = "jsapi/rest/hc/collections";
export const KB_COLLECTION_URL_PATH_BY_ID: string = "jsapi/rest/hc/collection/";
export const KB_ARTICLE_URL_PATH: string = "jsapi/rest/hc/article/";
export const KB_SEARCH_URL_PATH: string = "jsapi/rest/hc/search";
export const KB_SEARCH_URL_PATH_V2: string = "jsapi/rest/hc/v2/search";

export const GPT_MESSAGE_SCORE_UPDATE_URL_PATH: string =
  "api/support/jsclient/widget/submit-gpt-message-feedback";

export const BOT_FETCH_URL_PATH: string = "";

export const CONVERSATIONS_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "/get-chat-conversations/" + VISITOR_UUID;

export const CHAT_FLOWS_FETCH_URL_PATH = REQUEST_PREFIX_PATH + "/chat-flows/";

export const START_FLOW_URL_PATH = REQUEST_PREFIX_PATH + "/flow/start";

export const EXECUTION_LIST_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "/flow/execution/";

export const EXECUTE_FLOW_NODE_URL_PATH = REQUEST_PREFIX_PATH + "/flow/execute";

export const CONVERSATION_MESSAGE_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "/get-chat-messages";

export const CHANNEL_PREFS_FETCH_URL_PATH =
  "http://localhost:8787/channel/get-active-channel";

export const USER_PREFS_FETCH_URL_PATH =
  "https://eb-webhooks.engagebay.com/user/get-users?tid=" + TENANT_ID;

export const WEB_RULES_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "widget/web-rules";
export const TYPING_ALERT_URL_PATH =
  REQUEST_PREFIX_PATH + "widget/typing-alerts/VISITOR";
export const FILE_UPLOAD_URL_PATH = REQUEST_PREFIX_PATH + "/get-file-path";
export const GET_BIG_TEXT_URL_PATH =
  REQUEST_PREFIX_PATH + "widget/get-big-text/";

export const WINDOW_OPEN = "window-open";

export const CUSTOMER = "customer";

export const OPENED_CHAT = "opened-chat";

export const OPENED_FLOW = "opened-flow";

export const TRACK_MANAGE = "track-manage";

export const OPERATORS = "operators";

export const WIDGET_ACTIVE_TAB = "widget_active_tab";

export const PROACTIVE_MESSAGE = "proactive-message";

export const FORM_DATA = "form_data";

export const FORM_DATA_ARRAY = "form_data_array";

export const TICKET_ACTIVE_ID = "ticket_active_id";

export const TICKET_ACTIVE_COMPONENT = "ticket_active_component";

export const HC_ACTIVE_ID = "hc_active_id";

export const HC_SEARCH_TEXT = "hc_search_text";

export const HC_ACTIVE_COMPONENT = "hc_active_component";

export const DEFAULT_AGENT_PROFILE_PIC =
  "https://files.reacho.com/images/app-images/profile-1.png";

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

export const getCustomerProfile = () => {
  try {
    return (window as any).parent.reachoJSClient.getCustomerProfile();
  } catch (e) {}
  return undefined;
};

export const getClientInfo = () => {
  try {
    return {
      page_url: (window as any).parent.location.href,
      page_domain: (window as any).parent.location.origin,
    };
  } catch (e) {}
  return undefined;
};

export const getClientLocationInfo = () => {
  try {
    return JSON.parse(
      (window as any).parent.EngHub_Storage.get_local_pref(
        (window as any).parent.EngHub_Storage.client_info_key
      )
    );
  } catch (e) {
    return undefined;
  }
};

export const getIntegrationSource = () => {
  try {
    return (window as any).parent.reachoJSClient.getIntegrationSource();
  } catch (e) {}
  return undefined;
};
