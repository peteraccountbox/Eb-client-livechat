import React, { useEffect, useState } from "react";
import TicketForm from "./TicketForm";
import arrow from "../assets/img/arrow.png";
import TicketNoteItem from "./TicketNoteItem";
import { getReq, postReq } from "../request";
import { NOTE_URL } from "../globals";
import TicketDetails from "./TicketDetails";
// export interface TicketProps extends EBComponetProps {
//     activeTicket: any
//     tickets:any,
//     setTickets: (arg0: any[]) => void,
//     showTicketsList(): void,
//     setActiveTicket: (arg0: any) => void
// }

const Ticket = (props) => {
  const {activeTicket, setActiveTicket, showTicketsList, setTickets, tickets} = props;
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState();
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    if (!activeTicket) {
      setShowTicketForm(true);
    } else {
      setShowDetails(true);
      const wait = getReq(NOTE_URL, {
        ticket_id: activeTicket.id,
        page_size: 100,
      });
      wait
        .then((response) => {
          console.log(response.data);
          const sortedNotes = response.data?.sort(compare);
          setNotes(sortedNotes);
        })
        .catch((e) => {
          console.log(e);
        });
      setShowTicketForm(false);
    }
  }, [activeTicket]);

  const compare = (a, b) => {
    if (a.created_time < b.created_time) return -1;
    if (a.created_time > b.created_time) return 1;
    return 0;
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNote();
    }
  };

  const handleScroll = (e) => {
    if (e.currentTarget.classList.contains("on_scroll") === false) {
      var el = e.currentTarget;
      e.currentTarget.classList.add("on_scroll");
      setTimeout(function() {
        el.classList.remove('on_scroll');
      }, 1000); 
    }
  }

  const back = () => {
    if(!showDetails && !showTicketForm)
      setShowDetails(true)
    else
      showTicketsList()
  }
  const addNote = () => {
    if (note && !saving) {
      setSaving(true);
      const wait = postReq(NOTE_URL + "/" + activeTicket.id, {
        ticket_id: activeTicket.id,
        text_body: note,
      });
      wait
        .then((response) => {
          console.log(response.data);
          setNotes([...notes, response.data]);
          setNote("");
          setSaving(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div className="chat__conversation chat__help chat__create-ticket">
      <div className="chat__header">
        <div className="ticket__header-action">
          <div
            data-trigger="all"
            className="chat__header-back"
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
              {showTicketForm ? "Create Ticket" : showDetails ? "Ticket Details" : "Ticket Notes"}
            </h3>
          </div>
          <div />
        </div>
      </div>
      <div className="chat__content">
        <div className="chat__messages">
          <div
            className={`chat__messages-track ${
              showTicketForm || showDetails ? "" : "ticket_conversations_data"
            }`}
          >
            {showTicketForm ? (
              <>
                <div className="chat__ticket-form-main">
                  <>
                    <div className="chat__ticket-form">
                      {/* <pre style={{ marginBottom: "10px" }}>
                        <p className="mb-2">
                          Please provide your information below to proceed with
                          creating a ticket
                        </p>
                      </pre> */}
                      <TicketForm
                        setTickets={setTickets}
                        tickets={tickets}
                        setActiveTicket={setActiveTicket}
                      />
                    </div>
                    {/* <button
className="cancel-ticket-btn"
onClick={() => props.showTicketsList()}
style={{ display: "flex", alignItems: "center" }}
>
<span style={{ marginRight: "5px" }}>Cancel</span>
</button> */}
                  </>
                </div>
              </>
            ) : (
              showDetails ? 
              <TicketDetails ticket={activeTicket} setShowDetails = {setShowDetails}/> 
              :
              <>
                {notes.length > 0 &&
                  notes.map((note) => {
                    return (
                      <TicketNoteItem note={note} ticket={activeTicket} />
                    );
                  })}
              </>
            )}
          </div>
        </div>
      </div>
      {!showTicketForm && !showDetails ? (
        <div id="note-footer">
          <div className="note">
            <textarea
              className="text"
              value={note}
              placeholder="Add note"
              rows={2}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
            />
            <div className="tools">
            <button className="send" onClick={(e) => addNote()} style={{cursor:`${!note || saving ? 'not-allowed': 'pointer'}`}}>
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default Ticket;
