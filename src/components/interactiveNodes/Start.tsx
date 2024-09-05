import React from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";

const Start: React.FC<InteractiveNodeProps> = ({
  execution,
}: InteractiveNodeProps) => {
  return (
    <div className="chat__messages-group chat__messages-group--me">
      <ul className="chat__messages-list">
        <li className="chat__messages-list-item">
          <div className="chat__messages-bubble chat__message-type-TEXT">
            <span className="actual">
              {execution.node.data.formData?.start_message}
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};
export default Start;
