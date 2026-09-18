import { ChatPrefsPayloadType } from "./Models";
import { getSessionStoragePrefs, setSessionStoragePrefs } from "./Storage";

export const TENANT_ID: string = (window as any).TENANT_ID;
export const CHANNEL_ID: string = (window as any).CHANNEL_ID;
export const API_KEY: string =
  (window.parent as any).EhAccount?.getKey() || (window as any).API_KEY;

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

const LEGACY_REQUEST_PREFIX_PATH = "api/support/jsclient/inbox";
const V1_REQUEST_PREFIX_PATH = "api/support/v1/jsclient/inbox";

let REQUEST_PREFIX_PATH = LEGACY_REQUEST_PREFIX_PATH;

const inboxUrl = (suffix: string) => REQUEST_PREFIX_PATH + suffix;

export const applyInboxApiPrefix = (migratedToPostgres?: boolean) => {
  REQUEST_PREFIX_PATH = migratedToPostgres
    ? V1_REQUEST_PREFIX_PATH
    : LEGACY_REQUEST_PREFIX_PATH;
  setInboxUrlPaths();
};

export let NEW_SESSION_URL_PATH: string;
export let VALIDATE_CUSTOMER_PATH: string;
export let UPDATE_READ_URL_PATH: string;
export let MESSAGE_URL_PATH: string;
export let ORDERS_FETCH_URL: string;
export let ORDER_FETCH_URL: string;
export let GPT_MESSAGE_SCORE_UPDATE_URL_PATH: string;
export let CONVERSATIONS_FETCH_URL_PATH: string;
export let GET_AIBOT_PATH: string;
export let CHAT_FLOWS_FETCH_URL_PATH: string;
export let START_FLOW_URL_PATH: string;
export let EXECUTION_LIST_FETCH_URL_PATH: string;
export let EXECUTE_FLOW_NODE_URL_PATH: string;
export let CONVERSATION_MESSAGE_FETCH_URL_PATH: string;
export let CONNECT_TO_AGENT_URL_PATH: string;
export let WEB_RULES_FETCH_URL_PATH: string;
export let TYPING_ALERT_URL_PATH: string;
export let FILE_UPLOAD_URL_PATH: string;
export let GET_BIG_TEXT_URL_PATH: string;

const setInboxUrlPaths = () => {
  NEW_SESSION_URL_PATH = inboxUrl("/new-conversation");
  VALIDATE_CUSTOMER_PATH = inboxUrl("/validate-customer");
  UPDATE_READ_URL_PATH = inboxUrl("/update-read");
  MESSAGE_URL_PATH = inboxUrl("/new-message");
  ORDERS_FETCH_URL = inboxUrl("/get-store-orders");
  ORDER_FETCH_URL = inboxUrl("/get-store-order");
  GPT_MESSAGE_SCORE_UPDATE_URL_PATH = inboxUrl("/submit-gpt-message-feedback");
  CONVERSATIONS_FETCH_URL_PATH = inboxUrl(
    "/get-chat-conversations/" + VISITOR_UUID,
  );
  GET_AIBOT_PATH = inboxUrl("/get-aibot");
  CHAT_FLOWS_FETCH_URL_PATH = inboxUrl("/chat-flows/");
  START_FLOW_URL_PATH = inboxUrl("/flow/start");
  EXECUTION_LIST_FETCH_URL_PATH = inboxUrl("/flow/execution/");
  EXECUTE_FLOW_NODE_URL_PATH = inboxUrl("/flow/execute");
  CONVERSATION_MESSAGE_FETCH_URL_PATH = inboxUrl("/get-chat-messages");
  CONNECT_TO_AGENT_URL_PATH = inboxUrl("/connect-to-agent/");
  WEB_RULES_FETCH_URL_PATH = inboxUrl("widget/web-rules");
  TYPING_ALERT_URL_PATH = inboxUrl("widget/typing-alerts/VISITOR");
  FILE_UPLOAD_URL_PATH = inboxUrl("/get-file-path");
  GET_BIG_TEXT_URL_PATH = inboxUrl("widget/get-big-text/");
};

setInboxUrlPaths();

export const KB_COLLECTION_CHILDREN_BY_ID: string = "jsapi/rest/hc/collections";
export const KB_ARTICLE_GET_PATH: string = "jsapi/rest/help-center/article";

export const AGENTS_FETCH_URL_PATH: string =
  "/user/get-users?tid=5943959859757056";

export const TICKETS_FETCH_URL: string =
  "jsapi/rest/get-tickets/" + VISITOR_UUID;

export const TICKET_FETCH_URL: string = "jsapi/rest/ticket/" + VISITOR_UUID;

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

export const BOT_FETCH_URL_PATH: string = "";

export const SUBDOMAIN_URL_PATH =
  LEGACY_REQUEST_PREFIX_PATH + "/get-subdomain/" + TENANT_ID;

export const CHANNEL_PREFS_FETCH_URL_PATH =
  "http://localhost:8787/channel/get-active-channel";

export const USER_PREFS_FETCH_URL_PATH =
  "https://eb-webhooks.engagebay.com/user/get-users?tid=" + TENANT_ID;

export const WINDOW_OPEN = "window-open";

export const CUSTOMER = "customer";

export const OPENED_CHAT = "opened-chat";

export const AIBOT_DETAILS = "aibot-details";

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

export const DEFAULT_BOT_ICON =
  "https://d2p078bqz5urf7.cloudfront.net/cloud/assets/img/chatbot-default-icon.png";

export const IS_NEW_SESSION: boolean = (function () {
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
        (window as any).parent.EngHub_Storage.client_info_key,
      ),
    );
  } catch (e) {
    return undefined;
  }
};
