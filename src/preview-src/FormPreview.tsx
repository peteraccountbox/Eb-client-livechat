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
          : "#000000",
      "--themeColor2":
        chatPrefs && chatPrefs.meta.decoration.gradientColor
          ? chatPrefs.meta.decoration.gradientColor
          : "#000000",
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
              <h1 className="chat__header-user-name">{chatPrefs.name}</h1>
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
                <div className="text-left">
                  <pre>
                    {" "}
                    <p className="mb-2"> {chatPrefs.meta?.title} </p>{" "}
                  </pre>
                </div>

                {chatPrefs.meta &&
                  chatPrefs.meta.fields.map((field, index) => {
                    return (
                      <>
                        {field.name != "message" && field.visible && (
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
                                            <option value={value}>
                                              {value}
                                            </option>
                                          );
                                        }
                                      )}
                                    </select>
                                  );
                                }

                                case field.visible &&
                                  field.type == "checkbox": {
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
                                      onClick={(e) => {
                                        if (field.type == "date")
                                          e.currentTarget.showPicker();
                                      }}
                                      required={field.required}
                                      name={field.name}
                                      value={field.value}
                                    />
                                  );
                                }

                                default:
                                  {
                                    return <></>;
                                  }
                                  break;
                              }
                            })()}
                          </div>
                        )}
                        {field.error ? (
                          <div className="error-content">{field.error}</div>
                        ) : (
                          <></>
                        )}
                        {/* {field.name == "email" && (
                          <p
                            style={{
                              marginBottom: "10px",
                              fontSize: "12px",
                              fontWeight: 400,
                            }}
                          >
                            A New customer will be created when provided new
                            email address on the form
                          </p>
                        )} */}
                      </>
                    );
                  })}
                <div className="chat__messages-form-group">
                  <textarea
                    className="chat_form-control"
                    placeholder={chatPrefs.meta.messagePlaceholder}
                    name={"message"}
                  ></textarea>
                </div>

                <a
                  className="chat__messages-btn"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span> {chatPrefs.meta.btnText} </span>

                    <svg
                      className="chat_send_icon"
                      id="fi_9290348"
                      enable-background="new 0 0 32 32"
                      viewBox="0 0 32 32"
                      style={{ fill: "white" }}
                      width={16}
                      height={16}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m21.1646194 29.9911366c-1.0395126.0777702-2.0082016-.2969723-2.7011948-.9899673-.6219101-.2503929-4.0971422-8.8551025-4.4971895-9.5459404l6.646821-6.646822c.395977-.395978.3889008-1.0253134 0-1.4142132-.3959789-.395978-1.0182362-.395978-1.4142132 0l-6.646822 6.6468201-8.4994373-3.7759256c-1.3576331-.6081448-2.1566238-1.9445429-2.0435059-3.4294939.1201961-1.4778719 1.1243188-2.6799183 2.552645-3.0617409l21.0859309-5.6568974c1.2091236-.3181636 2.4607162.0141559 3.3446007.8980393.8768063.8768055 1.2091255 2.1283982.8909607 3.3375232l-5.6568527 21.0859737c-.3818227 1.4283253-1.5839139 2.4324051-3.0617429 2.5526444z"></path>
                    </svg>
                  </span>
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
