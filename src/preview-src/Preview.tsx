// import boticon from "./assets/img/chatbot-final.png";
import { FC, useMemo, useState } from "react";
import React from "react";
import { icons } from "../icons";
import PreviewListItem from "./PreviewListItem";

import { ChatPrefsPayloadType } from "../Models";
export interface PreviewComponentProps {
  chatPrefs: ChatPrefsPayloadType;
}

const Preview: FC<PreviewComponentProps> = (props) => {
  const { chatPrefs } = props;

  const settings = [{ tab: 'Messages' }];

  const logo = chatPrefs?.meta.decoration.headerPictureUrl
    ? chatPrefs.meta.decoration.headerPictureUrl
    : "https://cdn5.engagebay.com/assets/img/engagebay-brand-logo-white.svg";
  const [tab, setTab] = useState(settings ? settings[0]?.tab : "Messages");
  const appThemeStyle: Object = useMemo(() => {
    return {
      "--bottom": settings?.length < 2 ? "20px" : "125px",
      "--reduceHeight": settings?.length < 2 ? "135px" : "210px",
      "--themeColor":
        chatPrefs && chatPrefs.meta.decoration.mainColor
          ? chatPrefs.meta.decoration.mainColor
          : "blue",
      "--themeColor2":
        chatPrefs && chatPrefs.meta.decoration.mainColor
          ? chatPrefs.meta.decoration.mainColor
          : "red",
    };
  }, [chatPrefs]);
  const getStartConvButtonText = () => {
    if (chatPrefs.matchedBotPrefs?.id)
      return chatPrefs.matchedBotPrefs?.settings.newConversationBtnText;

    return "Start New";
  };

  const getLabel = (label: string) => {
    if (label == "Messages") return "Chats";
    if (label == "Help") return "Help Center";
    return label;
  };

  return (
    chatPrefs && (
      <div
        id="App"
        className={`engagebay-viewport ${!chatPrefs.meta.deactivated ? "hide" : ""
          } `}
        style={appThemeStyle}
      >
        <div
          className={`chat is-open
              ${chatPrefs.meta.decoration.widgetAlignment == "LEFT" ? "left" : ""} 
              ${chatPrefs.meta.decoration.widgetAlignment == "RIGHT" ? "right" : ""}`}
          data-target="widget"
        >
          <div className="chat__main">
            {tab != "Home" ? (
              <>
                <div className="chat__ticket">
                  <div className="chat__header">
                    <div className="chat__header-user">
                      <h3 className="chat__header-user-name">
                        {tab}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="list-view" style={{ overflow: "hidden" }}>
                  <PreviewListItem />
                  <PreviewListItem />
                  <PreviewListItem />
                  <PreviewListItem />
                  <PreviewListItem />
                  <PreviewListItem />
                </div>
                {tab == "Tickets" && (
                  <button className="chat__all-btn d-flex create_ticket_button">
                    <span>Create Ticket</span>
                  </button>
                )}
                {tab == "Messages" && (
                  <button
                    className="chat__all-btn"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {getStartConvButtonText()}
                    </span>
                    <svg
                      className="chat_send_icon"
                      id="fi_9290348"
                      enable-background="new 0 0 32 32"
                      viewBox="0 0 32 32"
                      style={{ fill: "white" }}
                      width={16}
                      height={16}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m21.1646194 29.9911366c-1.0395126.0777702-2.0082016-.2969723-2.7011948-.9899673-.6219101-.2503929-4.0971422-8.8551025-4.4971895-9.5459404l6.646821-6.646822c.395977-.395978.3889008-1.0253134 0-1.4142132-.3959789-.395978-1.0182362-.395978-1.4142132 0l-6.646822 6.6468201-8.4994373-3.7759256c-1.3576331-.6081448-2.1566238-1.9445429-2.0435059-3.4294939.1201961-1.4778719 1.1243188-2.6799183 2.552645-3.0617409l21.0859309-5.6568974c1.2091236-.3181636 2.4607162.0141559 3.3446007.8980393.8768063.8768055 1.2091255 2.1283982.8909607 3.3375232l-5.6568527 21.0859737c-.3818227 1.4283253-1.5839139 2.4324051-3.0617429 2.5526444z"></path>
                    </svg>
                  </button>
                )}
              </>
            ) : (
              <div className="home__feeds-main-wrapper">
                <div className="home__feeds-main">
                  <div className="home__feeds-bg-primary">
                    <div className="home__feeds-bg-shadow"></div>
                  </div>
                  <div className="home__feeds-body">
                    <div className="home__feeds-header">
                      <div className="home__feeds-logo-brand">
                        <img src={logo} alt="Logo" />
                      </div>
                    </div>

                    <div className="home__feeds-home-title">
                      {chatPrefs?.meta.decoration.introductionText ? (
                        <>
                          {chatPrefs.meta.decoration.introductionText
                            .split("\n")
                            .map((line, index) => {
                              return index == 0 ? (
                                <h1>{line}</h1>
                              ) : (
                                <h2>{line}</h2>
                              );
                            })}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  <div className="home__feeds-cards-sec">
                    <div className="home__feeds-send-card">
                      <div className="home__feeds-media">
                        <div className="home__feeds-media-content">
                          <h5>Start Conversation</h5>
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
            )}
            {settings && settings.length > 1 && (
              <div className="chat__tabs-footer">
                <div className="chat__tabs-bottom-bar">
                  {settings.map((footerTab) => {
                    return (
                      <div
                        className={`chat__tabs-nav-link ${footerTab.tab == tab ? "active" : ""
                          }`}
                        onClick={() => setTab(footerTab.tab)}
                      >
                        <div className="chat__tabs-icon">
                          {footerTab.tab == tab
                            ? icons["active" + footerTab.tab]
                            : icons[footerTab.tab]}
                        </div>
                        <span className="chat__tabs-title">
                          {getLabel(footerTab.tab)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {!chatPrefs.isWhiteLabelEnabled && (
                  <div className="chat__powered__by-footer">
                    <a href="javascript:void(0);">Powered by EngageBay</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div
          className={`chat__trigger ${!chatPrefs.meta.deactivated ? "" : "hide"
            } ${chatPrefs.meta.decoration.widgetAlignment == "LEFT" ? "left" : ""} ${chatPrefs.meta.decoration.widgetAlignment == "RIGHT" ? "right" : ""
            } chat-opend`}
        >
          <div className="close_chat_bubble">
            <svg
              className="close-chat-icon"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.601 8.39897C18.269 8.06702 17.7309 8.06702 17.3989 8.39897L12 13.7979L6.60099 8.39897C6.26904 8.06702 5.73086 8.06702 5.39891 8.39897C5.06696 8.73091 5.06696 9.2691 5.39891 9.60105L11.3989 15.601C11.7309 15.933 12.269 15.933 12.601 15.601L18.601 9.60105C18.9329 9.2691 18.9329 8.73091 18.601 8.39897Z"
                fill="white"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    )
  );
};
export default Preview;
