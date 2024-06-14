import React, { FC, useContext, useEffect, useState } from 'react'
import { AppContext } from '../appContext';
import { ChatMessagePaylodObj, ChatSessionPaylodObj } from '../Models';
import { getOperatorName, getSystemMessage } from '../Utils';
import PromptFooter from './PromptFooter';
import closePrompt from '../assets/img/close.png';

interface ChatPromptProp {
	session: ChatSessionPaylodObj | undefined,
	handleProactiveMessageSubmit: (arg0: string, arg1: number) => void
}

const ChatPrompt: FC<ChatPromptProp> = (props) => {
	const [chatMessage, setChatMessage] = useState("");
	const parentContext = useContext(AppContext);
	const from = props.session?.messageList[props.session?.messageList.length - 1].from as unknown as string;
	useEffect(() => {


		return () => {

		}
	}, [])



	const getLatestChat = (): ChatMessagePaylodObj | undefined => {

		try {
			// if (props.session.type == "BOT") {
			return props.session?.messageList[props.session.messageList.length - 1];
			//}
			// return this.session.messageList[this.session.messageList.length - 1];
		} catch (error) {
			return undefined;
		}
	}

	const lastMessage = getLatestChat();

	const getLatestMessage = () => {
		try {
			let mssg: any = getLatestChat();
			if (
				mssg &&
				mssg.from === "System" &&
				(!mssg.message || mssg.SYSTEM_message_type === "CHAT_SESSION_CLOSED")
			)
				return getSystemMessage(mssg.SYSTEM_message_type);

			return mssg.message;
		} catch (error) { }
	}



	return (
		<>
			<div className="chat__prompt is-open" data-target="prompt">
				<div className="chat__prompt-main">
					<div className="chat__prompt-message">
						<div
							className="chat__prompt-message-profile"

						>
							&nbsp;
						</div>
						<div className="chat__prompt-message-copy">
							<h3> {getOperatorName(lastMessage?.user_id, parentContext.agents)} </h3>
						</div>
					</div>

					<div className="chat__prompt-base-helper">
						<>
							<p>
								pro-
								{
									getLatestChat()?.message_type == 'TEXT' || from == "System" ?
										getLatestMessage() : <></>}
							</p>

							<p >
								{getLatestChat()?.message_type == 'FILE' ?
									<>
										File {from && from == "Visitor" ? <span >Sent</span> :
											<span >Received</span>}
									</> :
									<>
									</>
								}
							</p>
						</>

					</div>
				</div>

				<div className="chat__prompt-header-close">
					<button
						className="chat__prompt-close"
						data-trigger="prompt"

					>
						<img
							src={closePrompt}
							alt="Close"
							className="chat__prompt-close-img"
						/>
					</button>
				</div>


				<div className="chat__prompt-parent">
					<PromptFooter widgetPrefs={undefined} session={props.session} handleProactiveMessageSubmit={props.handleProactiveMessageSubmit} />
				</div>

			</div>
		</>
	)
}

export default ChatPrompt
