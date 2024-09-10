import React, { FC, useEffect } from "react";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import Attachment from "./Attachment";
import { TicketNoteType, TicketType } from "../Models";

export interface TicketNoteItemComponentProps {
  note: TicketNoteType;
  ticket: TicketType;
}

const TicketNoteItem: FC<TicketNoteItemComponentProps> = (props) => {
  const { note, ticket } = props;
  const getMessageTime = () => {
    return note.created_time * 1000;
  };

  useEffect(() => {
    var elem = document.getElementsByClassName("chat__messages-track")[0];
    if (elem) elem.scrollTop = elem.scrollHeight;
  }, []);

  return (
    <>
      {note.created_by === "PROSPECT" ? (
        <div className="chat__messages-group chat__messages-group--me">
          <ul
            className="chat__messages-list"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <li className="chat__messages-list-item">
              <Tippy
                content={
                  <></>
                  // <ReactTimeAgo
                  //   date={getMessageTime()}
                  //   locale="en-US"
                  //   tooltip={false}
                  // />
                }
              >
                <div className="chat__messages-bubble">
                  <div className="ticket_conversations_email">
                    <h3>{ticket.requester_name} </h3>
                  </div>
                  <div
                    className="ticket_conversations_desc"
                    dangerouslySetInnerHTML={{ __html: note.text_body }}
                  >
                    {/* {note.text_body} */}
                  </div>
                </div>
              </Tippy>
            </li>
          </ul>

          <div
            className="chat__messages-timestamp ticket_conversations_timeago"
            // style={{ display: "none" }}
          >
            {/* <ReactTimeAgo
              date={getMessageTime()}
              locale="en-US"
              tooltip={false}
            /> */}
          </div>
        </div>
      ) : (
        <div className="chat__messages-group">
          <div className="chat__messages-agent-info">
            <div className="chat__messages-agent">
              <div className="chat__messages-agent-avatar">
                <img src={note.owner.profile_img_url} alt="Avatar" />
              </div>
              {/* <Tooltip
              title={<ReactTimeAgo date={getMessageTime()} locale="en-US" tooltip={false}/>}
              position="bottom"
              trigger="mouseenter"
              > */}
              <ul className="chat__messages-list">
                <li className="chat__messages-list-item">
                  <Tippy
                    content={
                      // <ReactTimeAgo
                      //   date={getMessageTime()}
                      //   locale="en-US"
                      //   tooltip={false}
                      // />
                      <></>
                    }
                  >
                    <div className="chat__messages-bubble">
                      <div className="ticket_conversations_email">
                        <h3>{note.owner.name} </h3>
                      </div>
                      <div
                        className="ticket_conversations_desc"
                        dangerouslySetInnerHTML={{ __html: note.html_body }}
                      >
                        {/* {note.text_body} */}
                      </div>
                      {note.repository_attachment_list.length > 0 && (
                        <div>
                          <h3 className="ticket_notes-attachment-title">
                            Attachments
                          </h3>
                          {note.repository_attachment_list.map((attachment) => (
                            <Attachment attachment={attachment} />
                          ))}
                        </div>
                      )}
                    </div>
                  </Tippy>
                </li>
              </ul>
              {/* </Tooltip> */}
            </div>
            <div className="chat__messages-timestamp ticket_conversations_timeago">
              {/* <ReactTimeAgo
                date={getMessageTime()}
                locale="en-US"
                tooltip={false}
              /> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketNoteItem;
