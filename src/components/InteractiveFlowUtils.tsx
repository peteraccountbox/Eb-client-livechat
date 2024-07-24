import Automated from "./interactiveNodes/Automated";
import CollectTextReply from "./interactiveNodes/CollectTextReply";
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
  responseNeeded: boolean;
  responseProvided: boolean;
  responseAction: NodeResonseType[];
  executed: boolean;
  nextNodeId: string;
  node: any;
  relatedEdges: any;
  createdTime: any;
};

export type NodeResonseType = {
  id: string;
  type: string;
  data: string;
};

export type NodePayLoad = {
  type: InteractiveNodeTypes;
  [x: string]: any;
};

export enum InteractiveNodeTypes {
  START,
  END,
  MULTIPLE_CHOICE,
  AUTOMATED_ANSWER,
  COLLECT_TEXT_REPLY,
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
  [InteractiveNodeTypes[InteractiveNodeTypes.AUTOMATED_ANSWER]]: Automated,
  [InteractiveNodeTypes[InteractiveNodeTypes.COLLECT_TEXT_REPLY]]:
    CollectTextReply,
};
