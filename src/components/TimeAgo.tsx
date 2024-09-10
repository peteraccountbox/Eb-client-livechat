import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import ReactTimeAgo from "react-time-ago";

import TimeAgoJS from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

TimeAgoJS.addDefaultLocale(en);
TimeAgoJS.addLocale(ru);

const TimeAgo = ({ date }: { date: Date | undefined }) => {
  // date = date + "";
  // if (date && date.indexOf("Z") == -1) date = date + "Z";



  return <>{
    date && <ReactTimeAgo date={date} locale="en-US" tooltip={false} />
  }</>;
};

export default TimeAgo;
