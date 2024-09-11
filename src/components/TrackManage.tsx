import React, { useCallback, useContext, useState } from "react";
import { getSessionStoragePrefs } from "../Storage";
import { CUSTOMER } from "../globals";
import { AppContext, OrderManagementContext } from "../appContext";
import CloseWidgetPanel from "./CloseWidgetPanel";
import {
  OrderManagementComponents,
  OrderManageTypes,
} from "./TrackManageUtils";

export interface TrackManageProps {
  backToHome: () => void;
  startNewChat: () => void;
}
const TrackManage = (props: TrackManageProps) => {
  const { backToHome, startNewChat } = props;
  const parentContext = useContext(AppContext);

  const [prevComponent, setPrevComponent] = useState<any>("");
  const customerData = JSON.parse(getSessionStoragePrefs(CUSTOMER));
  const [prevData, setPrevData] = useState<any>({
    customerId: customerData?.id,
  });
  const [data, setData] = useState<any>({
    customerId: customerData?.id,
  });
  const [customer, setCustomer] = useState<any>(
    JSON.parse(getSessionStoragePrefs(CUSTOMER))
  );
  const [managementComponent, setManagementComponent] = useState<any>(
    OrderManageTypes.CUSTOMER_IDENTIFICATION
  );
  const Component = OrderManagementComponents[managementComponent];
  const getHeaderIcon = () => {
    return parentContext.chatPrefs.meta.decoration.headerPictureUrl;
  };

  const getHeaderName = () => {
    if (parentContext.chatPrefs.name) return parentContext.chatPrefs.name;
  };
  const goBack = useCallback(() => {
    if (!prevComponent) {
      if (!getSessionStoragePrefs(CUSTOMER))
        setManagementComponent(OrderManageTypes.CUSTOMER_IDENTIFICATION);
      backToHome();
    } else {
      setManagementComponent(prevComponent);
      setData(prevData);
    }
  }, [prevComponent, prevData]);

  const actionCallback = (componentName: any, newData: any) => {
    setManagementComponent(componentName);
    setData(newData);
  };

  return (
    <OrderManagementContext.Provider
      value={{
        managementComponent,
        setManagementComponent,
        data,
        setData,
        setPrevComponent,
        setPrevData,
        customer,
      }}
    >
      <div className="chat__conversation">
        <div className="chat__header">
          <div className="chat__header-action chat__logout-panel-header">
            <div
              data-trigger="all"
              className="chat__header-back"
              onClick={goBack}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                color="currentColor"
              >
                <path
                  stroke="#fff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.7"
                  d="m14 18-6-6 6-6"
                ></path>
              </svg>
            </div>
            <div className="chat__header-user">
              {/* <div>
                <div
                  className="chat__header-user-img"
                  style={{ backgroundImage: 'url("' + getHeaderIcon() + '")' }}
                ></div>
              </div> */}

              <div className="chat__header-user-title">
                <h1 className="chat__header-user-name"> {getHeaderName()} </h1>
              </div>
            </div>

            <div className="chat__logout-panel">
              <button
                type="button"
                aria-label="Log out"
                className="chat__logout-btn"
              >
                <span className="chat__logout-btn-icon">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                  >
                    <path
                      d="M4.167 4.167h5A.836.836 0 0010 3.333a.836.836 0 00-.833-.833h-5C3.25 2.5 2.5 3.25 2.5 4.167v11.666c0 .917.75 1.667 1.667 1.667h5a.836.836 0 00.833-.833.836.836 0 00-.833-.834h-5V4.167z"
                      fill="#fff"
                    ></path>
                    <path
                      d="M17.208 9.708l-2.325-2.325a.417.417 0 00-.716.292v1.492H8.333A.836.836 0 007.5 10c0 .458.375.833.833.833h5.834v1.492c0 .375.45.558.708.292l2.325-2.325a.41.41 0 00.008-.584z"
                      fill="#fff"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div className="chat__help-end">
            <CloseWidgetPanel />
          </div>
        </div>
        <div className="chat__content">
          <div className="chat__messages">
            <div className="chat__messages-track">
              <Component startNewChat={startNewChat} backToHome={backToHome} />
            </div>
          </div>
        </div>
      </div>
    </OrderManagementContext.Provider>
  );
};

export default TrackManage;
