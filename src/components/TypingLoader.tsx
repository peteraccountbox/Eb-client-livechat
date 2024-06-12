import React from 'react'

const TypingLoader = () => {
  return (
    <>
    <div
		className="conversation__list__item__summary__is-typing u__relative"
		style={{position:"relative"}}
	>
		<div className="conversation__is-typing-animation__dot-01"></div>
		<div className="conversation__is-typing-animation__dot-02"></div>
		<div className="conversation__is-typing-animation__dot-03"></div>
	</div>
    </>
  )
}

export default TypingLoader