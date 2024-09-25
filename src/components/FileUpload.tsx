import React, { useEffect, useRef, useState } from "react";
import attach from "../assets/img/attach.png";
import loader from "../assets/img/loader.gif";
import { FILE_UPLOAD_URL_PATH } from "../globals";
import { postReq } from "../request";
import uploadFile from "../FileUpload";

interface FileUploadProps {
  fileUploadCallback(status: string, file: any): void;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState([]);
  const [filesCount, setFilesCount] = useState(0);
  const [status, setStatus] = useState("completed");
  const [excludeExt, setExcludeExt] = useState(["html", "exe", "xhtml"]);
  const [bucketURL, setBucketURL] = useState(
    "https://s3.amazonaws.com/ebuploads2/"
  );

  const iconUrl = () => {
    return status !== "uploading" ? attach : loader;
  };
  useEffect(() => {
    return () => { };
  }, []);
  const uploadFile1 = (input: any) => {
    setFiles(input.files);
    setFilesCount(input.files.length);

    // Check size and ignore
    if (input.files.length == 0) return;

    // Upload one by one
    setStatus("uploading");
    for (var i = 0; i < input.files.length; i++) {
      uploadToS3(input.files[i]);
    }
  };
  const uploadToS3 = (file: any) => {
    // Validate
    if (!isValidFile(file)) return;

    //Change unique file name
    setFilePath(file);

    var that = this;
    const wait = postReq(FILE_UPLOAD_URL_PATH + "?file=" + file.file_resource, {
      fileUrl: file.file_resource,
    });
    wait
      .then((response: any) => {
        file.file_resource = response.data.fileURL;
        uploadToAWSBucket(getFileData(file), file);
      })
      .catch(() => { });
    //this.sync(this.getRestURL("api/panel/contentbox/repo/getFilePath?file=" +file.file_resource) ,{"fileUrl":file.file_resource},function(data){

    //	file.file_resource = data.fileURL;
    //	that.uploadToAWSBucket(that.getFileData(file), file);
    //	})
  };

  /**
   * UPload to amazon
   *
   * @param form_data
   * @param file
   */
  const uploadToAWSBucket = (form_data: any, file: any) => {
    var that = this;

    // Construct http request for post request
    var xhr = new window.XMLHttpRequest();
    xhr.upload.addEventListener("progress", function (evt) { }, false);
    xhr.addEventListener(
      "load",
      function (evt: any) {
        var statusCode = evt.target
          ? evt.target.status
          : evt.currentTarget.status;

        emitEvent(
          statusCode >= 200 && statusCode <= 300 ? "success" : "error",
          file
        );
      },
      false
    );
    xhr.addEventListener(
      "error",
      function (evt) {
        file.error_mssg =
          "Sorry, you cannot upload files at this moment. Please try again later.";
        emitEvent("error", file);
      },
      false
    );
    xhr.addEventListener(
      "abort",
      function (evt) {
        file.error_mssg =
          "Sorry, you cannot upload files at this moment. Please try again later.";
        emitEvent("error", file);
      },
      false
    );

    // Must be last line before send
    xhr.open("POST", bucketURL, true);
    xhr.send(form_data);
  };

  const setFilePath = (file: any) => {
    var file_name = file.name.split(".")[0];
    var file_extension = file.name.split(".").pop();

    file.file_resource =
      "uploads/" +
      file_name.replace(/[^a-zA-Z0-9]/g, "_") +
      "." +
      file_extension;

    file.bucketURL = bucketURL;
  };

  const getFileData = (file: any) => {
    var fd = new FormData();

    // Construct post data
    fd.append("key", file.file_resource);
    fd.append("acl", "public-read");
    fd.append("AWSAccessKeyId", "AKIAIUBC6PDU7ZVBXFJA");
    fd.append(
      "policy",
      "ewogICJleHBpcmF0aW9uIjogIjIwMjktMDEtMDFUMTI6MDA6MDAuMDAwWiIsCiAgImNvbmRpdGlvbnMiOiBbCiAgICB7ImJ1Y2tldCI6ICJlYnVwbG9hZHMyIiB9LAogICAgeyJhY2wiOiAicHVibGljLXJlYWQiIH0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAidXBsb2Fkcy8iXSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJENvbnRlbnQtVHlwZSIsICIiXQogIF0KfQo="
    );
    fd.append("signature", "yQfJQnt5Jdbomu680QKvK4oD15c=");
    // fd.append('Content-Type', file.type | 'binary/octet-stream');
    fd.append("Content-Type", "binary/octet-stream");
    fd.append("file", file);

    return fd;
  };

  const isValidFile = (file: any) => {
    var file_name = file.name.split(".")[0];
    var file_extension = file.name.split(".").pop();

    if (excludeExt.includes(file_extension)) {
      file.error_mssg = "Sorry, you cannot upload such files.";
      emitEvent("error", file);
      return false;
    }

    // Large file limit (5MB)
    if (file.size > 50 * 1024 * 1024) {
      file.error_mssg = "Sorry, you cannot upload files larger than 50 MB.";
      emitEvent("error", file);
      return false;
    }

    return true;
  };

  const emitEvent = (status: string, file: any) => {
    props.fileUploadCallback(status, file);

    // File count change for completed status
    if (status == "success") {
      setStatus("completed");
      if (input.current) input.current.setAttribute("value", "");
    }
  };

  return (
    <div className="chat__actions-item chat__attachments">

      <label htmlFor="attachments" className="chat__actions-item-trigger">
        {status !== "uploading" ? (
          <svg
            onClick={(e: any) => uploadFile(postReq, (status: string, data:any) => {
              props.fileUploadCallback(status, data);
            })}
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
          </svg>
        ) : (
          <img
            src={loader}
            alt="Attachments"
            className="chat__actions-item-trigger"
          />
        )}
      </label>
    </div>
  );
};

export default FileUpload;
