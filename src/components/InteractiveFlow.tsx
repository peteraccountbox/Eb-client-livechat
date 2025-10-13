import React, { useContext, useEffect, useState } from "react";
import {
  getSessionStoragePrefs,
  removeSessionStoragePrefs,
  setSessionStoragePrefs,
} from "../Storage";
import CloseWidgetPanel from "./CloseWidgetPanel";
import { widgetFooterTabs } from "../App";
import { AppContext } from "../appContext";
import { ChatFlowsPayloadObj, ChatSessionPaylodObj } from "../Models";
import {
  InteractiveFlowNodes,
  InteractiveNodeTypes,
  NodeExecutionPayload,
} from "./InteractiveFlowUtils";
import {
  CUSTOMER,
  EXECUTE_FLOW_NODE_URL_PATH,
  EXECUTION_LIST_FETCH_URL_PATH,
  OPENED_CHAT,
  OPENED_FLOW,
  START_FLOW_URL_PATH,
  VISITOR_UUID,
} from "../globals";
import { getReq, postReq } from "../request";
import IrrelevantNode from "./interactiveNodes/IrrelevantNode";
import { getFormMetaData } from "../Utils";
export interface InteractiveFlowProps {
  showConversation(): void;
  backToHome: () => void;
  addNewSession: (arg0: ChatSessionPaylodObj) => void;
}
const InteractiveFlow = (props: InteractiveFlowProps) => {
  const parentContext = useContext(AppContext);

  const { chatPrefs, chatFlows, changeActiveTab } = parentContext;

  const detectedChatFlow = chatFlows.find(
    (flow) => flow.id === getSessionStoragePrefs(OPENED_FLOW)
  );
  if (!detectedChatFlow) {
    changeActiveTab(widgetFooterTabs.Home);
  }

  const [chatFlow] = useState<ChatFlowsPayloadObj>(
    detectedChatFlow ? detectedChatFlow : ({} as ChatFlowsPayloadObj)
  );

  const [loading, setLoading] = useState<boolean>(true);

  const [executionMeta, setExecutionMeta] = useState<any>({});
  const [executionList, setExecutionList] = useState<NodeExecutionPayload[]>(
    []
  );

  useEffect(() => {
    // Start chat flow
    let flowExecutionId = getSessionStoragePrefs("flow_execution_id");
    if (flowExecutionId) {
      // Get exections and set data
      getFlowExecution(flowExecutionId);
    } else {
      // Start flow
      startFlowExecution();
    }
  }, []);

  const getFlowExecution = async (flowExecutionId: string) => {
    const wait = getReq(EXECUTION_LIST_FETCH_URL_PATH + flowExecutionId, {});
    wait
      .then((response) => {
        setLoading(false);

        if (
          !response.data ||
          !response.data.executionMeta ||
          !response.data.executionList
        ) {
          startFlowExecution();
          return;
        }

        setExecutionMeta({ ...response.data.executionMeta });
        setExecutionList([...response.data.executionList]);

        setScrollBottom();
      })
      .catch(() => {
        startFlowExecution();
      });
  };

  const executeNodeOnUserInteraction = (execution: NodeExecutionPayload) => {
    const wait = postReq(EXECUTE_FLOW_NODE_URL_PATH, execution);
    wait
      .then((response) => {
        const newExecutionList = response.data.executionList;
        setExecutionMeta({ ...response.data.executionMeta });
        if (response.data.executionMeta?.info?.customer)
          setSessionStoragePrefs(
            CUSTOMER,
            JSON.stringify(response.data.executionMeta?.info?.customer)
          );
        // Write logic to update existing ids, and push new executions
        setExecutionList([
          ...executionList.filter(
            (execution) => execution.id != newExecutionList[0].id
          ),
          ...newExecutionList,
        ]);
        if (newExecutionList[newExecutionList.length - 1].info?.session) {
          const session =
            newExecutionList[newExecutionList.length - 1].info.session;
          removeSessionStoragePrefs(OPENED_CHAT);
          removeSessionStoragePrefs("flow_execution_id");
          props.addNewSession(session);
          setSessionStoragePrefs(OPENED_CHAT, session.id);
          props.showConversation();
        } else if (
          newExecutionList[newExecutionList.length - 1].executed &&
          !newExecutionList[newExecutionList.length - 1].nextNodeId &&
          newExecutionList[newExecutionList.length - 1].node.data.nodeType ==
            InteractiveNodeTypes.END &&
          newExecutionList[newExecutionList.length - 1].node.data.formData
            ?.action == "end"
        ) {
          removeSessionStoragePrefs(OPENED_CHAT);
          removeSessionStoragePrefs("flow_execution_id");
          goBack();
        }

        setScrollBottom();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const startFlowExecution = async () => {
    const wait = postReq(
      START_FLOW_URL_PATH + "/" + chatFlow.id + "/" + VISITOR_UUID,
      {
        id: chatFlow.id,
        meta_data: JSON.stringify(getFormMetaData()),
        matched_bot_id: chatPrefs.matchedBotPrefs?.id,
        channelId: chatPrefs.id,
        channelType: "CHAT",
      }
    );
    wait
      .then((response) => {
        setLoading(false);

        if (
          !response.data ||
          !response.data.executionMeta ||
          !response.data.executionList
        )
          return;
        // const newExecutionList = response.data.executionList;

        // if (
        //   newExecutionList[newExecutionList.length - 1].executed &&
        //   !newExecutionList[newExecutionList.length - 1].nextNodeId &&
        //   newExecutionList[newExecutionList.length - 1].node.data.nodeType ==
        //     InteractiveNodeTypes.END
        // ) {
        //   removeSessionStoragePrefs(OPENED_CHAT);
        //   removeSessionStoragePrefs("flow_execution_id");
        //   props.backToHome();
        //   return;
        // }

        setSessionStoragePrefs(
          "flow_execution_id",
          response.data.executionMeta.id
        );

        setExecutionMeta({ ...response.data.executionMeta });

        setExecutionList([...response.data.executionList]);

        setScrollBottom();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const setScrollBottom = () => {
    // setTimeout(() => {
    var elem = document.getElementsByClassName("chat__messages-track")[0];
    if (elem) elem.scrollTop = elem.scrollHeight;
    // }, 100);
  };

  const getHeaderIcon = () => {
    return parentContext.chatPrefs.meta.decoration.headerPictureUrl;
  };

  const getHeaderName = () => {
    if (parentContext.chatPrefs.name) return parentContext.chatPrefs.name;
  };

  const goBack = () => {
    // Empty existing
    removeSessionStoragePrefs(OPENED_FLOW);
    removeSessionStoragePrefs("flow_execution_id");

    changeActiveTab(widgetFooterTabs.Home);
  };

  return (
    <div className="chat__conversation">
      <div className="chat__header">
        <div className="chat__header-action">
          <div
            data-trigger="all"
            className="chat__header-back"
            onClick={() => goBack()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              color="currentColor"
            >
              <path
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7"
                d="m14 18-6-6 6-6"
              ></path>
            </svg>
          </div>
          <div className="chat__header-user">
            <div>
              <div
                className="chat__header-user-img"
                style={{ backgroundImage: 'url("' + getHeaderIcon() + '")' }}
              ></div>
            </div>

            <div className="chat__header-user-title">
              <h1 className="chat__header-user-name"> {getHeaderName()} </h1>
              {/* <p className="chat__header-user-lastseen">Active 30m ago</p> */}
            </div>
          </div>
        </div>

        <div className="chat__help-end">
          <CloseWidgetPanel />
        </div>
      </div>

      <div className="chat__content">
        <div className="chat__messages">
          <div className="chat__messages-track">
            <div>
              {loading && (
                <p style={{ marginTop: "60px", textAlign: "center" }}>
                  <div className="chat__form-loader1">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </p>
              )}

              {!loading &&
                executionList &&
                executionList.length &&
                executionList.map(
                  (exe: NodeExecutionPayload, index: number) => {
                    console.log(
                      exe.node.type as unknown as InteractiveNodeTypes
                    );
                    const Node =
                      exe.node.type !== "ACTION"
                        ? InteractiveFlowNodes[exe.node.type]
                        : InteractiveFlowNodes[exe.node.data.nodeType];
                    if (
                      exe.node.data.nodeType == InteractiveNodeTypes.END
                      // &&
                      // (exe.node.data.formData?.action == "ticket" || exe.node.data.formData?.action == "end")
                    )
                      return <></>;
                    if (
                      (exe.node.data.nodeType ==
                        InteractiveNodeTypes.ORDER_SELECTION ||
                        exe.node.data.nodeType ==
                          InteractiveNodeTypes.ITEM_SELECTION) &&
                      executionMeta &&
                      executionMeta.info &&
                      !executionMeta.info.customerId
                    ) {
                      return (
                        <IrrelevantNode
                          backToHome={props.backToHome}
                          content={
                            "No customer available to fetch orders and items for"
                          }
                        />
                      );
                    }
                    if (
                      exe.node.data.nodeType ==
                        InteractiveNodeTypes.ITEM_SELECTION &&
                      executionMeta &&
                      executionMeta.info &&
                      !executionMeta.info.orderId
                    ) {
                      return (
                        <IrrelevantNode
                          backToHome={props.backToHome}
                          content={"No order available to select items from"}
                        />
                      );
                    }
                    return (
                      <>
                        {Node ? (
                          <>
                            <Node
                              execution={exe}
                              executionMeta={executionMeta}
                              executeNodeOnUserInteraction={
                                executeNodeOnUserInteraction
                              }
                            />
                          </>
                        ) : (
                          <>{JSON.stringify(exe)}</>
                        )}
                      </>
                    );
                  }
                )}
            </div>
          </div>

          <div className="chat__messages-sign hide">
            <a target="_blank">
              We
              <img
                src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/livechat/love-icon.svg"
                width="12px"
              />
              EngageBay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveFlow;
