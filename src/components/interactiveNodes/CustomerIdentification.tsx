import React, { FC, useContext, useState } from "react";
// import { postReq } from "../request";
// import { AppContext } from "../appContext";
import { isValidTicketField } from "../../Utils";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import LoginForm from "../LoginForm";
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
  ];
  const [formFields, setFormFields] = useState<any[]>([
    fields[0],
    fields.find((field) => execution.node.data.formData.sign_in == field.name),
  ]);

  const [saving, setSaving] = useState(false);

  const [showSignIn, setShowSignIn] = useState(true);

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
              <li className="chat__messages-list-item">
                <div className="chat__messages-bubble chat__message-type-TEXT">
                  <span className="actual">Sign in to continue</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="chat__messages-group chat__messages-group--me">
            <ul className="chat__messages-list">
              <li className="chat__messages-list-item">
                <div
                  className="chat__messages-bubble chat__message-type-TEXT"
                  onClick={() => setShowSignIn(true)}
                >
                  <span className="actual">Continue to sign in</span>
                </div>
              </li>
            </ul>
          </div>
        </>
      ) : executionMeta &&
        !executionMeta.isCompleted &&
        !execution.nextNodeId ? (
        <>
          <div className="chat__messages-group">
            <ul className="chat__messages-list">
              <li className="chat__messages-list-item">
                <div className="chat__messages-bubble chat__message-type-TEXT">
                  <span className="actual">Sign in to continue</span>
                </div>
              </li>
            </ul>
          </div>
          <LoginForm
            sign_in={execution.node.data.formData.sign_in}
            submitForm={submitForm}
            formFields={formFields}
            setFormFields={setFormFields}
            saving={saving}
          />
        </>
      ) : (
        <div className="chat__messages-group">
          <ul className="chat__messages-list">
            <li className="chat__messages-list-item">
              <div className="chat__messages-bubble chat__message-type-TEXT">
                <span className="actual">
                  {execution.nextNodeId ? "Signed In" : "Invalid Customer"}
                </span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default CustomerIdentification;
