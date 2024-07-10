import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./appContext";
import ChatTabsList from "./components/ChatTabsList";
import Conversation from "./components/Conversation";
import ConversationList from "./components/ConversationList";
import { ChatMessagePaylodObj, ChatSessionPaylodObj } from "./Models";
import {
  getSessionStoragePrefs,
  removeSessionStoragePrefs,
  setSessionStoragePrefs,
} from "./Storage";
import { OPENED_CHAT } from "./globals";

enum LivechatComponentNames {
  ConversationList = "ConversationList",
  Conversation = "Conversation",
}

export type LivechatComponentProps = {
  loadingSessions: boolean;
  startNewChat: (initialMessage?: string | undefined) => void;
  openChat: (id: string) => void;
  addNewSession: (session: ChatSessionPaylodObj) => void;
};

export default function LiveChat({
  loadingSessions,
  startNewChat,
  openChat,
  addNewSession,
}: LivechatComponentProps) {
  // const parentContext = useContext(AppContext);
  // const { sessions, setSessions } = parentContext;

  let componentName =
    getSessionStoragePrefs(OPENED_CHAT) != null
      ? LivechatComponentNames.Conversation
      : LivechatComponentNames.ConversationList;

  const [activeComponentName, setActiveComponentName] =
    useState<LivechatComponentNames>(
      LivechatComponentNames[componentName as LivechatComponentNames]
    );

  useEffect(() => {
    // setSessionStoragePrefs("chat_active_component", activeComponentName);
  }, [activeComponentName]);

  const showChatList = () => {
    removeSessionStoragePrefs(OPENED_CHAT);
    setActiveComponentName(LivechatComponentNames.ConversationList);
  };

  return (
    <>
      {loadingSessions && !startNewChat ? (
        <>
          <div className="chat__header"></div>
          <div className="chat__all-messages-track">
            <p style={{ marginTop: "60px", textAlign: "center" }}>
              <div className="chat__form-loader1">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </p>
          </div>
        </>
      ) : (
        <>
          {(() => {
            if (
              activeComponentName === LivechatComponentNames.ConversationList
            ) {
              return (
                <ConversationList
                  openChat={openChat}
                  startNewChat={startNewChat}
                />
              );
            } else if (
              activeComponentName === LivechatComponentNames.Conversation
            ) {
              return (
                <Conversation
                  showChatsList={showChatList}
                  addNewSession={addNewSession}
                />
              );
            } else {
              return <>None</>;
            }
          })()}
        </>
      )}

      {/* {activeComponentName == LivechatComponentNames.ConversationList ? (
        <ChatTabsList />
      ) : (
        <></>
      )} */}
    </>
  );
}
