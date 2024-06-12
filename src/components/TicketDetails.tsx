import React, { FC, UIEvent, useContext, useEffect, useState } from "react";
import { getReq, postReq } from "../request";
import { NOTE_URL, TICKET_ACTIVE_ID, TICKET_FETCH_URL } from "../globals";
import { getSessionStoragePrefs, removeSessionStoragePrefs } from "../Storage";
import TicketNoteItem from "./TicketNoteItem";
import { AppContext } from "../appContext";
import { getOperator } from "../Utils";
import CloseWidgetPanel from "./CloseWidgetPanel";
import { widgetFooterTabs } from "../App";
import { AgentPaylodObj, TicketNoteType, TicketType } from "../Models";

export interface TicketDetailsComponentProps {
  activeTicketId: Number | undefined;
  backToList: () => void;
}

const TicketDetails: FC<TicketDetailsComponentProps> = (props) => {
  const [users, setUsers] = useState<AgentPaylodObj[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [notes, setNotes] = useState<TicketNoteType[]>([]);
  const [note, setNote] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [reLoad, setReload] = useState<boolean>(false);
  const [ticket, setTicket] = useState<TicketType>({} as TicketType);
  const { activeTicketId, backToList } = props;
  const parentContext = useContext(AppContext);

  useEffect(() => {
    var groupUsers = parentContext.agents;
    if (ticket && ticket.assigned_to == "GROUP") {
      if (groupUsers) {
        if (groupUsers.length > 3) setUsers([...groupUsers.slice(0, 3)]);
        else setUsers([...groupUsers]);
      }
    } else if (ticket && ticket.assigned_to == "USER") {
      let user = getOperator(ticket.assignee_id, groupUsers);
      if (user) setUsers([user]);
    }
  }, [ticket]);

  useEffect(() => {
    setLoading(true);
    var id = activeTicketId
      ? activeTicketId
      : getSessionStoragePrefs(TICKET_ACTIVE_ID);
    if (!showDetails) {
      const wait = getReq(NOTE_URL, {
        ticket_id: id,
        page_size: 100,
      });
      wait
        .then((response) => {
          setLoading(false);
          console.log(response.data);

          const sortedNotes = response.data?.sort(compare);
          setNotes(sortedNotes);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      const wait = getReq(TICKET_FETCH_URL + "/" + id, {});
      wait
        .then((response) => {
          setLoading(false);
          console.log(response.data);

          if (!response.data || !response.data.id) {
            removeSessionStoragePrefs(TICKET_ACTIVE_ID);
            removeSessionStoragePrefs("ticket_active_component");
            parentContext.changeActiveTab(widgetFooterTabs.Tickets);
          }

          setTicket(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [showDetails]);
  //reLoad

  const compare = (a: TicketNoteType, b: TicketNoteType) => {
    if (a.created_time < b.created_time) return -1;
    if (a.created_time > b.created_time) return 1;
    return 0;
  };

  const handleScroll = (e: UIEvent) => {
    if (e.currentTarget.classList.contains("on_scroll") === false) {
      var el = e.currentTarget;
      e.currentTarget.classList.add("on_scroll");
      setTimeout(function () {
        el.classList.remove("on_scroll");
      }, 1000);
    }
  };

  const back = () => {
    if (!showDetails) setShowDetails(true);
    else backToList();
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault();
  //     addNote();
  //   }
  // };

  const addNote = () => {
    if (note && !saving) {
      setSaving(true);
      const wait = postReq(NOTE_URL + "/" + ticket.id, {
        ticket_id: ticket.id,
        text_body: note,
      });
      wait
        .then((response: any) => {
          let newNote: TicketNoteType = response.data;
          console.log(response.data);
          setNotes([...notes, newNote]);
          setNote("");
          setSaving(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const getMessageTime = () => {
    const date = new Date(ticket.created_time * 1000);
    // Get the various components of the date
    // const year = date.getFullYear();
    // const month = date.toLocaleString('default', { month: 'long' });
    // const day = date.getDate();
    return (
      date.toLocaleDateString() +
      ", " +
      date.getHours() +
      ":" +
      date.getMinutes()
    );
  };

  return (
    <div className="chat__conversation chat__help chat__create-ticket">
      <div className="chat__header">
        <div className="ticket__header-action">
          <div
            data-trigger="all"
            className="chat__header-back chat__help-action"
            onClick={back}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              color="currentColor"
            >
              <path
                stroke="#fff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7"
                d="m14 18-6-6 6-6"
              ></path>
            </svg>
          </div>
          <div className="chat__header-user">
            <h3 className="chat__header-user-name">
              {/* {!showDetails && <span onClick={() => setReload(!reLoad)}>fetch </span>} */}
              {showDetails ? "Ticket Details" : "Ticket Notes"}
            </h3>
          </div>
          <div className="chat__help-end">
            <CloseWidgetPanel />
          </div>
        </div>
      </div>
      <div className="chat__content">
        <div className="chat__messages">
          <div
            className={`chat__messages-track ${
              showDetails ? "" : "ticket_conversations_data"
            }`}
          >
            {loading ? (
              <div className="pad-content">
                <div className="chat__form-loader1">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : showDetails && ticket ? (
              <div className="chat__ticket__report-details">
                <div className="chat__ticket__report-details-header">
                  <div className="home__feeds-header-avatars">
                    {users &&
                      users.length > 0 &&
                      users.map((user) => {
                        return (
                          <div className="home__feeds-header-avatars-item">
                            <div className="home__feeds-header-avatars-item-img">
                              <img src={user.profile_img_url} alt={user.name} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <p className="text__center">
                    {ticket.status == 4 || ticket.status == 5 ? (
                      <>Resolved by {users && users[0] && users[0].name}</>
                    ) : (
                      <>
                        {ticket.assigned_to == "USER"
                          ? users && users[0] && users[0].name
                          : "We"}{" "}
                        will pick this up soon
                      </>
                    )}
                  </p>
                </div>

                <div className="chat__ticket__report-status-list">
                  <ul className="chat__ticket__report-status-bar">
                    <li
                      className={`chat__ticket__report-status-item ${
                        ticket.status == 1 || ticket.status == 2
                          ? "active border_primary"
                          : ""
                      }`}
                    >
                      <label className="chat__ticket__report-status-label">
                        Submitted
                      </label>
                    </li>
                    <li
                      className={`chat__ticket__report-status-item ${
                        ticket.status == 3 ? "active border_primary" : ""
                      }`}
                    >
                      <label className="chat__ticket__report-status-label">
                        In progress
                      </label>
                    </li>

                    <li
                      className={`chat__ticket__report-status-item ${
                        ticket.status == 4 || ticket.status == 5
                          ? "active border_primary"
                          : ""
                      }`}
                    >
                      <label className="chat__ticket__report-status-label">
                        Resolved
                      </label>
                    </li>
                  </ul>
                </div>

                <div className="chat__ticket__report-panel">
                  <ul className="chat__ticket__report-panel-list">
                    <li className="chat__ticket__report-panel-item active">
                      <p className="chat__ticket__report-panel-title">
                        You will be notified here and by email
                      </p>
                      <p className="chat__ticket__report-panel-description">
                        {ticket.requester_email}
                      </p>
                    </li>
                    <li className="chat__ticket__report-panel-item">
                      <p className="chat__ticket__report-panel-title">
                        Issue subject
                      </p>
                      <p className="chat__ticket__report-panel-description">
                        {ticket.subject}
                      </p>
                    </li>

                    <li className="chat__ticket__report-panel-item">
                      <p className="chat__ticket__report-panel-title">
                        When is the issue reported
                      </p>
                      <p className="chat__ticket__report-panel-description">
                        {getMessageTime()}
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="chat__ticket__report-footer">
                  <p>Have a question about this issue?</p>
                  <button
                    type="button"
                    className="chat__ticket__report-conversation-btn"
                    onClick={() => setShowDetails(false)}
                  >
                    Continue the conversation
                  </button>
                </div>
              </div>
            ) : (
              notes.length > 0 &&
              notes.map(
                (note) =>
                  note.type != "PRIVATE" && (
                    <TicketNoteItem note={note} ticket={ticket} />
                  )
              )
            )}
          </div>
        </div>
      </div>

      {!showDetails && notes.length > 0 && (
        <div id="note-footer">
          <div className="note">
            <textarea
              className="text"
              value={note}
              placeholder="Add note"
              rows={2}
              onChange={(e) => setNote(e.target.value)}
              // onKeyDown={handleKeyDown}
              onScroll={handleScroll}
            />
            <div className="tools">
              <button
                className="send"
                onClick={(e) => addNote()}
                style={{
                  cursor: `${!note || saving ? "not-allowed" : "pointer"}`,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.394 14.7L13.75 9.3c1-.577 1-2.02 0-2.598L4.394 1.299a1.5 1.5 0 00-2.25 1.3v3.438l4.059 1.088c.494.132.494.833 0 .966l-4.06 1.087v4.224a1.5 1.5 0 002.25 1.299z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TicketDetails;
