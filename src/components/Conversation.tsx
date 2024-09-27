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
  ActiveSessionObjType,
  MessageByTypeEnum,
  MessageFormatType,
  JSONObjectType,
  JSONObjectType1,
  ChatSessionConnectedWithEnum,
  AIBotPromptsPayloadType,
  AIBotPromptActionEnum,
  AIBotPrefPayloadType,
  BotDetails,
  EventPayloadObj,
  AttachmentType,
} from "../Models";
import {
  getBrowserInfo,
  getFormData,
  getOperatorFromSession,
  isGPTEnabled,
  pushMessage,
  uuidv4,
} from "../Utils";
import { AppContext } from "../appContext";
import {
  ADD_EMAIL_URL_PATH,
  CHANNEL_ID,
  CONNECT_TO_AGENT_URL_PATH,
  CONVERSATION_MESSAGE_FETCH_URL_PATH,
  DEFAULT_AGENT_PROFILE_PIC,
  FORM_DATA,
  getCustomerProfile,
  getReachoOnsite,
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

export interface ConversationProps {
  showChatsList(): void;
  backToHome: () => void;
  addNewSession: (arg0: ChatSessionPaylodObj) => void;
}

const Conversation = (props: ConversationProps) => {
  const parentContext = useContext(AppContext);
  const { chatPrefs, sessions, setSessions, agentsPrefs, createSessionData } =
    parentContext;
  const customerProfile =
  getCustomerProfile()

  const _reachoOnsite =  getReachoOnsite();

  const singlefield = [
    {
      name: "customerEmail",
      label: "Drop your email",
      type: "email",
      required: true,
      value:
        customerProfile && customerProfile.email ? customerProfile.email : "",
      placeholder: "reacho@email.com",
      error: "",
      is_valid: true,
      helpText:
        "Messages and ticket updates will be sent to this email address",
    },
  ];

  const fields = [
    {
      name: "customerEmail",
      label: "Drop your email",
      type: "email",
      required: true,
      value:
        customerProfile && customerProfile.email ? customerProfile.email : "",
      placeholder: "reacho@email.com",
      error: "",
      is_valid: true,
      helpText:
        "Messages and ticket updates will be sent to this email address",
    },
    {
      name: "customerName",
      label: "Drop your name",
      type: "text",
      required: true,
      value: customerProfile && customerProfile.name ? customerProfile.name : "",
      placeholder: "Enter Name",
      error: "",
      is_valid: true,
    },
    {
      name: "query",
      label: "Drop query",
      type: "textarea",
      required: true,
      value: "",
      placeholder: "Drop Query",
      error: "",
      is_valid: true,
    },
  ];

  const text = useRef<HTMLTextAreaElement>(null);
  const [formFields, setFormFields] = useState<any[]>(fields);
  const [typeText, setTypeText] = useState("");
  const [showChatForm, setShowChatForm] = useState(false);
  const [typingTimer, setTypingTimer] = useState<any>();
  const [saving, setSaving] = useState<boolean>(false);
  useEffect(() => {
    if (!session?.messageList) setSession(getSession());
  }, [sessions]);

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

    // if (
    //   chatPrefs.matchedBotPrefs &&
    //   chatPrefs.matchedBotPrefs.id &&
    //   chatPrefs.matchedBotPrefs.settings.welcomeMessage
    // ) {
    //   session.messageList.push({
    //     from: MessageByTypeEnum.GPT,
    //     bodyText: chatPrefs.matchedBotPrefs.settings.welcomeMessage,
    //     format: MessageFormatType.TEXT,
    //     session_id: undefined,
    //     created_time: new Date().getTime() / 1000,
    //   });
    // }
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

          console.log(response);

          newNession.customerUnreadMessagesCount = 0;
          setSessionStoragePrefs(OPENED_CHAT, newNession.id);
          updateAndOpenSession(newNession);
          setSession(newNession);
        })
        .catch(() => { });
      createSessionData.force = false;
      createSessionData.messageList = [];
      createSessionData.sessionDetails = {};
    }

    return session;
  };

  const isEmailCaptured = (): boolean => {
    return !session.identifiers?.email && chatPrefs.meta.emailCaptureEnabled
      ? false
      : true;
  };

  const getSession = (): ChatSessionPaylodObj => {
    let chatId = getSessionStoragePrefs(OPENED_CHAT);
    if (!chatId || chatId == "new") {
      return getEmptySession();
    }

    let matchedSession = sessions.find(function (session) {
      return session.id == chatId;
    });
    console.log("matchedSession", matchedSession);

    if (matchedSession) return matchedSession;

    return getEmptySession();
  };

  const [session, setSession] = useState<ChatSessionPaylodObj>(getSession());
  const [emailCaptured, setEmailCaptured] = useState<boolean>(
    isEmailCaptured()
  );
  const [matchedBotPrefs, setMatchedBotPrefs] = useState<
    AIBotPrefPayloadType | undefined
  >(undefined);

  useEffect(() => {
    setScrollBottom();
  }, [session?.messageList]);

  useEffect(() => {
    let chatId = getSessionStoragePrefs(OPENED_CHAT);
    if (
      (!session ||
        !session?.messageList ||
        session?.messageList.length === 0) &&
      shouldShowForm() &&
      !isGPTEnabled() &&
      (!chatId || chatId == "new")
    ) {
      setShowChatForm(true);
    }

    let matchedBot = getMatchedBotPrefs();
    if (matchedBot) {
      setMatchedBotPrefs(matchedBot);
    }

    if (
      !session.id &&
      !session.messageList.length &&
      !isUserBusinessHour(chatPrefs, agentsPrefs)
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
        { page: 0, size: 50, sort: "createdTime" }
      );

      session.messageList = response.data.data;
      setSessions([...sessions]);
    } catch (error) { }
  };

  const getMatchedBotPrefs = () => {
    if (session && session.id) {
      if (
        !session.gpt_bot_id ||
        session.connected_with != ChatSessionConnectedWithEnum.GPT
      )
        return undefined;
      return chatPrefs.botPrefs?.find((pref) => {
        if (pref.id == session?.gpt_bot_id) return pref;
      });
    }

    return chatPrefs.matchedBotPrefs;
  };

  // useEffect(() => {
  //   let storedFormData: JSONObjectType = {};
  //   try {
  //     let obj: any = getFormData();
  //     if (obj) storedFormData = JSON.parse(obj) as JSONObjectType;
  //   } catch (error) {}

  //   let fields: ChatFromFieldDataPayLoad[] = [];

  //   // chatPrefs.prechat.formData.forEach(
  //   //   (field: ChatFromFieldDataPayLoad, index: number) => {
  //   //     let fieldClone = JSON.parse(
  //   //       JSON.stringify(field)
  //   //     ) as ChatFromFieldDataPayLoad;

  //   //     fieldClone.value =
  //   //       storedFormData[fieldClone.name] &&
  //   //         !(field.field_type == "SYSTEM" && field.name == "message")
  //   //         ? storedFormData[fieldClone.name]
  //   //         : "";
  //   //     if (fieldClone.type == "multicheckbox" || fieldClone.type == "checkbox")
  //   //       fieldClone.valueArr = storedFormData[fieldClone.name]
  //   //         ? Array.from(storedFormData[fieldClone.name])
  //   //         : [];
  //   //     fieldClone.is_valid = false;
  //   //     fields.push(fieldClone);
  //   //   }
  //   // );

  //   setFormFields(fields);
  // }, [showChatForm]);

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
      .catch(() => { });
  };

  const updateMessage = (message: ChatMessagePayloadObj) => {
    if (!message.ticketId) {
      return;
    }

    // Get session from session id
    let session = getSessionById(message.ticketId);
    console.log("updating message session", session);
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

  const updateMessageList = (message: EventPayloadObj) => {
    if (!message.ticketId) {
      return;
    }

    // Get session from session id
    let session = getSessionById(message.ticketId);
    console.log("updating message session", session);
    if (!session) return;

    session.messageList = session.messageList.map(
      (eachmessage: EventPayloadObj) => {
        if (eachmessage.tempId &&  eachmessage.tempId == message.tempId)
          return message;
        return eachmessage;
      }
    );
    session.lastMessage = message.message.bodyText;
    session.lastMessageAt = message.createdTime;
    session.lastCustomerMessageAt = message.createdTime;

    setSessions([...sessions]);
  };

  const getChatMessage = (
    msg: string | string[] | null,
    type?: MessageFormatType,
    attachments?: AttachmentType[]
  ) => {
    let state: ChatMessagePayloadObj = {
      bodyText: msg,
      format: !type ? MessageFormatType.TEXT : type,
      ticketId: session?.id && session?.id,
      created_time: new Date().getTime(),
      attachments: attachments
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

    setShowChatForm(false);

    setLocalStoragePrefs(FORM_DATA, JSON.stringify(formData));
    setSaving(true);
    if (_reachoOnsite)
      _reachoOnsite.push([
        "identify",
        { email: formData.customerEmail, name: formData.customerName },
      ]);
    if (session && session.id) {
      const wait = getReq(ADD_EMAIL_URL_PATH, {
        customerEmail: formData.customerEmail,
        ticketId: session.id,
      });
      wait
        .then((response: any) => {
          console.log(response);

          let newNession = response.data as ChatSessionPaylodObj;
          newNession.messageList = session.messageList;
          updateAndOpenSession(newNession);
          setSession(newNession);
          setEmailCaptured(true);
          setSessionStoragePrefs(OPENED_CHAT, newNession.id);
        })
        .catch(() => { });
      return;
    }
    session.customerEmail = formData.customerEmail as string;
    session.customerName = formData.customerName as string;
    if (formData.query) {
      var msg: ChatMessagePayloadObj = getChatMessage(
        formData.query,
        undefined
      );
      let event: EventPayloadObj = {
        ticketId: session?.id,
        eventType: "MESSAGE",
        source: "WEBSITE",
        visibility: "PUBLIC",
        from: MessageByTypeEnum.CUSTOMER,
        message: msg,
        tempId:  uuidv4(),
      };

      session.channelId = CHANNEL_ID;
      session.visitorId = VISITOR_UUID;
      session.channelType = "CHAT";
      session.createdSource = "WEBSITE";
      session.createdBy = MessageByTypeEnum.CUSTOMER;
      session.unRead = session.unRead ? session.unRead + 1 : 1;
      session.messageList.push(event);
    }
    submitSessionEvent(NEW_SESSION_URL_PATH, session, (response: any) => {
      // if (newChat) {
      // Get session
      let newNession = response.data as ChatSessionPaylodObj;
      updateAndOpenSession(newNession);
      setSession(newNession);
      setEmailCaptured(true);
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
      var mssg =
        "Whoops! Something went wrong. Please try again later.";

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
  const sendFileUploadMessage = (file: AttachmentType) => {

    if (!file) return;

    // // Message as JSON for file upload
    // var message: any = {};
    // message.fileName = file.name;
    // message.fileUrl = file.bucketURL + file.file_resource;
    // message.fileSize = file.size;
    // message.fileType = file.type;

    // Send message
    postMessage(
      getChatMessage("", MessageFormatType.TEXT, [file])
    );
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
    console.log("updating session", newNession);

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
        console.log(response);

        if (callback) callback(response);
      })
      .catch(() => { });
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
      tempId:  uuidv4(),
    };

    // Make temp push
    if (newChat) {
      session.channelId = CHANNEL_ID;
      session.visitorId = VISITOR_UUID;
      session.channelType = "CHAT";
      session.createdSource = "WEBSITE";
      session.createdBy = MessageByTypeEnum.CUSTOMER;
      session.subject = data.bodyText;
      if(customerProfile && customerProfile.email) {
      session.customerEmail = customerProfile.email;
      setEmailCaptured(emailCaptured => true);
      }
      if(customerProfile && customerProfile.name) 
        session.customerName = customerProfile.name;
      pushMessage(event, session);
    } else {
      data.ticketId = session?.id + "";
      pushMessage(event, session);
    }

    if (newChat &&
      !emailCaptured &&
      chatPrefs.meta.emailCaptureEnforcement == "required"
    ) 
      return;
    

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
    return false;
    //return  parentContext.chatPrefs.prechat.enabled;
  };

  /**
   * Send typed message
   */
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
    const agent = getOperatorFromSession(session, parentContext.agents);
    if (agent && agent?.profile_img_url) return agent?.profile_img_url;

    if (matchedBotPrefs?.id) return matchedBotPrefs?.settings.chatBotIconURL;

    return parentContext.chatPrefs.meta.decoration.headerPictureUrl || DEFAULT_AGENT_PROFILE_PIC;
  };

  const getHeaderName = () => {
    if (parentContext.chatPrefs.name) return parentContext.chatPrefs.name;
  };

  const executeBotPromptAction = (prompt: AIBotPromptsPayloadType) => {
    switch (prompt.action) {
      case AIBotPromptActionEnum.CONNECT_TO_AGENT:
        if (matchedBotPrefs?.settings.showChatFormBeforeConnectToAgent) {
          setShowChatForm(true);
          return;
        }

        break;

      case AIBotPromptActionEnum.MESSAGE:
        let message: ChatMessagePayloadObj = getChatMessage(
          prompt.message,
          MessageFormatType.TEXT
        );
        message.from = MessageByTypeEnum.CUSTOMER;

        console.log("in", message);

        postMessage(getChatMessage(message.message, undefined));
        setScrollBottom();

        break;

      default:
        break;
    }
  };

  const getChatPrompts = () => {
    if (!matchedBotPrefs || matchedBotPrefs.botPrompts?.length == 0)
      return <></>;

    return (
      <div className="chat_prompts_actions">
        {matchedBotPrefs.botPrompts.map((prompt) => (
          <button
            className={"btn btn-outline-primary"}
            onClick={() => executeBotPromptAction(prompt)}
          >
            {prompt.label}
          </button>
        ))}
      </div>
    );
  };

  const goBack = () => {
    if (session.unRead) {
      session.unRead = 0;
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
            <div>
              <div
                className="chat__header-user-img"
                style={{ backgroundImage: 'url("' + getHeaderIcon() + '")' }}
              ></div>
            </div>

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
              {!showChatForm ? (
                session?.messageList ? session?.messageList?.map(
                  (message: EventPayloadObj, index: number) => {
                    return (
                      <div>
                        <div>
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
                              {index == 0 && !emailCaptured && (
                                <ChatForm
                                  closeChatForm={() => {
                                    setShowChatForm(false);
                                  }}
                                  fields={singlefield}
                                  submitChatForm={submitChatForm}
                                  typeText={typeText}
                                  setTypeText={setTypeText}
                                  saving={saving}
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  }
                ) : 
                
            <p style={{ marginTop: "60px", textAlign: "center" }}>
                <div className="chat__form-loader1">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                </div>
                </p>
              ) : (
                <></>
              )}

              {showChatForm ? (
                <ChatForm
                  closeChatForm={() => {
                    setShowChatForm(false);
                  }}
                  fields={fields}
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

        <div
          className={`chat__footer ${showChatForm ||
            (!session.id && session.messageList?.length > 0) ||
            (chatPrefs.meta.emailCaptureEnforcement == "required" &&
              !emailCaptured &&
              !session.id &&
              session.messageList?.length > 0)
            ? "hide"
            : ""
            }`}
        >
          {getChatPrompts()}

          <div className={`chat__form`}>
            <textarea
              ref={text}
              rows={1}
              onChange={(e) => setTypeText(e.currentTarget.value)}
              onScroll={(e) => handleScroll(e)}
              className="chat__input chat__textarea"
              value={text?.current?.value}
              placeholder={
                !matchedBotPrefs || matchedBotPrefs.botPrompts?.length == 0
                  ? parentContext.chatPrefs.meta.decoration.introductionText
                  : matchedBotPrefs.settings.placeHolderText
              }
              contentEditable="true"
              onPaste={(e) => {
                e.preventDefault();
                document.execCommand(
                  "insertHTML",
                  false,
                  e.clipboardData.getData("text/plain")
                );
              }}
              onKeyDown={handleKeyDown}
              onInput={(e) => handleKeyPress(e)}
              onKeyUp={userTyping}
              id="chatMessageEditable"
            ></textarea>

            <div className="chat__actions">
              <Emoji onEmojiSelect={onEmojiSelect} />

              {session &&
                session.id ? (
                <FileUpload fileUploadCallback={fileUploadCallback} />
              ) : (
                <></>
              )}

              {typeText ? (
                <button
                  className="chat__btn chat_send_btn"
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
