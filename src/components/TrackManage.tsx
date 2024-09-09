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
    customerData ? "ORDERS" : "CUSTOMER_IDENTIFICATION"
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
          <div className="chat__header-action">
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
              <div>
                <div
                  className="chat__header-user-img"
                  style={{ backgroundImage: 'url("' + getHeaderIcon() + '")' }}
                ></div>
              </div>

              <div className="chat__header-user-title">
                <h1 className="chat__header-user-name"> {getHeaderName()} </h1>
              </div>
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
