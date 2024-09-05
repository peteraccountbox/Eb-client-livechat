import React, { useContext, useEffect, useState } from "react";
import ManageActions from "./ManageActions";
import { getReq } from "../../request";
import { ORDERS_FETCH_URL } from "../../globals";
import { AppContext, OrderManagementContext } from "../../appContext";
import { OrderManageTypes } from "../TrackManageUtils";

const Orders = () => {
  const orderManagementContext = useContext(OrderManagementContext);
  const {
    setPrevComponent,
    setPrevData,
    setManagementComponent,
    data: { customerId },
    setData,
  } = orderManagementContext;

  useEffect(() => {
    setPrevComponent("");
    setPrevData({
      customerId,
    });
  }, []);

  const action = (order: any) => {
    setPrevComponent(OrderManageTypes.ORDERS);
    setPrevData({ customerId: customerId });
    setManagementComponent(OrderManageTypes.ORDER);
    setData(order);
  };
  const [orders, setOrders] = useState<any>([]);
  const parentContext = useContext(AppContext);
  const { chatPrefs } = parentContext;

  useEffect(() => {
    if (customerId)
      getReq(ORDERS_FETCH_URL, {
        customerId: customerId,
        storeId: chatPrefs.meta.storeId,
      }).then((response) => {
        console.log(response.data);
        setOrders(response.data.content);
      });
  }, []);
  return (
    <>
      <header className="">
        <h2 className="title">My orders </h2>
      </header>
      <ul className="help__collections-list">
        {orders.length > 0 &&
          orders.map((order: any) => {
            const orderDetails = JSON.parse(order.meta);

            return (
              <div onClick={() => action(order)}>
                <div
                  className=""
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0px",
                    alignItems: "center",
                  }}
                  onClick={() => action(order)}
                >
                  <div
                    className=""
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div>
                      <h2>Order {orderDetails.name}</h2>
                      <div>Shipment</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "end" }}>
                    <div>
                      {orderDetails.currency}
                      {orderDetails.current_total_price}
                    </div>
                    <div>{orderDetails.fulfillment_status}</div>
                  </div>
                </div>
                <ManageActions />

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
                        src={`${
                          item.product_image_url
                            ? item.product_image_url
                            : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        }`}
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
              </div>
            );
          })}
      </ul>
    </>
  );
};

export default Orders;
