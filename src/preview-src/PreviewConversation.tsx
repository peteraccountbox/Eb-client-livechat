import { FC, useMemo, useState } from "react";
import { ChatPrefsPayloadType } from "../Models";
import CloseWidgetPanel from "../components/CloseWidgetPanel";
import { DEFAULT_AGENT_PROFILE_PIC } from "../globals";

export interface PreviewConversationComponentProps {
    chatPrefs: ChatPrefsPayloadType;
  }
  
  const PreviewConversation: FC<PreviewConversationComponentProps> = (props) => {
    const { chatPrefs } = props;
    const settings = [{ tab: "Messages" }];

    const appThemeStyle: Object = useMemo(() => {
      return {
        "--bottom": settings?.length < 2 ? "20px" : "125px",
        "--reduceHeight": settings?.length < 2 ? "135px" : "210px",
        "--themeColor":
          chatPrefs && chatPrefs.meta.decoration.mainColor
            ? chatPrefs.meta.decoration.mainColor
            : "blue",
        // "--themeColor2":
        //   chatPrefs && chatPrefs.meta.decoration.mainColor
        //     ? chatPrefs.meta.decoration.mainColor
        //     : "red",
      };
    }, [chatPrefs]);
    return    chatPrefs && 
    <div
    id="App"
    className={`engagebay-viewport ${
      !chatPrefs.meta.deactivated ? "" : "hide"
    } `}
    style={appThemeStyle}
  >
    <div
      className={`chat is-open
          ${
            chatPrefs.meta.decoration.widgetAlignment == "bottom left"
              ? "left"
              : ""
          }
          ${
            chatPrefs.meta.decoration.widgetAlignment == "bottom right"
              ? "right"
              : ""
          }`}
      data-target="widget"
    >
    <div className="chat__conversation">
    <div className="chat__header">
      <div className="chat__header-action">
        <div
          data-trigger="all"
          className="chat__header-back"
        //   onClick={() => goBack()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            color="currentColor"
          >
            <path
              stroke="#fff"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.7"
              d="m14 18-6-6 6-6"
            ></path>
          </svg>
        </div>
        <div className="chat__header-user">
          <div>
            <div
              className="chat__header-user-img"
              style={{ backgroundImage: 'url("' + chatPrefs.meta.decoration.headerPictureUrl || DEFAULT_AGENT_PROFILE_PIC + '")' }}
            ></div>
          </div>

          <div className="chat__header-user-title">
            <h1 className="chat__header-user-name"> {chatPrefs.name} </h1>
          </div>
        </div>
      </div>

      <div className="chat__help-end">
        <CloseWidgetPanel />
      </div>
    </div>

    <div className="chat__content">
      <div className="chat__messages">
        <div className="chat__messages-track">
          {/* <div>
            {!showChatForm ? (
              session?.messageList ? session?.messageList?.map(
                (message: EventPayloadObj, index: number) => {
                  return (
                    <div>
                      <div>
                        {message.eventType == "INTERACTIVE_FLOW_NODE" ? (
                          <InteractiveFlowItem
                            execution={message.meta.executionNode}
                          />
                        ) : (
                          <>
                            <ConversationItem
                              message={message}
                              session={session}
                              nextMessage={session?.messageList[index + 1]}
                              updateMessage={updateMessage}
                            />
                            {index == 0 && !emailCaptured && (
                              <ChatForm
                                closeChatForm={() => {
                                  setShowChatForm(false);
                                }}
                                fields={singlefield}
                                submitChatForm={submitChatForm}
                                typeText={typeText}
                                setTypeText={setTypeText}
                                saving={saving}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
              ) : 
              
          <p style={{ marginTop: "60px", textAlign: "center" }}>
              <div className="chat__form-loader1">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
              </div>
              </p>
            ) : (
              <></>
            )}

            {showChatForm ? (
              <ChatForm
                closeChatForm={() => {
                  setShowChatForm(false);
                }}
                fields={fields}
                submitChatForm={submitChatForm}
                typeText={typeText}
                setTypeText={setTypeText}
                saving={saving}
              />
            ) : (
              <></>
            )}
          </div> */}
        </div>
        <div className="chat__messages-sign hide">
          <a target="_blank">
            We
            <img
              src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/livechat/love-icon.svg"
              width="12px"
            />
            Reacho
          </a>
        </div>
      </div>

      {/* <div
        className={`chat__footer ${showChatForm ||
          (!session.id && session.messageList?.length > 0) ||
          (chatPrefs.meta.emailCaptureEnforcement == "required" &&
            !emailCaptured &&
            !session.id &&
            session.messageList?.length > 0)
          ? "hide"
          : ""
          }`}
      >
        {getChatPrompts()}

        <div className={`chat__form`}>
          <textarea
            ref={text}
            rows={1}
            onChange={(e) => setTypeText(e.currentTarget.value)}
            onScroll={(e) => handleScroll(e)}
            className="chat__input chat__textarea"
            value={text?.current?.value}
            placeholder={
              !matchedBotPrefs || matchedBotPrefs.botPrompts?.length == 0
                ? parentContext.chatPrefs.meta.decoration.introductionText
                : matchedBotPrefs.settings.placeHolderText
            }
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
            onKeyUp={userTyping}
            id="chatMessageEditable"
          ></textarea>

          <div className="chat__actions">
            <Emoji onEmojiSelect={onEmojiSelect} />

            {session &&
              session.id ? (
              <FileUpload fileUploadCallback={fileUploadCallback} />
            ) : (
              <></>
            )}

            {typeText ? (
              <button
                className="chat__btn chat_send_btn"
                onClick={() => sendMessage(false)}
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
    </div>
  </div>
  </div>
  <div
          className={`chat__trigger ${
            !chatPrefs.meta.deactivated ? "" : "hide"
          } ${
            chatPrefs.meta.decoration.widgetAlignment == "bottom left"
              ? "left"
              : ""
          } ${
            chatPrefs.meta.decoration.widgetAlignment == "RIGHT" ? "right" : ""
          } chat-opend`}
        >
          <div className="close_chat_bubble">
            <svg
              className="close-chat-icon"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.601 8.39897C18.269 8.06702 17.7309 8.06702 17.3989 8.39897L12 13.7979L6.60099 8.39897C6.26904 8.06702 5.73086 8.06702 5.39891 8.39897C5.06696 8.73091 5.06696 9.2691 5.39891 9.60105L11.3989 15.601C11.7309 15.933 12.269 15.933 12.601 15.601L18.601 9.60105C18.9329 9.2691 18.9329 8.73091 18.601 8.39897Z"
                fill="white"
              ></path>
            </svg>
          </div>
        </div>
  </div>
  }

  export default PreviewConversation;