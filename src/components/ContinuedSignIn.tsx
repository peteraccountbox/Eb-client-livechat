import React from "react";

const ContinuedSignIn = (props: any) => {
  return (
    <>
      <div className="chat_agent_data chat_flows-login continue__SigninForm">
        <div className="chat__ticket-form1 chat_flows-login-form chat__messages-form chatuserformdata">
          <div className="chat__ticket-form-group">
            <div className="chat_flows-login-title">Sign in</div>
            <div className="continue__SigninForm-email-text">
              You are signed with <strong>{props.email}</strong>
            </div>
            <div className="continue__SigninForm-email-btn">
              <button
                className="chat__messages-btn"
                onClick={() => props.action(true)}
              >
                Continue
              </button>
            </div>
            <div
              className="continue__SigninForm-accounts-text"
              onClick={() => props.action(false)}
            >
              Sign In To a Different Account
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContinuedSignIn;
