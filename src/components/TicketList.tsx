import React, { FC, useContext, useEffect, useState } from "react";
import { AppContext } from "../appContext";
import { DEFAULT_AGENT_PROFILE_PIC, TICKETS_FETCH_URL } from "../globals";
import { getReq } from "../request";
import CloseWidgetPanel from "./CloseWidgetPanel";
import { AgentPaylodObj, TicketType } from "../Models";

export interface TicketListComponentProps {
  openTicket: (ticketId: Number) => void;
  setTickets: (arg0: TicketType[]) => void;
  tickets: TicketType[];
  showForm: () => void;
}
const TicketList: FC<TicketListComponentProps> = (props) => {
  const parentContext = useContext(AppContext);
  const { openTicket, setTickets, tickets, showForm } = props;
  const [loading, setLoading] = useState(true);
  const createTicket = () => {
    showForm();
  };
  useEffect(() => {
    const wait = getReq(TICKETS_FETCH_URL, {});
    wait
      .then((response) => {
        console.log(response.data);
        setTickets(response.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  const getImage = (ticket: TicketType) => {

    if (!ticket.agentId || !ticket.agentId || parentContext.agents?.length == 0 || !(parentContext.agents?.find(agent => (agent.id == ticket.agentId))))
      return DEFAULT_AGENT_PROFILE_PIC;

    const agent: AgentPaylodObj | undefined = parentContext.agents.find(agent => (agent.id == ticket.agentId));
    return agent?.userPicURL || DEFAULT_AGENT_PROFILE_PIC;

  };

  return (
    <div
      className={`chat__help chat__ticket ${tickets.length == 0 ? "chat_no_padcontent_data" : ""
        } `}
    >
      <div className="chat__header">
        <div className="chat__help-action"></div>
        <div className="chat__header-user">
          <h3 className="chat__header-user-name">Tickets</h3>
        </div>
        <div className="chat__help-end">
          <CloseWidgetPanel />
        </div>
      </div>

      <div
        className={`help__collections ${tickets.length == 0 ? "" : "chat__ticket-collections"
          }`}
      >
        {tickets.length > 0 ? (
          <div className="chat__ticket-collections-body">
            <div className="chat__ticket-collections-body-track">
              <ul className="help__collections-list">
                {tickets.map((ticket) => {
                  return (
                    <li>
                      <div
                        className="help__collections-list-item"
                        onClick={() => openTicket(ticket.id)}
                      >
                        <div className="help__collections-list-item-avatar">
                          <div
                            className="chat__all-messages-item-profile"
                            style={{
                              backgroundImage:
                                'url("' + getImage(ticket) + '")',
                            }}
                          >
                            &nbsp;
                          </div>
                        </div>
                        <div className="help__collections-list-content">
                          <div className="help__collections-list-content-tickets">
                            <h6>{ticket.subject}</h6>
                            <div>
                              <span className="text-gray">
                                {ticket.status == 1 ? "New" : ""}
                                {ticket.status == 2 ? "Open" : ""}
                                {ticket.status == 3 ? "Pending" : ""}
                                {ticket.status == 4 ? "Solved" : ""}
                                {ticket.status == 5 ? "Closed" : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="help__collections-list-arrow">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M5.42773 4.70898C5.46387 4.85254 5.53809 4.98828 5.65039 5.10059L8.54932 8L5.64893 10.9004C5.31689 11.2324 5.31689 11.7705 5.64893 12.1025C5.98096 12.4336 6.51904 12.4336 6.85107 12.1025L10.3516 8.60059C10.5591 8.39355 10.6367 8.10449 10.585 7.83691C10.5537 7.67578 10.4761 7.52246 10.3516 7.39844L6.85254 3.89941C6.52051 3.56738 5.98242 3.56738 5.65039 3.89941C5.43066 4.11816 5.35645 4.42871 5.42773 4.70898Z"
                              fill="#000000"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="chat__all-messages-bottom-shadow"></div>
          </div>
        ) : (
          <div className="help__collections-list">
            <div className="pad-content">
              {loading ? (
                <>
                  <div className="chat__form-loader1">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </>
              ) : (
                <>
                  <img
                    className="pad-no-content-img"
                    src="https://d2p078bqz5urf7.cloudfront.net/cloud/assets/livechat/no-tickets-yet.svg"
                    alt="No Tickets"
                  />
                  <h2 className="pad-content-title">No Tickets</h2>
                  <p className="pad-text">
                    There is no previous ticket history on record.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {(!loading || tickets.length > 0) && (
        <button
          className="chat__all-btn d-flex create_ticket_button"
          onClick={() => createTicket()}
        >
          <span>Create Ticket</span>
        </button>
      )}
    </div>
  );
};

export default TicketList;
