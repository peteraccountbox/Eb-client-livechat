import React from 'react'
import { BotMessageList } from '../Models'
import BotMessageUI from './BotMessageUI'

interface UserBotReplyProps {  
    message:BotMessageList,
    nextMessage:BotMessageList,
    pushUserReponse:(message:BotMessageList) => void,
    getUserRespondedDialogue:(targetID:string) => void
}


const UserBotReply: React.FC<UserBotReplyProps> = (props) => {
  return (
    <div
    className="
      chat__messages-group
      chat__messages-group--me
      chat__messages-group--bot--me
    "
  >
    <div className="chat__messages-header">
      <p>
        {/* <!-- Status --> */}
        &nbsp;
        {props.message.status == 'SENDING' ?
        <span
          className="message-sent-status"
         
        >
          Sending ...</span
        > :
        <></>}

        {props.message.status == 'FAILED' ?
        <span className="message-sent-error" >
          Failed</span
        > :
        <></>}
      </p>
    </div>

    <ul className="chat__messages-list">
      <li className="chat__messages-list-item">
         <BotMessageUI message={props.message} 
         pushUserReponse={props.pushUserReponse} 
         getUserRespondedDialogue={props.getUserRespondedDialogue}/> 
      </li>
    </ul>
  </div>
  )
}

export default UserBotReply