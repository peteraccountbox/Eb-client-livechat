import React, { useEffect, useState } from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import {
  ChatFromFieldDataPayLoad,
  JSONObjectType,
  JSONObjectType1,
} from "../../Models";
import { getBrowserInfo, getFormData, isValidField } from "../../Utils";
import { FORM_DATA, FORM_DATA_ARRAY } from "../../globals";
import { getLocalStoragePrefs, setLocalStoragePrefs } from "../../Storage";
import FormComponent from "../FormComponent";

const CollectFormData: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
}: InteractiveNodeProps) => {
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
        } else eachField.value = value;

        if (eachField.error) eachField = isValidField(eachField);
      }
      return eachField;
    });
    setFormFields(results);
  };

  useEffect(() => {
    let storedFormData: JSONObjectType = {};
    try {
      let obj: any = getFormData();
      if (obj) storedFormData = JSON.parse(obj) as JSONObjectType;
    } catch (error) {}

    let fields: ChatFromFieldDataPayLoad[] = [];

    execution.node.data.formData.mapped_fields.forEach(
      (field: ChatFromFieldDataPayLoad, index: number) => {
        let fieldClone = JSON.parse(
          JSON.stringify(field)
        ) as ChatFromFieldDataPayLoad;

        fieldClone.value =
          storedFormData[fieldClone.name] &&
          !(field.field_type == "SYSTEM" && field.name == "message")
            ? storedFormData[fieldClone.name]
            : "";
        if (fieldClone.type == "multicheckbox")
          fieldClone.valueArr = storedFormData[fieldClone.name]
            ? Array.from(storedFormData[fieldClone.name])
            : [];
        fieldClone.is_valid = false;
        fields.push(fieldClone);
      }
    );

    setFormFields(fields);
  }, []);

  const [formFields, setFormFields] = useState<ChatFromFieldDataPayLoad[]>(
    execution.node.data.formData.mapped_fields
  );
  const [saving, setSaving] = useState(false);

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

  const getFormMetaData = () => {
    var meta: JSONObjectType1 = {};

    // Form data if any
    var formDataArray: any = getLocalStoragePrefs(FORM_DATA_ARRAY);

    meta.form_data = JSON.parse(formDataArray);

    return meta;
  };
  const submitForm = () => {
    if (isvalidForm()) {
      // Set field data in to storage
      setSaving(true);
      let obj: JSONObjectType = {};
      let form_data: any[] = [];
      formFields.map((field: ChatFromFieldDataPayLoad) => {
        if (field.value) obj[field.name] = field.value;
        form_data.push({
          name: field.name,
          value: field.value,
        });
      });

      console.log("formdata", obj);

      setLocalStoragePrefs(FORM_DATA_ARRAY, JSON.stringify(form_data));
      let formData = getLocalStoragePrefs(FORM_DATA);
      if (formData) {
        formData = JSON.parse(formData);
        Object.assign(formData, obj);
      } else {
        formData = obj;
      }
      setLocalStoragePrefs(FORM_DATA, JSON.stringify(formData));
      sendMessage();
      // submitChatForm(obj);
    }
  };

  const sendMessage = () => {
    execution.nodeId = execution.node.id;
    execution.executed = true;
    execution.responseAction = [
      {
        id: execution.node.id,
        type: "FORM_DATA",
        data: JSON.stringify(getFormMetaData()),
      },
    ];
    executeNodeOnUserInteraction(execution);
  };

  const getData = () => {
    try {
      return JSON.parse(execution.responseAction[0].data).form_data.map(
        (data: any, index: number) => {
          let field = formFields.find((field: any) => field.name == data.name);
          return (
            <div style={{ lineHeight: "1.5" }}>
              {" "}
              <span style={{ fontWeight: "500" }}>
                {field?.field_label || field?.label}
              </span>
              : {data.value}
            </div>
          );
        }
      );
    } catch (error) {
      return undefined;
    }
  };
  return (
    <>
      {!execution.executed ? (
        <div className="chat__messages-group">
          <ul
            className="chat__messages-list multi_choice-list"
            style={{ display: "block", width: "85%" }}
          >
            <div className="chat_agent_data" style={{ display: "flex" }}>
              <FormComponent
                message={execution.node.data.formData?.message}
                formFields={formFields}
                handleFieldValueChange={handleFieldValueChange}
                saving={saving}
                submitForm={submitForm}
              />
            </div>
          </ul>
        </div>
      ) : (
        <div className="chat__messages-group chat__messages-group--me">
          <ul className="chat__messages-list">
            <div className="chat__messages-list-item">
              <div className="chat__messages-bubble chat__message-type-TEXT">
                <span className="actual">
                  <span
                    style={{
                      fontWeight: "500",
                      fontSize: "15px",
                      paddingBottom: "2px",
                      display: "inline-block",
                    }}
                  >
                    Form Data
                  </span>
                  {getData()}
                </span>
              </div>
            </div>
          </ul>
        </div>
      )}
    </>
  );
};

export default CollectFormData;
