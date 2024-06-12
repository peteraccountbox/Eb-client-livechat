import React from 'react'
import { BotMessageList } from '../Models'
import BotMessageUI from './BotMessageUI'

interface BotMessageProps {  
    message:BotMessageList,
    pushUserReponse:(message:BotMessageList) => void,
    getUserRespondedDialogue:(targetID:string) => void
}

const BotMessage: React.FC<BotMessageProps> = (props) => {
  return (
    <div className="chat__messages-group chat__messages-group--bot">
    {/* <div className="chat__messages-header">
      <p></p>
    </div> */}

    <div className='chat__messages-bot-group'>
      <div className='chat__messages-bot-group-avatar'>
        <img src="https://infinity.500apps.com/img/botup/chatly.svg" alt="Avatar" />
      </div>

      <ul className="chat__messages-list">
      <li className="chat__messages-list-item">
        <BotMessageUI
         message={props.message}
        pushUserReponse={props.pushUserReponse} 
        getUserRespondedDialogue={props.getUserRespondedDialogue}/>
      </li>
    </ul>
    
   </div>

  </div>
  )
}

export default BotMessage