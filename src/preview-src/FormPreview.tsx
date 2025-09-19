import React, { FC, useMemo } from "react";

import { ChatPrefsPayloadType } from "../Models";

export interface FormPreviewComponentProps {
  chatPrefs: ChatPrefsPayloadType;
}

const FormPreview: FC<FormPreviewComponentProps> = (props) => {
  const { chatPrefs } = props;

  const appThemeStyle: Object = useMemo(() => {
    return {
      "--themeColor":
        chatPrefs && chatPrefs.meta.decoration.mainColor
          ? chatPrefs.meta.decoration.mainColor
          : "blue",
      position: "inherit",
      opacity: "inherit",
      transform: "none",
      margin: "10px auto",
      pointerEvents: "auto",
    };
  }, [chatPrefs]);
  return (
    <div style={appThemeStyle} className="chat__main">
      <div className="chat__header">
        <div className="chat__header-action">
          <div data-trigger="all" className="chat__header-back">
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
            <div className="">
              <div
                className="chat__header-user-img"
                style={{
                  backgroundImage:
                    'url("' + chatPrefs.meta.decoration.headerPictureUrl + '")',
                }}
              >
                &nbsp;
              </div>
            </div>

            <div className="chat__header-user-title">
              <h1 className="chat__header-user-name">title</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="chat__content">
        <div className="chat__messages">
          <div className="chat__messages-track">
            <div className="chat_agent_data" style={{ display: "flex" }}>
              <form
                className="chat__messages-form chatuserformdata"
                style={{ paddingTop: "0px", flex: "1" }}
              >
                <div className="text-left" style={{ marginBottom: "10px" }}>
                  <pre>
                    {" "}
                    
                      <p className="mb-2"> {chatPrefs.meta?.title} </p>
                   
                   {" "}
                  </pre>
                </div>

                {chatPrefs.meta &&
                  chatPrefs.meta.fields.map((field, index) => {
                    return (
                      <>
                        <div className="chat__messages-form-group">
                          {(() => {
                            switch (true) {
                              case field.type == "textarea" && field.visible:
                                {
                                  return (
                                    <textarea
                                      className="chat_form-control"
                                      placeholder={field.placeholder}
                                      required={field.required}
                                      value={field.value}
                                      name={field.name}
                                    ></textarea>
                                  );
                                }
                                break;

                              case field.visible && field.type == "list": {
                                return (
                                  <select
                                    className="chat_form-control"
                                    //placeholder={field.placeholder}
                                    required={field.required}
                                    name={field.name}
                                    value={field.value}
                                  >
                                    <option value="">
                                      {field.placeholder}
                                    </option>
                                    {JSON.parse(field?.options || "[]").map(
                                      (value: string, index: number) => {
                                        return (
                                          <option value={value}>{value}</option>
                                        );
                                      }
                                    )}
                                  </select>
                                );
                              }

                              case field.visible && field.type == "checkbox": {
                                return (
                                  <div className="chat__form-checkbox">
                                    <div className="chat__form-check">
                                      <input
                                        type="checkbox"
                                        id={field.options}
                                        required={field.required}
                                        value={field.options}
                                        className="chat__form-check-input"
                                      />

                                      <label
                                        className="chat__form-check-label"
                                        htmlFor={field.options}
                                      >
                                        {" "}
                                        {field.placeholder}{" "}
                                      </label>
                                    </div>
                                  </div>
                                );
                              }

                              case field.visible &&
                                field.type == "multicheckbox": {
                                return (
                                  <div className="chat__form-checkbox">
                                    <label className="chat__form-label">
                                      {" "}
                                      {field.placeholder}{" "}
                                    </label>
                                    {JSON.parse(field?.options || "[]").map(
                                      (opt: string, index: number) => {
                                        return (
                                          <div className="chat__form-check">
                                            <input
                                              type="checkbox"
                                              className="chat__form-check-input"
                                              id={opt}
                                              value={opt}
                                            />
                                            <label
                                              className="chat__form-check-label"
                                              htmlFor={opt}
                                            >
                                              {" "}
                                              {opt}{" "}
                                            </label>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              }

                              case field.visible &&
                                field.type == "radiobutton": {
                                return (
                                  <div className="chat__form-checkbox radio">
                                    <label className="chat__form-label">
                                      {field.placeholder}
                                    </label>
                                    {JSON.parse(field?.options || "[]").map(
                                      (opt: string, index: number) => {
                                        return (
                                          <div className="chat__form-check radio-options">
                                            <input
                                              type="radio"
                                              id={opt}
                                              value={opt}
                                              name={field.name}
                                              required={field.required}
                                              className="chat__form-check-input"
                                            />
                                            <label
                                              className="chat__form-check-label"
                                              htmlFor={opt}
                                            >
                                              {opt}
                                            </label>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                );
                              }

                              case field.visible: {
                                return (
                                  <input
                                    className="chat_form-control"
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    name={field.name}
                                    value={field.value}
                                  />
                                );
                              }

                              default:
                                {
                                  return <p>Bye</p>;
                                }
                                break;
                            }
                          })()}
                        </div>
                        {field.name== "email" && <p style={{ marginBottom: "10px" }}>
                            A New customer will be created when provided new email address on the form
                          </p>}
                        {field.error ? (
                          <div className="error-content">{field.error}</div>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })}

                <a
                  className="chat__messages-btn"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <span> {chatPrefs.meta.btnText} </span>
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;
