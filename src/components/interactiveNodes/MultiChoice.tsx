import React, { useContext } from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import { AppContext } from "../../appContext";

const MultiChoice: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
}: InteractiveNodeProps) => {
  const parentContext = useContext(AppContext);
  const chatFlow = parentContext.chatFlows.find(
    (chatFlow) => chatFlow.id === execution.flowId
  );

  const onChoiceSelected = (edge: any) => {
    execution.nodeId = execution.node.id;
    execution.executed = true;
    execution.responseAction = [
      {
        id: edge.id,
        type: "CHOICES",
        data: JSON.stringify(edge.data),
      },
    ];
    executeNodeOnUserInteraction(execution);
  };
  return (
    <>
      <div className="chat__messages-group">
        <ul className="chat__messages-list">
          <div className="chat__messages-list-item">
            <div className="chat__messages-bubble chat__message-type-TEXT">
              <span className="actual">
                {execution.node.data.formData?.message}
              </span>
            </div>
          </div>
        </ul>
      </div>

      {!execution.executed ? (
        <div className="chat__messages-group">
          <ul className="chat__messages-list multi_choice-list">
            {execution.relatedEdges.map((edge: any) => {
              return (
                <div
                  className="multi_choice-list-item-btn"
                  onClick={() => onChoiceSelected(edge)}
                >
                  <span className="actual">{edge.data.displayText}</span>
                </div>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="chat__messages-group chat__messages-group--me">
          <ul className="chat__messages-list">
            <div className="chat__messages-list-item">
              <div className="chat__messages-bubble chat__message-type-TEXT">
                <span className="actual">
                  {JSON.parse(execution.responseAction[0].data).displayText}
                </span>
              </div>
            </div>
          </ul>
        </div>
      )}
    </>
  );
};
export default MultiChoice;
