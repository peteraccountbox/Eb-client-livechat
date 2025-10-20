import React, { FC, useContext, useEffect } from "react";
import { AppContext } from "../appContext";
import { EventPayloadObj } from "../Models";
import ChatMessage from "./ChatMessage";
import { isUserBusinessHour } from "../BusinessHours";
import TimeAgo from "./TimeAgo";

export interface UserChatMessagePropsType {
  message: EventPayloadObj;
  sessionId?: number | string;
  nextMessage: EventPayloadObj | undefined;
}

const UserChatMessage: FC<UserChatMessagePropsType> = (props) => {
  const parentContext = useContext(AppContext);

  const { chatPrefs, agentsPrefs } = parentContext;

  const canShowAnavailableMessage = () => {
    return false;

    // const from = MessageByTypeEnum[
    //   props.message.from
    // ] as unknown as MessageByTypeEnum;
    // const xyz = props.nextMessage?.message.from;
    // let nextFrom: any;
    // if (xyz) nextFrom = MessageByTypeEnum[xyz] as unknown as MessageByTypeEnum;

    // try {
    //   if (true) return false;

    // var canShowUnavailabiltyInCurrentMessage =
    //   from == MessageByTypeEnum.CUSTOMER && props.message.agents_unavailable;
    // if (
    //   (!props.message.nextMessage && canShowUnavailabiltyInCurrentMessage) ||
    //   (canShowUnavailabiltyInCurrentMessage &&
    //     props.nextMessage &&
    //     (nextFrom != MessageByTypeEnum.CUSTOMER ||
    //       !(
    //         nextFrom == MessageByTypeEnum.CUSTOMER &&
    //         props.nextMessage.agents_unavailable
    //       )))
    // ) {
    //   return true;
    // }

    // return false;
    // } catch (error) {
    //   return false;
    // }
  };

  return (
    <>
      <div className="chat__messages-group chat__messages-group--me">
        <div className="chat__messages-header">
          <p>
            <div>
              <span className="chat__messages-header-user">You </span> |
              <span className="chat__messages-header-timeago">
                {props.message.status == "SENDING" ? (
                  "Sending ..."
                ) : (
                  <TimeAgo time={props.message.createdTime} />
                )}
              </span>
            </div>
          </p>
          {/*  Status */}

          {props.message.status == "SENDING" ? (
            <span className="message-sent-status">Sending ...</span>
          ) : (
            <></>
          )}

          {props.message.status == "FAILED" ? (
            <span className="message-sent-error">Failed</span>
          ) : (
            <></>
          )}
        </div>

        <ul className="chat__messages-list">
          <li className="chat__messages-list-item">
            <ChatMessage
              sessionId={props.sessionId}
              message={props.message}
              updateMessage={() => {}}
            />
          </li>
          {!props.message.id && props.message.tempId && !props.nextMessage && (
            <div>Sending ...</div>
          )}
        </ul>

        {!isUserBusinessHour(chatPrefs, agentsPrefs) &&
        !props.nextMessage &&
        props.message.id &&
        chatPrefs.meta.chatMessageOfflineStatusMessageEnabled ? (
          <div className="chat__messages-footer">
            <div
              style={{
                background: "rgb(207, 237, 239)",
                border: "1px solid rgb(206, 232, 241)",
                borderRadius: "3px",
                color: "rgb(57, 92, 96)",
                fontSize: "10px",
                padding: "5px",
                textAlign: "center",
                marginTop: "16px",
              }}
            >
              <span className="message-sent-status">
                {chatPrefs.meta.chatMessageOfflineStatusMessage}
              </span>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default UserChatMessage;
