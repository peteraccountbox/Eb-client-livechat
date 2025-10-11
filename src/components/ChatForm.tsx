import React, { FC, useContext, useState } from "react";
import { AppContext } from "../appContext";
import { ChatFromFieldDataPayLoad, JSONObjectType } from "../Models";
import { isValidField, isValidTicketField } from "../Utils";
import FormComponent from "./FormComponent";

export interface ChatFormPropsType {
  formFields: ChatFromFieldDataPayLoad[];
  setFormFields(fields: ChatFromFieldDataPayLoad[]): void;
  submitChatForm: (formData: JSONObjectType) => void;
  closeChatForm: () => void;
  typeText: string;
  saving: boolean;
  setTypeText: (arg0: string) => void;
}

const ChatForm: FC<ChatFormPropsType> = (props) => {
  const { setTypeText, submitChatForm, formFields, setFormFields, typeText } =
    props;

  const [saving, setSaving] = useState(false);

  const handleFieldValueChange = (
    value: string,
    field: ChatFromFieldDataPayLoad
  ) => {
    let results = formFields.map((eachField: ChatFromFieldDataPayLoad) => {
      if (eachField === field) {
        if (eachField.type === "multicheckbox") {
          if (!eachField.valueArr) eachField.valueArr = [];
          if (eachField.valueArr.includes(value)) {
            const index = eachField.valueArr.indexOf(value);
            if (index > -1) {
              eachField.valueArr.splice(index, 1);
            }
          } else eachField.valueArr.push(value);
          eachField.value = eachField.valueArr;
        } else {
          eachField.value = value;
        }
        if (eachField.error) eachField = isValidField(eachField);
        if (eachField.field_type == "SYSTEM" && field.name == "message")
          setTypeText(value);
      }
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

  return (
    <div className="chat_agent_data" style={{ display: "flex" }}>
      <FormComponent
        typeText={typeText}
        formFields={formFields}
        handleFieldValueChange={handleFieldValueChange}
        saving={saving}
        submitForm={submitForm}
      />
    </div>
  );
};

export default ChatForm;
