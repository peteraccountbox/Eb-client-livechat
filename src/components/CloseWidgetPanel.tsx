import React, { useContext } from 'react'
import { AppContext } from '../appContext';

const CloseWidgetPanel = () => {
    const parentContext = useContext(AppContext);
    const chatBubbleClicked = parentContext.chatBubbleClicked;
  return (
    <div className="closeChatWidgetPanel" onClick={chatBubbleClicked}>
    <svg focusable="false" aria-hidden="true" width="12" height="12" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" color="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 7.23251L7.23251 8L4 4.76749L0.767492 8L0 7.23251L3.23251 4L0 0.767492L0.767492 0L4 3.23251L7.23251 0L8 0.767492L4.76749 4L8 7.23251Z" fill="currentColor"></path></svg>
    </div>  
  )
}

export default CloseWidgetPanel