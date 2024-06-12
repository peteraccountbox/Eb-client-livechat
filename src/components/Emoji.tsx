import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";

interface EmojiProps {
  onEmojiSelect(emoji: any): void;
}

const Emoji: React.FC<EmojiProps> = (props) => {
  const [isActive, setIsActive] = useState(false);
  const emojiClicked = (emoji: any) => {
    setIsActive(!isActive);

    props.onEmojiSelect(emoji);
  };
  return (
    <>
      {" "}
      <div className="chat__actions-item">
        <div className="chat__actions-item-trigger">
          <svg
            onClick={() => setIsActive(!isActive)}
            width="16"
            height="16"
            fill="#757575"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 16 16"
          >
            <g>
              <path d="M8,15.4c-4.1,0-7.4-3.3-7.4-7.4S3.9,0.6,8,0.6s7.4,3.3,7.4,7.4S12.1,15.4,8,15.4z M8,1.9   C4.7,1.9,1.9,4.7,1.9,8s2.7,6.1,6.1,6.1s6.1-2.7,6.1-6.1S11.3,1.9,8,1.9z" />
            </g>
            <g>
              <path d="M5.8,7.5c0.6,0,1.1-0.5,1.1-1.1S6.4,5.3,5.8,5.3c-0.6,0-1.1,0.5-1.1,1.1C4.7,7,5.2,7.5,5.8,7.5z M10.2,7.5   c0.6,0,1.1-0.5,1.1-1.1s-0.5-1.1-1.1-1.1c-0.6,0-1.1,0.5-1.1,1.1C9.1,7,9.6,7.5,10.2,7.5z" />
            </g>
            <g>
              <path d="M8,11.7c-1,0-1.9-0.5-2.5-1.3c-0.2-0.3-0.1-0.7,0.1-0.9c0.3-0.2,0.7-0.1,0.9,0.1c0.7,0.9,2.3,0.9,2.9,0   c0.2-0.3,0.6-0.4,0.9-0.1c0.3,0.2,0.4,0.6,0.1,0.9C9.9,11.2,9,11.7,8,11.7z" />
            </g>
          </svg>
        </div>

        {isActive ? (
          <div
            className="
        engagebay-composer-popover
        engagebay-composer-emoji-popover
        engagebay-composer-popover-enter-done
      "
          >
            <EmojiPicker onEmojiClick={(e: any) => emojiClicked(e.emoji)} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Emoji;
