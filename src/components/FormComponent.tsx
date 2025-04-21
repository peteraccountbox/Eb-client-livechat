import React, { FC, useContext } from 'react'
import { ChatFromFieldDataPayLoad } from '../Models';
import { AppContext } from '../appContext';

export interface FormComponentPropsType {
    formFields: ChatFromFieldDataPayLoad[];
    handleFieldValueChange: (value: string,
        field: ChatFromFieldDataPayLoad) => void;
    submitForm:() => void;
    message?: string;
    typeText?: string;
    saving?: boolean;
  }
  const FormComponent: FC<FormComponentPropsType> = (props) => {
      const parentContext = useContext(AppContext);
    
    const { formFields, handleFieldValueChange, submitForm, message, saving, typeText } =
    props;
  return (
    <form
    action="javascript:void(0);"
    onSubmit={submitForm}
    className="chat__messages-form chatuserformdata"
    style={{ paddingTop: "0px", flex: "1" }}
  >
    <div className="text-left">
      <pre>
        {" "}
        <p>
            {
            
        parentContext.chatPrefs.meta?.title
            }
        </p>
        {" "}
      </pre>
    </div> 
    {formFields.map((field: ChatFromFieldDataPayLoad, index: number) => {
          return (
            <>
              <div className="chat__messages-form-group">
                {(() => {
                  switch (true) {
                    case field.type == "textarea" && field.visible:
                      {
                        if (typeText && typeText != "" && field.name == "message")
                          field.value = typeText;
                        return (
                          <textarea
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
                              id={field.name}
                              required={field.required}
                              value={field.value}
                              // checked={field.value == "true"}
                              // value={field.options}
                              checked={
                                field.valueArr?.length == 1 ? true : false
                              }
                              className="chat__form-check-input"
                              onChange={(e) => {
                                // handleFieldValueChange(e.target.checked + '', field)
                                if(e.target.checked) 
                                handleFieldValueChange(e.target.checked + '', field)
                                
                              else 
                              handleFieldValueChange('', field)

                              }
                              }
                            />
                            <label
                              className="chat__form-check-label"
                              htmlFor={field.name}
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
                                      field.valueArr?.includes(opt)
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
                        return <></>;
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
        
        <a onClick={submitForm} href="javascript:void(0)" className="chat__messages-btn">
      {saving ? (
        <span>Sending ...</span>
      ) : (
        <span
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <span> {message ? "Submit" : parentContext.chatPrefs.meta.btnText} </span>
          {!message && <svg
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
          </svg>}
        </span>
      )}
    </a>

    <input
      type="submit"
      className="form-submit"
      value="Submit"
      style={{ display: "none" }}
    /></form>
  )
}

export default FormComponent