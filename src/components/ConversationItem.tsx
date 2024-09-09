import React, { FC } from "react";
import AgentChatMessage from "./AgentChatMessage";
import UserChatMessage from "./UserChatMessage";
import Notice from "./Notice";
import {
  ChatFromFieldDataPayLoad,
  ChatMessagePayloadObj,
  ChatSessionPaylodObj,
  EventPayloadObj,
  MessageByTypeEnum,
} from "../Models";

export interface ConversationItemPropsType {
  message: EventPayloadObj;
  session: ChatSessionPaylodObj | undefined;
  nextMessage: EventPayloadObj | undefined;
  // formFields: ChatFromFieldDataPayLoad[];
  updateMessage: (message: ChatMessagePayloadObj) => void;
}

const ConversationItem: FC<ConversationItemPropsType> = (props) => {
  const formatMessageTime = () => {
    if (!props.message || !props.message.message.created_time) return;
    return props.message.message.created_time * 1000;
  };

  const from = MessageByTypeEnum[
    props.message.from
  ] as unknown as MessageByTypeEnum;

  return (
    <>
      {from === MessageByTypeEnum.AGENT ? (
        <AgentChatMessage
          sessionId={props.session?.id}
          message={props.message}
          formatMessageTime={formatMessageTime}
        />
      ) : (
        <></>
      )}

      {from === MessageByTypeEnum.SYSTEM &&
      props.message.SYSTEM_message_type === "PROACTIVE_SYSTEM_MESSAGE" ? (
        <AgentChatMessage
          sessionId={props.session?.id}
          message={props.message}
          formatMessageTime={formatMessageTime}
        />
      ) : (
        <></>
      )}

      {from === MessageByTypeEnum.GPT ? (
        <></>
      ) : (
        // <GPTChatMessage
        //   sessionId={props.session?.id}
        //   message={props.message.message}
        //   formatMessageTime={formatMessageTime}
        //   updateMessage={props.updateMessage}
        // />
        <></>
      )}

      {from === MessageByTypeEnum.CUSTOMER ? (
        <UserChatMessage
          message={props.message}
          sessionId={props.session?.id}
          nextMessage={props.nextMessage}
        />
      ) : (
        <></>
      )}

      {from === MessageByTypeEnum.SYSTEM &&
      props.message.SYSTEM_message_type != "PROACTIVE_SYSTEM_MESSAGE" ? (
        <Notice
          message={props.message.message}
          //  formFields={props.formFields}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default ConversationItem;
