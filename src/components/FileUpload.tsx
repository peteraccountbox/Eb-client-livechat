import React, { useState } from "react";
import { postReq } from "../request";
import uploadFile from "../FileUpload";

interface FileUploadProps {
  fileUploadCallback(status: string, file: any): void;
  component?: any;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const [status, setStatus] = useState("completed");

  return (
    <div className="chat__actions-item chat__attachments">

      <label htmlFor="attachments" className="chat__actions-item-trigger">
        {status !== "uploading" ? (
          <span onClick={(e: any) => uploadFile(postReq, setStatus, props.component ? true : false, (status: string, data:any) => {
            props.fileUploadCallback(status, data);
            setStatus("completed");
          })}>
          {props.component ?
        props.component :
          <svg
            width="16"
            height="16"
            fill="#757575"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 16 16"
          >
            {" "}
            <g>
              {" "}
              <path d="M5.3,13.5C5.3,13.5,5.3,13.5,5.3,13.5c-1.1,0-2.1-0.4-2.8-1.2c-1.5-1.5-1.5-4,0-5.6l4.2-4.2   c0.3-0.3,0.7-0.3,0.9,0c0.3,0.3,0.3,0.7,0,0.9L3.4,7.7c-1,1-1,2.7,0,3.7c0.5,0.5,1.2,0.8,1.9,0.8c0.8,0,1.4-0.3,1.9-0.8l5.9-5.9   c0.4-0.4,0.4-1.1,0-1.5c-0.2-0.2-0.5-0.3-0.7-0.3l0,0c-0.3,0-0.5,0.1-0.7,0.3L5.7,10c-0.3,0.3-0.7,0.3-0.9,0s-0.3-0.7,0-0.9   l5.9-5.9c0.4-0.4,1-0.7,1.7-0.7l0,0c0.6,0,1.2,0.2,1.7,0.7c0.9,0.9,0.9,2.4,0,3.3l-5.9,5.9C7.3,13.1,6.3,13.5,5.3,13.5z" />{" "}
            </g>{" "}
          </svg>}
          </span>
        ) : (
          <img
            src={"https://d2p078bqz5urf7.cloudfront.net/cloud/assets/livechat/loader.gif"}
            alt="Attachments"
            className="chat__actions-item-trigger"
          />
        )}
      </label>
    </div>
  );
};

export default FileUpload;
