import React, { useContext, useEffect, useState } from "react";
import { getReq } from "../../request";
import { ORDERS_FETCH_URL } from "../../globals";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import { AppContext } from "../../appContext";

const people = [1, 2, 3, 4, 5];

const OrderSelection: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
  executionMeta,
}: InteractiveNodeProps) => {
  const parentContext = useContext(AppContext);
  const { chatPrefs } = parentContext;
  useEffect(() => {
    getReq(ORDERS_FETCH_URL, {
      customerId: executionMeta.info.customerId,
      storeId: chatPrefs.meta.storeId,
    }).then((response) => {
      console.log(response.data);
      setOrders(response.data.content);
    });
  }, []);

  const [orders, setOrders] = useState<any>([]);

  const selectOrder = (order: any) => {
    execution.nodeId = execution.node.id;
    execution.executed = true;
    execution.responseAction = [
      {
        id: execution.node.id,
        type: "order_selection",
        data: order.meta,
      },
    ];
    executeNodeOnUserInteraction(execution);
  };

  const orderDetails =
    execution.responseAction && execution.responseAction.length > 0
      ? JSON.parse(JSON.parse(execution.responseAction[0].data).$r_extra)
      : null;
  return (
    <>
      {execution.executed && orderDetails ? (
        <div className="chat__messages-group--me">
          <ul className="chat__messages-list">
            <div className="chat__messages-list-item">
              <div className="chat__messages-bubble chat__message-type-TEXT">
                <span className="actual">
                  {orderDetails.name} - {orderDetails.currency}
                  {orderDetails.current_total_price} - {orderDetails.created_at}
                </span>
              </div>
            </div>
          </ul>
        </div>
      ) : (
        <>
          <header className="">
            <h2 className="title">My orders </h2>
            <p className="desc">{execution.node.data.formData?.message}</p>
          </header>
          <ul className="help__collections-list">
            {orders.length > 0 &&
              orders.map((order: any) => {
                const orderDetails = JSON.parse(
                  JSON.parse(order.meta).$r_extra
                );
                return (
                  <div
                    className=""
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0px",
                      alignItems: "center",
                    }}
                    onClick={() => selectOrder(order)}
                  >
                    <div
                      className=""
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        style={{
                          width: "4rem",
                          height: "4rem",
                          borderRadius: "5px",
                        }}
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      />
                      <div style={{ marginLeft: "10px" }}>
                        <div>Order {orderDetails.name}</div>
                        <div>{orderDetails.created_at}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: "end" }}>
                      <div>
                        {orderDetails.currency}
                        {orderDetails.current_total_price}
                      </div>
                      <span>{orderDetails.financial_status}</span>
                    </div>
                  </div>
                );
              })}
          </ul>
        </>
      )}
    </>
  );
};

export default OrderSelection;
