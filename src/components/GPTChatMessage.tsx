import React, { FC, useContext, useEffect } from 'react'
import { ChatMessagePaylodObj, ChatSessionPaylodObj } from '../Models';
import ChatMessage from './ChatMessage'
// import TimeAgo from 'react-timeago'
import boticon from '../assets/img/chatbot-final.png';
import { AppContext } from '../appContext';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

export interface GPTChatMessagePropsType {
  message: ChatMessagePaylodObj,
  sessionId?: number,
  formatMessageTime(): void
  updateMessage: (message: ChatMessagePaylodObj) => void
}

const GPTChatMessage: FC<GPTChatMessagePropsType> = (props) => {

  const getmessageTime = () => {
    return props.message.created_time * 1000;
  }
  useEffect(() => {


    return () => {

    }
  }, []);

  const parentContext = useContext(AppContext);

  const getIcon = () => {

    if (parentContext.chatPrefs.matchedBotPrefs?.id)
      return parentContext.chatPrefs.matchedBotPrefs?.settings.chatBotIconURL;

    return boticon;

  }

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

        <div className='chat__messages-agent-info'>
          <div className='chat__messages-agent'>
            <div className='chat__messages-agent-avatar'>

              <img src={getIcon()} alt="Avatar" />
            </div>

            <ul className="chat__messages-list">
              <li className="chat__messages-list-item">
                <ChatMessage sessionId={props.sessionId} message={props.message} updateMessage={props.updateMessage} />
              </li>
            </ul>

          </div>

          <div className='chat__messages-timestamp'>
            {/* <ReactTimeAgo date={getmessageTime()} locale="en-US" tooltip={false}/> */}
          </div>
        </div>

      </div>
    </>
  )
}

export default GPTChatMessage;