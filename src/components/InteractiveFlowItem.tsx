import React from "react";
import {
  InteractiveFlowNodes,
  InteractiveNodeTypes,
} from "./InteractiveFlowUtils";

const InteractiveFlowItem = (props: any) => {
  const Node =
    props.execution.node.type !== "ACTION"
      ? InteractiveFlowNodes[props.execution.node.type]
      : InteractiveFlowNodes[props.execution.node.data.nodeType];
  if (
    props.execution.node.data.nodeType == "END"
    // &&
    // props.execution.node.data.formData?.action == "agent"
  )
    return <></>;
  else
    return (
      <>
        {Node ? (
          <Node
            execution={props.execution}
            executeNodeOnUserInteraction={() => {}}
          />
        ) : (
          <>{JSON.stringify(props.execution)}</>
        )}
      </>
    );
};

export default InteractiveFlowItem;
