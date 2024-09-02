import React, { FC, useContext, useEffect } from "react";
import {
  ChatMessagePaylodObj,
  ChatSessionPaylodObj,
  EventPayloadObj,
} from "../Models";
import ChatMessage from "./ChatMessage";
import OperatorName from "./OperatorName";
import boticon from "../assets/img/chatbot-final.png";
import { AppContext } from "../appContext";
// import Timeago from "react-timeago";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

export interface AgentChatMessagePropsType {
  message: EventPayloadObj;
  sessionId?: number | string;
  // session: ChatSessionPaylodObj | undefined,
  formatMessageTime(): void;
}

const AgentChatMessage: FC<AgentChatMessagePropsType> = (props) => {
  const getMessageTime = () => {
    return props.message.createdTime + "Z";
  };

  const parentContext = useContext(AppContext);

  const agent = parentContext.agents?.find((agent) => {
    return agent.id === props.message.agentId;
  });

  return (
    <>
      <div className="chat__messages-group">
        {/* <div className="chat__messages-header">
      <p>
        <OperatorName
         agent_id={props.message.user_id}/>
        &nbsp; | &nbsp;
        <span 
          >
            <TimeAgo date={getmessageTime()} formatter={undefined} />
          </span>
      </p>


    </div> */}

        <div className="chat__messages-agent-info">
          <div className="chat__messages-agent">
            <div className="chat__messages-agent-avatar">
              <img
                src={
                  agent?.profile_img_url
                    ? agent?.profile_img_url
                    : parentContext.chatPrefs.meta.decoration.headerPictureUrl
                }
                alt="Avatar"
              />
            </div>

            <ul className="chat__messages-list">
              <li className="chat__messages-list-item">
                <ChatMessage
                  message={props.message}
                  sessionId={props.sessionId}
                  updateMessage={() => {}}
                />
              </li>
            </ul>
          </div>

          <div className="chat__messages-timestamp">
            {/* <>{getMessageTime()}</> */}
            <ReactTimeAgo
              date={new Date(getMessageTime())}
              locale="en-US"
              tooltip={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentChatMessage;
