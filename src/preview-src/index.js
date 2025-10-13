import Preview from './Preview.tsx';
import ReactDOM from 'react-dom/client';
import React, { useContext } from 'react';
import '../index.css';
import '../assets/css/main.scss';
import '../assets/css/components/_chat.scss';
import PreviewConversation from './PreviewConversation.tsx';
import FormPreview from './FormPreview.tsx';
window.renderPreview = function (chatPrefs, previewType) {
  const root = ReactDOM.createRoot(document.getElementById('root-preview'));
  root.render(
    <React.StrictMode>
     {(() => {
      switch (previewType) {
        case "home":
          return <Preview chatPrefs={chatPrefs}/>;

        case "conversation":
          return <PreviewConversation chatPrefs={chatPrefs} />;   
        
        case "form":
          return <FormPreview chatPrefs={chatPrefs}/>;  

        default:
          return <></>
      }})()}
      {/* {isForm ? <FormPreview chatPrefs={chatPrefs}/> : <Preview chatPrefs={chatPrefs}/>} */}
    </React.StrictMode>
  );
}

