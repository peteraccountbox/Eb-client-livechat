import React from 'react'
import { BotDetails, BotMessageList } from '../Models'
import BotMessage from './BotMessage'
import UserBotReply from './UserBotReply'

interface ChatBotItemProps {
  messageList: BotMessageList[],
  message: BotMessageList,
  nextMessage: BotMessageList,
  getUserRespondedDialogue: (targetID: string) => void,
  botDetails: BotDetails,
  setBotDetails(arg: BotDetails): void,
  setConversationStorage: () => void,
}

const ChatBotItem: React.FC<ChatBotItemProps> = (props) => {

  const pushUserReponse = (message: BotMessageList) => {
    let msg = JSON.parse(JSON.stringify(message));
    // ("message", msg);

    msg.from = "Visitor";
    msg.message_type = "TEXT";
    msg.dialogueId = message.id;
    msg.id = new Date().getTime();
    props.messageList.push(msg);

    props.setBotDetails({ ...props.botDetails })
    // this.$parent.$parent.setScrollBottom();
  }
  return (
    <div>
      {props.message.from == 'Agent' ?
        <BotMessage message={props.message}
          pushUserReponse={pushUserReponse}
          getUserRespondedDialogue={props.getUserRespondedDialogue} /> :
        <></>}
      {props.message.from == 'Visitor' ?
        <UserBotReply message={props.message}
          nextMessage={props.nextMessage}
          pushUserReponse={pushUserReponse}
          getUserRespondedDialogue={props.getUserRespondedDialogue}
        /> :
        <></>}
    </div>
  )
}

export default ChatBotItem