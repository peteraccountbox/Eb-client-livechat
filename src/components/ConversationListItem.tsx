import React, { FC, useContext, useEffect, useState } from "react";
import { AppContext } from "../appContext";
import {
  AgentPaylodObj,
  ChatSessionPaylodObj,
  MessageByTypeEnum,
} from "../Models";
// import TimeAgo from 'react-timeago'

import { DEFAULT_AGENT_PROFILE_PIC } from "../globals";
import TimeAgo from "./TimeAgo";

interface ConversationListItemProp {
  session: ChatSessionPaylodObj;
  openChatConversation(id: string): void;
  // openBotConversation: (id: string) => void,
  // updateSession: () => void,
}

const ConversationListItem: FC<ConversationListItemProp> = (props) => {
  const parentContext = useContext(AppContext);
  const setSessions = parentContext.setSessions;
  const sessions = parentContext.sessions;
  // const from = MessageByTypeEnum[
  //   props.session.messageList[props.session.messageList.length - 1]?.from
  // ] as unknown as MessageByTypeEnum;
  const from = MessageByTypeEnum.CUSTOMER;

  const [agentTypingTimer, setAgentTypingTimer] = useState<any>(null);
  // useEffect(() => {

  //   setTimeout(function () {
  //     if (!props.session) return;

  //     // console.log(that.session.id, that.session.typing);
  //     props.session.typing = false;
  //     props.updateSession();
  //   }, 3000);
  // }, [props.session.typing_alert])

  // const getLatestChat = (): ChatMessagePaylodObj | undefined => {
  //   try {
  //     // if (props.session.type == "BOT") {
  //     return props.session.messageList[props.session.messageList.length - 1];
  //     //}
  //     // return this.session.messageList[this.session.messageList.length - 1];
  //   } catch (error) {
  //     return undefined;
  //   }
  // };

  // const getLatestMessage = () => {
  //   try {
  //     let mssg: ChatMessagePaylodObj | undefined = getLatestChat();
  //     if (
  //       mssg &&
  //       mssg.from === MessageByTypeEnum.SYSTEM &&
  //       (!mssg.message || mssg.SYSTEM_message_type === "CHAT_SESSION_CLOSED")
  //     )
  //       return (
  //         mssg.SYSTEM_message_type && getSystemMessage(mssg.SYSTEM_message_type)
  //       );

  //     return mssg?.message;
  //   } catch (error) {}
  // };

  // const clickOpenBotConversation = () => {
  //   props.openBotConversation(props.session.conversationId)
  // }

  const clickOpenChatConversation = () => {
    props.session.unRead = 0;
    props.openChatConversation(props.session.id + "");
  };

  const getMessageTime = () => {
    try {
      if (!props.session.lastMessageAt) return undefined;

      return new Date(props.session.lastMessageAt + "Z");
    } catch (e) {
      console.log("Issue getMessageTime", e);
      return new Date().getTime();
    }
  };

  const getImage = () => {
    if (
      !props.session.agentId ||
      !props.session.agentId ||
      parentContext.agents?.length == 0 ||
      !parentContext.agents?.find((agent) => agent.id == props.session.agentId)
    )
      return DEFAULT_AGENT_PROFILE_PIC;

    const agent: AgentPaylodObj | undefined = parentContext.agents.find(
      (agent) => agent.id == props.session.agentId
    );
    return agent?.userPicURL || DEFAULT_AGENT_PROFILE_PIC;

    // const lastMessage = getLatestChat();
    // if (!lastMessage)
    // return parentContext.chatPrefs.meta.decoration.headerPictureUrl;

    // if (
    //   props.session.lastAgentMessageAt &&
    //   props.session.lastMessageAt == props.session.lastAgentMessageAt
    // ) {
    //   const agent = parentContext.agents?.find((agent) => {
    //     return agent.id === props.session.assignedToAgentId;
    //   });
    //   return agent && agent.userPicURL
    //     ? agent.userPicURL
    //     : DEFAULT_AGENT_PROFILE_PIC;
    // }
    // else if (lastMessage.from == MessageByTypeEnum.GPT) {
    //   const bot = parentContext.chatPrefs.botPrefs?.find((bot) => {
    //     return bot.id === lastMessage.gpt_bot_id;
    //   });
    //   return bot && bot.settings.chatBotIconURL
    //     ? bot.settings.chatBotIconURL
    //     : parentContext.chatPrefs.meta.decoration.botAvatarImage;
    // }

    // return parentContext.chatPrefs.meta.decoration.headerPictureUrl;
  };

  const getName = (): string => {
    // const lastMessage = getLatestChat();
    // console.log(lastMessage, " lastMessage");
    // if (!lastMessage) return "";

    if (
      props.session.lastAgentMessageAt &&
      props.session.lastMessageAt == props.session.lastAgentMessageAt
    ) {
      const agent = parentContext.agents?.find((agent) => {
        return agent.id == props.session.assignedToAgentId;
      });
      return agent && agent.name ? agent.name : "Agent";
    }

    if (
      props.session.lastCustomerMessageAt &&
      props.session.lastMessageAt == props.session.lastCustomerMessageAt
    )
      return "You";
    // else if (lastMessage.from == MessageByTypeEnum.GPT) {
    //   const bot = parentContext.chatPrefs.botPrefs?.find((bot) => {
    //     return bot.id === lastMessage.gpt_bot_id;
    //   });
    //   return bot && bot.name ? bot.name : "Bot";
    // } else if (lastMessage.from == MessageByTypeEnum.SYSTEM) {
    //   return "Operator";
    // }

    return "System";
  };

  useEffect(() => {
    clearTimer();
    if (!props.session.typing) return;
    resetTimer();
  }, [props.session.typing]);

  useEffect(() => {
    clearTimer();
    resetTimer();
  }, [props.session.typing_alert]);

  const clearTimer = () => {
    if (agentTypingTimer) clearTimeout(agentTypingTimer);

    // console.log("clearTimer", this.agentTypingTimer);
    setAgentTypingTimer(null);
  };

  const resetTimer = () => {
    const typingTimer = setTimeout(function () {
      if (!props.session) return;

      props.session.typing = false;
      setSessions([...sessions]);
    }, 3000);
    setAgentTypingTimer(typingTimer);
  };

  return (
    <>
      <div
        className={`chat__all-messages-item`}
        data-trigger="all"
        onClick={() => clickOpenChatConversation()}
      >
        <div className="chat__all-messages-item-avatar">
          <div
            className="chat__all-messages-item-profile"
            style={{ backgroundImage: 'url("' + getImage() + '")' }}
          >
            &nbsp;
          </div>
        </div>

        <div className="chat__all-messages-item-copy">
          <div className="chat__all-messages-item-main">
            {/* { */}
            {/* props.session.typing ||
            getLatestChat()?.message_type === "FETCHING" ? ( */}
            <>
              <div
              // data-a={JSON.stringify(getLatestChat())}
              >
                {props.session.lastMessage}
              </div>
              {/* <TypingLoader /> */}
            </>
            {/* ) : (
               <> */}
            {/* <p className={`${props.session.unRead > 0 ? "unRead" : ""}`}>
                  {getLatestChat()?.message_type == "TEXT" ||
                    from == MessageByTypeEnum.SYSTEM ? (
                    getLatestMessage()
                  ) : (
                    <></>
                  )}
                </p> */}

            {/* <p>
                  {getLatestChat()?.message_type == "FILE" ? (
                    <>
                      File{" "}
                      {from == MessageByTypeEnum.CUSTOMER ? (
                        <span>Sent</span>
                      ) : (
                        <span>Received</span>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </p> */}
            {/* </>
             )
          } */}
          </div>
          <div className="chat__all-messages-item-header">
            <p className="chat-messages-username"> {getName()}</p>
            <p className="chat__all-messages-item-header-timegao">
              <TimeAgo date={getMessageTime()} />
            </p>
          </div>
        </div>

        <div>
          {props.session.customerUnreadMessagesCount > 0 ? (
            <span className="chat__all-btn chat_notifications_count">
              {props.session.customerUnreadMessagesCount}
            </span>
          ) : (
            <></>
          )}
        </div>

        <div className="chat__all-messages-item-arrow">
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
    </>
  );
};

export default ConversationListItem;
