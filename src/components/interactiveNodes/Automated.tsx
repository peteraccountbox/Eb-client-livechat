import React from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import ReactTimeAgo from "react-time-ago";

const Automated: React.FC<InteractiveNodeProps> = ({
  execution,
}: InteractiveNodeProps) => {
  return (
    <div className="chat__messages-group">
      <ul className="chat__messages-list">
        <li className="chat__messages-list-item">
          <div className="chat__messages-bubble chat__message-type-TEXT">
            <span className="actual">
              {execution.node.data.formData?.message}
            </span>
          </div>
        </li>
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
  );
};

export default Automated;
