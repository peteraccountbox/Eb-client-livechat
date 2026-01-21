import HeaderAction from "./HeaderAction";
import ChatForm from "./ChatForm";
import { getReq, postReq } from "../request";
import ConversationItem from "./ConversationItem";
import Emoji from "./Emoji";
import FileUpload from "./FileUpload";
import {
  ChatFromFieldDataPayLoad,
  ChatMessagePayloadObj,
  ChatSessionPaylodObj,
  MessageByTypeEnum,
  MessageFormatType,
  JSONObjectType,
  JSONObjectType1,
  ChatSessionConnectedWithEnum,
  AIBotPromptsPayloadType,
  AIBotPromptActionEnum,
  AIBotPrefPayloadType,
  EventPayloadObj,
  AttachmentType,
  AIBotPayloadType,
  AgentPaylodObj,
} from "../Models";
import {
  getBrowserInfo,
  getFormData,
  getIdentifiersData,
  getOperatorFromSession,
  isGPTEnabled,
  pushMessage,
  uuidv4,
} from "../Utils";
import { AppContext } from "../appContext";
import {
  AIBOT_DETAILS,
  CHANNEL_ID,
  CONNECT_TO_AGENT_URL_PATH,
  CONVERSATION_MESSAGE_FETCH_URL_PATH,
  DEFAULT_AGENT_PROFILE_PIC,
  FORM_DATA,
  GET_AIBOT_PATH,
  getClientInfo,
  getClientLocationInfo,
  MESSAGE_URL_PATH,
  NEW_SESSION_URL_PATH,
  OPENED_CHAT,
  PROACTIVE_MESSAGE,
  TYPING_ALERT_URL_PATH,
  UPDATE_READ_URL_PATH,
  VISITOR_UUID,
} from "../globals";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useInsertionEffect,
} from "react";
import { FC } from "react";
import {
  getLocalStoragePrefs,
  getSessionStoragePrefs,
  removeSessionStoragePrefs,
  setLocalStoragePrefs,
  setSessionStoragePrefs,
} from "../Storage";
import CloseWidgetPanel from "./CloseWidgetPanel";
import eventBus from "../eventBus";
import InteractiveFlowItem from "./InteractiveFlowItem";
import { isUserBusinessHour } from "../BusinessHours";
import Loader from "./Loader";
import { set } from "date-fns";

export interface ConversationProps {
  showChatsList(): void;
  backToHome: () => void;
  addNewSession: (arg0: ChatSessionPaylodObj) => void;
}

const Conversation = (props: ConversationProps) => {
  const parentContext = useContext(AppContext);
  const { chatPrefs, sessions, setSessions, createSessionData, agents } =
    parentContext;
  const { botPrefs } = chatPrefs;

  const text = useRef<HTMLTextAreaElement>(null);
  const [formFields, setFormFields] = useState<ChatFromFieldDataPayLoad[]>([]);
  const [typeText, setTypeText] = useState("");
  const [showChatForm, setShowChatForm] = useState(false);
  const [files, setFiles] = useState<any>([]);
  const [typingTimer, setTypingTimer] = useState<any>();
  const [saving, setSaving] = useState<boolean>(false);

  const getEmptySession = () => {
    let session = {} as ChatSessionPaylodObj;
    session.messageList = [];

    let initialMessage = getSessionStoragePrefs(PROACTIVE_MESSAGE);
    // if (initialMessage) {
    //   session.messageList.push({
    //     from: MessageByTypeEnum.SYSTEM,
    //     bodyText: initialMessage,
    //     format: MessageFormatType.TEXT,
    //     session_id: undefined,
    //     system_message_type: "PROACTIVE_SYSTEM_MESSAGE",
    //     created_time: new Date().getTime() / 1000,
    //   } as ChatMessagePaylodObj);
    // }

    if (chatPrefs.aiAgentId && botPrefs?.settings?.welcomeMessage) {
      let msg: ChatMessagePayloadObj = {
        bodyText: botPrefs?.settings?.welcomeMessage,
        format: MessageFormatType.TEXT,
        created_time: new Date().getTime(),
      } as ChatMessagePayloadObj;

      session.messageList.push({
        from: MessageByTypeEnum.AI_AGENT,
        message: msg,
        eventType: "MESSAGE",
        source: "SYSTEM",
        visibility: "PUBLIC",
      });
      session.aiAgentId = chatPrefs.aiAgentId;
      session.lastConnectionWith = ChatSessionConnectedWithEnum.AI_AGENT;
    } else if (!chatPrefs.aiAgentId || !botPrefs) {
      session.lastConnectionWith = ChatSessionConnectedWithEnum.AGENT;
    }

    if (createSessionData.force) {
      session.messageList = createSessionData.messageList;
      session.channelId = createSessionData.sessionDetails.channelId;
      session.visitorId = createSessionData.sessionDetails.visitorId;
      session.channelType = createSessionData.sessionDetails.channelType;
      session.createdSource = createSessionData.sessionDetails.createdSource;
      session.createdBy = createSessionData.sessionDetails.createdBy;
      session.customerEmail = createSessionData.sessionDetails.customerEmail;
      session.customerName = createSessionData.sessionDetails.customerName;

      const wait = postReq(NEW_SESSION_URL_PATH, session);
      wait
        .then((response: any) => {
          let newNession = response.data as ChatSessionPaylodObj;

          newNession.customerUnreadMessagesCount = 0;
          setSessionStoragePrefs(OPENED_CHAT, newNession.id);
          updateAndOpenSession(newNession);
          setSession(newNession);
        })
        .catch(() => {});
      createSessionData.force = false;
      createSessionData.messageList = [];
      createSessionData.sessionDetails = {};
    }

    return session;
  };

  const getSession = (): ChatSessionPaylodObj => {
    let chatId = getSessionStoragePrefs(OPENED_CHAT);
    if (!chatId || chatId == "new") {
      return getEmptySession();
    }

    let matchedSession = sessions.find(function (session) {
      return session.id == chatId;
    });

    if (matchedSession) return matchedSession;

    return getEmptySession();
  };

  const [session, setSession] = useState<ChatSessionPaylodObj>(getSession());

  useEffect(() => {
    setScrollBottom();
  }, [session?.messageList]);

  useEffect(() => {
    if (!session?.messageList) setSession(getSession());
    else if (session.id)
      setSession(sessions.find((s) => s.id == session.id) || session);
  }, [sessions]);

  useEffect(() => {
    let chatId = getSessionStoragePrefs(OPENED_CHAT);
    if (
      (!session ||
        !session?.messageList ||
        session?.messageList.length === 0) &&
      (!chatId || chatId == "new") &&
      shouldShowForm() &&
      (!chatPrefs?.aiAgentId || !botPrefs)
    )
      setShowChatForm(true);

    if (session.id && !session.messageList) getMessageList();
    if (session.id)
      getReq(UPDATE_READ_URL_PATH + "/" + session.id, {}).then((response) => {
        session.customerUnreadMessagesCount = 0;
        setSessions([...sessions]);
        eventBus.emit("message_read");
      });
  }, [session]);

  const getMessageList = async () => {
    if (!session.id) return;

    //

    try {
      const response = await getReq(
        CONVERSATION_MESSAGE_FETCH_URL_PATH + "/" + session.id,
        { page: 0, size: 50, sort: "createdTime" },
      );

      session.messageList = response.data.data;
      setSessions([...sessions]);
    } catch (error) {}
  };

  useEffect(() => {
    let storedFormData: JSONObjectType = {};
    try {
      let obj: any = getFormData();
      if (obj) storedFormData = JSON.parse(obj) as JSONObjectType;
    } catch (error) {}

    let fields: ChatFromFieldDataPayLoad[] = [];

    chatPrefs.meta?.fields?.forEach(
      (field: ChatFromFieldDataPayLoad, index: number) => {
        let fieldClone = JSON.parse(
          JSON.stringify(field),
        ) as ChatFromFieldDataPayLoad;

        fieldClone.value =
          storedFormData[fieldClone.name] &&
          !(field.field_type == "SYSTEM" && field.name == "message")
            ? storedFormData[fieldClone.name]
            : "";
        if (fieldClone.type == "multicheckbox" || fieldClone.type == "checkbox")
          fieldClone.valueArr = storedFormData[fieldClone.name]
            ? Array.from(storedFormData[fieldClone.name])
            : [];
        fieldClone.is_valid = false;
        fields.push(fieldClone);
      },
    );

    setFormFields(fields);
  }, [showChatForm]);

  const publishMessageToChatAgents = (message: any) => {
    if (!session) return;

    // Holding for a moment to make changes live
    // with PUSHER service
    // if (true) return;

    // Check for invalid Session/Agents
    //if (!session || !pusher) return;

    var ids = session.participant_user_ids;
    if (!ids || !ids.length) return;

    var json = {
      event_type: "TYPING",
      message: {
        from: "VISITOR",
        message: message,
        session_id: session.id,
      },
    };

    /*for (var i = 0; i < ids.length; i++) {
      that.ortcClient.send(ids[i] + '', JSON.stringify(json));
    }*/
    // Send an event via server

    const wait = postReq(TYPING_ALERT_URL_PATH, json);
    wait
      .then((response) => {
        console.log("typing");
      })
      .catch(() => {});
  };

  const updateMessage = (message: ChatMessagePayloadObj) => {
    if (!message.ticketId) {
      return;
    }

    // Get session from session id
    let session = getSessionById(message.ticketId);
    if (!session || !session.messageList || session.messageList.length == 0)
      return;

    session.messageList.map((eachmessage: EventPayloadObj) => {
      if (message.id === eachmessage.id) return message;
      return eachmessage;
    });

    setSessions([...sessions]);
  };

  // const updateSession = () => {
  //   setSessions([...sessions]);
  // }

  const getSessionById = (id: string | undefined) => {
    if (!id) return undefined;

    return sessions.find(function (session) {
      return session.id == id;
    });
  };

  const disableType = () => {
    return session.lastConnectionWith ==
      ChatSessionConnectedWithEnum.AI_AGENT &&
      session.messageList &&
      (session.messageList[session.messageList.length - 1]?.message
        .progressingMode ||
        (session.messageList[session.messageList.length - 1]?.tempId &&
          !session.messageList[session.messageList.length - 1]?.id))
      ? true
      : false;
  };

  const updateMessageList = (message: EventPayloadObj) => {
    if (!message.ticketId) {
      return;
    }

    // Get session from session id
    let session = getSessionById(message.ticketId);
    if (!session) return;

    session.messageList = session.messageList.map(
      (eachmessage: EventPayloadObj) => {
        if (eachmessage.tempId && eachmessage.tempId == message.tempId)
          return message;
        return eachmessage;
      },
    );
    let lastMessage = session.messageList.at(-1);
    if (lastMessage) {
      session.lastMessage = lastMessage.message.bodyText;
      session.lastMessageAt = lastMessage.createdTime;
    }
    session.lastCustomerMessageAt = message.createdTime;
    setSession({ ...session });
    setSessions([...sessions]);
  };

  const getChatMessage = (
    msg: string | string[] | null,
    type?: MessageFormatType,
    attachments?: AttachmentType[],
  ) => {
    let state: ChatMessagePayloadObj = {
      bodyText: msg,
      format: !type ? MessageFormatType.TEXT : type,
      ticketId: session?.id && session?.id,
      created_time: new Date().getTime(),
      attachments: attachments,
    } as ChatMessagePayloadObj;

    // Add session id if present
    if (session && session.id && session.type == "LIVECHAT")
      state.ticketId = session.id + "";

    return state;
  };

  const onEmojiSelect = (emoji: any) => {
    if (text.current) {
      const current = text.current;
      const curPos = current.selectionStart;
      const value = current.value;
      current.textContent =
        value.slice(0, curPos) + emoji + value.slice(curPos);
      text.current.value = current.textContent;
      setTypeText(current.textContent);
      setTimeout(() => {
        current.selectionStart = current.selectionEnd = curPos + emoji.length;
      }, 0);
      text.current.focus();
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.classList.contains("on_scroll") === false) {
      var el = e.currentTarget;
      e.currentTarget.classList.add("on_scroll");
      setTimeout(function () {
        el.classList.remove("on_scroll");
      }, 1000);
    }
  };

  const submitChatForm = (formData: JSONObjectType) => {
    if (!formData) formData = {};
    setTypeText("");
    if (text.current) {
      text.current.textContent = "";
      text.current.value = "";
    }
    setShowChatForm(false);

    setLocalStoragePrefs(FORM_DATA, JSON.stringify(formData));
    setSaving(true);
    session.customerEmail = formData.email as string;
    session.customerName = formData.name as string;
    if (formData.message) {
      session.subject = formData.message as string;
      var msg: ChatMessagePayloadObj = getChatMessage(
        formData.message,
        undefined,
      );
      let event: EventPayloadObj = {
        ticketId: session?.id,
        eventType: "MESSAGE",
        source: "WEBSITE",
        visibility: "PUBLIC",
        from: MessageByTypeEnum.CUSTOMER,
        message: msg,
        tempId: uuidv4(),
      };

      session.channelId = CHANNEL_ID;
      session.visitorId = VISITOR_UUID;
      session.channelType = "CHAT";
      session.createdSource = "WEBSITE";
      session.createdBy = MessageByTypeEnum.CUSTOMER;
      session.messageList.push(event);
      session.identifiers = getIdentifiersData();
      const locationInfo = getClientLocationInfo();
      if (locationInfo && locationInfo.geo_info) delete locationInfo.geo_info;
      session.meta = {
        formData: getFormData(),
        browserInfo: getBrowserInfo(),
        locationInfo: locationInfo,
        clientInfo: getClientInfo(),
      };
    }
    submitSessionEvent(NEW_SESSION_URL_PATH, session, (response: any) => {
      // if (newChat) {
      // Get session
      let newNession = response.data as ChatSessionPaylodObj;
      updateAndOpenSession(newNession);
      setSession(newNession);
      setSessionStoragePrefs(OPENED_CHAT, newNession.id);
      // } else {
      //   updateMessageList(response.data);
      // }
    });

    // Submit form
    // setEnableChatFooter(true);
    // Regular flow

    // connectToAgent();
  };

  const fileUploadCallback = (status: string, file: any) => {
    if (status == "success") {
      sendFileUploadMessage(file);
    } else {
      var mssg = file.error_mssg;
      // "Whoops! Something went wrong. Please try again later.";

      var data: ChatMessagePayloadObj = getChatMessage(mssg, undefined);
      let event: EventPayloadObj = {
        ticketId: session?.id,
        eventType: "MESSAGE",
        source: "WEBSITE",
        from: MessageByTypeEnum.CUSTOMER,
        message: data,
      };
      pushMessage(event, session);

      setSessions([...sessions]);
    }
  };

  /**
   * Send uploaded file
   */
  const sendFileUploadMessage = (file: any) => {
    if (!file) return;

    // // Message as JSON for file upload
    var message: any = {};
    message.fileName = file.name;
    message.url = file.bucketURL + file.file_resource;
    message.name = file.name;

    // Send message
    postMessage(getChatMessage("", MessageFormatType.TEXT, [message]));
  };

  const getFormMetaData = () => {
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

  const updateAndOpenSession = (newNession: ChatSessionPaylodObj) => {
    props.addNewSession(newNession);

    setTimeout(() => {
      // TODO
      // props.openChat(newNession.id);
      setSaving(false);
    }, 1000);
  };

  const submitSessionEvent = (url: string, data: any, callback?: Function) => {
    let isNewChat = !session || !session.id ? true : false;

    // Add browser info + local storage data
    if (isNewChat) {
      data.meta_data = JSON.stringify(getFormMetaData());
    }

    const wait = postReq(url, data);
    wait
      .then((response: any) => {
        if (callback) callback(response);
      })
      .catch(() => {});
  };

  const postMessage = (data: ChatMessagePayloadObj) => {
    if (!session) return;

    //
    let newChat: boolean = true;
    if (session && session.id) newChat = false;

    // Set status sending

    var url = newChat ? NEW_SESSION_URL_PATH : MESSAGE_URL_PATH;

    let event: EventPayloadObj = {
      ticketId: session?.id,
      eventType: "MESSAGE",
      source: "WEBSITE",
      visibility: "PUBLIC",
      from: MessageByTypeEnum.CUSTOMER,
      message: data,
      tempId: uuidv4(),
    };

    let updatedSession: any;

    // Make temp push
    if (newChat) {
      session.channelId = CHANNEL_ID;
      session.visitorId = VISITOR_UUID;
      session.channelType = "CHAT";
      session.createdSource = "WEBSITE";
      session.createdBy = MessageByTypeEnum.CUSTOMER;
      session.subject = data.bodyText;
      const identifiers = getIdentifiersData();
      if (identifiers) {
        if (identifiers.name) session.customerName = identifiers.name;
        if (identifiers.email) session.customerEmail = identifiers.email;
      }
      session.identifiers = identifiers;
      const locationInfo = getClientLocationInfo();
      if (locationInfo && locationInfo.geo_info) delete locationInfo.geo_info;
      session.meta = {
        formData: getFormData(),
        browserInfo: getBrowserInfo(),
        locationInfo: locationInfo,
        clientInfo: getClientInfo(),
      };
      updatedSession = pushMessage(event, session);
    } else {
      data.ticketId = session?.id + "";
      updatedSession = pushMessage(event, session);
    }

    setSession({ ...updatedSession });

    submitSessionEvent(url, newChat ? session : event, (response: any) => {
      if (newChat) {
        // Get session
        let newNession = response.data as ChatSessionPaylodObj;
        updateAndOpenSession(newNession);
        setSession(newNession);
        setSessionStoragePrefs(OPENED_CHAT, newNession.id);
      } else {
        updateMessageList(response.data);
      }
    });
  };

  const handleKeyPress = (e: React.FormEvent<HTMLTextAreaElement>) => {
    // console.log(e.currentTarget.textContent);
    if (e.currentTarget.textContent != null)
      setTypeText(e.currentTarget.textContent);
    else setTypeText("");
  };

  const handleKeyDown = (e: any) => {
    if (e.shiftKey && e.key === "Enter") return;
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(false);
    }
  };

  const setScrollBottom = () => {
    // setTimeout(() => {
    var elem = document.getElementsByClassName("chat__messages-track")[0];
    if (elem) elem.scrollTop = elem.scrollHeight;
    // }, 100);
  };

  // Send typing alert
  const userTyping = () => {
    if (!typeText.trim()) {
      return;
    }

    console.log("send alert1", typeText);
    publishMessageToChatAgents(typeText);
  };

  const shouldShowForm = () => {
    return chatPrefs.meta.requiredContactInformation;
  };

  /**
   * Send typed message
   */

  const connectToAgent = () => {
    var url = CONNECT_TO_AGENT_URL_PATH + session.id;

    submitSessionEvent(url, session, (response: any) => {
      // Get session
      let newSession = response.data as ChatSessionPaylodObj;
      session.lastConnectionWith = newSession.lastConnectionWith;
      setSession({ ...session });
    });
  };

  const sendMessage = (check: boolean) => {
    if ((!session || !session.id) && shouldShowForm() && !check) {
      setShowChatForm(true);
      return;
    }
    var triggerFromProactive = getSessionStoragePrefs(PROACTIVE_MESSAGE);
    removeSessionStoragePrefs(PROACTIVE_MESSAGE);
    if (!typeText && !triggerFromProactive) return;

    // this.deleteStoragePrefs('FORM_SUBMIT');

    let message: string | null = typeText.trim();
    if (!message) {
      message = triggerFromProactive;
    }
    //that = this;
    setTypeText("");
    // Clear content holder
    if (text.current) {
      text.current.textContent = "";
      text.current.value = "";
    }

    // Stop typing timer
    //  userUnFocused();

    // Send message and make empty
    postMessage(getChatMessage(message, undefined));
    setScrollBottom();
  };

  const getHeaderIcon = () => {
    const agent: AgentPaylodObj | undefined = agents?.find(
      (agent) => agent.id == session?.agentId,
    );
    if (agent) return agent?.profile_image_url || DEFAULT_AGENT_PROFILE_PIC;
    if (
      !chatPrefs.aiAgentId ||
      !botPrefs ||
      session.lastConnectionWith == ChatSessionConnectedWithEnum.AGENT
    )
      return chatPrefs.meta.decoration.headerPictureUrl;

    return botPrefs?.settings?.chatBotIconURL;
  };

  const getHeaderName = () => {
    if (
      !chatPrefs.aiAgentId ||
      !botPrefs ||
      session.lastConnectionWith == ChatSessionConnectedWithEnum.AGENT
    )
      return chatPrefs.name;
    return botPrefs?.name;
  };

  const [clickTimeout, setClickTimeout] = useState<any>(null);

  const executeBotPromptAction = (prompt: AIBotPromptsPayloadType) => {
    if (disableType()) return;
    if (clickTimeout) return;
    else {
      const timeout = setTimeout(() => {
        setClickTimeout(null);
      }, 700); // Delay to detect if double-click happens
      setClickTimeout(timeout);
    }
    switch (prompt.action) {
      case AIBotPromptActionEnum.CONNECT_TO_AGENT:
        // if (aiBotDetails?.settings?.showChatFormBeforeConnectToAgent) {
        //   setShowChatForm(true);
        //   return;
        // }
        connectToAgent();
        break;

      case AIBotPromptActionEnum.MESSAGE:
        let message: ChatMessagePayloadObj = getChatMessage(
          prompt.message,
          MessageFormatType.TEXT,
        );

        // console.log("in", message);
        if ((!session || !session.id) && shouldShowForm()) {
          setTypeText(prompt.message);
          setShowChatForm(true);
          return;
        }

        postMessage(message);
        setScrollBottom();
        break;

      default:
        break;
    }
  };

  const getChatPrompts = () => {
    if (
      !chatPrefs.aiAgentId ||
      !botPrefs ||
      botPrefs.botPrompts?.length == 0 ||
      (!botPrefs.botPrompts.find(
        (prompt) => prompt.action == AIBotPromptActionEnum.MESSAGE,
      ) &&
        !session.id) ||
      session.lastConnectionWith == ChatSessionConnectedWithEnum.AGENT
    )
      return <></>;

    return (
      <div className="chat_prompts_actions">
        {botPrefs?.botPrompts?.map((prompt: any) =>
          session.id || prompt.action == AIBotPromptActionEnum.MESSAGE ? (
            <button
              className={"btn btn-outline-primary"}
              onClick={() => executeBotPromptAction(prompt)}
            >
              {prompt.label}
            </button>
          ) : (
            <></>
          ),
        )}
      </div>
    );
  };

  const goBack = () => {
    if (session.customerUnreadMessagesCount) {
      session.customerUnreadMessagesCount = 0;
      setSessions([...sessions]);
    }

    props.backToHome();
  };

  return (
    <div className="chat__conversation">
      <div className="chat__header">
        <div className="chat__header-action">
          <div
            data-trigger="all"
            className="chat__header-back"
            onClick={() => goBack()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              color="currentColor"
            >
              <path
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7"
                d="m14 18-6-6 6-6"
              ></path>
            </svg>
          </div>
          <div className="chat__header-user">
            {getHeaderIcon() && (
              <div>
                <div
                  className="chat__header-user-img"
                  style={{
                    backgroundImage: 'url("' + getHeaderIcon() + '")',
                  }}
                ></div>
              </div>
            )}
            <div className="chat__header-user-title">
              <h1 className="chat__header-user-name"> {getHeaderName()} </h1>
              {/* <p className="chat__header-user-lastseen">Active 30m ago</p> */}
            </div>
          </div>
        </div>

        <div className="chat__help-end">
          <CloseWidgetPanel />
        </div>
      </div>

      <div className="chat__content">
        <div className="chat__messages">
          <div className="chat__messages-track">
            {session?.newTicket == false &&
              session.messageList &&
              session.messageList.length < session.messagesCount && (
                <>
                  <div className="old-chat">
                    <span
                      onClick={(e: any) => {
                        getMessageList();
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling)
                          e.currentTarget.nextElementSibling.style.display =
                            "block";
                      }}
                    >
                      Previous History
                    </span>
                    <p style={{ textAlign: "center", display: "none" }}>
                      <div className="chat__form-loader1">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </p>
                  </div>
                </>
              )}
            {!showChatForm ? (
              session?.messageList ? (
                session?.messageList?.map(
                  (message: EventPayloadObj, index: number) => {
                    return (
                      <>
                        {message.eventType == "INTERACTIVE_FLOW_NODE" ? (
                          <InteractiveFlowItem
                            execution={message.meta.executionNode}
                          />
                        ) : (
                          <>
                            <ConversationItem
                              message={message}
                              session={session}
                              nextMessage={session?.messageList[index + 1]}
                              updateMessage={updateMessage}
                            />
                          </>
                        )}
                      </>
                    );
                  },
                )
              ) : (
                <p style={{ marginTop: "60px", textAlign: "center" }}>
                  <div className="chat__form-loader1">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </p>
              )
            ) : (
              <></>
            )}

            {showChatForm ? (
              <ChatForm
                closeChatForm={() => {
                  setShowChatForm(false);
                }}
                formFields={formFields}
                setFormFields={setFormFields}
                submitChatForm={submitChatForm}
                typeText={typeText}
                setTypeText={setTypeText}
                saving={saving}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="chat__messages-sign hide">
            <a target="_blank">
              We
              <img
                src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/livechat/love-icon.svg"
                width="12px"
              />
              EngageBay
            </a>
          </div>
        </div>
        {!showChatForm && getChatPrompts()}
        <div className={`chat__footer ${showChatForm ? "hide" : ""}`}>
          <div className={`chat__form`}>
            <textarea
              ref={text}
              rows={1}
              maxLength={5000}
              onChange={(e) => setTypeText(e.currentTarget.value)}
              onScroll={(e) => handleScroll(e)}
              className="chat__input chat__textarea"
              value={text?.current?.value}
              placeholder={
                session.lastConnectionWith ==
                  ChatSessionConnectedWithEnum.AGENT || !botPrefs
                  ? chatPrefs.meta.messagePlaceholder
                  : botPrefs?.settings?.placeHolderText
              }
              contentEditable="true"
              onPaste={(e) => {
                e.preventDefault();
                document.execCommand(
                  "insertHTML",
                  false,
                  e.clipboardData.getData("text/plain"),
                );
              }}
              onKeyDown={handleKeyDown}
              disabled={disableType()}
              onInput={(e) => handleKeyPress(e)}
              onKeyUp={userTyping}
              id="chatMessageEditable"
            ></textarea>

            <div className="chat__actions">
              {!disableType() && <Emoji onEmojiSelect={onEmojiSelect} />}

              {session &&
              session.lastConnectionWith ===
                ChatSessionConnectedWithEnum.AGENT ? (
                <FileUpload
                  setFiles={setFiles}
                  fileUploadCallback={fileUploadCallback}
                />
              ) : (
                <></>
              )}

              {typeText ? (
                <button
                  className="chat__btn chat_send_btn1 chat_send_btn-icon"
                  onClick={() => sendMessage(false)}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.394 14.7L13.75 9.3c1-.577 1-2.02 0-2.598L4.394 1.299a1.5 1.5 0 00-2.25 1.3v3.438l4.059 1.088c.494.132.494.833 0 .966l-4.06 1.087v4.224a1.5 1.5 0 002.25 1.299z"
                    ></path>
                  </svg>
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
