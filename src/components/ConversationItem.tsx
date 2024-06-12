import React, { FC } from "react";
import AgentChatMessage from "./AgentChatMessage";
import GPTChatMessage from "./GPTChatMessage";
import UserChatMessage from "./UserChatMessage";
import Notice from "./Notice";
import {
  ChatFromFieldDataPayLoad,
  ChatMessagePaylodObj,
  ChatSessionPaylodObj,
  MessageByTypeEnum,
} from "../Models";

export interface ConversationItemPropsType {
  message: ChatMessagePaylodObj;
  session: ChatSessionPaylodObj | undefined;
  nextMessage: ChatMessagePaylodObj | undefined;
  formFields: ChatFromFieldDataPayLoad[];
  updateMessage: (message: ChatMessagePaylodObj) => void;
}

const ConversationItem: FC<ConversationItemPropsType> = (props) => {
  const formatMessageTime = () => {
    if (!props.message || !props.message.created_time) return;
    return props.message.created_time * 1000;
  };

  const from = MessageByTypeEnum[
    props.message.from
  ] as unknown as MessageByTypeEnum;

  return (
    <>
      {from === MessageByTypeEnum.Agent ? (
        <AgentChatMessage
          sessionId={props.session?.id}
          message={props.message}
          formatMessageTime={formatMessageTime}
        />
      ) : (
        <></>
      )}

      {from === MessageByTypeEnum.System &&
      props.message.system_message_type === "PROACTIVE_SYSTEM_MESSAGE" ? (
        <AgentChatMessage
          sessionId={props.session?.id}
          message={props.message}
          formatMessageTime={formatMessageTime}
        />
      ) : (
        <></>
      )}

      {from === MessageByTypeEnum.GPT ? (
        <GPTChatMessage
          sessionId={props.session?.id}
          message={props.message}
          formatMessageTime={formatMessageTime}
          updateMessage={props.updateMessage}
        />
      ) : (
        <></>
      )}

      {from === MessageByTypeEnum.Visitor ? (
        <UserChatMessage
          message={props.message}
          sessionId={props.session?.id}
          nextMessage={props.nextMessage}
        />
      ) : (
        <></>
      )}

      {from === MessageByTypeEnum.System &&
      props.message.system_message_type != "PROACTIVE_SYSTEM_MESSAGE" ? (
        <Notice message={props.message} formFields={props.formFields} />
      ) : (
        <></>
      )}
    </>
  );
};

export default ConversationItem;
