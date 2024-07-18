import End from "./interactiveNodes/End";
import MultiChoice from "./interactiveNodes/MultiChoice";
import Start from "./interactiveNodes/Start";

export type NodeExecutionPayload = {
  id: string;
  executionMetaId: string;
  flowId: string;
  info: string;
  nodeType: InteractiveNodeTypes;
  nodeId: string;
  isResponseNeeded: boolean;
  isResponseProvided: boolean;
  responseAction: object[];
  isExecuted: boolean;
  nextNodeId: string;
  node: any;
  relatedEdges: any;
};

export type NodePayLoad = {
  type: InteractiveNodeTypes;
  [x: string]: any;
};

export enum InteractiveNodeTypes {
  START,
  END,
  MULTIPLE_CHOICE,
}

export type InteractiveNodeProps = {
  execution: NodeExecutionPayload;
  executeNodeOnUserInteraction: (exe: NodeExecutionPayload) => void;
};

export const InteractiveFlowNodes: {
  [key: string]: React.FC<InteractiveNodeProps>;
} = {
  [InteractiveNodeTypes[InteractiveNodeTypes.START]]: Start,
  [InteractiveNodeTypes[InteractiveNodeTypes.MULTIPLE_CHOICE]]: MultiChoice,
  [InteractiveNodeTypes[InteractiveNodeTypes.END]]: End,
};
