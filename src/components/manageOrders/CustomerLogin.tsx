import React, { useContext, useState } from "react";
import { isValidTicketField } from "../../Utils";
import LoginForm from "../LoginForm";
import { postReq } from "../../request";
import {
  CUSTOMER_ID_ON_TRACK_MANAGE,
  VALIDATE_CUSTOMER_PATH,
} from "../../globals";
import { OrderManageTypes } from "../TrackManageUtils";
import { setSessionStoragePrefs } from "../../Storage";
import { OrderManagementContext } from "../../appContext";

const CustomerLogin = () => {
  const orderManagementContext = useContext(OrderManagementContext);
  const { setManagementComponent, setData } = orderManagementContext;

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
    if (isvalidForm() && !saving) {
      setSaving(true);
      let data = {
        type: formFields[1].name,
        value: formFields[1].value,
      };

      postReq(VALIDATE_CUSTOMER_PATH, data).then((res: any) => {
        console.log(res.data.customerId);
        setSessionStoragePrefs(
          CUSTOMER_ID_ON_TRACK_MANAGE,
          res.data.customerId
        );
        setManagementComponent(OrderManageTypes.ORDERS);
        setData(res.data);
      });
    }
  };
  const [saving, setSaving] = useState(false);

  return (
    <LoginForm
      sign_in={"email"}
      submitForm={submitForm}
      formFields={formFields}
      setFormFields={setFormFields}
      saving={saving}
    />
  );
};

export default CustomerLogin;
