import End from "./interactiveNodes/End";
import MultiChoice from "./interactiveNodes/MultiChoice";
import Start from "./interactiveNodes/Start";

export type NodeExecutionPayload = {
  id: string;
  executionMetaId: string;
  flowId: string
  info: string
  nodeType: InteractiveNodeTypes;
  nodeId: string;
  isResponseNeeded: boolean;
  isResponseProvided: boolean;
  responseAction: object[];
  isExecuted: boolean;
  nextNodeId: string;
  node: any
}

enum InteractiveNodeTypes {
  START,
  MULTI_CHOICE,
  END
}

export type InteractiveNodeProps = {
  execution: NodeExecutionPayload;
  executeNodeOnUserInteraction: (exe: NodeExecutionPayload) => void
}

export const InteractiveFlowNodes: {
  [key in InteractiveNodeTypes]: React.FC<InteractiveNodeProps>
} = {
  [InteractiveNodeTypes.START]: Start,
  [InteractiveNodeTypes.MULTI_CHOICE]: MultiChoice,
  [InteractiveNodeTypes.END]: End
}