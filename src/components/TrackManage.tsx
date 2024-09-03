import React from "react";
import { getSessionStoragePrefs } from "../Storage";
import { TRACK_MANAGE } from "../globals";

const TrackManage = () => {
  const componentState = getSessionStoragePrefs(TRACK_MANAGE);
 return <div>TrackManage</div>;
};

export default TrackManage;
