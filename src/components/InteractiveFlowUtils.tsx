import Automated from "./interactiveNodes/Automated";
import CollectFileUpload from "./interactiveNodes/CollectFileUpload";
import CollectTextReply from "./interactiveNodes/CollectTextReply";
import CustomerIdentification from "./interactiveNodes/CustomerIdentification";
import End from "./interactiveNodes/End";
import ItemSelection from "./interactiveNodes/ItemSelection";
import MultiChoice from "./interactiveNodes/MultiChoice";
import OrderSelection from "./interactiveNodes/OrderSelection";
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
  START = "START",
  END = "END",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  AUTOMATED_ANSWER = "AUTOMATED_ANSWER",
  COLLECT_TEXT_REPLY = "COLLECT_TEXT_REPLY",
  COLLECT_FILE_UPLOAD = "COLLECT_FILE_UPLOAD",
  CUSTOMER_IDENTIFICATION = "CUSTOMER_IDENTIFICATION",
  ORDER_SELECTION = "ORDER_SELECTION",
  ITEM_SELECTION = "ITEM_SELECTION",
}

export type InteractiveNodeProps = {
  execution: NodeExecutionPayload;
  executionMeta?: any;
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
  [InteractiveNodeTypes[InteractiveNodeTypes.COLLECT_FILE_UPLOAD]]: CollectFileUpload,  
  [InteractiveNodeTypes[InteractiveNodeTypes.CUSTOMER_IDENTIFICATION]]:
    CustomerIdentification,
  [InteractiveNodeTypes[InteractiveNodeTypes.ORDER_SELECTION]]: OrderSelection,
  [InteractiveNodeTypes[InteractiveNodeTypes.ITEM_SELECTION]]: ItemSelection,
};
