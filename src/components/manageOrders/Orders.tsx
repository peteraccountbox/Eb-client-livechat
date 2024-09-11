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
  const [fetching, setFetching] = useState<any>([]);
  const parentContext = useContext(AppContext);
  const { chatPrefs } = parentContext;

  useEffect(() => {
    setFetching(true);
    if (customerId)
      getReq(ORDERS_FETCH_URL, {
        customerId: customerId,
        storeId: chatPrefs.meta.storeId,
      }).then((response) => {
        console.log(response.data);
        setOrders(response.data.content);
        setFetching(false);
      });
  }, []);
  return (
    <>
      {!fetching && orders.length === 0 ? (
        <>
          <div className="no__order_data">No orders found</div>
        </>
      ) : (
        <div className="orders__collections">
          <header>
            <h2 className="orders__collections-title">My orders</h2>
          </header>
          <div className="orders__collections-list">
            {orders.length > 0 &&
              orders &&
              orders.map((order: any) => {
                const orderDetails = JSON.parse(order.meta);

                if (
                  !orderDetails.line_items ||
                  orderDetails.line_items.length == 0
                )
                  return <></>;

                return (
                  <div
                    className="orders__collections-list-item"
                    onClick={() => action(order)}
                  >
                    <div
                      className="orders__collections-list-order-header"
                      onClick={() => action(order)}
                    >
                      <div className="orders__collections-list-order-header-title">
                        Order {orderDetails.name}
                      </div>

                      <div className="orders__collections-list-order-header-end">
                        <span>
                          {orderDetails.currency}
                          {orderDetails.current_total_price}
                        </span>
                      </div>
                    </div>
                    <div className="orders__collections-list-fulfillment-header">
                      <div className="orders__collections-list-fulfillment-header-title">
                        Shipment
                      </div>
                      <div className="orders__collections-list-fulfillment-header-status">
                        {orderDetails.fulfillment_status && (
                          <span className="orders__collections-list-fulfillment-header-badge">
                            {orderDetails.fulfillment_status}
                          </span>
                        )}
                      </div>
                    </div>
                    <ManageActions />

                    {orderDetails.line_items &&
                      orderDetails.line_items.map((item: any) => (
                        <div className="orders__collections-line-items-group">
                          <div className="orders__collections-line-items">
                            <div className="orders__collections-line-items-avatar">
                              <img
                                src={`${item.product_image_url
                                  ? item.product_image_url
                                  : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                  }`}
                              />
                            </div>
                            <div className="orders__collections-line-items-details">
                              <div className="orders__collections-line-items-name">
                                {item.name}
                              </div>
                              <div className="orders__collections-line-items-currency">
                                {orderDetails.currency}
                                {item.price} <span>x{item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
