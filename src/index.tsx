import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/css/main.scss";
import App, { widgetFooterTabs } from "./App";
import { getSessionStoragePrefs, removeSessionStoragePrefs } from "./Storage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// const getIsOpened = () => {
//   let opened = getSessionStoragePrefs("window-open");
//   let activeTabname = getSessionStoragePrefs("widget_active_tab");
//   if (!opened || !activeTabname) return;

//   if (activeTabname == widgetFooterTabs.Messages) {
//     const activeChatType = getSessionStoragePrefs("opened-chat");
//     if (activeChatType && activeChatType == "new") {
//       removeSessionStoragePrefs("window-open");
//       removeSessionStoragePrefs("proactive-message");
//       removeSessionStoragePrefs("opened-chat");
//     }
//   }
// };
// getIsOpened();

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
