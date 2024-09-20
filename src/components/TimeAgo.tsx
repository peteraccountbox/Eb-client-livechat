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

const TimeAgo = ({
  date,
  time,
}: {
  date?: Date | undefined;
  time?: string;
}) => {
  // date = date + "";
  // if (date && date.indexOf("Z") == -1) date = date + "Z";

  const [newDate, setNewDate] = useState(
    date
      ? date
      : !time
      ? new Date()
      : time.indexOf("Z") == -1
      ? new Date(time + "Z")
      : new Date(time)
  );

  return (
    <>
      {newDate && (
        <ReactTimeAgo date={newDate} locale="en-US" tooltip={false} />
      )}
    </>
  );
};

export default TimeAgo;
