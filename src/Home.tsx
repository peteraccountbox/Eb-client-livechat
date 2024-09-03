import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./appContext";
import ChatTabsList from "./components/ChatTabsList";
import ConversationListItem from "./components/ConversationListItem";
import { ChatFlowsPayloadObj, ChatSessionPaylodObj } from "./Models";
import CloseWidgetPanel from "./components/CloseWidgetPanel";

const Home = ({
  openChat,
  startNewChat,
  startFlow,
}: {
  openChat: (id: string) => void;
  startNewChat: (initialMessage?: string | undefined) => void;
  startFlow: (id: string) => void;
}) => {
  const parentContext = useContext(AppContext);
  const { sessions, chatPrefs, chatFlows } = parentContext;

  const [recentSessions, setRecentSessions] = useState<ChatSessionPaylodObj[]>(
    []
  );

  useEffect(() => {
    function compare(a: ChatSessionPaylodObj, b: ChatSessionPaylodObj) {
      if (new Date(a.updatedTime) < new Date(b.updatedTime)) return 1;
      if (new Date(a.updatedTime) > new Date(b.updatedTime)) return -1;
      return 0;
    }
    const sortedSessions = sessions?.sort(compare);
    setRecentSessions([...sortedSessions]);
    // setRecentSession(sortedSessions[0]);
  }, [sessions]);

  return (
    <>
      <div className="home__feeds-main-wrapper">
        <div className="home__feeds-main">
          <div className="home__feeds-bg-primary">
            <div className="home__feeds-bg-shadow"></div>
          </div>
          <div className="home__feeds-body">
            <div className="home__feeds-header">
              <div className="home__feeds-logo-brand">
                <img
                  src={
                    "https://cdn5.engagebay.com/assets/img/engagebay-brand-logo-white.svg"
                  }
                  alt="Logo"
                />
              </div>
              <div className="chat__help-end">
                <CloseWidgetPanel />
              </div>
            </div>

            <div className="home__feeds-home-title">
              {"welcome message" ? <>Welcome message</> : <></>}
            </div>
          </div>
          <div className="home__feeds-cards-main">
            <div className="home__feeds-cards-sec">
              {chatFlows && chatFlows.length > 0 && (
                <>
                  <div className="home__feeds-send-card home__feeds-recent-card">
                    <div className="home__feeds-media">
                      <div className="home__feeds-media-content">
                        {chatFlows.map(
                          (chatFlow: ChatFlowsPayloadObj, index: number) => {
                            return (
                              <div onClick={() => startFlow(chatFlow.id)}>
                                {chatFlow.name}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {chatPrefs.orderManagement && (
                <>
                  <div className="home__feeds-send-card home__feeds-recent-card">
                    <div className="home__feeds-media">
                      <div className="home__feeds-media-content">
                        <div>{chatPrefs.orderManagement.name}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {recentSessions && recentSessions.length > 0 && (
                <>
                  <div className="home__feeds-send-card home__feeds-recent-card">
                    <div className="home__feeds-media">
                      <div className="home__feeds-media-content">
                        <h4
                          className={`${false ? "unRead" : ""}`}
                          style={{ cursor: "auto" }}
                        >
                          Recent conversation
                        </h4>
                        {recentSessions.map(
                          (
                            recentSession: ChatSessionPaylodObj,
                            index: number
                          ) => (
                            <ConversationListItem
                              session={recentSession}
                              openChatConversation={openChat}
                              // openBotConversation={props.openBotConversation}
                              key={recentSession.id}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div
                className="home__feeds-send-card"
                onClick={() => startNewChat()}
              >
                <div className="home__feeds-media">
                  <div className="home__feeds-media-content">
                    <h5>Send us a message </h5>
                    {/* <p>We typically reply within a day</p> */}
                  </div>
                  <div className="home__feeds-media-icon">
                    <svg
                      className="chat_send_icon"
                      id="fi_9290348"
                      enable-background="new 0 0 32 32"
                      viewBox="0 0 32 32"
                      style={{ fill: "white" }}
                      width={18}
                      height={18}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m21.1646194 29.9911366c-1.0395126.0777702-2.0082016-.2969723-2.7011948-.9899673-.6219101-.2503929-4.0971422-8.8551025-4.4971895-9.5459404l6.646821-6.646822c.395977-.395978.3889008-1.0253134 0-1.4142132-.3959789-.395978-1.0182362-.395978-1.4142132 0l-6.646822 6.6468201-8.4994373-3.7759256c-1.3576331-.6081448-2.1566238-1.9445429-2.0435059-3.4294939.1201961-1.4778719 1.1243188-2.6799183 2.552645-3.0617409l21.0859309-5.6568974c1.2091236-.3181636 2.4607162.0141559 3.3446007.8980393.8768063.8768055 1.2091255 2.1283982.8909607 3.3375232l-5.6568527 21.0859737c-.3818227 1.4283253-1.5839139 2.4324051-3.0617429 2.5526444z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChatTabsList />
    </>
  );
};

export default Home;
