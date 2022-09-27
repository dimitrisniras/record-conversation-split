import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import nexmoClient from "./nexmoClient";

import EventList from "./containers/EventList";
import Login from "./containers/Login";

import "./App.css";

const Container = styled.div`
  height: 100vh;
`;

function useSocketEvents(nexmoApp) {
  const [event, setEvent] = useState(null);

  const setLastEvent = (clientEvent) => {
    setEvent(clientEvent);
  };

  useEffect(() => {
    if (nexmoApp?.session?.connection?.io) {
      nexmoApp.session.connection.io.on("packet", async (packet) => {
        if (packet.type !== 2) return;
        if (packet.data[0] === "echo") return;
        const event = packet.data[1];
        event.type = packet.data[0];

        setLastEvent(event);
      });
    }
  });

  return event;
}

function App() {
  const [nexmoApp, setNexmoApp] = useState(nexmoClient);
  const [events, setEvents] = useState([]);
  const [outboundCall, setOutboundCall] = useState(undefined);
  const lastSocketEvent = useSocketEvents(nexmoApp);

  useEffect(() => {
    const appendHistory = (clientEvent) => {
      if (clientEvent)
        setEvents((eventsHistory) => [...eventsHistory, clientEvent]);
    };

    appendHistory(lastSocketEvent);
  }, [lastSocketEvent]);

  return (
    <Router>
      <Container>
        <Switch>
          <Route path="/login">
            <Login
              nexmoApp={nexmoApp}
              setNexmoApp={setNexmoApp}
              setOutboundCall={setOutboundCall}
            />
          </Route>
          <Route path="/events">
            <EventList
              nexmoApp={nexmoApp}
              events={events}
              setEvents={setEvents}
              outboundCall={outboundCall}
              setOutboundCall={setOutboundCall}
            />
          </Route>
          <Route path="/">
            <Login
              nexmoApp={nexmoApp}
              setNexmoApp={setNexmoApp}
              setOutboundCall={setOutboundCall}
            />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
