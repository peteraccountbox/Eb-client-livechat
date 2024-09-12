import React, { useContext } from "react";
import Address from "./Address";
import { AppContext, OrderManagementContext } from "../../appContext";

const Track = () => {
  const orderManagementContext = useContext(OrderManagementContext);
  const {
    data: { order },
  } = orderManagementContext;
  const orderDetails = JSON.parse(order.meta);
  const parentContext = useContext(AppContext);

  const {
    chatPrefs: {
      orderManagement: { trackOrderPolicy },
    },
  } = parentContext;
  return (
    <>
      <div className="track__orders-details">
        <div
          className="orders__collections-line-items-group"
          // onClick={() => selectOrder(order)}
        >
          <div className="orders__collections-line-items track__orders-list-item">
            <div className="orders__collections-line-items-avatar">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
            </div>

            <div className="orders__collections-line-items-details">
              <h2 className="orders__collections-line-items-name">
                Order {orderDetails.name}
              </h2>
              <div className="orders__collections-line-items-currency">
                {orderDetails.created_at}
              </div>
            </div>
          </div>
        </div>

        <div className="timeline__block-container">
          <div className="timeline__block timeline__block-right">
            <div className="marker active">
              {/* <i className="fa fa-check active" aria-hidden="true"></i> */}
            </div>
            <div className="timeline__block-content">
              <h3>Order placed</h3>
              <span>{orderDetails.created_at}</span>
              {trackOrderPolicy.unfulfilledMessage && (
                <p>{trackOrderPolicy.unfulfilledMessage}</p>
              )}
            </div>
          </div>

          <div className="timeline__block timeline__block-left">
            <div className="marker">
              {/* <i className="fa fa-check" aria-hidden="true"></i> */}
            </div>
            <div className="timeline__block-content">
              <h3>Confirmed</h3>
              <span>Last updated Time Ago {orderDetails.updated_at}</span>
            </div>
          </div>
        </div>

        {orderDetails.shipping_address && (
          <Address type={"Shipping"} address={orderDetails.shipping_address} />
        )}
      </div>
    </>
  );
};

export default Track;
