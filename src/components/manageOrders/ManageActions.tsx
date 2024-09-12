import React, { useContext } from "react";
import { AppContext, OrderManagementContext } from "../../appContext";
import { OrderManageTypes } from "../TrackManageUtils";

const ManageActions = (props: any) => {
  const orderManagementContext = useContext(OrderManagementContext);
  const {
    setPrevComponent,
    setPrevData,
    managementComponent,
    setManagementComponent,
    data,
    setData,
    customer,
  } = orderManagementContext;
  const { order, fulfillment } = props;
  const parentContext = useContext(AppContext);
  const {
    chatPrefs: {
      orderManagement: {
        cancelOrderPolicy,
        reportIssuePolicy,
        returnOrderPolicy: {
          eligibilities: [eligibility],
        },
        trackOrderPolicy,
      },
    },
  } = parentContext;
  const orderDetails = JSON.parse(order.meta);
  const date = new Date(orderDetails.created_at);
  const fulfillmentDate = new Date(fulfillment?.created_at);
  const isValidReturn = () => {
    switch (eligibility.attribute) {
      case "order_created":
        return new Date().getDay() - date.getDay() < eligibility.value;
        break;
      case "order_delivered":
        return (
          fulfillment &&
          new Date().getDay() - fulfillmentDate.getDay() < eligibility.value
        );
        break;
      default:
        break;
    }
  };

  const action = (type: string) => {
    setPrevComponent(managementComponent);
    if (managementComponent === OrderManageTypes.ORDER) setPrevData(order);
    else
      setPrevData({
        customerId: customer?.id,
      });
    setManagementComponent(type);
    setData({ order, fulfillment });
  };
  return (
    <>
      <div className="orders__collections-action-buttons-list">
        {/* {orderManagement.trackOrderPolicy.enabled && ( */}
        <span
          className="orders__collections-action-buttons-list-type"
          onClick={() => action(OrderManageTypes.TRACK)}
        >
          <button
            type="button"
            className="orders__collections-action-buttons-list-type-btn"
          >
            Track
          </button>
        </span>
        {/* )} */}

        {/* {orderManagement.cancelOrderPolicy.enabled &&
        orderManagement.cancelOrderPolicy.eligibilities[0].value ===
          orderDetails.fulfillment_status && ( */}
        <span
          className="orders__collections-action-buttons-list-type"
          onClick={() => action(OrderManageTypes.CANCEL)}
        >
          <button
            type="button"
            className="orders__collections-action-buttons-list-type-btn"
          >
            Cancel
          </button>
        </span>
        {/* )} */}
        {order &&
          fulfillment &&
          fulfillment.status !== "cancelled" &&
          isValidReturn() && (
            <span
              className="orders__collections-action-buttons-list-type"
              onClick={() => action(OrderManageTypes.RETURN)}
            >
              <button
                type="button"
                className="orders__collections-action-buttons-list-type-btn"
              >
                Return
              </button>
            </span>
          )}
        {/* {orderManagement.reportIssuePolicy.enabled && ( */}
        <span
          className="orders__collections-action-buttons-list-type"
          onClick={() => action(OrderManageTypes.REPORT_ISSUE)}
        >
          <button
            type="button"
            className="orders__collections-action-buttons-list-type-btn"
          >
            Report issue
          </button>
        </span>
        {/* )} */}
      </div>
    </>
  );
};

export default ManageActions;
