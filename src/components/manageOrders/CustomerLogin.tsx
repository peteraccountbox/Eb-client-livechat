import React, { useContext, useState } from "react";
import { isValidTicketField } from "../../Utils";
import LoginForm from "../LoginForm";
import { postReq } from "../../request";
import { CUSTOMER, VALIDATE_CUSTOMER_PATH } from "../../globals";
import { OrderManageTypes } from "../TrackManageUtils";
import { setSessionStoragePrefs } from "../../Storage";
import { OrderManagementContext } from "../../appContext";

const CustomerLogin = () => {
  const orderManagementContext = useContext(OrderManagementContext);
  const { setManagementComponent, setData } = orderManagementContext;

  const [error, setError] = useState<string>("");

  const fields = [
    {
      name: "sign_in",
      label: "Sign in",
      type: "radio",
      required: true,
      value: "email",
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
  const [formFields, setFormFields] = useState<any[]>([fields[0], fields[1]]);
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

  const submitForm = () => {

    // Clear error
    setError("");

    if (isvalidForm() && !saving) {
      setSaving(true);
      let data = {
        type: formFields[1].name,
        value: formFields[1].value,
      };

      postReq(VALIDATE_CUSTOMER_PATH, data).then((res: any) => {
        console.log("VALIDATE_CUSTOMER_PATH", res);

        if (!res || !res.data) {
          setSaving(false);
          setError("Sorry, No customer associated with these details");
          return;
        }

        setSessionStoragePrefs(CUSTOMER, JSON.stringify(res.data));
        orderManagementContext.customer = res.data;
        setManagementComponent(OrderManageTypes.ORDERS);

        setData({
          customerId: res.data.id,
        });

      }).catch((e) => {
        console.log("VALIDATE_CUSTOMER_PATH error", e);
        setSaving(false);
        setError("Sorry, No customer associated with these details");
      });
    }
  };
  const [saving, setSaving] = useState(false);

  return (
    <> {error && <p className="">{error}</p>}
      <LoginForm
        sign_in={"email"}
        submitForm={submitForm}
        formFields={formFields}
        setFormFields={setFormFields}
        saving={saving}
      /></>
  );
};

export default CustomerLogin;
