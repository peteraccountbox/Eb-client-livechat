import React, { FC, useContext, useEffect } from "react";
import { ChatMessagePayloadObj } from "../Models";
import ChatMessage from "./ChatMessage";

import { AppContext } from "../appContext";
import TimeAgo from "./TimeAgo";

import { DEFAULT_BOT_ICON } from "../globals";

export interface GPTChatMessagePropsType {
  message: any;
  sessionId?: number | string;
  formatMessageTime(): void;
  updateMessage: (message: ChatMessagePayloadObj) => void;
  //   executeAiAction:
  //     | ((action: string, message?: string, aiInputMessage?: string) => void)
  //     | null;
}

const GPTChatMessage: FC<GPTChatMessagePropsType> = (props) => {
  const parentContext = useContext(AppContext);

  const getIcon = () => {
    if (parentContext.chatPrefs.matchedBotPrefs?.id)
      return parentContext.chatPrefs.matchedBotPrefs?.settings.chatBotIconURL;

    return DEFAULT_BOT_ICON;
  };

  return (
    <>
      <div className="chat__messages-group">
        <div className="chat__messages-agent-info">
          <div className="chat__messages-agent">
            <div className="chat__messages-agent-avatar">
              <img src={getIcon()} alt="Avatar" />
            </div>

            <ul className="chat__messages-list">
              <li className="chat__messages-list-item">
                <ChatMessage
                  sessionId={props.sessionId}
                  message={props.message}
                  updateMessage={props.updateMessage}
                  //   executeAiAction={
                  //     props.executeAiAction ? props.executeAiAction : null
                  //   }
                />
              </li>
            </ul>
          </div>

          <div className="chat__messages-timestamp">
            <TimeAgo time={props.message.createdTime} />
          </div>
        </div>
      </div>
    </>
  );
};

export default GPTChatMessage;
