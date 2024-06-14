import React, { useContext } from "react";
import { widgetFooterTabs } from "../App";
import { AppContext } from "../appContext";
import { icons } from "../icons";
import { ChatFooterDataPayload } from "../Models";

const ChatTabsList = (props: any) => {
  const parentContext = useContext(AppContext);

  const { chatPrefs, activeTab, changeActiveTab } = parentContext;

  const footerTabs = [{
    tab: "Messages",
    enable: true
  }];

  const getLabel = (label: string) => {
    if (label == "Messages") return "Chats";
    if (label == "Help") return "Help Center";
    return label;
  };
  return (
    <div className="chat__tabs-footer">
      <div className="chat__tabs-bottom-bar">
        {footerTabs.map((footerTab: ChatFooterDataPayload) => {
          return (
            <div
              className={`chat__tabs-nav-link ${footerTab.tab == activeTab ? "active" : ""
                }`}
              onClick={() => changeActiveTab(footerTab.tab as widgetFooterTabs)}
            >
              <div className="chat__tabs-icon">
                {footerTab.tab == activeTab
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
          <a
            target="_blank"
            href="https://www.engagebay.com/?utm_source=powered-by&amp;utm_medium=widget&amp;utm_campaign=www-engagebay-com"
          >
            Powered by EngageBay
          </a>
        </div>
      )}
    </div>
  );
};

export default ChatTabsList;
