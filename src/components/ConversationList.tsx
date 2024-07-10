import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import HeaderAction from "./HeaderAction";
import ConversationListItem from "./ConversationListItem";
import { ChatSessionPaylodObj } from "../Models";
import { AppContext } from "../appContext";
import CloseWidgetPanel from "./CloseWidgetPanel";

export interface ConversationListProps {
  startNewChat: () => void;
  openChat: (id: string) => void;
}

const ConversationList = ({
  startNewChat,
  openChat,
}: ConversationListProps) => {
  const parentContext = useContext(AppContext);
  const { sessions } = parentContext;

  // const [sessionList, setSessionList] = useState<ChatSessionPaylodObj[]>();

  const sortedSessions: ChatSessionPaylodObj[] | undefined = useMemo(() => {
    function compare(a: ChatSessionPaylodObj, b: ChatSessionPaylodObj) {
      if (new Date(a.updatedTime).valueOf() < new Date(b.updatedTime).valueOf())
        return 1;
      if (new Date(a.updatedTime).valueOf() > new Date(b.updatedTime).valueOf())
        return -1;
      return 0;
    }
    return sessions?.sort(compare);
  }, [sessions]);

  const openChatConversation = (id: string) => {
    openChat(id);
  };

  const getHeaderText = () => {
    // if (parentContext.chatPrefs.matchedBotPrefs?.id)
    //   return parentContext.chatPrefs.matchedBotPrefs?.name;
    if (parentContext.chatPrefs.name) return parentContext.chatPrefs.name;

    return "Header Text";
  };

  const getStartConvButtonText = () => {
    if (parentContext.chatPrefs.matchedBotPrefs?.id)
      return parentContext.chatPrefs.matchedBotPrefs?.settings
        .newConversationBtnText;

    return "start new chat";
  };

  return (
    <div className="chat__all is-open" data-target="all">
      <div className="chat__header">
        <div className="chat__help-action"></div>
        <div className="chat__header-user">
          <h3 className="chat__header-user-name"> {getHeaderText()} </h3>
        </div>
        <div className="chat__help-end">
          <CloseWidgetPanel />
        </div>
      </div>

      <div className="chat__all-messages">
        {sortedSessions?.length ? (
          <div className="chat__all-messages-body">
            <div className="chat__all-messages-body-track">
              {sortedSessions.map(
                (session: ChatSessionPaylodObj, index: number) => (
                  <ConversationListItem
                    session={session}
                    openChatConversation={openChatConversation}
                    key={session.id}
                    // updateSession={updateSession}
                  />
                )
              )}
            </div>
            <div className="chat__all-messages-bottom-shadow"></div>
          </div>
        ) : (
          <div className="chat__all-messages-track no_messages_content">
            <div className="no_messages">
              <img
                className="pad-no-content-img"
                src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/livechat/no-chats-yet.svg"
                alt="No Tickets"
              />
              <h2 className="pad-content-title">No Chats</h2>
              <p className="pad-text">No Messages</p>
            </div>
          </div>
        )}
      </div>

      <button
        className="chat__all-btn"
        onClick={() => startNewChat()}
        style={{ display: "flex", alignItems: "center" }}
      >
        {/* {parentContext.chatPrefs.widget.new_conversation_btn_text} */}
        <span style={{ marginRight: "5px" }}>{getStartConvButtonText()}</span>
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
    </div>
  );
};

export default ConversationList;
