import React, { useContext } from "react";
import { OrderManagementContext } from "../../appContext";

const CancelNode = (props: any) => {
  const { cancelOrderPolicy } = props;
  const orderManagementContext = useContext(OrderManagementContext);
  const { data: order } = orderManagementContext;
  const orderDetails = JSON.parse(order.meta);
  const { address1, city, province_code, zip } = orderDetails.shipping_address;
  return (
    <>
      <div className="chat__messages-group--me">
        <div className="chat__messages-group">
          <ul className="chat__messages-list">
            <div className="chat__messages-list-item">
              <div className="chat__messages-bubble chat__message-type-TEXT">
                <span className="actual">
                  I'd like to cancel the following fulfillment
                  <br />
                  ---------------------------------------
                  <br />
                  Order number: {orderDetails.name}
                  <br />
                  Fulfillment: {orderDetails.name}.0
                  <br />
                  Item names:
                  {orderDetails.line_items.map((item: any, index: number) =>
                    index > 0 ? ", " : "" + item.name
                  )}
                  Tracking Url: {orderDetails.fulfillments[0]?.tracking_url}
                  <br />
                  Order Created: {orderDetails.created_at}
                  Shipping address: {address1}, {city}, {province_code}, {zip}
                </span>
              </div>
            </div>
          </ul>
        </div>
      </div>
      <div className="chat__messages-group">
        <ul className="chat__messages-list">
          <div className="chat__messages-list-item">
            <div className="chat__messages-bubble chat__message-type-TEXT">
              <span className="actual">
                {cancelOrderPolicy.automatedMessage}
              </span>
            </div>
          </div>
        </ul>
        <div className="chat__all-messages-item-header">
          <p className="chat-messages-username"> Automated</p>
        </div>
      </div>
    </>
  );
};

export default CancelNode;
