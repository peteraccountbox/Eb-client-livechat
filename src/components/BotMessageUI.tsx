import React from 'react'
import { BotMessageList } from '../Models'

interface BotMessageUIProps {
  message: BotMessageList,
  pushUserReponse: (message: BotMessageList) => void,
  getUserRespondedDialogue: (targetID: string) => void
}


const BotMessageUI: React.FC<BotMessageUIProps> = (props) => {

  const loadDialogue = (message: BotMessageList) => {
    if (message.button_status == "disabled") return;

    if (message.id == "connect_agent" && message.message_type == "BUTTON") {
      message.button_status = "disabled";
    }

    props.pushUserReponse(message);
    props.getUserRespondedDialogue(message.id)

  }
  return (
    <div>
      {props.message.message_type == 'TEXT' && props.message.message ?
        <div
          className="chat__bot chat__messages-bubble"
        >
          <span className="actual">
            {props.message.message}
          </span>
        </div> :

        (props.message.button_status != 'disabled' &&
          props.message.message_type == 'BUTTON' &&
          props.message.message) ?
          <div
            className={props.message.button_status == 'disabled' ? "disabled chat__messages-bubble chat__messages-button" : "chat__messages-bubble chat__messages-button"}
            onClick={() => loadDialogue(props.message)}

          >
            <span className="actual">
              <a
                className={props.message.button_status}
                href="javascript:void(0)"
                style={{ textDecoration: "none" }}
              >
                {props.message.message}
              </a>
            </span>
          </div> :
          <></>}
    </div>

  )
}

export default BotMessageUI


