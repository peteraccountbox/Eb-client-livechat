import React, { useState } from "react";
import { InteractiveNodeProps } from "../InteractiveFlowUtils";
import TimeAgo from "../TimeAgo";
import FileUpload from "../FileUpload";

const CollectFileUpload: React.FC<InteractiveNodeProps> = ({
  execution,
  executeNodeOnUserInteraction,
}: InteractiveNodeProps) => {


    const fileUploadCallback = (status: string, file: any) => {
      if (status == "success") {
        execution.nodeId = execution.node.id;
        execution.executed = true;
        execution.responseAction = [
          {
            id: execution.node.id,
            type: "MESSAGE",
            data: JSON.stringify(file),
          },
        ];
        executeNodeOnUserInteraction(execution);
      } else {

      }
    };
    let responseAction;
    if(execution.responseAction && execution.responseAction.length) {
    responseAction = JSON.parse(execution.responseAction[0].data);
    }
  return (
    <>
      <div className="chat__messages-group">
        <ul className="chat__messages-list">
          <div className="chat__messages-list-item">
            <div className="chat__messages-bubble chat__message-type-TEXT">
              <span className="actual">
                {execution.node.data.formData?.message}
              </span>
            </div>
          </div>
        </ul>
      </div>
      {!execution.executed ? (
        <>
          <div className="chat__messages-group">

          <label
                  className="multi_choice-list-item-btn"
                >
                  
                  <FileUpload fileUploadCallback={fileUploadCallback} component={<span className="actual">Attach upto 5 files</span>}/>
                </label>
        </div>

        </>
      ) : (
        <>
          <div className="chat__messages-group--me">
            <div className="chat__messages-group">
              

                      <ul className="chat__messages-list">
                                            {responseAction &&
                                          responseAction.length ?
                                          responseAction.map((attachment: any) => {
                                            return (
                                                                <li className="chat__messages-list-item" key={attachment}>
                                                                <div className="chat__messages-bubble chat__message-type-TEXT">
                      
                                                  <a
                                                    className="inbox-attachment-filename chat__header-user-table-cell"
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                  >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="attach-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"></path></svg>
                                                    <span>
                                                      {attachment.fileName || attachment.name}
                                                    </span>
                                                  </a>
                                                 
                                              </div>
                                              </li>
                                            );
                                          }) : <div className="inbox-attachment-item" key={responseAction}>
                      
                                          <a
                                            className="inbox-attachment-filename chat__header-user-table-cell"
                                            href={responseAction.url}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="attach-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"></path></svg>
                                            <span>
                                              {responseAction.fileName || responseAction.name}
                                            </span>
                                          </a>
                                         
                                      </div>}
                                      </ul>
                  </div>
                
              
            
          </div>
        </>
      )}
    </>
  );
};
export default CollectFileUpload;