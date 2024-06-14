import React, { FC } from 'react'
import { ChatFromFieldDataPayLoad, ChatMessagePaylodObj, ChatSessionPaylodObj, MessageByTypeEnum } from '../Models'
import { getSystemMessage } from '../Utils';

export interface NoticePropsType {
  message: ChatMessagePaylodObj,
  // session: ChatSessionPaylodObj | undefined,
  formFields: ChatFromFieldDataPayLoad[],
}

const Notice: FC<NoticePropsType> = (props) => {
  const from = MessageByTypeEnum[props.message.from] as unknown as MessageByTypeEnum;

  const getSystemMessageNotice = (message: any) => {
    if (
      message &&
      message.from === "System" &&
      (!message.message ||
        message.SYSTEM_message_type === "CHAT_SESSION_CLOSED")
    )
      return getSystemMessage(message.SYSTEM_message_type);

    return message.message;
  }

  return (
    <div className="chat__messages-notice" >
      {getSystemMessageNotice(props.message)}
    </div>
  )
}

export default Notice