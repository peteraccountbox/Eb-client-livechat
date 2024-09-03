import React from "react";
import Address from "./Address";
import ManageActions from "./ManageActions";

const Order = (props: any) => {
  const { data: order, actionCallback } = props;
  const orderDetails = JSON.parse(order.meta);

  return (
    <>
      <header className="">
        <h2 className="title">Order {orderDetails.name}</h2>
        <div>{orderDetails.created_at}</div>
      </header>
      <h3>Summary</h3>

      <div
        className=""
        style={{
          justifyContent: "space-between",
          padding: "10px 0px",
          alignItems: "center",
        }}
        // onClick={() => selectOrder(order)}
      >
        <div className="" style={{ display: "flex", alignItems: "center" }}>
          <div>
            <h2>Shipment</h2>
          </div>
        </div>

        <div style={{ textAlign: "end" }}>
          <span>{orderDetails.fulfillment_status}</span>
        </div>
        {/* <ManageActions
          orderDetails={orderDetails}
        /> */}

        {orderDetails.line_items.map((item: any) => (
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
              <img
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "5px",
                }}
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              />
              <div style={{ marginLeft: "10px" }}>
                <div>{item.name}</div>
                <div>
                  {item.price}
                  {orderDetails.currency} x{item.quantity}
                </div>
              </div>
            </div>
          </div>
        ))}

        <Address type={"Shipping"} address={orderDetails.shipping_address} />

        <Address type={"Billing"} address={orderDetails.billing_address} />
      </div>
    </>
  );
};

export default Order;
