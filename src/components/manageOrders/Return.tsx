import React, { useContext, useEffect, useReducer, useState } from "react";
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

const Return = (props: any) => {
  const orderManagementContext = useContext(OrderManagementContext);
  const {
    data: { order, fulfillment, item },
  } = orderManagementContext;
  const orderDetails = JSON.parse(order.meta);
  const parentContext = useContext(AppContext);
  const { startNewChat } = props;
  const { createSessionData } = parentContext;
  const reducer = (currentState: any, action: any) => {
    let newState = [...currentState];
    let index = -1;
    switch (action.type) {
      case "selectAll":
        newState = currentState.map((state: any) => {
          return { ...state, isSelect: true };
        });
        return newState;
        break;
      case "removeAll":
        newState = currentState.map((state: any) => {
          return { ...state, isSelect: false };
        });
        return newState;
        break;
      case "select":
        index = newState.findIndex((state: any) => state.id == action.id);
        if (index != -1) newState[index].isSelect = true;
        return newState;
        break;
      case "disselect":
        index = newState.findIndex((state: any) => state.id == action.id);
        if (index != -1) newState[index].isSelect = false;
        return newState;
        break;
      case "incr":
        index = newState.findIndex((state: any) => state.id == action.id);
        if (index != -1) newState[index].quantity++;
        return newState;
        break;
      case "decr":
        index = newState.findIndex((state: any) => state.id == action.id);
        if (index != -1) newState[index].quantity--;
        return newState;
        break;
      default:
        break;
    }
  };
  const initialState = [
    { quantity: item.quantity, isSelect: false, id: item.id },
  ];
  // fulfillment.line_items.reduce((acc: [], item: any) => {
  //   item = orderDetails.line_items.find(
  //     (line_item: any) => line_item.id == item.id
  //   );
  //   return [...acc, { quantity: item.quantity, isSelect: false, id: item.id }];
  // }, []);
  const [returnItems, dispatch] = useReducer(reducer, initialState);
  console.log(returnItems);

  const handleSelectAll = (e: any) => {
    if (e.currentTarget.checked) dispatch({ type: "selectAll" });
    else dispatch({ type: "removeAll" });
  };

  const handleSelect = (e: any, id: any) => {
    if (e.currentTarget.checked) dispatch({ type: "select", id });
    else dispatch({ type: "disselect", id });
  };

  useEffect(() => {
    console.log(JSON.stringify(returnItems));
  }, [JSON.stringify(returnItems)]);

  const {
    chatPrefs: {
      orderManagement: { returnOrderPolicy },
    },
  } = parentContext;

  const customer = JSON.parse(getSessionStoragePrefs(CUSTOMER));

  const createTicket = () => {
    if (!returnItems || returnItems?.length == 0) return;

    let message: ChatMessagePayloadObj = {
      bodyHTML: renderToString(
        <>
          I'd like to return the following items :
          <br />
          ---------------------------------------
          {orderDetails && (
            <OrderDetails
              order={order}
              returnItems={returnItems}
              fulfillment={fulfillment}
              item={item}
            />
          )}
        </>
      ),
      bodyText: renderToString(
        <>
          I'd like to return the following items:
          <br />
          ---------------------------------------
          {orderDetails && (
            <OrderDetails
              order={order}
              returnItems={returnItems}
              fulfillment={fulfillment}
              item={item}
            />
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
      bodyText: returnOrderPolicy.automatedMessage,
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

  const selectAll = returnItems?.every((item: any) => item.isSelect == true);

  const select = returnItems?.some((item: any) => item.isSelect == true);
  const isChecked = returnItems?.find(
    (rItem: any) => rItem.id == item.id && rItem.isSelect == true
  );

  const quantity = returnItems?.find(
    (rItem: any) => rItem.id == item.id
  ).quantity;

  return (
    <>
      <div className="orders__collections">
        <header>
          <h2 className="orders__collections-title">Return items</h2>
        </header>
        <div className="orders__collections-list order__return__collections--list">
          <div className="orders__collections-list-order-header pb-2">
            <div className="orders__collections-list-order-header-title">
              Order {orderDetails.name}
            </div>
          </div>
          <div className="selected__all-group">
            <input
              type="checkbox"
              id="select-all"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e)}
            />
            <label className="select__all-label" htmlFor="select-all">
              Select all
            </label>
          </div>
          <ul className="orders__collections-line-items-group order__return-items-group">
            {/* {
            fulfillment.line_items.map((item: any) => {
              const quantity = returnItems?.find(
                (rItem: any) => rItem.id == item.id
              ).quantity;
              const isChecked = returnItems?.find(
                (rItem: any) => rItem.id == item.id && rItem.isSelect == true
              );
              item = orderDetails.line_items.find(
                (line_item: any) => line_item.id == item.id
              );
              return (
                <> */}
            <li className="orders__collections-line-items order__return-items">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleSelect(e, item.id)}
              />
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
                  {item.price}
                </div>
                <div className="orders__collections-line-items-currency">
                  Quantity:
                  {item.quantity}
                </div>
                {isChecked && (
                  <div>
                    {quantity > 1 && (
                      <span
                        onClick={() => dispatch({ type: "decr", id: item.id })}
                      >
                        -
                      </span>
                    )}{" "}
                    {quantity}{" "}
                    {quantity < item.quantity && (
                      <span
                        onClick={() => dispatch({ type: "incr", id: item.id })}
                      >
                        +
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
            {/* </>
              );
            })} */}
          </ul>

          <div className="orders__collections-cancellation-btn">
            <button
              className="chat__messages-btn"
              onClick={() => createTicket()}
              disabled={
                !returnItems ||
                returnItems?.length === 0 ||
                !returnItems.find((returnItem) => returnItem.isSelect)
              }
            >
              Request Return
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Return;
