import React, { useContext, useEffect, useState } from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import { getReq } from "../../request";
import { ORDER_FETCH_URL } from "../../globals";
import { AppContext } from "../../appContext";
const people = [1, 2, 3, 4, 5];

const ItemSelection: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
  executionMeta,
}: InteractiveNodeProps) => {
  const parentContext = useContext(AppContext);
  const { chatPrefs } = parentContext;
  useEffect(() => {
    getReq(ORDER_FETCH_URL, {
      customerId: executionMeta.info.customerId,
      storeId: chatPrefs.meta.storeId,
      orderId: executionMeta.info.orderId,
    }).then((response) => {
      setItems(JSON.parse(JSON.parse(response.data.meta).$r_extra).line_items);
      setOrderDetails(JSON.parse(JSON.parse(response.data.meta).$r_extra));
      console.log(response.data);
    });
  }, []);

  const [items, setItems] = useState<any>([]);

  const [orderDetails, setOrderDetails] = useState<any>();

  const selectItem = () => {};

  return orderDetails ? (
    <>
      <header className="collection-header">
        <h2 className="title">Select items</h2>
        <p className="desc">{execution.node.data.formData?.message}</p>
        <div
          className=""
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <div>
            <h2 className="title">Order {orderDetails.name} </h2>
            <p className="desc">{orderDetails.created_at} </p>
          </div>
          <div>
            <h2 className="title" style={{ textAlign: "end" }}>
              {orderDetails.currency}
              {orderDetails.current_total_price}
            </h2>
            <p className="desc">selected Items count</p>
          </div>
        </div>
      </header>
      <ul className="help__collections-list">
        {items.length > 0 &&
          items.map((item: any) => (
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 20px",
              }}
            >
              <div className="" style={{ display: "flex", width: "100%" }}>
                <img
                  style={{ width: "5rem", height: "5rem", borderRadius: "5px" }}
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                />
                <div style={{ marginLeft: "10px", width: "100%" }}>
                  <div>{item.name}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div>
                        {orderDetails.currency}
                        {item.price}
                      </div>
                      <span>Quantity : {item.quantity}</span>
                    </div>
                    {/* <div onClick={() => selectItem()}>
                      {" "}
                      - {item.current_quantity} +{" "}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </ul>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          className="chat__messages-btn"
          // onClick={submitForm}
          style={{
            display: "flex",
            alignItems: "center",
            width: "auto",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Select Items
        </button>
      </span>
    </>
  ) : (
    <></>
  );
};

export default ItemSelection;
