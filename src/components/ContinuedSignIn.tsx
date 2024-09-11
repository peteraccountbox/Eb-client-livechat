import React from "react";

const ContinuedSignIn = (props: any) => {
  return (
    <>
      <div className="chat__ticket-form1 chat_flows-login-form chat__messages-form chatuserformdata">
        <div className="chat__ticket-form-group">
          <div className="chat_flows-login-title">Sign in</div>
          <br />
          <br />
          You are signed with <b>{props.email}</b>
          <br />
          <br />
          <span
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <button
              className="chat__messages-btn"
              onClick={() => props.action(true)}
            >
              Continue
            </button>
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => props.action(false)}
          >
            Sign In To a Different Account
          </span>
        </div>
      </div>
    </>
  );
};

export default ContinuedSignIn;
