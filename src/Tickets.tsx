import React, { useEffect, useState } from "react";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import { getSessionStoragePrefs, setSessionStoragePrefs } from "./Storage";
import TicketDetails from "./components/TicketDetails";
import ChatTabsList from "./components/ChatTabsList";
import { TICKET_ACTIVE_COMPONENT, TICKET_ACTIVE_ID } from "./globals";
import { TicketType } from "./Models";
export default function Tickets() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<Number>();
  //export this
  enum TicketComponentNames {
    TicketList = "TicketList",
    TicketDetail = "TicketDetail",
    TicketForm = "TicketForm",
  }

  const [activeComponentName, setActiveComponentName] =
    useState<TicketComponentNames>(
      TicketComponentNames[
        (getSessionStoragePrefs(TICKET_ACTIVE_COMPONENT) != null
          ? getSessionStoragePrefs(TICKET_ACTIVE_COMPONENT)
          : TicketComponentNames.TicketList) as TicketComponentNames
      ]
    );

  const openTicket = (ticketId: Number) => {
    setSessionStoragePrefs(TICKET_ACTIVE_ID, ticketId);
    setActiveTicketId(ticketId);
    setActiveComponentName(TicketComponentNames.TicketDetail);
  };

  useEffect(() => {
    setSessionStoragePrefs(TICKET_ACTIVE_COMPONENT, activeComponentName);
  }, [activeComponentName]);

  const backToList = () => {
    setSessionStoragePrefs(TICKET_ACTIVE_ID, null);
    setActiveComponentName(TicketComponentNames.TicketList);
  };

  const showForm = () => {
    setActiveComponentName(TicketComponentNames.TicketForm);
  };

  return (
    <>
      {(() => {
        switch (activeComponentName) {
          case TicketComponentNames.TicketDetail: {
            return (
              <TicketDetails
                activeTicketId={activeTicketId}
                backToList={backToList}
              />
            );
          }

          case TicketComponentNames.TicketForm: {
            return (
              <TicketForm
                backToList={backToList}
                openTicket={openTicket}
                setTickets={setTickets}
                tickets={tickets}
              />
            );
          }

          case TicketComponentNames.TicketList: {
            return (
              <TicketList
                openTicket={openTicket}
                setTickets={setTickets}
                tickets={tickets}
                showForm={showForm}
              />
            );
          }

          default:
            return <></>;
        }
      })()}

      {activeComponentName == TicketComponentNames.TicketList ? (
        <ChatTabsList />
      ) : (
        <></>
      )}
    </>
  );
}
