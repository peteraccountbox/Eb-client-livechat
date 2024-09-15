import React from "react";
import { removeSessionStoragePrefs } from "../../Storage";
import { OPENED_CHAT } from "../../globals";

const NoCustomer = (props: any) => {
  const back = () => {
    removeSessionStoragePrefs(OPENED_CHAT);
    removeSessionStoragePrefs("flow_execution_id");
    props.backToHome();
  };
  return (
    <>
      <div className="chat__messages-group">
        <ul className="chat__messages-list">
          <div className="chat__messages-list-item">
            <div className="chat__messages-bubble chat__message-type-TEXT">
              <span className="actual">
                No customer available to fetch orders and items for
              </span>
            </div>
          </div>
        </ul>
      </div>
      <div className="chat__messages-group--me">
        <ul className="chat__messages-list">
          <div className="multi_choice-list-item-btn" onClick={() => back()}>
            <span className="actual">Back to home</span>
          </div>
        </ul>
      </div>
    </>
  );
};

export default NoCustomer;
