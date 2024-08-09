import React, { FC, useContext, useState } from "react";
// import { postReq } from "../request";
// import { AppContext } from "../appContext";
import { isValidTicketField } from "../../Utils";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
export interface TicketFormComponentProps {
  openTicket: (ticketId: Number) => void;
  backToList: () => void;
}
const CustomerIdentification: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
  executionMeta,
}: InteractiveNodeProps) => {
  // const parentContext = useContext(AppContext);

  const fields = [
    {
      name: "sign_in",
      label: "Sign in",
      type: "radio",
      required: true,
      value: execution.node.data.formData.sign_in,
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

    // {
    //   name: "date",
    //   label: "When did the issue occur",
    //   type: "date",
    //   required: true,
    //   value: "",
    //   placeholder: "",
    //   error: "",
    //   is_valid: true,
    // },
  ];
  const [formFields, setFormFields] = useState<any[]>([
    fields[0],
    fields.find((field) => execution.node.data.formData.sign_in == field.name),
  ]);
  const [toggleField, setToggleField] = useState<any>(
    fields.find((field) => execution.node.data.formData.sign_in == field.name)
  );
  const [saving, setSaving] = useState(false);

  const [showSignIn, setShowSignIn] = useState(execution.executed);

  const handleFieldValueChange = (value: string, field: any) => {
    const results = formFields.map((eachField) => {
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
  const submitForm = () => {
    if (isvalidForm() && !saving) {
      setSaving(true);
      execution.nodeId = execution.node.id;
      execution.executed = true;
      execution.responseAction = [
        {
          id: execution.node.id,
          type: formFields[1].name,
          data: formFields[1].value,
        },
      ];
      executeNodeOnUserInteraction(execution);
    }
  };

  const isvalidForm = () => {
    let isValid = true;
    let results = formFields.map((field) => {
      field = isValidTicketField(field);
      if (isValid) isValid = field.is_valid;
      return field;
    });
    setFormFields(results);
    return isValid;
  };
  return (
    <>
      {!showSignIn ? (
        <>
          <div className="chat__messages-group">
            <ul className="chat__messages-list">
              <div className="chat__messages-list-item">
                <div className="chat__messages-bubble chat__message-type-TEXT">
                  <span className="actual">Sign in to continue</span>
                </div>
              </div>
            </ul>
          </div>
          <div className="chat__messages-group--me">
            <div className="chat__messages-group">
              <ul className="chat__messages-list">
                <div className="chat__messages-list-item">
                  <div
                    className="chat__messages-bubble chat__message-type-TEXT"
                    onClick={() => setShowSignIn(true)}
                  >
                    <span className="actual">Continue to sign in</span>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </>
      ) : executionMeta &&
        !executionMeta.isCompleted &&
        !execution.nextNodeId ? (
        <div className="chat__ticket-form-main">
          <div className="chat__ticket-form">
            <div className="chat__ticket-form-group">
              <label className="chat__ticket-form-label">
                {fields[0].label} <span className="theme-color">*</span>
              </label>
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
                    id="sms"
                    value="phone"
                    required={fields[0].required}
                    name={fields[0].name}
                    checked={formFields[0].value == "phone"}
                    onChange={(e: any) => onToggle(e.target.value)}
                    className="chat__form-check-input"
                  />
                  <label className="chat__form-check-label" htmlFor={"sms"}>
                    SMS
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
              <label className="chat__ticket-form-label">
                {toggleField.label} <span className="theme-color">*</span>
              </label>
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
                justifyContent: "center",
              }}
            >
              <button
                className="chat__messages-btn"
                onClick={submitForm}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "auto",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                {saving ? "Saving ..." : "Sign In"}
              </button>
            </span>
          </div>
        </div>
      ) : (
        <div className="chat__messages-group">
          <ul className="chat__messages-list">
            <div className="chat__messages-list-item">
              <div className="chat__messages-bubble chat__message-type-TEXT">
                <span className="actual">
                  {execution.nextNodeId ? "Signed In" : "Invalid Customer"}
                </span>
              </div>
            </div>
          </ul>
        </div>
      )}
    </>
  );
};

export default CustomerIdentification;
