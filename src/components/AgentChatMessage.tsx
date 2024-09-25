import React, { FC, useContext, useEffect } from "react";
import { ChatMessagePayloadObj, EventPayloadObj } from "../Models";
import ChatMessage from "./ChatMessage";
import OperatorName from "./OperatorName";
import boticon from "../assets/img/chatbot-final.png";
import { AppContext } from "../appContext";
import { DEFAULT_AGENT_PROFILE_PIC } from "../globals";
import TimeAgo from "./TimeAgo";

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

        <div className="chat__messages-agent-info chat__messages-agent-item">
          <div className="chat__messages-agent">
            <div className="chat__messages-agent-avatar">
              <img
                src={
                  agent && agent?.userPicURL
                    ? agent?.userPicURL
                    : DEFAULT_AGENT_PROFILE_PIC
                }
                alt={agent && agent.name ? agent.name : "Agent"}
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

          {/* <div className="chat__messages-timestamp"> */}
            {/* <>{getMessageTime()}</> */}
            {/* <TimeAgo time={props.message.createdTime} /> */}
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default AgentChatMessage;
