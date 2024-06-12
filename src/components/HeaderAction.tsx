import React from 'react'
import closeBubble from '../assets/img/close.png';

const HeaderAction = ({chatBubbleClicked}:{chatBubbleClicked:Function}) => {
  return (
    <>
    <div className="chat__prompt-header hide" onClick={()=>chatBubbleClicked()}>
		<button className="chat__prompt-close" data-trigger="prompt">
			<img src={closeBubble} alt="Close"
				className="chat__prompt-close-img"/>
		</button>
	  </div>
    </>
  )
}

export default HeaderAction