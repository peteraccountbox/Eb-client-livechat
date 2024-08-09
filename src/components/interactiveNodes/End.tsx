import React from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";

const End: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
}: InteractiveNodeProps) => {
  const onChoiceSelected = (choice: any) => {
    execution.nodeId = execution.node.id;
    execution.executed = true;
    execution.responseAction = [
      {
        id: execution.node.id,
        type: "CHOICES",
        data: JSON.stringify(choice),
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
                {execution.node.data.formData?.displayText}
              </span>
            </div>
          </div>
        </ul>
      </div>
      {!execution.executed ? (
        <div className="chat__messages-group">
          <ul className="chat__messages-list">
            {execution.node.data.formData?.choice.map((choice: any) => {
              return (
                <div className="chat__messages-list-item">
                  <div
                    className="chat__messages-bubble chat__message-type-TEXT"
                    onClick={() => onChoiceSelected(choice)}
                  >
                    <span className="actual">{choice.text}</span>
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="chat__messages-group--me">
          <div className="chat__messages-group">
            <ul className="chat__messages-list">
              <div className="chat__messages-list-item">
                <div className="chat__messages-bubble chat__message-type-TEXT">
                  <span className="actual">
                    {JSON.parse(execution.responseAction[0].data).text}
                  </span>
                </div>
              </div>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default End;
