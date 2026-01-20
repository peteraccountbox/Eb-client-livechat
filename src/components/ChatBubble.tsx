import React, {
  FunctionComponentFactory,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AppContext } from "../appContext";

interface ChatBubbleProps {
  isVisible: boolean;
  setIsVisible(type: boolean): void;
  chatBubbleClicked(): void;
  opened: boolean;
  notifyEnabled: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = (props) => {
  useEffect(() => {
    return () => {};
  }, []);

  const chatPrefs = useContext(AppContext).chatPrefs;
  const { isVisible, setIsVisible, notifyEnabled } = props;

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div
      className={`chat__trigger ${isVisible ? "" : "hide"} ${
        chatPrefs.meta.decoration.widgetAlignment == "bottom left" ? "left" : ""
      } ${
        chatPrefs.meta.decoration.widgetAlignment == "bottom right"
          ? "right"
          : ""
      } ${props.opened ? "chat-opend" : "chat-closed"}`}
      data-trigger="widget"
      // onClick={() => props.chatBubbleClicked()}
    >
      {props.opened ? (
        <div
          className="close_chat_bubble"
          onClick={(e) => props.chatBubbleClicked()}
        >
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
      ) : (
        <>
          <div
            className="chat__trigger-message"
            onClick={(e) => props.chatBubbleClicked()}
          >
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 50 50"
            >
              <path
                className="st0"
                fill="#FFFFFF"
                d="M38.4,8.5h-3.2c0-1.2-0.3-2.2-0.9-2.8C33.5,5,32.5,5,32.5,5H12.7c-3.9,0-7,2.8-7,6.3v27.9l3.5-2.8V45l8.1-7.1
	h21.2c3.3,0,5.9-2.7,5.9-5.9V14.4C44.4,11.2,41.7,8.5,38.4,8.5z M6.4,37.5V11.3c0-3,2.8-5.5,6.3-5.5l19.8,0c0,0,0.7,0,1.3,0.5
	c0.5,0.5,0.7,1.2,0.7,2.2H15.1c-3.3,0-5.9,2.7-5.9,5.9v21L6.4,37.5z M32,29.6H13.6v-1.8H32V29.6z M39.9,24.6H13.6v-1.8h26.3V24.6z
	 M39.9,19.6H13.6v-1.8h26.3V19.6z"
              />
            </svg>
          </div>
          {!notifyEnabled && (
            <div
              className="close_chat_bubble_circle"
              onClick={toggleVisibility}
            >
              <svg
                focusable="false"
                aria-hidden="true"
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="white"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 7.23251L7.23251 8L4 4.76749L0.767492 8L0 7.23251L3.23251 4L0 0.767492L0.767492 0L4 3.23251L7.23251 0L8 0.767492L4.76749 4L8 7.23251Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatBubble;
