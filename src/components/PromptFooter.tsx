import React, { FC, useEffect, useState } from "react";
import { ChatSessionPaylodObj } from "../Models";
import send from "../assets/img/send.png";
import { getLocalStoragePrefs, setLocalStoragePrefs } from "../Storage";
import { getFormData } from "../Utils";
import { FORM_DATA } from "../globals";

interface PromptFooterProp {
  widgetPrefs: undefined;
  session: ChatSessionPaylodObj | undefined;
  handleProactiveMessageSubmit: (arg0: string, arg1: number) => void;
}

const PromptFooter: FC<PromptFooterProp> = (props) => {
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const updateFromData = (message: any) => {
    var formData: any = getFormData();
    formData = !formData ? {} : JSON.parse(formData);
    formData.message = message;
    setLocalStoragePrefs(FORM_DATA, JSON.stringify(formData));

    return formData;
  };

  const handleKeyChange = (e: any) => {
    console.log(e.currentTarget.value);
    if (e.currentTarget.value != null) setChatMessage(e.currentTarget.value);
    else setChatMessage("");
  };

  const handleKeyDown = (e: any) => {
    if (e.key == "Enter") {
      updateFromData(chatMessage);
      props.handleProactiveMessageSubmit(
        chatMessage,
        Number(props.session?.id)
      );
    }
  };

  return (
    <>
      <div className="chat__prompt-container">
        <div className="chat__prompt-footer">
          <input
            type="text"
            className="chat__prompt-input"
            placeholder={
              "Write a reply"
            }
            onChange={(e) => handleKeyChange(e)}
            onKeyDown={handleKeyDown}
          />
          <button className="chat__prompt-btn">
            <span
              className="chat__prompt-btn-icon"
              onClick={() => {
                updateFromData(chatMessage);
                props.handleProactiveMessageSubmit(chatMessage, 8);
              }}
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
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PromptFooter;
