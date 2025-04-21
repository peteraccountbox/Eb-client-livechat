import React from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";

const End: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
}: InteractiveNodeProps) => {

  return (
    <>
      <div className="chat__messages-group">
        <div className="chat__messages-list">
          <div className="chat__messages-list-item">
            <div className="chat__messages-bubble chat__message-type-TEXT">
              <span className="actual">
                {execution.node.data.formData?.action}
              </span>
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
};
export default End;
