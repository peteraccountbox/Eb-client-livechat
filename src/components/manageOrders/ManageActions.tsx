import React, { useContext } from "react";
import { AppContext, OrderManagementContext } from "../../appContext";
import { OrderManageTypes } from "../TrackManageUtils";
import shopifyValidateRules from "../orderConditionValidation/ShopifyConditionValidation";
import { PredicateJoinCondition } from "../orderConditionValidation/ConditionValidation";

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
  const { order, fulfillment, item, itemfulfillment } = props;
  const parentContext = useContext(AppContext);
  const {
    chatPrefs: {
      orderManagement: {
        cancelOrderPolicy,
        reportIssuePolicy,
        returnOrderPolicy,
        // : {
        //   eligibilities: [eligibility],
        // }
        trackOrderPolicy,
      },
    },
  } = parentContext;
  const orderDetails = JSON.parse(order.meta);
  // const date = new Date(orderDetails.created_at);
  // const fulfillmentDate = new Date(fulfillment?.created_at);
  // const isValidReturn = () => {
  //   switch (eligibility.attribute) {
  //     case "order_created":
  //       return new Date().getDay() - date.getDay() < eligibility.value;
  //       break;
  //     case "order_delivered":
  //       return (
  //         fulfillment &&
  //         new Date().getDay() - fulfillmentDate.getDay() < eligibility.value
  //       );
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const isValidCancel = () => {

  //   // Iterate

  //   switch (cancelOrderPolicy.eligibilities[0].value) {
  //     case "processing_fulfillment":
  //       return fulfillment ? fulfillment.status == "open" : false;
  //       break;
  //     case "unfulfilled":
  //       return fulfillment ? fulfillment.status == "pending" : true;
  //       break;
  //     case "pending_delivery":
  //       return fulfillment ? fulfillment.status == "success" : false;
  //     default:
  //       break;
  //   }
  // };

  const isValidCancel = shopifyValidateRules(
    order,
    cancelOrderPolicy.eligibilities,
    PredicateJoinCondition.OR,
    itemfulfillment,
    ""
  );

  const isValidReturn = shopifyValidateRules(
    order,
    returnOrderPolicy.eligibilities,
    PredicateJoinCondition.OR,
    itemfulfillment,
    ""
  );

  const isValidReport = reportIssuePolicy.scenarios.some((scenario: any) => {
    return (
      shopifyValidateRules(
        order,
        scenario.predicate,
        scenario.joinOperator,
        itemfulfillment,
        "shopify"
      ) == true
    );
  });
  const action = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    type: string
  ) => {
    event.stopPropagation();
    setPrevComponent(managementComponent);
    if (managementComponent === OrderManageTypes.ORDER) setPrevData(order);
    else
      setPrevData({
        customerId: customer?.id,
      });
    setManagementComponent(type);
    setData({ order, fulfillment, item });
  };
  return (
    <>
      <div className="orders__collections-action-buttons-list">
        {trackOrderPolicy.enabled && (
          <span
            className="orders__collections-action-buttons-list-type"
            onClick={(e) => action(e, OrderManageTypes.TRACK)}
          >
            <button
              type="button"
              className="orders__collections-action-buttons-list-type-btn"
            >
              Track
            </button>
          </span>
        )}

        {cancelOrderPolicy.enabled && isValidCancel && (
          <span
            className="orders__collections-action-buttons-list-type"
            onClick={(e) => action(e, OrderManageTypes.CANCEL)}
          >
            <button
              type="button"
              className="orders__collections-action-buttons-list-type-btn"
            >
              Cancel
            </button>
          </span>
        )}
        {order &&
          itemfulfillment &&
          itemfulfillment.status == "success" &&
          isValidReturn && (
            <span
              className="orders__collections-action-buttons-list-type"
              onClick={(e) => action(e, OrderManageTypes.RETURN)}
            >
              <button
                type="button"
                className="orders__collections-action-buttons-list-type-btn"
              >
                Return
              </button>
            </span>
          )}
        {reportIssuePolicy.enabled && isValidReport && (
          <span
            className="orders__collections-action-buttons-list-type"
            onClick={(e) => action(e, OrderManageTypes.REPORT_ISSUE)}
          >
            <button
              type="button"
              className="orders__collections-action-buttons-list-type-btn"
            >
              Report issue
            </button>
          </span>
        )}
      </div>
    </>
  );
};

export default ManageActions;
