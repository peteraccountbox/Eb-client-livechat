import React from "react";

const ManageActions = (props: any) => {
  const { orderManagement, orderDetails } = props;
  return (
    <>
      {orderManagement.trackOrderPolicy.enabled && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
      )}

      {orderManagement.cancelOrderPolicy.enabled &&
        orderManagement.cancelOrderPolicy.eligibilities[0].value ===
          orderDetails.fulfillment_status && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
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
        )}
      {orderManagement.reportIssuePolicy.enabled && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
      )}
    </>
  );
};

export default ManageActions;
