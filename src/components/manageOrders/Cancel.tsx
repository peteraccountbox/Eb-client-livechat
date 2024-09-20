import React, { useContext } from "react";
import { AppContext, OrderManagementContext } from "../../appContext";
import {
  ChatMessagePayloadObj,
  EventPayloadObj,
  MessageByTypeEnum,
  MessageFormatType,
} from "../../Models";
import { renderToString } from "react-dom/server";
import OrderDetails from "./OrderDetails";
import { CHANNEL_ID, CUSTOMER, VISITOR_UUID } from "../../globals";
import { getSessionStoragePrefs } from "../../Storage";
import OrderComponent from "./OrderComponent";

const Cancel = (props: any) => {
  const orderManagementContext = useContext(OrderManagementContext);
  const {
    data: { order, fulfillment, item },
  } = orderManagementContext;
  const orderDetails = JSON.parse(order.meta);
  const parentContext = useContext(AppContext);
  const { startNewChat } = props;
  const { createSessionData } = parentContext;

  const {
    chatPrefs: {
      orderManagement: { cancelOrderPolicy },
    },
  } = parentContext;

  const customer = JSON.parse(getSessionStoragePrefs(CUSTOMER));

  const createTicket = () => {
    let message: ChatMessagePayloadObj = {
      bodyHTML: renderToString(
        <>
          I'd like to cancel the following fulfillment:
          <br />
          ---------------------------------------
          {orderDetails && (
            <OrderDetails order={order} fulfillment={fulfillment} item={item} />
          )}
        </>
      ),
      bodyText: renderToString(
        <>
          I'd like to cancel the following fulfillment:
          <br />
          ---------------------------------------
          {orderDetails && (
            <OrderDetails order={order} fulfillment={fulfillment} item={item} />
          )}
        </>
      ),
      format: MessageFormatType.TEXT,
    } as ChatMessagePayloadObj;
    let event: EventPayloadObj = {
      eventType: "MESSAGE",
      source: "WEBSITE",
      visibility: "PUBLIC",
      from: MessageByTypeEnum.CUSTOMER,
      message: message,
      createdTime: new Date(),
    };
    createSessionData.messageList = [event];
    message = {
      bodyText: cancelOrderPolicy.automatedMessage,
      format: MessageFormatType.TEXT,
    } as ChatMessagePayloadObj;
    event = {
      eventType: "MESSAGE",
      source: "SYSTEM",
      visibility: "PUBLIC",
      from: MessageByTypeEnum.AGENT,
      message: message,
      createdTime: new Date(),
    };
    createSessionData.messageList.push(event);
    createSessionData.sessionDetails = {
      channelId: CHANNEL_ID,
      visitorId: VISITOR_UUID,
      channelType: "CHAT",
      createdSource: "WEBSITE",
      createdBy: MessageByTypeEnum.SYSTEM,
      customerEmail: customer.email,
      customerName: customer.firstName,
    };
    createSessionData.force = true;
    startNewChat();
  };

  return (
    <>
      <div className="orders__collections">
        <header>
          <h2 className="orders__collections-title">Cancel fulfillment</h2>
        </header>
        <div className="orders__collections-list">
          <div className="orders__collections-list-order-header pb-2">
            <div className="orders__collections-list-order-header-title">
              Order {orderDetails.name}
            </div>
            <div className="orders__collections-list-fulfillment-header-status">
              {item.fulfillment_status && (
                <span className="orders__collections-list-fulfillment-header-badge">
                  {item.fulfillment_status}
                </span>
              )}
            </div>
          </div>

          {/* {orderDetails.line_items.map((item: any) => (
            <div className="orders__collections-line-items-group">
              <div className="orders__collections-line-items">
                <div className="orders__collections-line-items-avatar">
                  <img
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "5px",
                    }}
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
          ))} */}
          <OrderComponent order={order} headers={false} item={item} />

          <div className="orders__collections-cancellation-btn">
            <button
              className="chat__messages-btn"
              onClick={() => createTicket()}
            >
              Request Cancellation
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cancel;
