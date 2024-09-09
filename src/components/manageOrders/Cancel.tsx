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

const Cancel = (props: any) => {
  const orderManagementContext = useContext(OrderManagementContext);
  const { data: order } = orderManagementContext;
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
          <OrderDetails order={order} />
        </>
      ),
      bodyText: renderToString(
        <>
          I'd like to cancel the following fulfillment:
          <br />
          ---------------------------------------
          <OrderDetails order={order} />
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
      <header className="">
        <h2 className="title">Cancel fulfillment</h2>
      </header>
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
          </div>
        </div>

        <div style={{ textAlign: "end" }}>
          <span>{orderDetails.fulfillment_status}</span>
        </div>
      </div>
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

      <span
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <button className="chat__messages-btn" onClick={() => createTicket()}>
          Request Cancellation
        </button>
      </span>
    </>
  );
};

export default Cancel;
