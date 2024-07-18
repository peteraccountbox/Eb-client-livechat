import React from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";

const CollectTextReply: React.FC<InteractiveNodeProps> = ({
  execution,
}: InteractiveNodeProps) => {
  return <div>End {JSON.stringify(execution)}</div>;
};
export default CollectTextReply;
