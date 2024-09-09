import React, { useContext } from "react";
import Address from "./Address";
import { AppContext, OrderManagementContext } from "../../appContext";

const Track = () => {
  const orderManagementContext = useContext(OrderManagementContext);
  const { data: order } = orderManagementContext;
  const orderDetails = JSON.parse(order.meta);
  const parentContext = useContext(AppContext);

  const {
    chatPrefs: {
      orderManagement: { trackOrderPolicy },
    },
  } = parentContext;
  return (
    <>
      <div
        className=""
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 0px",
          alignItems: "center",
        }}
        // onClick={() => selectOrder(order)}
      >
        <div className="" style={{ display: "flex", alignItems: "center" }}>
          <div>
            <h2>Order {orderDetails.name}</h2>
            <div>{orderDetails.created_at}</div>
          </div>
        </div>

        <div style={{ textAlign: "end" }}>
          <img
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "5px",
            }}
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        </div>
      </div>
      <div>Order placed</div>
      <div>{orderDetails.created_at}</div>
      <div>{trackOrderPolicy.unfulfilledMessage}</div>
      <div>Confirmed</div>
      <div>Last updated Time Ago {orderDetails.updated_at}</div>
      {orderDetails.shipping_address && (
        <Address type={"Shipping"} address={orderDetails.shipping_address} />
      )}
    </>
  );
};

export default Track;
