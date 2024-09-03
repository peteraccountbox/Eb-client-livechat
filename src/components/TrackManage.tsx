import React, { useContext, useState } from "react";
import { getSessionStoragePrefs } from "../Storage";
import { TRACK_MANAGE } from "../globals";
import { AppContext } from "../appContext";
import CloseWidgetPanel from "./CloseWidgetPanel";
import { OrderManagementComponents } from "./TrackManageUtils";

const TrackManage = () => {
  const componentState = getSessionStoragePrefs(TRACK_MANAGE);
  const parentContext = useContext(AppContext);
  const [data, setData] = useState();
  const { managementComponent, setManagementComponent } = parentContext;
  const Component = OrderManagementComponents[managementComponent];
  const getHeaderIcon = () => {
    return parentContext.chatPrefs.meta.decoration.headerPictureUrl;
  };

  const getHeaderName = () => {
    if (parentContext.chatPrefs.name) return parentContext.chatPrefs.name;
  };
  const goBack = () => {
    // Empty existing
  };

  const actionCallback = (componentName: any, data: any) => {
    setManagementComponent(componentName);
    setData(data);
  };

  return (
    <div className="chat__conversation">
      <div className="chat__header">
        <div className="chat__header-action">
          <div
            data-trigger="all"
            className="chat__header-back"
            onClick={() => goBack()}
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
              {/* <p className="chat__header-user-lastseen">Active 30m ago</p> */}
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
            <Component actionCallback={actionCallback} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackManage;
