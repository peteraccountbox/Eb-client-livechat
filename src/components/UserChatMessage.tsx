import React, { FC, useContext, useEffect } from "react";
import { AppContext } from "../appContext";
import {
  ChatMessagePayloadObj,
  ChatSessionPaylodObj,
  EventPayloadObj,
  MessageByTypeEnum,
} from "../Models";
import ChatMessage from "./ChatMessage";
import { getCustomerProfile } from "../globals";
import { isUserBusinessHour } from "../BusinessHours";
// import TimeAgo from 'react-timeago';

export interface UserChatMessagePropsType {
  message: EventPayloadObj;
  sessionId?: number | string;
  nextMessage: EventPayloadObj | undefined;
}

const UserChatMessage: FC<UserChatMessagePropsType> = (props) => {
  const parentContext = useContext(AppContext);

  const { chatPrefs, sessions, setSessions, agentsPrefs, createSessionData } =
    parentContext;
  const customerProfile = getCustomerProfile();
  const getMessageTime = () => {
    // let myDate = new Date(props.message.created_time * 1000);
    // let dateStr = myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear()
    // //+ " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds()
    // return dateStr;
    return props.message.created_time * 1000;
  };

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
                  <>{getMessageTime()}</>
                  // <ReactTimeAgo
                  //   date={getMessageTime()}
                  //   locale="en-US"
                  //   tooltip={false}
                  // />
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
          {!props.message.id &&
            props.message.tempId &&
            (props.message.ticketId ||
              (customerProfile && customerProfile.email)) && (
              <div>Sending ...</div>
            )}
        </ul>

        {!isUserBusinessHour(chatPrefs, agentsPrefs) &&
        !props.nextMessage &&
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
                marginTop: "5px",
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

      {/* <div className="ai-answer-card">
        <div className="ai-answer-card-header">
          <div>
            <span>Eva</span> Answer
          </div>
        </div>
        <div className="ai-answer-card-body">
          <p>
            Yes, you can change the date of your reservation for up to seven
            days in advance. To do this, go to “Your Reservations” and click the
            reservation. Then, go to “Edit” and enter a new date.
          </p>
        </div>
        <div className="ai-answer-card-footer">
          <h6 style={{ fontSize: "14px" }}>Source</h6>
          <p style={{ display: "flex", alignItems: "center" }}>
            Changing your reservation date{" "}
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
          </p>
        </div>
      </div> */}

      {/* <div className="fullscreen-main hide">
        <div className="fullscreen-card">
          <div className="fullscreen-card-header">
            <button className="go-backicon">
              <svg
                width="24"
                height="24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="linkColor"
              >
                <path
                  d="M14 18l-6-6 6-6"
                  stroke="#0057ff"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <div className="toggle-expansion">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.99902 2.00073L6.99903 7.00073"
                  stroke="#0057ff"
                  stroke-width="1.7"
                ></path>
                <path
                  d="M6.49902 1.50073L1.49902 1.50073L1.49902 6.50073"
                  stroke="#0057ff"
                  stroke-width="1.75"
                ></path>
                <path
                  d="M8.99902 9.00074L13.999 14.0007"
                  stroke="#0057ff"
                  stroke-width="1.75"
                ></path>
                <path
                  d="M14.499 9.50073L14.499 14.5007L9.49902 14.5007"
                  stroke="#0057ff"
                  stroke-width="1.75"
                ></path>
              </svg>
            </div>
          </div>

          <div className="fullscreen-card-body">
            <h1>Pricing</h1>
            <p className="fs-14 text-gray-45">
              Understand how Fin AI Resolutions are defined and calculated.
            </p>

            <div className="media-avatar">
              <img
                src="https://static.intercomassets.com/avatars/5355539/square_128/5355539-1665143317.jpg"
                alt="avatar"
              />
              <div className="media-avatar-info">
                <div className="text-gray-45">
                  Written by <span>Beth-Ann Sher</span>
                </div>
                <div className="text-gray-45">Update d over a week ago</div>
              </div>
            </div>

            <p style={{ marginBottom: "10px" }}>
              Fin usage is measured in <b>Resolutions</b>. This ensures that you
              only pay when Fin does what you care about most; resolving a
              customer’s question.
            </p>

            <p className="subheading">
              <b>Examples:</b>
            </p>

            <div className="ordered-nested-list">
              <ol>
                <li>
                  <div className="interblocks-paragraph">
                    <p>
                      The support rep replies to the conversation after the
                      customer confirms the AI answer is satisfactory.{" "}
                    </p>
                  </div>
                </li>
                <li>
                  <div className="interblocks-paragraph">
                    <p>
                      The support rep replies to the conversation after the
                      customer exits the conversation without requesting further
                      assistance.{" "}
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <p style={{ marginBottom: "10px" }}>
              Following the last AI Answer in a conversation, the customer
              confirms the answer provided is satisfactory or exits the
              conversation without requesting further assistance.
            </p>


            <div className="feedback-footer-sec">
              <div className="feedback-footer">
                <div className="feedback-footer-body">
                  <div className="feedback-question">
                    Did this answer your question?
                  </div>
                  <span className="feedback-emojis">
                    <span className="feedback-emojis-item">😞</span>
                  </span>
                  <span className="feedback-emojis">
                    <span className="feedback-emojis-item">😐</span>
                  </span>
                  <span className="feedback-emojis">
                    <span className="feedback-emojis-item">😃</span>
                  </span>
                </div>
              </div>
            </div>



          </div>



        </div>
      </div> */}
    </>
  );
};

export default UserChatMessage;
