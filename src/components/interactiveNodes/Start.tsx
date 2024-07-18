import React from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";

const Start: React.FC<InteractiveNodeProps> = ({
  execution,
}: InteractiveNodeProps) => {
  return (
    <div className="chat__messages-group chat__messages-group--me">
      <div className="chat__messages-group">
        <ul className="chat__messages-list">
          <div className="chat__messages-list-item">
            <div className="chat__messages-bubble chat__message-type-TEXT">
              <span className="actual">
                {execution.node.data.formData?.trigger_button}
              </span>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
export default Start;
