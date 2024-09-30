import React, { FC, useContext, useState } from "react";
import { AppContext } from "../appContext";
import { ChatFromFieldDataPayLoad, JSONObjectType } from "../Models";
import { isValidField, isValidTicketField } from "../Utils";

export interface ChatFormPropsType {
  fields: any[];
  // setFormFields(fields: any[]): void;
  submitChatForm: (formData: JSONObjectType) => void;
  closeChatForm: () => void;
  typeText: string;
  saving: boolean;
  setTypeText: (arg0: string) => void;
}

const ChatForm: FC<ChatFormPropsType> = (props) => {
  const { setTypeText, submitChatForm, fields, typeText } = props;

  const parentContext = useContext(AppContext);
  const [saving, setSaving] = useState(false);
  // const fields = [
  //   {
  //     name: "customerEmail",
  //     label: "Drop your email",
  //     type: "email",
  //     required: true,
  //     value: "",
  //     placeholder: "reacho@email.com",
  //     error: "",
  //     is_valid: true,
  //     helpText:
  //       "Messages and ticket updates will be sent to this email address",
  //   },
  //   {
  //     name: "customerName",
  //     label: "Drop your name",
  //     type: "text",
  //     required: true,
  //     value: "",
  //     placeholder: "Enter Name",
  //     error: "",
  //     is_valid: true,
  //   },
  //   {
  //     name: "query",
  //     label: "Drop query",
  //     type: "textarea",
  //     required: true,
  //     value: "",
  //     placeholder: "Drop Query",
  //     error: "",
  //     is_valid: true,
  //   },
  //   // {
  //   //   name: "date",
  //   //   label: "When did the issue occur",
  //   //   type: "date",
  //   //   required: true,
  //   //   value: "",
  //   //   placeholder: "",
  //   //   error: "",
  //   //   is_valid: true,
  //   // },
  // ];

  const [formFields, setFormFields] = useState<any[]>(fields);

  // const handleFieldValueChange = (
  //   value: string,
  //   field: ChatFromFieldDataPayLoad
  // ) => {
  //   let results = formFields.map((eachField: ChatFromFieldDataPayLoad) => {
  //     if (eachField === field) {
  //       if (
  //         eachField.type === "multicheckbox" ||
  //         eachField.type === "checkbox"
  //       ) {
  //         if (!eachField.valueArr) eachField.valueArr = [];
  //         if (eachField.valueArr.includes(value)) {
  //           const index = eachField.valueArr.indexOf(value);
  //           if (index > -1) {
  //             eachField.valueArr.splice(index, 1);
  //           }
  //         } else eachField.valueArr.push(value);
  //         eachField.value = eachField.valueArr;
  //       } else {
  //         eachField.value = value;
  //       }
  //       if (eachField.error) eachField = isValidField(eachField);
  //       if (eachField.field_type == "SYSTEM" && field.name == "message")
  //         setTypeText(value);
  //     }
  //     return eachField;
  //   });
  //   setformFields(results);
  // };
  const handleFieldValueChange = (value: string, field: any) => {
    const results = formFields.map((eachField) => {
      if (eachField.name == field.name) eachField.value = value;
      if (eachField.error) eachField = isValidTicketField(eachField);
      return eachField;
    });
    setFormFields(results);
  };
  const submitForm = () => {
    if (isvalidForm() && !saving) {
      // Set field data in to storage
      setSaving(true);
      let obj: JSONObjectType = {};
      formFields.map((field: ChatFromFieldDataPayLoad) => {
        if (field.value) obj[field.name] = field.value;
      });

      console.log("formdata", obj);

      submitChatForm(obj);
    }
  };

  const isvalidForm = () => {
    let isValid = true;
    let results = formFields.map((field: ChatFromFieldDataPayLoad) => {
      field = isValidField(field);
      if (isValid) isValid = field.is_valid;
      return field;
    });
    setFormFields(results);
    return isValid;
  };
  const triggerForm = () => {
    submitForm();
  };
  return (
    <div className="chat_agent_data" style={{ display: "flex" }}>
      <form
        action="javascript:void(0);"
        onSubmit={submitForm}
        className="chat__messages-form chatuserformdata"
        style={{ flex: "1" }}
      >
        <div className="text-left" style={{ marginBottom: "5px" }}>
          <pre>
            <p className="mb-2">
            {formFields && formFields.length && (formFields.length >  1  ? "Enter Details" : "Drop your email")}
            </p>
          </pre>
        </div>

        {/* <button className="btn" onClick={props.closeChatForm}>close form</button> */}

        {formFields.map((field: any, index: number) => {
          return (
            <>
              <div className="chat__messages-form-group">
                {(() => {
                  switch (true) {
                    case field.type == "textarea":
                      {
                        if (typeText != "" && field.name == "message")
                          field.value = typeText;
                        return (
                          <textarea
                          rows={12}
                            className="chat_form-control"
                            placeholder={field.placeholder}
                            required={field.required}
                            value={field.value}
                            name={field.name}
                            onChange={(e) =>
                              handleFieldValueChange(e.target.value, field)
                            }
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
                          onChange={(e) =>
                            handleFieldValueChange(e.target.value, field)
                          }
                        >
                          <option value="">{field.placeholder}</option>
                          {JSON.parse(field?.options || "[]").map(
                            (value: string, index: number) => {
                              return <option value={value}>{value}</option>;
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
                              checked={
                                field.valueArr.length == 1 ? true : false
                              }
                              className="chat__form-check-input"
                              onChange={(e) =>
                                handleFieldValueChange(e.target.value, field)
                              }
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

                    case field.visible && field.type == "multicheckbox": {
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
                                    checked={
                                      field.valueArr.includes(opt)
                                        ? true
                                        : false
                                    }
                                    value={opt}
                                    onChange={(e) =>
                                      handleFieldValueChange(
                                        e.target.value,
                                        field
                                      )
                                    }
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

                    case field.visible && field.type == "radiobutton": {
                      return (
                        <div className="chat__form-checkbox radio">
                          <label className="chat__form-label">
                            {" "}
                            {field.placeholder}{" "}
                          </label>
                          {JSON.parse(field?.options || "[]").map(
                            (opt: string, index: number) => {
                              return (
                                <div className="chat__form-check radio-options">
                                  <input
                                    type="radio"
                                    checked={field.value == opt ? true : false}
                                    id={opt}
                                    value={opt}
                                    name={field.name}
                                    required={field.required}
                                    className="chat__form-check-input"
                                    onChange={(e) =>
                                      handleFieldValueChange(
                                        e.target.value,
                                        field
                                      )
                                    }
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

                    case field.visible: {
                      return (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          required={field.required}
                          name={field.name}
                          value={field.value}
                          className="chat_form-control"
                          onChange={(e) =>
                            handleFieldValueChange(e.target.value, field)
                          }
                        />
                      );
                    }

                    default:
                      {
                        return (
                          <>
                            <input
                              type={field.type}
                              placeholder={field.placeholder}
                              required={field.required}
                              name={field.name}
                              className="chat_form-control"
                              value={field.value}
                              onChange={(e) =>
                                handleFieldValueChange(e.target.value, field)
                              }
                            />
                            {/* {field.error ? (
                              <div className="error-content">{field.error}</div>
                            ) : (
                              <></>
                            )} */}
                            {/* <div className="chat__ticket-form-text">
                              {field.helpText}
                            </div> */}
                          </>
                        );
                      }
                      break;
                  }
                })()}
              </div>
              {field.error ? (
                <div className="error-content">{field.error}</div>
              ) : (
                <></>
              )}
            </>
          );
        })}

        <a
          onClick={triggerForm}
          href="javascript:void(0)"
          className="chat__messages-btn"
        >
          {props.saving ? (
            <span>Sending ...</span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span>Send</span>
              {/* <svg
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
              </svg> */}
            </span>
          )}
        </a>

        <input
          type="submit"
          className="form-submit"
          value="Submit"
          style={{ display: "none" }}
        />
      </form>
    </div>
  );
};

export default ChatForm;
