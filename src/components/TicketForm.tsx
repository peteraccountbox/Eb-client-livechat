import React, { FC, useContext, useState } from "react";
import { TicketType } from "../Models";
import { isValidTicketField } from "../Utils";
import { postReq } from "../request";
import { TICKET_CREATE_URL, VISITOR_UUID } from "../globals";
import { AppContext } from "../appContext";
import CloseWidgetPanel from "./CloseWidgetPanel";
export interface TicketFormComponentProps {
  openTicket: (ticketId: Number) => void;
  backToList: () => void;
  setTickets: (arg0: TicketType[]) => void;
  tickets: TicketType[];
}
const TicketForm: FC<TicketFormComponentProps> = (props) => {
  const parentContext = useContext(AppContext);

  const { openTicket, backToList, setTickets, tickets } = props;
  const fields = [
    {
      name: "to",
      label: "Enter Email",
      type: "email",
      required: true,
      value: "",
      placeholder: "Email",
      error: "",
      is_valid: true,
      helpText:
        "Messages and ticket updates will be sent to this email address",
    },
    {
      name: "subject",
      label: "Subject",
      type: "text",
      required: true,
      value: "",
      placeholder: "Subject",
      error: "",
      is_valid: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      value: "",
      placeholder: "Description",
      error: "",
      is_valid: true,
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
  const [formFields, setFormFields] = useState<any[]>(fields);
  const [saving, setSaving] = useState(false);

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
      setSaving(true);
      var body: any = {};
      formFields.forEach((field) => {
        if (field.name == "to") body.requester_email = field.value;
        else if (field.name == "subject") body.subject = field.value;
        else body.text_body = field.value;
      });
      body.CUSTOMER_UUID = VISITOR_UUID;
      const wait = postReq(TICKET_CREATE_URL, body);
      wait
        .then((response: any) => {
          let newTicket: TicketType = response.data;
          console.log(response);
          setTickets([newTicket, ...tickets]);
          openTicket(newTicket.id);
        })
        .catch((e) => {
          console.log(e);
        });
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
    <div className="chat__conversation chat__help chat__create-ticket">
      <div className="chat__header">
        <div
          data-trigger="all"
          className="chat__header-back chat__help-action"
          onClick={() => backToList()}
        >
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
          <h3 className="chat__header-user-name">Create Ticket</h3>
        </div>
        <div className="chat__help-end">
          <CloseWidgetPanel />
        </div>
      </div>
      <div className="chat__content">
        <div className="chat__messages">
          <div className="chat__messages-track">
            <div className="chat__ticket-form-main">
              <div className="chat__ticket-form">
                {formFields.map((field, index) => {
                  return (
                    <>
                      <div className="chat__ticket-form-group">
                        {(() => {
                          switch (true) {
                            case field.type == "textarea": {
                              return (
                                <>
                                  <label className="chat__ticket-form-label">
                                    {field.label}{" "}
                                    <span className="theme-color">*</span>
                                  </label>
                                  <textarea
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    value={field.value}
                                    name={field.name}
                                    className="chat__ticket-form-control"
                                    rows={5}
                                    onChange={(e) =>
                                      handleFieldValueChange(
                                        e.target.value,
                                        field
                                      )
                                    }
                                  ></textarea>
                                  {field.error ? (
                                    <div className="error-content">
                                      {field.error}
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              );
                            }

                            default: {
                              return (
                                <>
                                  <label className="chat__ticket-form-label">
                                    {field.label}{" "}
                                    <span className="theme-color">*</span>
                                  </label>
                                  <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    name={field.name}
                                    className="chat__ticket-form-control"
                                    value={field.value}
                                    onChange={(e) =>
                                      handleFieldValueChange(
                                        e.target.value,
                                        field
                                      )
                                    }
                                  />
                                  {field.error ? (
                                    <div className="error-content">
                                      {field.error}
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  {/* <div className="chat__ticket-form-text">
                          {field.helpText}
                        </div> */}
                                </>
                              );
                            }
                          }
                        })()}
                      </div>
                    </>
                  );
                })}
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
                    {saving ? "Saving ..." : "Create Ticket"}
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
