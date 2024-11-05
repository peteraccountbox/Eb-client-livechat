import { FC, useContext, useMemo, useState } from "react";
import React from "react";
import { icons } from "../icons";
import PreviewListItem from "./PreviewListItem";

import { ChatPrefsPayloadType } from "../Models";
import CloseWidgetPanel from "../components/CloseWidgetPanel";
import PreviewFlowListItem from "./PreviewFlowListItem";
export interface PreviewComponentProps {
  chatPrefs: ChatPrefsPayloadType;
}

const Preview: FC<PreviewComponentProps> = (props) => {
  const { chatPrefs } = props;

  const settings = [{ tab: "Messages" }];

  const appThemeStyle: Object = useMemo(() => {
    return {
      "--bottom": settings?.length < 2 ? "20px" : "125px",
      "--reduceHeight": settings?.length < 2 ? "135px" : "210px",
      "--themeColor":
        chatPrefs && chatPrefs.meta.decoration.mainColor
          ? chatPrefs.meta.decoration.mainColor
          : "blue",
      // "--themeColor2":
      //   chatPrefs && chatPrefs.meta.decoration.mainColor
      //     ? chatPrefs.meta.decoration.mainColor
      //     : "red",
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
        className={`engagebay-viewport ${
          !chatPrefs.meta.deactivated ? "" : "hide"
        } `}
        style={appThemeStyle}
      >
        <div
          className={`chat is-open
              ${
                chatPrefs.meta.decoration.widgetAlignment == "bottom left"
                  ? "left"
                  : ""
              }
              ${
                chatPrefs.meta.decoration.widgetAlignment == "bottom right"
                  ? "right"
                  : ""
              }`}
          data-target="widget"
        >
          <div className="chat__main">
            <div className="home__feeds-main-wrapper">
              <div className="home__feeds-main">
                <div className="home__feeds-bg-primary">
                  <div className="home__feeds-bg-shadow"></div>
                </div>
                <div className="home__feeds-body">
                  <div className="home__feeds-header">
                    {/* <div className="home__feeds-logo-brand">
                      <img
                        src={
                          "https://cdn5.engagebay.com/assets/img/engagebay-brand-logo-white.svg"
                        }
                        alt="Logo"
                      />
                    </div> */}
                    {chatPrefs.meta.decoration.headerPictureUrl ? (
                      <img
                        style={{
                          width: "4rem",
                          height: "4rem",
                          borderRadius: "5px",
                        }}
                        src={chatPrefs.meta.decoration.headerPictureUrl}
                      />
                    ) : (
                      chatPrefs.name
                    )}
                    <div className="chat__help-end">
                      <CloseWidgetPanel />
                    </div>
                  </div>

                  <div className="home__feeds-home-title">
                    {chatPrefs.meta.decoration.introductionText}
                  </div>
                </div>
                <div className="home__feeds-cards-main">
                  <div className="home__feeds-cards-sec">
                    {/* <div className="home__feeds-send-card home__feeds-recent-card">
                      <div className="home__feeds-media">
                        <div className="home__feeds-media-content">
                          <PreviewFlowListItem />
                          <PreviewFlowListItem />
                        </div>
                      </div>
                    </div> */}
                {chatPrefs.flowNames && chatPrefs.flowNames.length > 0 && (
                <>
                  <div className="home__feeds-send-card home__feeds-flow-list-card home__feeds-recent-card">
                    <div className="home__feeds-media">
                      <div className="home__feeds-media-content">
                        {chatPrefs.flowNames.map(
                          (flowName: string, index: number) => {
                            return (
                              <div
                                className="home__feeds-flow-list"
                              >
                                <div className="home__feeds-flow-list-title">
                                  <span>{flowName}</span>
                                </div>
                                <div className="home__feeds-flow-list-arrow">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M5.42773 4.70898C5.46387 4.85254 5.53809 4.98828 5.65039 5.10059L8.54932 8L5.64893 10.9004C5.31689 11.2324 5.31689 11.7705 5.64893 12.1025C5.98096 12.4336 6.51904 12.4336 6.85107 12.1025L10.3516 8.60059C10.5591 8.39355 10.6367 8.10449 10.585 7.83691C10.5537 7.67578 10.4761 7.52246 10.3516 7.39844L6.85254 3.89941C6.52051 3.56738 5.98242 3.56738 5.65039 3.89941C5.43066 4.11816 5.35645 4.42871 5.42773 4.70898Z"
                                      fill="#000000"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {chatPrefs.managementName && (
                <>
                  <div className="home__feeds-send-card home__feeds-recent-card order__management-card">
                    <div
                      className="home__feeds-media order__management-card-media"
                    >
                      <div className="order__management-card-profile flex-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          role="img"
                        >
                          <path d="M11.9311 3.08561C11.7334 2.97146 11.4129 2.97146 11.2152 3.08561L4.77137 6.80594C4.57365 6.92009 4.57365 7.10516 4.77137 7.21931L7.27729 8.66611C7.37614 8.72318 7.53642 8.72318 7.63528 8.66611L14.4371 4.73909C14.5359 4.68202 14.5359 4.58948 14.4371 4.53241L11.9311 3.08561Z"></path>
                          <path d="M15.869 5.35915C15.7702 5.30207 15.6099 5.30207 15.511 5.35915L8.70924 9.28616C8.61039 9.34324 8.61039 9.43577 8.70924 9.49285L11.2152 10.9396C11.4129 11.0538 11.7334 11.0538 11.9311 10.9396L18.3749 7.21931C18.5727 7.10516 18.5727 6.92009 18.3749 6.80594L15.869 5.35915Z"></path>
                          <path d="M11.9865 12.3038C11.9865 12.0755 12.1468 11.7979 12.3445 11.6837L18.7883 7.96338C18.986 7.84923 19.1463 7.94176 19.1463 8.17006V15.6107C19.1463 15.839 18.986 16.1166 18.7883 16.2308L12.3445 19.9511C12.1468 20.0653 11.9865 19.9727 11.9865 19.7444V12.3038Z"></path>
                          <path d="M4 8.17006C4 7.94176 4.16028 7.84923 4.35799 7.96338L6.86391 9.41017C6.96277 9.46725 7.04291 9.60605 7.04291 9.7202V11.3737C7.04291 11.4878 7.12304 11.6266 7.2219 11.6837L7.93788 12.0971C8.03673 12.1542 8.11687 12.1079 8.11687 11.9937V10.3403C8.11687 10.2261 8.19701 10.1798 8.29587 10.2369L10.8018 11.6837C10.9995 11.7979 11.1598 12.0755 11.1598 12.3038V19.7444C11.1598 19.9727 10.9995 20.0653 10.8018 19.9511L4.35799 16.2308C4.16028 16.1166 4 15.839 4 15.6107L4 8.17006Z"></path>
                        </svg>
                      </div>
                      <div className="home__feeds-media-content">
                        <div className="order__management-card-name">
                          {chatPrefs.managementName}
                        </div>
                      </div>

                      <div className="order__management-card-arrow">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M5.42773 4.70898C5.46387 4.85254 5.53809 4.98828 5.65039 5.10059L8.54932 8L5.64893 10.9004C5.31689 11.2324 5.31689 11.7705 5.64893 12.1025C5.98096 12.4336 6.51904 12.4336 6.85107 12.1025L10.3516 8.60059C10.5591 8.39355 10.6367 8.10449 10.585 7.83691C10.5537 7.67578 10.4761 7.52246 10.3516 7.39844L6.85254 3.89941C6.52051 3.56738 5.98242 3.56738 5.65039 3.89941C5.43066 4.11816 5.35645 4.42871 5.42773 4.70898Z"
                            fill="#000000"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}
{(chatPrefs.managementName ||
              
              (chatPrefs?.flowNames  && chatPrefs?.flowNames.length)) &&
                    <div className="home__feeds-send-card home__feeds-recent-card">
                      <div className="home__feeds-media">
                        <div className="home__feeds-media-content">
                          <h4
                            className={`${false ? "unRead" : ""}`}
                            style={{ cursor: "auto" }}
                          >
                            Recent conversation
                          </h4>
                          <PreviewListItem />
                          <PreviewListItem />
                          <PreviewListItem />
                          <PreviewListItem />
                          <PreviewListItem />
                        </div>
                      </div>
                    </div>}


{!chatPrefs.managementName &&
              
              (!chatPrefs?.flowNames  || !chatPrefs?.flowNames.length) ? (
                <div className="home__feeds-no-data-send-card">
                  <h5 className="home__feeds-no-data-send-card-title">
                    Begin the Conversation
                  </h5>
                  <div
                    className="home__feeds-send-card"
                    // onClick={() => startNewChat()}
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
              ) : (
                <div
                  className="home__feeds-send-card"
                  // onClick={() => startNewChat()}
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
              )}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`chat__trigger ${
            !chatPrefs.meta.deactivated ? "" : "hide"
          } ${
            chatPrefs.meta.decoration.widgetAlignment == "bottom left"
              ? "left"
              : ""
          } ${
            chatPrefs.meta.decoration.widgetAlignment == "RIGHT" ? "right" : ""
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
