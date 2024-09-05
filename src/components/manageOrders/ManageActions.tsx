import React, { useContext } from "react";
import { AppContext, OrderManagementContext } from "../../appContext";
import { OrderManageTypes } from "../TrackManageUtils";
import { getSessionStoragePrefs } from "../../Storage";
import { CUSTOMER_ID_ON_TRACK_MANAGE } from "../../globals";

const ManageActions = () => {
  const orderManagementContext = useContext(OrderManagementContext);
  const {
    setPrevComponent,
    setPrevData,
    managementComponent,
    setManagementComponent,
    data: order,
    setData,
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
        customerId: getSessionStoragePrefs(CUSTOMER_ID_ON_TRACK_MANAGE),
      });
    setManagementComponent(type);
    setData(order);
  };
  return (
    <>
      {/* {orderManagement.trackOrderPolicy.enabled && ( */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => action(OrderManageTypes.TRACK)}
      >
        <button
          className="chat__messages-btn"
          style={{
            display: "flex",
            alignItems: "center",
            width: "auto",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Track
        </button>
      </span>
      {/* )} */}

      {/* {orderManagement.cancelOrderPolicy.enabled &&
        orderManagement.cancelOrderPolicy.eligibilities[0].value ===
          orderDetails.fulfillment_status && ( */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => action(OrderManageTypes.CANCEL)}
      >
        <button
          className="chat__messages-btn"
          style={{
            display: "flex",
            alignItems: "center",
            width: "auto",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Cancel
        </button>
      </span>
      {/* )} */}
      {/* {orderManagement.reportIssuePolicy.enabled && ( */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => action(OrderManageTypes.REPORT_ISSUE)}
      >
        <button
          className="chat__messages-btn"
          style={{
            display: "flex",
            alignItems: "center",
            width: "auto",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Report issue
        </button>
      </span>
      {/* )} */}
    </>
  );
};

export default ManageActions;
