import Preview from './Preview.tsx';
import ReactDOM from 'react-dom/client';
import React, { useContext } from 'react';
import '../index.css';
import '../assets/css/main.scss';
import '../assets/css/components/_chat.scss';
import FormPreview from './FormPreview.tsx';
window.renderPreview = function (chatPrefs, isForm) {
  console.log("rendering view");
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      {isForm ? <FormPreview chatPrefs={chatPrefs}/> : <Preview chatPrefs={chatPrefs}/>}
     
    </React.StrictMode>
  );
}

