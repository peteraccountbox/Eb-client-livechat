import React, { useContext, useEffect, useState } from "react";
import { getReq } from "../../request";
import { OPENED_FLOW, ORDERS_FETCH_URL } from "../../globals";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import { AppContext } from "../../appContext";
import Orders from "../manageOrders/Orders";
import { getSessionStoragePrefs } from "../../Storage";

const OrderSelection: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
  executionMeta,
}: InteractiveNodeProps) => {
  const parentContext = useContext(AppContext);
  const { chatPrefs, chatFlows } = parentContext;

  const chatFlow = chatFlows.find(
    (flow) => flow.id === getSessionStoragePrefs(OPENED_FLOW)
  );
  useEffect(() => {
    if (executionMeta && !executionMeta.isCompleted)
      getReq(ORDERS_FETCH_URL, {
        customerId: executionMeta.info.customerId,
        storeId: chatFlow?.storeId,
        sort: "createdTime,DESC",
      }).then((response) => {
        console.log(response.data);
        setOrders(response.data.content);
      });
  }, []);

  const [orders, setOrders] = useState<any>([]);

  const selectOrder = (order: any) => {
    execution.nodeId = execution.node.id;
    execution.executed = true;
    const orderDetails = JSON.parse(order.meta);
    const response = {
      name: orderDetails.name,
      total_price: orderDetails.total_price,
      currency: orderDetails.currency,
      created_at: orderDetails.created_at,
      order_id: orderDetails.id,
      order_number: orderDetails.order_number,
    };
    execution.responseAction = [
      {
        id: execution.node.id,
        type: "order_selection",
        data: JSON.stringify(response),
      },
    ];
    executeNodeOnUserInteraction(execution);
  };

  const orderDetails =
    execution.responseAction && execution.responseAction.length > 0
      ? JSON.parse(execution.responseAction[0].data)
      : null;
  return (
    <>
      {execution.executed && orderDetails ? (
        <div className="chat__messages-group--me">
          <div className="chat__messages-group">
            <ul className="chat__messages-list">
              <div className="chat__messages-list-item">
                <div className="chat__messages-bubble chat__message-type-TEXT">
                  <span className="actual">
                    {orderDetails.name} - {orderDetails.currency}
                    {orderDetails.total_price} - {orderDetails.created_at}
                  </span>
                </div>
              </div>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="flows_collections">
            <header>
              <h2 className="flows_collections-title">My orders </h2>
              <p className="flows_collections-desc">
                {execution.node.data.formData?.message}
              </p>
            </header>
            <ul className="flows_collections-list">
              {orders.length > 0 &&
                orders.map((order: any) => {
                  const orderDetails = JSON.parse(order.meta);

                  return (
                    <li
                      className="flows_collections-list-item"
                      onClick={() => selectOrder(order)}
                    >
                      <div className="flows_collections-list-item-avatar">
                        <div className="flows_collections-list-item-profile">
                          <img
                            alt="image"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          />
                        </div>
                      </div>
                      <div className="flows_collections-list-item-content">
                        <div className="flows_collections-list-item-name">
                          Order {orderDetails.name}
                        </div>
                        <div className="flows_collections-list-item-timegao">
                          {orderDetails.created_at}
                        </div>
                      </div>

                      <div className="flows_collections-list-item-price-info">
                        {orderDetails.currency && (
                          <div className="flows_collections-list-item-currency">
                            {orderDetails.currency}
                            <span className="flows_collections-list-item-total-price">
                              {orderDetails.current_total_price}
                            </span>
                          </div>
                        )}

                        <div className="flows_collections-list-item-status">
                          {orderDetails.fulfillment_status}
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default OrderSelection;
