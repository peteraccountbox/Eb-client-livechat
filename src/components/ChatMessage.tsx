import React, { FC, useEffect, useMemo } from "react";
import { getTextOfJSDocComment } from "typescript";
import {
  ChatMessagePayloadObj,
  EventPayloadObj,
  MessageByTypeEnum,
} from "../Models";
import typingAnimationGif from "../assets/img/bot-response.gif";
import linkifyHtml from "linkify-html";
import {
  convertEmojis,
  createTextLinks_,
  fileName,
  fileSize,
  fileUrl,
  formatBytes,
} from "../Utils";
import { GPT_MESSAGE_SCORE_UPDATE_URL_PATH } from "../globals";
import { postReq } from "../request";
import Tippy from "@tippyjs/react";
import TimeAgo from "./TimeAgo";
import "tippy.js/dist/tippy.css";

export interface ChatMessagePropsType {
  message: EventPayloadObj;
  sessionId?: number | string;
  updateMessage: (message: ChatMessagePayloadObj) => void;
}

const ChatMessage: FC<ChatMessagePropsType> = (props) => {
  const format = props.message.message.format as unknown as string;
  const attachments = props.message.message.attachments as unknown as [];

  const errorStyle = useMemo(() => {
    return !props.message.id && !props.message.tempId
      ? { backgroundColor: "red" }
      : {};
  }, [!props.message.id]);
  // const filename = (message: ChatMessagePaylodObj) => {
  //   return JSON.parse(message.message).fileName;
  // };
  // const fileurl = (message: ChatMesppsagePaylodObj) => {
  //   return JSON.parse(message.message).fileUrl;
  // };
  // const filesize = () => {
  //   return formatBytes(JSON.parse(props.message.message).fileSize, 0);
  // };

  const ifAnImage = (url: string) => {
    return [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".svg",
      ".gif",
      ".jpe",
      ".ico",
      ".jfif",
      ".bmp",
    ].some(function (ext) {
      return url.endsWith(ext);
    });
  };

  const getMessageTime = () => {
    return props.message.createdTime
      ? props.message.createdTime + "Z"
      : props.message.message.created_time;
  };

  const submitGPTFeedback = (feedback: number) => {
    props.message.gpt_relavance_score = feedback;
    props.updateMessage(props.message.message);

    // Push to server
    const wait = postReq(
      GPT_MESSAGE_SCORE_UPDATE_URL_PATH + "/" + props.sessionId,
      props.message
    );
    wait.then((response: any) => {
      console.log(response);
    });
  };

  const setScrollBottom = () => {
    setTimeout(() => {
      var elem = document.getElementsByClassName("chat__messages-track")[0];
      if (elem) elem.scrollTop = elem.scrollHeight;
    }, 100);
  };

  return (
    <Tippy
      content={
        props.message.createdTime && (
          <TimeAgo time={props.message.createdTime} />
        )
      }
      // visible={props.message.ticketId ? true : false}
      disabled={props.message.id ? false : true}
    >
      <div
        className={`chat__messages-bubble chat__message-type-${format}`}
        style={errorStyle}
      >
        {(() => {
          setScrollBottom();
          switch (format) {
            case "TEXT":
              return (
                <span
                  className="actual"
                  dangerouslySetInnerHTML={{
                    __html: linkifyHtml(
                      convertEmojis(props.message.message.bodyText),
                      { target: "_blank" }
                    ),
                  }}
                ></span>
              );
            case "TEXT_AND_FILE":
              return (
                <>
                  <div className="inbox-attachments inbox-attachments-links">
                    {attachments &&
                      attachments.length &&
                      attachments.map((attachment: any) => {
                        return ifAnImage(attachment.url) ? (
                          attachment?.name ? (
                            // <Tippy content={attachment.name}>
                            <img
                              src={attachment.url}
                              alt={attachment.name || "Image"}
                              className="w-20 h-20 object-cover"
                            />
                          ) : (
                            // </Tippy>
                            <img
                              src={attachment.url}
                              alt="Image"
                              className="w-20 h-20 object-cover"
                            />
                          )
                        ) : (
                          <div
                            className="inbox-attachment-item"
                            key={attachment}
                          >
                            <a
                              className="inbox-attachment-filename chat__header-user-table-cell"
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
                                className="attach-icon"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                                ></path>
                              </svg>
                              <span>
                                {attachment.fileName || attachment.name}
                              </span>
                            </a>
                          </div>
                        );
                      })}
                  </div>
                  <span
                    className="actual"
                    dangerouslySetInnerHTML={{
                      __html: linkifyHtml(
                        convertEmojis(props.message.message.bodyText),
                        { target: "_blank" }
                      ),
                    }}
                  ></span>

                  {props.message.from === MessageByTypeEnum.GPT &&
                  props.message.sources &&
                  JSON.parse(props.message.sources).length > 0 ? (
                    <div className="source-label-sec">
                      <div className="source-label-list">
                        {JSON.parse(props.message.sources).map(
                          (value: string, index: number) => {
                            return (
                              <div className="source-label">
                                <p className="source-label-ellipsis">
                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={value}
                                    className="source-label-link"
                                  >
                                    {value}
                                    <span className="source-label-link-absolute"></span>
                                  </a>
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  {props.message.from === MessageByTypeEnum.GPT ? (
                    <div className="feedback-actions">
                      <span
                        onClick={() => submitGPTFeedback(1)}
                        className={`btn positive-btn ${
                          props.message.gpt_relavance_score === 1
                            ? "active"
                            : ""
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                        </svg>
                      </span>
                      <span
                        onClick={() => submitGPTFeedback(2)}
                        className={`btn negative-btn ${
                          props.message.gpt_relavance_score === 2
                            ? "active"
                            : ""
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"></path>
                        </svg>
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              );
            case "FILE":
              return (
                <div className="chat__header-user">
                  <div className="chat__header-user-table">
                    {/* <div className="chat__header-user-img chat__header-user-file-img">
                      <img src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/livechat/chatfile.png" />
                    </div>
                    <div className="chat__header-user-name chat__header-user-table-cell file-info">
                      <a
                        className="chat__header-user-name"
                        target="_blank"
                        href={fileUrl(props.message.message)}
                        dangerouslySetInnerHTML={{
                          __html: createTextLinks_(
                            fileName(props.message.message)
                          ),
                        }}
                      ></a>
                      <div
                        className="file-info-name"
                        style={{ marginTop: "5px" }}
                      >
                        <span>{fileSize(props.message.message)}</span>
                      </div>
                    </div> */}
                    <div className="inbox-attachments inbox-attachments-links">
                      {attachments &&
                        attachments.length &&
                        attachments.map((attachment: any) => {
                          return ifAnImage(attachment.url) ? (
                            attachment?.name ? (
                              // <Tippy content={attachment.name}>
                              <img
                                src={attachment.url}
                                alt={attachment.name || "Image"}
                                className="w-20 h-20 object-cover"
                              />
                            ) : (
                              // </Tippy>
                              <img
                                src={attachment.url}
                                alt="Image"
                                className="w-20 h-20 object-cover"
                              />
                            )
                          ) : (
                            <div
                              className="inbox-attachment-item"
                              key={attachment}
                            >
                              <a
                                className="inbox-attachment-filename chat__header-user-table-cell"
                                href={attachment.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  aria-hidden="true"
                                  data-slot="icon"
                                  className="attach-icon"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                                  ></path>
                                </svg>
                                <span>
                                  {attachment.fileName || attachment.name}
                                </span>
                              </a>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            case "FETCHING":
              return (
                <div>
                  <div className="loading-dots">
                    {/* {props.message.message.bodyText} */}

                    <span>
                      <i className="loading-dots--dot"></i>
                      <i className="loading-dots--dot"></i>
                      <i className="loading-dots--dot"></i>
                    </span>
                  </div>
                </div>
              );
            default:
              return <div />;
          }
        })()}
      </div>
    </Tippy>
  );
};

export default ChatMessage;
