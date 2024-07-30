import React, { FC, useContext, useState } from "react";
// import { TicketType } from "../Models";
// import { postReq } from "../request";
// import { TICKET_CREATE_URL, VISITOR_UUID } from "../globals";
// import { AppContext } from "../appContext";
import { isValidTicketField } from "../../Utils";
// import CloseWidgetPanel from "./CloseWidgetPanel";
export interface TicketFormComponentProps {
  openTicket: (ticketId: Number) => void;
  backToList: () => void;
  // setTickets: (arg0: TicketType[]) => void;
  // tickets: TicketType[];
}
const CustomerLogin: FC<any> = (props) => {
  // const parentContext = useContext(AppContext);

  const { openTicket, backToList, setTickets, tickets } = props;
  const fields = [
    {
      name: "sign_in",
      label: "Sign in",
      type: "radio",
      required: true,
      value: "",
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
  const [formFields, setFormFields] = useState<any[]>([fields[0], fields[1]]);
  const [toggleField, setToggleField] = useState<any>(fields[1]);
  const [saving, setSaving] = useState(false);

  const handleFieldValueChange = (value: string, field: any) => {
    const results = formFields.map((eachField) => {
      if (eachField.name == field.name) eachField.value = value;
      if (eachField.error) eachField = isValidTicketField(eachField);
      return eachField;
    });
    setFormFields(results);
  };

  const onToggle = (value: string) => {
    console.log("onToggle ", value);
    if (value == "email") {
      setToggleField(fields[1]);
      setFormFields([fields[0], fields[1]]);
    } else {
      setToggleField(fields[2]);
      setFormFields([fields[0], fields[2]]);
    }
  };
  // const submitForm = () => {
  //   if (isvalidForm() && !saving) {
  //     setSaving(true);
  //     var body: any = {};
  //     formFields.forEach((field) => {
  //       if (field.name == "to") body.requester_email = field.value;
  //       else if (field.name == "subject") body.subject = field.value;
  //       else body.text_body = field.value;
  //     });
  //     body.CUSTOMER_UUID = VISITOR_UUID;
  //     const wait = postReq(TICKET_CREATE_URL, body);
  //     wait
  //       .then((response: any) => {
  //         let newTicket: TicketType = response.data;
  //         console.log(response);
  //         setTickets([newTicket, ...tickets]);
  //         openTicket(newTicket.id);
  //       })
  //       .catch((e:any) => {
  //         console.log(e);
  //       });
  //   }
  // };

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
                value="sms"
                required={fields[0].required}
                name={fields[0].name}
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
            // onClick={submitForm}
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
  );
};

export default CustomerLogin;
