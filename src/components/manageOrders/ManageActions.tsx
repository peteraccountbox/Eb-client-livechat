import React, { useContext } from "react";
import { AppContext, OrderManagementContext } from "../../appContext";
import { OrderManageTypes } from "../TrackManageUtils";

const ManageActions = () => {
  const orderManagementContext = useContext(OrderManagementContext);
  const {
    setPrevComponent,
    setPrevData,
    managementComponent,
    setManagementComponent,
    data: order,
    setData,
    customer,
  } = orderManagementContext;
  const parentContext = useContext(AppContext);
  const {
    chatPrefs: { orderManagement },
  } = parentContext;
  const action = (type: string) => {
    setPrevComponent(managementComponent);
    if (managementComponent === OrderManageTypes.ORDER) setPrevData(order);
    else
      setPrevData({
        customerId: customer?.id,
      });
    setManagementComponent(type);
    setData(order);
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
