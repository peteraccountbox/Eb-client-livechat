import axios, { AxiosResponse } from "axios";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppContext } from "./appContext";
import ChatBubble from "./components/ChatBubble";
import {
  CHANNEL_PREFS_FETCH_URL_PATH,
  CONVERSATIONS_FETCH_URL_PATH,
  VISITOR_UUID,
  PARENT_WINDOW,
  GET_BIG_TEXT_URL_PATH,
  WINDOW_OPEN,
  OPENED_CHAT,
  OPERATORS,
  WIDGET_ACTIVE_TAB,
  PROACTIVE_MESSAGE,
  TENANT_ID,
  AGENTS_FETCH_URL_PATH,
  UPDATE_READ_URL_PATH,
  FooterTabs,
  CHAT_FLOWS_FETCH_URL_PATH,
  OPENED_FLOW,
  CHANNEL_PREFS,
  USER_PREFS_FETCH_URL_PATH,
  TRACK_MANAGE,
  USERS_FETCH_URL,
  getIntegrationSource,
} from "./globals";
import {
  ActiveSessionObjType,
  AgentPaylodObj,
  AgentPrefsPayloadType,
  ChatChannelMeta,
  ChatFlowsPayloadObj,
  ChatFooterDataPayload,
  ChatMessagePayloadObj,
  ChatPrefsPayloadType,
  ChatSessionConnectedWithEnum,
  ChatSessionPaylodObj,
  ConversationResponsePayload,
  MessageByTypeEnum,
  MessageFormatType,
  SessionStateEnum,
  WebRulesPayloadType,
} from "./Models";
import { getReq, postReq } from "./request";
import {
  getSessionStoragePrefs,
  removeSessionStoragePrefs,
  setSessionStoragePrefs,
} from "./Storage";
import Home from "./Home";
import LiveChat from "./LiveChat";
import { pushMessage, resizeFrame } from "./Utils";
import HelpCenter from "./HelpCenter";
import Loader from "./components/Loader";
import NewPromptMessage from "./NewPromptMessage";
import eventBus from "./eventBus";
import { initalizeSocket } from "./socket";
import { isUserBusinessHour } from "./BusinessHours";

export enum widgetFooterTabs {
  Home = "Home",
  Messages = "Messages",
  Loader = "Loader",
  Tickets = "Tickets",
  Help = "Help",
}

export enum PromtWidth {
  Small = "Small",
  Large = "Large",
}

export enum NotificationPromtTypes {
  Livechat = "Livechat",
  Ticket = "Ticket",
  Proactive = "Proactive",
}

const App: React.FunctionComponent = () => {
  // Context states
  console.log("running.........");
  const [chatPrefs, setChatPrefs] =
    useState<ChatPrefsPayloadType>(CHANNEL_PREFS);
  const [agents, setAgents] = useState<AgentPaylodObj[]>([]);

  const [agentsPrefs, setAgentsPrefs] = useState<AgentPrefsPayloadType[]>([]);

  const [sessions, setSessions] = useState<ChatSessionPaylodObj[]>([]);
  const sessionsRef = useRef(sessions);
  const [chatFlows, setChatFlows] = useState<ChatFlowsPayloadObj[]>([]);
  const [createSessionData, setCreateSessionData] = useState<any>({});
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);
  // const getWidgetActiveTabs = () => {
  //   if (!chatPrefs) return [];

  //   let activeTabname = getSessionStoragePrefs(WIDGET_ACTIVE_TAB);
  //   if (!activeTabname) activeTabname = widgetFooterTabs.Home;
  //   try {
  //     if (!FooterTabs.find((footer) => footer.tab == activeTabname)) {
  //       activeTabname = FooterTabs[0].tab;
  //     }
  //   } catch (error) {}

  //   return activeTabname;
  // };

  const getWidgetActiveTabs = () => {
    const footerTabs = chatPrefs?.meta?.chatFooterSettings.filter(
      (footer) => footer.enable == true
    );
    let activeTabname = getSessionStoragePrefs(WIDGET_ACTIVE_TAB);
    if (!activeTabname) activeTabname = widgetFooterTabs.Home;
    try {
      if (!footerTabs.find((footer) => footer.tab == activeTabname)) {
        activeTabname = footerTabs[0].tab;
      }
    } catch (error) {}

    return activeTabname;
  };

  const [activeTab, setActiveTab] = useState<widgetFooterTabs>(
    getWidgetActiveTabs() as widgetFooterTabs
  );
  const [promtWidth, setPromtWidth] = useState<PromtWidth>(PromtWidth.Small);

  // Maintaining the recent session when message inbound or outboud times are updated.
  const [hideChatBubble, setHideChatBubble] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(
    getSessionStoragePrefs(WINDOW_OPEN) ? true : false
  );
  const [isVisible, setIsVisible] = useState(true);

  const [notificationPrompt, setNotificationPrompt] = useState<{
    enabled: boolean;
    type: NotificationPromtTypes | undefined;
    info: { [x: string]: any } | undefined;
    id: string | undefined;
  }>({
    enabled: false,
    type: undefined,
    info: undefined,
    id: undefined,
  });

  const [channelConnected, setChannelConnected] = useState<boolean>(false);

  // const [activeSessionDetails, setActiveSessionDetails] = useState<ActiveSessionObjType>({
  //   session_id: undefined,
  //   session_type: undefined,
  //   session: undefined
  // });

  const [prefsFetched, setPrefsFetched] = useState<boolean>(false);
  useEffect(() => {
    if (prefsFetched) {
      //fetchChatFlows();
      setChatFlows(chatPrefs?.flows || []);

      registerChannelInstallation();
    }
  }, [prefsFetched]);

  const [loadingSessions, setLoadingSessions] = useState<boolean>(true);

  useEffect(() => {
    setActiveTab(getWidgetActiveTabs());
  }, [chatPrefs]);

  useEffect(() => {
    setPromtWidth(PromtWidth.Small);
    setSessionStoragePrefs(WIDGET_ACTIVE_TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (isOpened) setIsVisible(true);

    if (!isVisible) return resizeFrame("LIVECHAT_WRAPPER_CLOSED");

    setTimeout(() => {
      if (!isOpened) {
        resizeFrame("WINDOW_CLOSED");
      } else {
        resizeFrame(
          promtWidth && promtWidth == PromtWidth.Large
            ? "WINDOW_OPENED_LARGE"
            : "WINDOW_OPENED"
        );
      }
    }, 300);
  }, [promtWidth, isOpened, isVisible]);

  useEffect(() => {
    console.log("useEffect1");

    const prefsReq = axios.get(USER_PREFS_FETCH_URL_PATH);
    const usersReq = axios.get(USERS_FETCH_URL);

    prefsReq
      .then((prefsRes) => {
        if (prefsRes && prefsRes.data) setAgentsPrefs(prefsRes.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    axios
      .all([prefsReq, usersReq])
      .then(
        axios.spread((prefsRes, usersRes) => {
          if (prefsRes && prefsRes.data) setAgentsPrefs(prefsRes.data);

          if (usersRes && usersRes.data) setAgents(usersRes.data);
        })
      )
      .catch((error) => {
        console.error("There was an error!", error);
      });

    // Fetch chat prefs
    console.log("useEffect 2");

    fetchChatPrefs();

    // Restore storage prefs
    // console.log("this.$isNewSession", this.$isNewSession);
    // if (IS_NEW_SESSION) {
    //   removeSessionStoragePrefs("window-open");
    //   removeSessionStoragePrefs("opened-chat");
    //   // deleteStoragePrefs("opened-chat-type");
    // }

    // Fetch conversations
    fetchConversationsAndAgents();

    // Open window on localstorage value
    // let opened = getStoragePrefs("window-open");
    // if (opened && opened === "true") {
    //   // Open window
    //   chatBubbleClicked();
    // }

    // Subscribe to event bus
    eventBus.on("engagebay-event", function () {});

    eventBus.on("new_ticket_message", function (message) {
      let messageSession: ChatSessionPaylodObj | undefined =
        sessionsRef.current.find(function (session) {
          return session.id == message.ticket.id;
        });

      let chatId = getSessionStoragePrefs(OPENED_CHAT);
      if (messageSession) {
        messageSession.lastMessage = message.message.message.bodyText;
        messageSession.lastAgentMessageAt = message.message.createdTime;
        messageSession.lastMessageAt = message.message.createdTime;
        pushMessage(message.message, messageSession);
      }
      if (chatId && chatId == message.ticket.id) {
        getReq(UPDATE_READ_URL_PATH + "/" + message.ticket.id, {}).then(
          (response) => {
            eventBus.emit("on-ticket-updated", messageSession);
          }
        );
      } else {
        if (messageSession) {
          messageSession.customerUnreadMessagesCount += 1;
        }
      }
      setSessions([...sessionsRef.current]);
    });

    return () => {
      eventBus.off("new_ticket_message");
    };
  }, []);

  const registerChannelInstallation = () => {
    try {
      // check this url is available in installedDomains list
      const installedDomainsList = chatPrefs?.meta.installedDomains;
      console.log("Installed Domains: ", installedDomainsList);

      const domain = (window as any).location.host;
      if (installedDomainsList && installedDomainsList.includes(domain)) {
        console.log("Channel is already installed.");
        return;
      }

      // If not send request to worker to sync the domain list
      // axios
      //   .get(CHAT_WORKER_URL_PATH)
      //   .then((response) => {
      //     if (!response) return;
      //     console.log("response: ", response);
      //   })
      //   .catch(() => {});
    } catch (error) {
      console.log("error", error);
    }
  };

  const closeNotify = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setNotificationPrompt({
      enabled: false,
      type: undefined,
      info: undefined,
      id: undefined,
    });
    resizeFrame("WINDOW_CLOSED");
  };

  const openNotify = () => {
    let activeTab = widgetFooterTabs.Messages;
    setActiveTab(activeTab);

    chatBubbleClicked();

    if (notificationPrompt.type == NotificationPromtTypes.Proactive) {
      startNewChat(notificationPrompt.info?.message);
    } else if (
      notificationPrompt.id &&
      notificationPrompt.type == NotificationPromtTypes.Livechat
    )
      openChat(notificationPrompt.id);
  };

  const fetchChatPrefs = async () => {
    console.log("CHANNEL_PREFS", CHANNEL_PREFS);

    if (CHANNEL_PREFS) {
      setChatPrefs(CHANNEL_PREFS);
      setPrefsFetched(true);
      return;
    }

    try {
      console.log("CHANNEL_PREFS_FETCH_URL_PATH", CHANNEL_PREFS_FETCH_URL_PATH);

      // axios(CHANNEL_PREFS_FETCH_URL_PATH, {}).then(
      //   (response: AxiosResponse<any, any>) => {
      //     let prefs = response.data as ChatPrefsPayloadType;

      //     setChatPrefs(prefs);
      //     setPrefsFetched(true);
      //   }
      // );

      // let prefs = response.data as ChatPrefsPayloadType;

      // if (prefs.botPrefs && prefs.botPrefs.length > 0)
      //   prefs.matchedBotPrefs = prefs.botPrefs[0];

      // let chatChannelMeta: ChatChannelMeta = {
      //   deactivated: false,
      //   hideOnMobile: true,
      //   hideOnOutsideBusinessHours: true,
      //   emailCaptureEnabled: true,
      //   emailCaptureEnforcement: false,
      //   liveChatAvailability: "always-live-during-business-hours",
      //   sendChatTranscript: true,
      //   decoration: {
      //     headerPictureUrl: "https://example.com/image.png",
      //     fontFamily: "Arial",
      //     mainColor: "#FFFFFF",
      //     conversationColor: "#000000",
      //     backgroundStyle: "solid",
      //     introductionText: "Welcome to our chat!",
      //     offlineIntroductionText: "We are currently offline.",
      //     avatarType: "circle",
      //     widgetAlignment: "right",
      //     widgetAlignmentOffsetX: 10,
      //     widgetAlignmentOffsetY: 20,
      //     launcherType: "icon",
      //     agentAvatarImageType: "image",
      //     agentAvatarNameType: "name",
      //     botAvatarImage: "https://example.com/bot.png",
      //   },
      // };

      // prefs.meta = chatChannelMeta;

      // setChatPrefs(prefs);

      // setPrefsFetched(true);
    } catch (e) {
      console.log("errr", e);
    }
  };

  const chatBubbleClicked = () => {
    notificationPrompt.enabled &&
      setNotificationPrompt({
        enabled: false,
        type: undefined,
        info: undefined,
        id: undefined,
      });
    if (!isOpened) resizeFrame("WINDOW_OPENED");
    else {
      setIsOpened(!isOpened);
      setTimeout(() => {
        // resizeFrame("WINDOW_CLOSED");
      }, 2000);
    }

    setTimeout(() => {
      setIsOpened(!isOpened);

      // Setting
      // setPromtWidth(PromtWidth.Small);

      setSessionStoragePrefs(WINDOW_OPEN, !isOpened);
      if (isOpened) {
        removeSessionStoragePrefs(WINDOW_OPEN);
        // removeSessionStoragePrefs(OPENED_CHAT);
        // deleteStoragePrefs("opened-chat-type");
      }
    }, 50);
  };

  const fetchChatFlows = async () => {
    if (!chatPrefs?.meta.flowIds || chatPrefs?.meta.flowIds.length == 0) return;

    const response = await getReq(CHAT_FLOWS_FETCH_URL_PATH + chatPrefs.id, {
      page: 0,
      size: 20,
      sort: "updatedTime",
    });

    setChatFlows([...response.data]);
  };

  const fetchConversationsAndAgents = async () => {
    try {
      const response = await getReq(CONVERSATIONS_FETCH_URL_PATH, {
        page: 0,
        size: 20,
        sort: "lastMessageAt,DESC",
      });

      console.log(response);
      // let agentsList = agents;
      // response.data.operators.forEach((agent) => {
      //   agentsList.push(agent);
      // });

      // setSessionStoragePrefs(
      //   OPERATORS,
      //   JSON.stringify(response.data.operators)
      // );
      // setAgents(response.data.operators);

      let sessionsList = sessions;
      response.data.data.forEach((session: ChatSessionPaylodObj) => {
        sessionsList.push(session);
      });

      setSessions([...sessionsList]);
      setLoadingSessions(false);

      if (sessions.length > 0) bindPusherSocketEvents();

      // Check for opened chat
      let openedChat = getSessionStoragePrefs(OPENED_CHAT);
      if (openedChat) {
        openChat(openedChat);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isPromptEnabled = () => {
    return notificationPrompt.enabled;
  };

  const executeWebrules = () => {
    if (
      PARENT_WINDOW &&
      PARENT_WINDOW.EhWebRules &&
      !PARENT_WINDOW.EhWebRules.webRulesFetched
    ) {
      setTimeout(function () {
        executeWebrules();
      }, 500);
    }

    if (!PARENT_WINDOW || !PARENT_WINDOW.EhWebRules) return;

    PARENT_WINDOW.EhWebRules.executeScopeBasedRules(
      "LIVECHAT",
      function (rule: WebRulesPayloadType) {
        // console.log("rule1", rule);

        let ruleType = rule.actionType;
        if (!ruleType) return;

        // console.log("ruleType", ruleType);

        switch (ruleType) {
          case "LIVECHAT_PROACTIVE_MESSAGE":
            setTimeout(function () {
              // Show proactive message
              let proactiveMsg = "";
              try {
                proactiveMsg = JSON.parse(rule.customData).message;
              } catch (error) {}
              // console.log("proactiveMsg", proactiveMsg);

              // if (proactiveMsg)
              // setIsOpened(true);
              let opened = getSessionStoragePrefs(WINDOW_OPEN);
              if (!opened && !isPromptEnabled() && proactiveMsg) {
                // setLoadingChats(false);
                // chatBubbleClicked();

                resizeFrame("WINDOW_OPENED");

                setNotificationPrompt({
                  enabled: true,
                  type: NotificationPromtTypes.Proactive,
                  info: { message: proactiveMsg, user_id: undefined },
                  id: undefined,
                });

                // startNewChat(proactiveMsg);
                // setSessionStoragePrefs(
                //   "notification_type",
                //   NotificationPromtTypes.Proactive
                // );
              }

              // showProactiveMessage(proactiveMsg);
            }, 1000);
            break;

          case "LIVECHAT_HIDE":
            setHideChatBubble(true);
            break;

          default:
            break;
        }

        // Saving visitor
        if (PARENT_WINDOW && rule && rule.id)
          PARENT_WINDOW.EhGrabberVisitor.saveFrequency(rule.id);
      }
    );
  };

  const openChat = (id: string) => {
    setSessionStoragePrefs(OPENED_CHAT, id);

    changeActiveTab(widgetFooterTabs.Messages);
  };

  const startFlow = (id: string) => {
    setSessionStoragePrefs(OPENED_FLOW, id);
    changeActiveTab(widgetFooterTabs.Messages);
  };

  const openTrackAndManage = (id: string) => {
    setSessionStoragePrefs(TRACK_MANAGE, id);
    changeActiveTab(widgetFooterTabs.Messages);
  };

  const backToHome = () => {
    removeSessionStoragePrefs(OPENED_CHAT);
    changeActiveTab(widgetFooterTabs.Home);
  };

  const startNewChat = (initialMessage?: string) => {
    setSessionStoragePrefs(OPENED_CHAT, "new");

    if (initialMessage)
      setSessionStoragePrefs(PROACTIVE_MESSAGE, initialMessage);
    else removeSessionStoragePrefs(PROACTIVE_MESSAGE);

    changeActiveTab(widgetFooterTabs.Messages);
  };

  const changeActiveTab = (tab: widgetFooterTabs) => {
    if (activeTab == tab) {
      setActiveTab(widgetFooterTabs.Loader);
      setTimeout(() => {
        setActiveTab(tab);
      }, 10);
    } else {
      setActiveTab(tab);
    }
  };

  const getSessionById = (id: number | undefined) => {
    if (!id) return undefined;

    return sessions.find(function (session) {
      return session.id === Number(id);
    });
  };

  const bindPusherSocketEvents = () => {
    if (channelConnected) {
      console.log("Alredy connected");
      return;
    }

    initalizeSocket();
    setChannelConnected(true);
  };

  const handleMessage = (event: any) => {
    console.log("handleMessage", event);

    // If typing alert
    if (event.event_type == "TYPING") {
      console.log("TYPING", event.message);
      handleInboundTyping(event.message);
      return;
    }

    // If CALL alert
    //   if (event.event_type == "CALL_ALERT") {
    //     console.log("CALL_ALERT", event);
    //     this.handleCallRequest(event.message);
    //     return;
    //   }
    let chat_message: ChatMessagePayloadObj = event.message
      .message as ChatMessagePayloadObj;

    console.log(chat_message);
    if (!chat_message) return;

    console.log("pusgedd alreadd");

    sessions.forEach((element) => {
      console.log("availablesessionids", element.id);
    });

    let session = getSessionById(chat_message.session_id);
    console.log("sessionunavailabnle", chat_message.session_id);

    if (!session) return;

    //If system message
    if (
      event.event_type === "SYSTEM_MESSAGE" ||
      chat_message.from === MessageByTypeEnum.SYSTEM
    ) {
      var message_type = chat_message.SYSTEM_message_type;
      var systemMssgArray = [
        "CHAT_SESSION_ASSIGNED_TO_USER",
        "CHAT_SESSION_TRANSFERED_TO_ANOTHER_USER",
        "CHAT_SESSION_ADD_ANOTHER_USER_TO_CONFERENCE",
      ];

      if (message_type && systemMssgArray.includes(message_type)) {
        session.first_answered_by_user_id =
          event.message.session.first_answered_by_user_id;
        session.participant_user_ids =
          event.message.session.participant_user_ids;
      }

      if (!chat_message.message) return;
    }

    pushMessage(event, session);

    setSessions([...sessions]);

    // Set prompt message
    if (!isOpened && isVisible) {
      setNotificationPrompt({
        enabled: true,
        type: NotificationPromtTypes.Livechat,
        info: event.message.message,
        id: session.id + "",
      });
      resizeFrame("WINDOW_OPENED");
    }
  };

  const handleInboundTyping = (message: any) => {
    // Holding for a moment to make changes live
    // with PUSHER service
    // if (true) return;

    // Get session I from noty message
    if (!message.session_id) return;

    // Get session from ID
    var session = getSessionById(message.session_id);
    // console.log("handleInboundTyping", session);

    if (!session) return;

    // Set reactivity dynamic
    var time = new Date().getTime();

    session.typing = true;
    session.typing_alert = time;
    setSessions([...sessions]);
  };

  const addNewSession = useCallback(
    (session: ChatSessionPaylodObj) => {
      let availableIndex = sessions.findIndex((eachSession) => {
        return eachSession.id == session.id;
      });
      if (availableIndex > -1) {
        sessions.splice(availableIndex, 1);
      }
      let sessionsList = sessions;
      sessionsList.push(session);
      setSessions([...sessionsList]);

      console.log(sessions);

      bindPusherSocketEvents();
    },
    [sessions]
  );

  const appThemeStyle: object = useMemo(() => {
    if (
      !chatPrefs
      //  || !agentsPrefs.length
    )
      return {};

    const settings = chatPrefs?.meta?.chatFooterSettings.filter(
      (footer) => footer.enable == true
    );

    const mainColor = chatPrefs && chatPrefs.meta.decoration.mainColor;
    const gradientColor = chatPrefs && chatPrefs.meta.decoration.gradientColor;
    const offlineColor =
      chatPrefs &&
      !chatPrefs.meta.decoration.useMainColorOutsideBusinessHour &&
      !isUserBusinessHour(chatPrefs, agentsPrefs);

    return {
      "--bottom": settings?.length < 2 ? "20px" : "125px",
      "--reduceHeight": settings?.length < 2 ? "135px" : "210px",
      "--themeColor": offlineColor
        ? "#959ba8"
        : mainColor
        ? chatPrefs.meta.decoration.mainColor
        : "#000000",
      ...(offlineColor
        ? { "--themeColor2": "#959ba8" }
        : {
            "--themeColor2": gradientColor
              ? chatPrefs.meta.decoration.gradientColor
              : "#000000",
          }),
    };
  }, [chatPrefs, agentsPrefs]);

  if (
    prefsFetched &&
    chatPrefs &&
    !(
      chatPrefs.meta.hideOnNonBusiness &&
      !isUserBusinessHour(chatPrefs, agentsPrefs)
    )
  ) {
    return (
      <AppContext.Provider
        value={{
          agentsPrefs,
          setAgentsPrefs,
          agents,
          setAgents,
          chatPrefs,
          chatBubbleClicked,
          setChatPrefs,
          sessions,
          setSessions,
          activeTab,
          changeActiveTab,
          promtWidth,
          setPromtWidth,
          chatFlows,
          setChatFlows,
          createSessionData,
        }}
      >
        <div
          id="App"
          className={`engagebay-viewport ${
            !isOpened && hideChatBubble ? "hide" : ""
          } `}
          style={appThemeStyle}
        >
          {isVisible ? (
            <>
              <ChatBubble
                isVisible={isVisible}
                notifyEnabled={notificationPrompt.enabled}
                setIsVisible={setIsVisible}
                chatBubbleClicked={chatBubbleClicked}
                opened={isOpened}
              />

              {notificationPrompt.enabled ? (
                <NewPromptMessage
                  info={notificationPrompt.info}
                  close={closeNotify}
                  open={openNotify}
                />
              ) : (
                <div
                  className={`chat ${isOpened ? "is-open" : ""} 
              ${
                chatPrefs.meta.decoration.widgetAlignment == "bottom left"
                  ? "left"
                  : ""
              } 
              ${
                chatPrefs.meta.decoration.widgetAlignment == "RIGHT"
                  ? "right"
                  : ""
              }`}
                  data-target="widget"
                >
                  <div
                    className={`chat__main ${
                      getIntegrationSource() + "-SOURCE"
                    }`}
                    style={{
                      minWidth: `${
                        promtWidth == PromtWidth.Large ? "700px" : "auto"
                      }`,
                    }}
                  >
                    {(() => {
                      if (widgetFooterTabs.Home == activeTab) {
                        return (
                          <Home
                            openChat={openChat}
                            startNewChat={startNewChat}
                            startFlow={startFlow}
                            openTrackAndManage={openTrackAndManage}
                          />
                        );
                      }

                      if (widgetFooterTabs.Messages == activeTab) {
                        return (
                          <LiveChat
                            loadingSessions={loadingSessions}
                            openChat={openChat}
                            startNewChat={startNewChat}
                            addNewSession={addNewSession}
                            backToHome={backToHome}
                          />
                        );
                      }

                      if (widgetFooterTabs.Loader == activeTab) {
                        return <Loader />;
                      }

                      if (widgetFooterTabs.Help == activeTab) {
                        return <HelpCenter />;
                      }

                      return <></>;
                    })()}
                  </div>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </AppContext.Provider>
    );
  } else {
    return <></>;
  }
};

export default App;
