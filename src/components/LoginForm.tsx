import React, { useState } from "react";
import { isValidTicketField } from "../Utils";

const LoginForm = (props: any) => {
  const { sign_in, submitForm, formFields, setFormFields, saving } = props;
  const fields = [
    {
      name: "sign_in",
      label: "Sign in",
      type: "radio",
      required: true,
      value: sign_in,
      placeholder: "",
      error: "",
      is_valid: true,
    },
    {
      name: "email",
      label: "Your email",
      type: "email",
      required: true,
      value: "",
      placeholder: "",
      error: "",
      is_valid: true,
      display: true,
      // helpText:
      //   "Messages and ticket updates will be sent to this email address",
    },
    {
      name: "phone",
      label: "Your phone number",
      type: "text",
      required: true,
      value: "",
      placeholder: "",
      error: "",
      is_valid: true,
      display: false,
    },
  ];

  const [toggleField, setToggleField] = useState<any>(
    formFields.find((field: any) => sign_in == field.name)
  );

  const handleFieldValueChange = (value: string, field: any) => {
    const results = formFields.map((eachField: any) => {
      if (eachField.name == field.name) eachField.value = value;
      if (eachField.name == "sign_in") eachField.value = field.name;
      if (eachField.error) eachField = isValidTicketField(eachField);
      return eachField;
    });
    setFormFields(results);
  };

  const onToggle = (value: string) => {
    console.log("onToggle ", value);
    if (value == "email") {
      setToggleField(fields[1]);
      setFormFields([{ ...formFields[0], value: value }, fields[1]]);
    } else {
      setToggleField(fields[2]);
      setFormFields([{ ...formFields[0], value: value }, fields[2]]);
    }
  };
  return (
    <div className="chat__ticket-form-main chat_agent_data chat_flows-login">
      <div className="chat__ticket-form1 chat_flows-login-form chat__messages-form chatuserformdata">
        <div className="chat__ticket-form-group">
          <div className="chat_flows-login-title">{fields[0].label}</div>
          <div style={{ display: "flex" }}>
            <div
              className="chat__form-check radio-options"
              style={{ width: "25%" }}
            >
              <input
                type="radio"
                id="email"
                value="email"
                required={fields[0].required}
                name={fields[0].name}
                checked={formFields[0].value == "email"}
                onChange={(e: any) => onToggle(e.target.value)}
                className="chat__form-check-input"
              />
              <label className="chat__form-check-label" htmlFor="email">
                Email
              </label>
            </div>
            <div className="chat__form-check radio-options">
              <input
                type="radio"
                id="phone"
                value="phone"
                required={fields[0].required}
                name={fields[0].name}
                checked={formFields[0].value == "phone"}
                onChange={(e: any) => onToggle(e.target.value)}
                className="chat__form-check-input"
              />
              <label className="chat__form-check-label" htmlFor={"phone"}>
                Phone
              </label>
            </div>
          </div>

          {fields[0].error ? (
            <div className="error-content">{fields[0].error}</div>
          ) : (
            <></>
          )}
        </div>
        <div className="chat__ticket-form-group">
          <div className="chat__ticket-form-label">
            {toggleField.label} <span className="theme-color">*</span>
          </div>
          <input
            type={toggleField.type}
            placeholder={toggleField.placeholder}
            required={toggleField.required}
            name={toggleField.name}
            className="chat__ticket-form-control"
            value={toggleField.value}
            onChange={(e) =>
              handleFieldValueChange(e.target.value, toggleField)
            }
          />
          {toggleField.error ? (
            <div className="error-content">{toggleField.error}</div>
          ) : (
            <></>
          )}
        </div>

        <span
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <button className="chat__messages-btn" onClick={submitForm}>
            {saving ? "Saving ..." : "Sign In"}
          </button>
        </span>
      </div>
    </div>
  );
};

export default LoginForm;
