import React, { useContext } from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import { AppContext } from "../../appContext";

const MultiChoice: React.FC<InteractiveNodeProps> = ({
  execution,
}: InteractiveNodeProps) => {
  const parentContext = useContext(AppContext);
  const chatFlow = parentContext.chatFlows.find(
    (chatFlow) => chatFlow.id === execution.flowId
  );

  const onChoiceSelected = (target: any) => {
    const node = chatFlow?.nodes.find((node: any) => node.id === target);
  };
  return (
    <div className="chat__messages-group chat__messages-group--me">
      <div className="chat__messages-group">
        <ul className="chat__messages-list">
          <div className="chat__messages-list-item">
            <div className="chat__messages-bubble chat__message-type-TEXT">
              <span className="actual">
                {execution.node.data.formData?.question}
              </span>
            </div>
          </div>
        </ul>
      </div>
      <div className="chat__messages-group chat__messages-group--me">
        <div className="chat__messages-group">
          <ul className="chat__messages-list">
            {execution.relatedEdges.map((edge: any) => {
              return (
                <div className="chat__messages-list-item">
                  <div
                    className="chat__messages-bubble chat__message-type-TEXT"
                    onClick={() => onChoiceSelected(edge.target)}
                  >
                    <span className="actual">{edge.data.displayText}</span>
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default MultiChoice;
