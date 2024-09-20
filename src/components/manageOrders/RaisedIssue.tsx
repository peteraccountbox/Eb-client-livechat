import React, { useContext, useEffect } from "react";
import { AppContext, OrderManagementContext } from "../../appContext";
import OrderDetails from "./OrderDetails";
import { CHANNEL_ID, VISITOR_UUID } from "../../globals";
import {
  ChatMessagePayloadObj,
  EventPayloadObj,
  MessageByTypeEnum,
  MessageFormatType,
} from "../../Models";
import { renderToString } from "react-dom/server";
import { OrderManageTypes } from "../TrackManageUtils";

const RaisedIssue = (props: any) => {
  const orderManagementContext = useContext(OrderManagementContext);
  const { backToHome, startNewChat } = props;
  const parentContext = useContext(AppContext);
  const { createSessionData } = parentContext;
  const {
    setPrevComponent,
    setPrevData,
    managementComponent,
    setManagementComponent,
    data: { order, reason, fulfillment, item },
    setData,
    customer,
  } = orderManagementContext;
  const orderDetails = JSON.parse(order.meta);

  const createTicket = () => {
    let message: ChatMessagePayloadObj = {
      bodyHTML: renderToString(
        <>
          {reason.title}
          <br />
          ---------------------------------------
          {orderDetails && (
            <OrderDetails order={order} fulfillment={fulfillment} item={item} />
          )}
        </>
      ),
      bodyText: renderToString(
        <>
          {reason.title}
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
      bodyText: reason.automatedMessage,
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

  useEffect(() => {
    setPrevComponent(OrderManageTypes.REPORT_ISSUE);
    setPrevData({ order, reason, fulfillment });
  }, []);
  return (
    <>
      <div className="chat__messages-group--me">
        <div className="chat__messages-group">
          <ul className="chat__messages-list">
            <div className="chat__messages-list-item">
              <div className="chat__messages-bubble chat__message-type-TEXT">
                <span className="actual">
                  {reason.title}
                  <br />
                  ---------------------------------------
                  {orderDetails && (
                    <OrderDetails
                      order={order}
                      fulfillment={fulfillment}
                      item={item}
                    />
                  )}
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
              <span className="actual">{reason.automatedMessage}</span>
            </div>
          </div>
        </ul>
      </div>

      {reason.showHelpfulPrompt && (
        <>
          <div className="chat__messages-group">
            <ul className="chat__messages-list">
              <div className="chat__messages-list-item">
                <div className="chat__messages-bubble chat__message-type-TEXT">
                  <span className="actual">Was this helpful?</span>
                </div>
              </div>
            </ul>
          </div>
          <div className="chat__messages-group">
            <div className="chat__messages-list multi_choice-list">
              <div
                className="multi_choice-list-item-btn"
                onClick={() => backToHome()}
              >
                <span className="actual">Yes, Close This Request</span>
              </div>
              <div
                className="multi_choice-list-item-btn"
                onClick={() => createTicket()}
              >
                <span className="actual">No, I Need More Help</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RaisedIssue;
