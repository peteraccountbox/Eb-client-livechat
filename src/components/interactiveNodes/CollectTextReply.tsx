import React, { useState } from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import ReactTimeAgo from "react-time-ago";

const CollectTextReply: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
}: InteractiveNodeProps) => {
  const [typeText, setTypeText] = useState<string>("");
  const handleKeyPress = (e: React.FormEvent<HTMLTextAreaElement>) => {
    // console.log(e.currentTarget.textContent);
    if (e.currentTarget.textContent != null)
      setTypeText(e.currentTarget.textContent);
    else setTypeText("");
  };
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    execution.nodeId = execution.node.id;
    execution.executed = true;
    execution.responseAction = [
      {
        id: execution.node.id,
        type: "MESSAGE",
        data: typeText,
      },
    ];
    executeNodeOnUserInteraction(execution);
  };
  return (
    <>
      {!execution.executed ? (
        <>
          {/* <div className="chat__messages-group">
            <ul className="chat__messages-list">
              <div className="chat__messages-list-item">
                <div className="chat__messages-bubble chat__message-type-TEXT">
                  <span className="actual">
                    {execution.node.data.formData.message}
                  </span>
                </div>
              </div>
            </ul>
            <div className="chat__all-messages-item-header">
              <p className="chat-messages-username"> Automated</p>
              <p className="chat__all-messages-item-header-timegao">
                •{" "}
                <ReactTimeAgo
                  date={new Date(execution?.createdTime)}
                  locale="en-US"
                  tooltip={false}
                />
              </p>
            </div>
          </div>
          <div className={`chat__footer`}>
            <div className="chat__form">
              <textarea
                rows={1}
                onChange={(e) => setTypeText(e.currentTarget.value)}
                // onScroll={(e) => handleScroll(e)}
                className="chat__input chat__textarea"
                value={typeText}
                placeholder="Type a message..."
                contentEditable="true"
                onPaste={(e) => {
                  e.preventDefault();
                  document.execCommand(
                    "insertHTML",
                    false,
                    e.clipboardData.getData("text/plain")
                  );
                }}
                onKeyDown={handleKeyDown}
                onInput={(e) => handleKeyPress(e)}
                id="chatMessageEditable"
              ></textarea>

              <div className="chat__actions">
                {typeText ? (
                  <button
                    className="chat__btn chat_send_btn"
                    onClick={() => sendMessage()}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.394 14.7L13.75 9.3c1-.577 1-2.02 0-2.598L4.394 1.299a1.5 1.5 0 00-2.25 1.3v3.438l4.059 1.088c.494.132.494.833 0 .966l-4.06 1.087v4.224a1.5 1.5 0 002.25 1.299z"
                      ></path>
                    </svg>
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div> */}
          <div className="chat_agent_data" style={{ display: "flex" }}>
            <div className="chat__messages-form chatuserformdata">
              <div
                className="text-left"
                style={{ marginBottom: "10px", display: "flex" }}
              >
                <pre>
                  <p className="mb-2">{execution.node.data.formData.message}</p>
                </pre>
              </div>
              <div className="chat__messages-form-group">
                <textarea
                  rows={2}
                  onChange={(e) => setTypeText(e.currentTarget.value)}
                  // onScroll={(e) => handleScroll(e)}
                  className="chat_form-control"
                  value={typeText}
                  placeholder="Type a message..."
                  contentEditable="true"
                  onPaste={(e) => {
                    e.preventDefault();
                    document.execCommand(
                      "insertHTML",
                      false,
                      e.clipboardData.getData("text/plain")
                    );
                  }}
                  onKeyDown={handleKeyDown}
                  onInput={(e) => handleKeyPress(e)}
                  id="chatMessageEditable"
                ></textarea>
              </div>
              {typeText ? (
                <a className="chat_send_btn" onClick={() => sendMessage()}>
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.394 14.7L13.75 9.3c1-.577 1-2.02 0-2.598L4.394 1.299a1.5 1.5 0 00-2.25 1.3v3.438l4.059 1.088c.494.132.494.833 0 .966l-4.06 1.087v4.224a1.5 1.5 0 002.25 1.299z"
                    ></path>
                  </svg>
                </a>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="chat__messages-group">
            <ul className="chat__messages-list">
              <div className="chat__messages-list-item">
                <div className="chat__messages-bubble chat__message-type-TEXT">
                  <span className="actual">
                    {execution.node.data.formData.message}
                  </span>
                </div>
              </div>
            </ul>
            <div className="chat__all-messages-item-header">
              <p className="chat-messages-username"> Automated</p>
              <p className="chat__all-messages-item-header-timegao">
                •{" "}
                <ReactTimeAgo
                  date={new Date(execution?.createdTime)}
                  locale="en-US"
                  tooltip={false}
                />
              </p>
            </div>
          </div>
          <div className="chat__messages-group--me">
            <div className="chat__messages-group">
              <ul className="chat__messages-list">
                <div className="chat__messages-list-item">
                  <div className="chat__messages-bubble chat__message-type-TEXT">
                    <span className="actual">
                      {execution.responseAction[0].data}
                    </span>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default CollectTextReply;
