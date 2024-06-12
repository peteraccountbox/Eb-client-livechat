import { ChatPrefsPayloadType } from "./Models";
import { getSessionStoragePrefs, setSessionStoragePrefs } from "./Storage";

export const TENANT_ID: string = (window as any).TENANT_ID;
export const VISITOR_UUID: string = (window as any).VISITOR_UUID;

export const SERVER_REQ_HOST_PATH: string =
  (window as any).SERVER_HOST_DOMAIN_URL || "https://app.engagebay.com/";

export const PARENT_WINDOW = (window as any).parent;
export const PARENT_WINDOW_LIVECHAT_REF = PARENT_WINDOW
  ? PARENT_WINDOW.EngageBay_Livechat
  : undefined;
export const CHAT_PREFS: ChatPrefsPayloadType = PARENT_WINDOW_LIVECHAT_REF
  ? PARENT_WINDOW_LIVECHAT_REF.ref.settings
  : undefined;
export const NEW_SESSION_URL_PATH: string =
  "chat/api/widget/new-session1/" + VISITOR_UUID;

export const CONNECT_TO_AGENT_URL_PATH: string =
  "chat/api/widget/connect-to-agent/";
export const TICKETS_FETCH_URL: string = "jsapi/rest/get-tickets/" + VISITOR_UUID;

export const TICKET_FETCH_URL: string = "jsapi/rest/ticket/" + VISITOR_UUID;
export const USERS_FETCH_URL: string = "jsapi/rest/group/users/";
export const USER_FETCH_URL: string = "jsapi/rest/user/";
export const TICKET_CREATE_URL: string =
  "jsapi/rest/create-ticket/" + VISITOR_UUID;
export const NOTE_URL: string = "jsapi/rest/ticket-notes/" + VISITOR_UUID;
export const LAST_NOTE_URL: string = "jsapi/rest/last-note/";
export const MESSAGE_URL_PATH: string = "chat/api/widget/message/" + VISITOR_UUID;

export const KB_COLLECTION_URL_PATH: string = "jsapi/rest/hc/collections";
export const KB_COLLECTION_URL_PATH_BY_ID: string = "jsapi/rest/hc/collection/";
export const KB_ARTICLE_URL_PATH: string = "jsapi/rest/hc/article/";
export const KB_SEARCH_URL_PATH: string = "jsapi/rest/hc/search";

export const GPT_MESSAGE_SCORE_UPDATE_URL_PATH: string =
  "chat/api/widget/submit-gpt-message-feedback";

export const BOT_FETCH_URL_PATH: string = "";

const REQUEST_PREFIX_PATH = "chat/api/";
export const CONVERSATIONS_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "widget/get-conversations/" + VISITOR_UUID;
export const CHAT_PREFS_FETCH_URL_PATH =
  REQUEST_PREFIX_PATH + "widget/chat-prefs";
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
