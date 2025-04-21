import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./appContext";
import ChatTabsList from "./components/ChatTabsList";
import Conversation from "./components/Conversation";
import ConversationList from "./components/ConversationList";
import { ChatMessagePayloadObj, ChatSessionPaylodObj } from "./Models";
import {
  getSessionStoragePrefs,
  removeSessionStoragePrefs,
  setSessionStoragePrefs,
} from "./Storage";
import { OPENED_CHAT, OPENED_FLOW, TRACK_MANAGE } from "./globals";
import InteractiveFlow from "./components/InteractiveFlow";

enum LivechatComponentNames {
  ConversationList = "ConversationList",
  Conversation = "Conversation",
  Flow = "Flow",
}

export type LivechatComponentProps = {
  loadingSessions: boolean;
  startNewChat: (initialMessage?: string | undefined) => void;
  backToHome: () => void;
  openChat: (id: string) => void;
  addNewSession: (session: ChatSessionPaylodObj) => void;
};

export default function LiveChat({
  loadingSessions,
  startNewChat,
  backToHome,
  openChat,
  addNewSession,
}: LivechatComponentProps) {
  // const parentContext = useContext(AppContext);
  // const { sessions, setSessions } = parentContext;

  let componentName = LivechatComponentNames.ConversationList;
  if (getSessionStoragePrefs(OPENED_CHAT) != null) {
    componentName = LivechatComponentNames.Conversation;
  } else if (getSessionStoragePrefs(OPENED_FLOW) != null) {
    componentName = LivechatComponentNames.Flow;
  }

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

  const showConversation = () => {
    setActiveComponentName(LivechatComponentNames.Conversation);
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
                  backToHome={backToHome}
                />
              );
            } else if (activeComponentName === LivechatComponentNames.Flow) {
              return (
                <InteractiveFlow
                  addNewSession={addNewSession}
                  showConversation={showConversation}
                  backToHome={backToHome}
                />
              );
            } else {
              return <>None</>;
            }
          })()}
        </>
      )}

      {activeComponentName == LivechatComponentNames.ConversationList ? (
        <ChatTabsList />
      ) : (
        <></>
      )}
    </>
  );
}
