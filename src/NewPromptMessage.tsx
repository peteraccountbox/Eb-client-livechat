import React, { useContext } from "react";
import { ChatMessagePaylodObj, ChatSessionPaylodObj } from "./Models";
import {
  convertEmojis,
  createTextLinks_,
  fileName,
  fileSize,
  fileUrl,
  promptImg,
} from "./Utils";
import { AppContext } from "./appContext";
export type NewPromptMessageComponentProps = {
  info: { [x: string]: any } | undefined;
  close: (e: React.MouseEvent<HTMLElement>) => void;
  open: () => void;
};
const NewPromptMessage = (props: NewPromptMessageComponentProps) => {
  const parentContext = useContext(AppContext);
  const { info, close, open } = props;
  const { agents, chatPrefs } = parentContext;
  return (
    <div
      className={`chat_popover ${chatPrefs.meta.decoration.widgetAlignment == "LEFT" ? "left" : "right"
        } `}
    >
      <div className="chat_popover-content chat" onClick={open}>
        <div className="chat_popover-content-close" onClick={close}>
          <span>
            <svg
              focusable="false"
              aria-hidden="true"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 7.23251L7.23251 8L4 4.76749L0.767492 8L0 7.23251L3.23251 4L0 0.767492L0.767492 0L4 3.23251L7.23251 0L8 0.767492L4.76749 4L8 7.23251Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </div>
        <div className="chat_popover-media">
          {info?.user_id && (
            <div className="chat_popover-img">
              <img
                //src="https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_19.jpg"
                alt="profile"
                src={promptImg(info?.user_id, agents, chatPrefs)}
              />
            </div>
          )}
          <div className="chat_popover-media-body">
            {/* <span
              className="actual"
              dangerouslySetInnerHTML={{
                __html: convertEmojis(info?.message),
              }}
            ></span> */}
            {(() => {
              switch (info?.message_type) {
                case "TEXT":
                  return (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: convertEmojis(info?.message),
                      }}
                    ></span>
                  );
                case "FILE":
                  return (
                    <div className="chat_popover-user">
                      <div className="chat_popover-user-table">
                        <div className="chat_popover-file-img">
                          <img src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/livechat/chatfile.png" />
                        </div>
                        <div className="chat_popover-file-info">
                          <a
                            className="chat_popover-user-name"
                            target="_blank"
                            // href={fileUrl(info as ChatMessagePaylodObj)}
                            dangerouslySetInnerHTML={{
                              __html: createTextLinks_(
                                fileName(info as ChatMessagePaylodObj)
                              ),
                            }}
                          ></a>
                          <div
                            className="chat_popover-file-name"
                            style={{ marginTop: "5px" }}
                          >
                            <span>
                              {fileSize(info as ChatMessagePaylodObj)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                default:
                  return info?.message;
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPromptMessage;
