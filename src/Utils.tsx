// export function showFrame() {
//     parent.EngageBay_Livechat.ref.visibleFrame();
//     this.resizeFrame((this.isOpened || this.showWelcomePrompt) ? 'WINDOW_OPENED' : 'WINDOW_CLOSED');
// }555

import {
  AgentPaylodObj,
  ChatFromFieldDataPayLoad,
  ChatMessagePayloadObj,
  ChatPrefsPayloadType,
  ChatSessionPaylodObj,
  EventPayloadObj,
  JSONObjectType1,
  MessageByTypeEnum,
  TicketFromFieldDataPayLoad,
} from "./Models";
import Browser from "browser-detect";
import EMOJILIST from "./emoji-list";
import boticon from "../src/assets/img/chatbot-final.png";
import { FORM_DATA, PARENT_WINDOW_LIVECHAT_REF } from "./globals";
import { getLocalStoragePrefs } from "./Storage";
// var EMOJI = require("emojis-list");

// export function resizeFrame(type: string) {
//     parent.EngageBay_Livechat.ref.UI().resize(type);
// },

// export const showFrame = (isOpened: any, showWelcomePrompt: any) => {
//     parent.EngageBay_Livechat.ref.visibleFrame();
//     resizeFrame((isOpened || showWelcomePrompt) ? 'WINDOW_OPENED' : 'WINDOW_CLOSED');
// };
// export const resizeFrame = (type: any) => {
//     parent.EngageBay_Livechat.ref.UI().resize(type);
// };

export const getOperator = (
  id: number | undefined,
  agents: AgentPaylodObj[] | undefined
): AgentPaylodObj | undefined => {
  return agents?.find((agent: AgentPaylodObj) => {
    return agent.id == id;
  });
};

export const resizeFrame = (type: string) => {
  try {
    // let parentDocument = window.parent.document;

    // if (!(window as any).FRAME_REF_ID) return;

    // let frame = parentDocument.getElementById((window as any).FRAME_REF_ID);

    // frame.addClass("collapase");

    // (window as any).parent.EngageBay_Livechat.ref.UI().resize(type);
    const iframeElement: any = (window as any).parent.document.querySelector(
      'iframe[name="engagebay-messenger-frame"]'
    );
    if (iframeElement) {
      iframeElement.style.width = type == "WINDOW_OPENED" ? "500px" : "100px";
      iframeElement.style.height =
        type == "WINDOW_OPENED" ? "calc(100vh - 100px - 0rem)" : "100px";
    }
  } catch (error) {}
};

export const loadBgAssetImage = (url: string) => {
  return (
    "background-image: url(" +
    (url.indexOf("../") > -1 ? require(url) : url) +
    ")"
  );
};

export const getFormData = () => {
  var formData = getLocalStoragePrefs(FORM_DATA);

  let dataJSON: { [key: string]: string } = {};
  if (formData) dataJSON = JSON.parse(formData);

  return JSON.stringify(dataJSON);
};

export const getIdentifiersData = () => {
  var formData = getLocalStoragePrefs(FORM_DATA);

  let dataJSON: { [key: string]: string } = {};
  if (formData) dataJSON = JSON.parse(formData);

  if (!dataJSON["name"] && dataJSON["email"]) {
    dataJSON["name"] = dataJSON["email"].split("@")[0];
  }

  return dataJSON;
};

export const getFormMetaData = () => {
  // Browser
  var browser: any = getBrowserInfo();
  var meta: JSONObjectType1 = {};
  meta.browser_info = browser;

  // Form data if any
  var formData: any = getFormData();
  if (formData) {
    // Reset first message
    formData = JSON.parse(formData);
    meta.user_info = formData;
  }

  return meta;
};

export const getOperatorImage = (
  id: number | undefined,
  agents: AgentPaylodObj[] | undefined,
  chatPrefs: ChatPrefsPayloadType
) => {
  //const agent = getOperator(id, agents);
  // return agent?.profile_image_url || chatPrefs.widget.default_profile_image || "boticon";
  return boticon;
};

export const getOperatorName = (
  id: number | undefined,
  agents: AgentPaylodObj[] | undefined
) => {
  const agent = getOperator(id, agents);
  return agent?.name || "You";
};

export const promptImg = (
  user_id?: number,
  agents?: AgentPaylodObj[],
  chatPrefs?: ChatPrefsPayloadType
) => {
  const agent = agents?.find((agent) => {
    return agent.id === user_id;
  });
  return agent && agent.profile_image_url
    ? agent.profile_image_url
    : chatPrefs?.meta.decoration.headerPictureUrl;
};

const playSound = (url: string) => {
  if (!url) return;

  try {
    const sound = new Audio(url);

    sound
      .play()
      .then(() => {
        console.log("played.");
      })
      .catch((error) => {
        if (error.name === "NotAllowedError") {
          console.log("Audio play blocked, user interaction required.");
        } else {
          console.log("Audio play error:", error);
        }
      });
  } catch (error) {
    console.log("playSound", error);
  }
};

export const pushMessage = (
  event: EventPayloadObj,
  session: ChatSessionPaylodObj
) => {
  if (!session) {
    console.log("Session not found");
    // if (activeSessionDetails.session_type == SessionStateEnum.NEW_SESSION) {
    //   activeSessionDetails.session?.messageList.push(message);
    //   setActiveSessionDetails(activeSessionDetails);
    // }

    return;
  }

  console.log("pushing new messge to", event.ticketId);

  // Get session from session id
  // let session = getSessionById(message.session_id);
  console.log("having session", session);

  // Update time of the session
  // session.updated_time = parseInt((new Date().getTime() / 1000).toString());
  session.updatedTime = new Date().toISOString().replace("Z", "");

  // Set unread count
  // if (!activeSessionDetails?.session_id || !activeSessionDetails?.session || activeSessionDetails.session.id != session.id) {
  //   console.log("updating unread");
  //   session.unRead = session.unRead ? session.unRead + 1 : 1;
  // }

  session.unRead = session.unRead ? session.unRead + 1 : 1;

  // Push message
  let matchFound = false;
  session.messageList &&
    session.messageList.length &&
    session.messageList.forEach(function (eachMessage, index) {
      if (eachMessage.id && eachMessage.id == event.id) {
        matchFound = true;
        session.messageList[index] = event;
      }
    });

  if (
    !matchFound &&
    (!session.id || (session.messageList && session.messageList.length))
  )
    session.messageList.push(event);

  if (event.from != "CUSTOMER")
    // Play sound
    playSound(
      "https://d2p078bqz5urf7.cloudfront.net/cloud/assets/sounds/track3.mp3"
    );

  // Update document title for
  // this.blinkTitle(message.message);
  //}

  if (event.from == MessageByTypeEnum.AGENT) {
    // Close typing
    session.typing = false;
  }
};

export const getOperatorFromSession = (
  session?: ChatSessionPaylodObj,
  agents?: AgentPaylodObj[]
) => {
  let userId: number | undefined = undefined;

  try {
    if (session?.messageList) {
      for (let i = 0; i < session?.messageList?.length; i++) {
        if (
          session.messageList[i].from == MessageByTypeEnum.AGENT &&
          session.messageList[i].user_id
        )
          userId = session.messageList[i].user_id;
      }
    }
  } catch (e) {}

  if (!userId)
    userId =
      session && session.first_answered_by_user_id
        ? session.first_answered_by_user_id
        : 0;

  return userId ? getOperator(userId, agents) : undefined;
};

export function isValidTicketField(field: ChatFromFieldDataPayLoad) {
  if (field.required && (!field.value || field.value.length === 0)) {
    field.is_valid = false;
    field.error = "This field is required";
    return field;
  }
  if (!field.value) {
    field.is_valid = true;
    field.error = "";
    return field;
  }
  let isValid = true;
  let error = "";
  switch (field.type) {
    case "text":
      break;
    case "list":
      break;
    case "email":
      var match =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          field.value.toString()
        );
      if (!match) {
        isValid = false;
        error = "Invalid field";
      }
      break;
  }
  field.is_valid = isValid;
  if (!isValid) field.error = error;
  else field.error = "";
  return field;
}

export function isValidField(field: ChatFromFieldDataPayLoad) {
  if (field.required && (!field.value || field.value.length === 0)) {
    field.is_valid = false;
    field.error = "This field is required";
    return field;
  }
  if (!field.value) {
    field.is_valid = true;
    field.error = "";
    return field;
  }
  try {
    if (field.value instanceof String) field.value = field.value.trim();
  } catch (error) {}
  if (field.pattern) {
    let pattern = new RegExp(field.pattern);
    if (pattern && field.value && !pattern.test(field.value + "")) {
      field.is_valid = false;
      field.error = "Invalid field";
      return field;
    }
  }
  let isValid = true;
  let error = "";
  switch (field.type) {
    case "text":
      break;
    case "list":
      break;
    case "email":
      var match =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          field.value.toString()
        );
      if (!match) {
        isValid = false;
        error = "Invalid field";
      }
      break;
    case "checkbox":
      break;
    case "multicheckbox":
      break;
    case "date":
      break;
    case "file":
      break;
    case "url":
      let pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i"
      ); // fragment locator
      if (!pattern.test(field.value + "")) isValid = false;
      break;
    case "textarea":
      break;
    default:
      break;
  }
  field.is_valid = isValid;
  if (!isValid) field.error = error;
  else field.error = "";
  return field;
}

export function getBrowserInfo() {
  var json = {
    os: Browser().os,
    browser: Browser().name,
    version: Browser().version,
    mobile: Browser().mobile,
  };

  return json;
}

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatBytes(bytes: number, decimals: number) {
  if (bytes == 0) return "0 Bytes";
  var k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// export function blinkTitle(message:any) {
//     var that = EngageBay_Livechat.ref, originalTitle = "";

//     var blink = function() {
//         document.title = document.title == message ? originalTitle
//                 : message;
//     }, /* function to BLINK browser tab */
//     clear = function() { /* function to set title back to original */
//         if (that.timeoutId)
//             clearInterval(that.timeoutId);

//         if (originalTitle)
//             document.title = originalTitle;

//         that.timeoutId = null;
//     };

//     clear();
//     originalTitle = document.title;

//     if (!that.timeoutId) {
//         that.timeoutId = setInterval(blink, 1000);
//     }

//     // Add focus event
//     window.onfocus = function() {
//         clear();
//     };
// }

export function convertEmojis(text: string) {
  try {
    var emoji_array = [],
      emoji_json: any = {},
      b = /[[\]{}()*+?.\\|^$\-,&#\s]/gi;

    for (var i = 0; i < EMOJILIST.length; i++) {
      emoji_json[EMOJILIST[i].title] = EMOJILIST[i];
      emoji_array.push("(" + EMOJILIST[i].title.replace(b, "\\$&") + ")");
    }

    return text.replace(
      new RegExp(emoji_array.join("|"), "gi"),
      function (g: any) {
        g = g === undefined ? g : g.toUpperCase();
        var css =
          "border: 0px;vertical-align: middle;background-color: transparent;display: inline-block; height: 16px; width: 16px; background-position: " +
          emoji_json[g].position;

        return typeof emoji_json[g] != "undefined"
          ? '<span class="engagebay-emoji-picker-image" aria-label="' +
              emoji_json[g].label +
              '" style="' +
              css +
              '"></span>'
          : g;
      }
    );
  } catch (error) {}
  return text;
}

/**
 * Convert links to anchor tags
 *
 * @param {Create} text
 */
export function createTextLinks_(text: string) {
  return (text || "").replace(
    /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
    function (match: string, space: string, url: string) {
      var hyperlink = url;
      if (!hyperlink.match("^https?://")) {
        hyperlink = "http://" + hyperlink;
      }
      return (
        space + '<a target="_blank" href="' + hyperlink + '">' + url + "</a>"
      );
    }
  );
}

export function isGPTEnabled() {
  return PARENT_WINDOW_LIVECHAT_REF &&
    PARENT_WINDOW_LIVECHAT_REF.ref.settings?.botPrefs?.length > 0
    ? true
    : false;
}

export function fileName(message: ChatMessagePayloadObj) {
  return JSON.parse(message.message).fileName;
}
export function fileUrl(message: ChatMessagePayloadObj) {
  return JSON.parse(message.message).fileUrl;
}

export function fileSize(message: ChatMessagePayloadObj) {
  return formatBytes(JSON.parse(message.message).fileSize, 0);
}

export function getSystemMessage(type: string) {
  let message = type;
  switch (type) {
    case "ASK_USER_DETAILS":
      message =
        PARENT_WINDOW_LIVECHAT_REF.ref.settings.SYSTEMMessage[
          type + "_TO_VISITOR"
        ];
      break;
    case "CHAT_SESSION_CLOSED":
      message =
        PARENT_WINDOW_LIVECHAT_REF.ref.settings.SYSTEMMessage[
          type + "_TO_VISITOR"
        ];
      break;

    default:
      break;
  }
  return message;
}
