import React, { useContext, useEffect } from "react";
import { AppContext, OrderManagementContext } from "../../appContext";
import shopifyValidateRules from "../orderConditionValidation/ShopifyConditionValidation";
import { PredicateJoinCondition } from "../orderConditionValidation/ConditionValidation";
import { OrderManageTypes } from "../TrackManageUtils";

const ReportIssue = () => {
  const orderManagementContext = useContext(OrderManagementContext);
  const {
    setPrevComponent,
    setPrevData,
    managementComponent,
    setManagementComponent,
    data: { order, fulfillment, item },
    setData,
  } = orderManagementContext;
  const parentContext = useContext(AppContext);
  const {
    chatPrefs: {
      orderManagement: {
        reportIssuePolicy: { scenarios },
      },
    },
  } = parentContext;
  const filteredScenarios = scenarios.filter((scenario: any) => {
    return shopifyValidateRules(
      order,
      scenario.predicate,
      scenario.joinOperator,
      fulfillment,
      "shopify"
    );
  });

  const action = (reason: any) => {
    setPrevComponent(managementComponent);
    setPrevData(order);
    setManagementComponent(OrderManageTypes.RAISED_ISSUE);
    setData({ order, reason, fulfillment, item });
  };
  useEffect(() => {
    setPrevComponent(OrderManageTypes.ORDER);
    setPrevData(order);
  }, []);
  return (
    <>
      {filteredScenarios.length ? (
        filteredScenarios.map((scenario: any) => (
          <>
            <header className="order__reportissue-header">
              <h2 className="order__reportissue-header-title">
                {scenario.title}
              </h2>
            </header>

            <div className="home__feeds-media-content">
              {scenario.reasons.map((reason: any, index: number) => {
                return (
                  <div
                    className="home__feeds-flow-list"
                    onClick={() => action(reason)}
                  >
                    <div className="home__feeds-flow-list-title">
                      <span>{reason.title}</span>
                    </div>
                    <div className="home__feeds-flow-list-arrow">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M5.42773 4.70898C5.46387 4.85254 5.53809 4.98828 5.65039 5.10059L8.54932 8L5.64893 10.9004C5.31689 11.2324 5.31689 11.7705 5.64893 12.1025C5.98096 12.4336 6.51904 12.4336 6.85107 12.1025L10.3516 8.60059C10.5591 8.39355 10.6367 8.10449 10.585 7.83691C10.5537 7.67578 10.4761 7.52246 10.3516 7.39844L6.85254 3.89941C6.52051 3.56738 5.98242 3.56738 5.65039 3.89941C5.43066 4.11816 5.35645 4.42871 5.42773 4.70898Z"
                          fill="#000000"
                        ></path>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ))
      ) : (
       
            <p style={{ marginTop: "60px", textAlign: "center" }}>
                <div className="chat__form-loader1">
                          <span></span>
                          <span></span>
                          <span></span>
                          <span></span>
                </div>
                </p>
      )}
    </>
  );
};

export default ReportIssue;
