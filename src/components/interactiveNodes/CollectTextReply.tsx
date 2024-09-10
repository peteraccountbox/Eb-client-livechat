import React, { useState } from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import TimeAgo from "../TimeAgo";

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
          {/* <div className="chat_agent_data" style={{ display: "flex" }}> */}
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
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>Send</span>
                  {/* <svg
                    className="chat_send_icon"
                    enable-background="new 0 0 32 32"
                    viewBox="0 0 32 32"
                    style={{ fill: "white" }}
                    width={16}
                    height={16}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m21.1646194 29.9911366c-1.0395126.0777702-2.0082016-.2969723-2.7011948-.9899673-.6219101-.2503929-4.0971422-8.8551025-4.4971895-9.5459404l6.646821-6.646822c.395977-.395978.3889008-1.0253134 0-1.4142132-.3959789-.395978-1.0182362-.395978-1.4142132 0l-6.646822 6.6468201-8.4994373-3.7759256c-1.3576331-.6081448-2.1566238-1.9445429-2.0435059-3.4294939.1201961-1.4778719 1.1243188-2.6799183 2.552645-3.0617409l21.0859309-5.6568974c1.2091236-.3181636 2.4607162.0141559 3.3446007.8980393.8768063.8768055 1.2091255 2.1283982.8909607 3.3375232l-5.6568527 21.0859737c-.3818227 1.4283253-1.5839139 2.4324051-3.0617429 2.5526444z"></path>
                  </svg> */}
                </span>
                {/* <svg
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
                </svg> */}
              </a>
            ) : (
              <></>
            )}
          </div>
          {/* </div> */}
        </>
      ) : (
        <>
          <div className="chat__messages-group">
            <ul className="chat__messages-list">
              <li className="chat__messages-list-item">
                <div className="chat__messages-bubble chat__message-type-TEXT">
                  <span className="actual">
                    {execution.node.data.formData.message}
                  </span>
                </div>
              </li>
            </ul>
            <div className="chat__all-messages-item-header">
              <p className="chat-messages-username"> Automated</p>
              <p className="chat__all-messages-item-header-timegao">
                <TimeAgo date={new Date(execution?.createdTime)} />
              </p>
            </div>
          </div>
          <div className="chat__messages-group--me">
            <div className="chat__messages-group">
              <ul className="chat__messages-list">
                <li className="chat__messages-list-item">
                  <div className="chat__messages-bubble chat__message-type-TEXT">
                    <span className="actual">
                      {execution.responseAction[0].data}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default CollectTextReply;
