import React, { useEffect, useState } from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import { ChatFromFieldDataPayLoad, JSONObjectType, JSONObjectType1 } from "../../Models";
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
          if (eachField.type === "checkbox") {
            if (!eachField.valueArr) eachField.valueArr = [];
            if (!value && eachField.valueArr.length == 1) eachField.valueArr.splice(0, 1);
             else eachField.valueArr.push(value);
            eachField.value = eachField.valueArr;
          }
          else
          if (
            eachField.type === "multicheckbox" 
            // ||
            // eachField.type === "checkbox"
          ) {
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
          // if (eachField.field_type == "SYSTEM" && field.name == "message")
          //   setTypeText(value);
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
            if (fieldClone.type == "multicheckbox" || fieldClone.type == "checkbox")
              fieldClone.valueArr = storedFormData[fieldClone.name]
                ? Array.from(storedFormData[fieldClone.name])
                : [];
            fieldClone.is_valid = false;
            fields.push(fieldClone);
          }
        );
    
        setFormFields(fields);
      }, []);

    const [formFields, setFormFields] = useState<ChatFromFieldDataPayLoad[]>(execution.node.data.formData.mapped_fields);
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
          value: field.value
        })
      });

      console.log("formdata", obj);

      
      setLocalStoragePrefs(FORM_DATA_ARRAY, JSON.stringify(form_data));
      let formData = getLocalStoragePrefs(FORM_DATA);
      if(formData) {
        formData = JSON.parse(formData);
        Object.assign(formData,obj);
      } 
      else {
        formData = obj
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
      return JSON.parse(execution.responseAction[0].data).form_data.map((data:any,index:number) => {
        let field = formFields.find((field: any) => field.name == data.name)
        return <div style={{lineHeight:"1.5"}}> <span style={{fontWeight: "500"}}>{field?.field_label || field?.label}</span>: {data.value}</div>
      })

    } catch (error) {
      return undefined
    }
  }
  return (
    <>

      {!execution.executed ? (
        <div className="chat__messages-group">
          <ul className="chat__messages-list multi_choice-list" style={{ display: "block", width: "85%" }}>
          <div className="chat_agent_data" style={{ display: "flex" }}>
      {/* <form
        action="javascript:void(0);"
        onSubmit={submitForm}
        className="chat__messages-form chatuserformdata"
        style={{ paddingTop: "0px", flex: "1" }}
      >
         <div style={{ marginBottom: "10px", marginTop: "10px" }}>
          <pre>
            
              <p className="mb-2"> {execution.node.data.formData?.message} </p>
           
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
                                          id={field.options}
                                          required={field.required}
                                          value={field.options}
                                          checked={
                                            field.valueArr.length == 1 ? true : false
                                          }
                                          className="chat__form-check-input"
                                          onChange={(e) =>
                                            handleFieldValueChange(e.target.value, field)
                                          }
                                        />
                                        <label
                                          className="chat__form-check-label"
                                          htmlFor={field.options}
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
                                                  field.valueArr.includes(opt)
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
                          {field.error ? (
                            <div className="error-content">{field.error}</div>
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })}
            {saving ? <>Saving...</> :
                    <a onClick={submitForm} href="javascript:void(0)" className="chat__messages-btn">
                      
                        <span
                          style={{ display: "flex", alignItems: "center", gap: "10px" }}
                        >
                          Submit

                        </span>
                      
                    </a>}
            
                    <input
                      type="submit"
                      className="form-submit"
                      value="Submit"
                      style={{ display: "none" }}
                    />
        
                  </form> */}
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
                <span style={{fontWeight:"500", fontSize:"15px", paddingBottom:"2px", display:"inline-block"}}>Form Data</span>
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