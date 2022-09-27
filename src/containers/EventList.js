import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Divider,
  Button
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";

import { Container } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    gridColumn: 1,
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "10%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    paddingLeft: "15px",
    paddingRight: "15px",
  },
  footer: {
    position: "fixed",
    left: 0,
    bottom: 0,
    width: "100%",
    "text-align": "left",
    "border-style": "solid",
    "border-color": "grey",
    "border-width": "medium",
  },
  clearButton: {
    width: "100%",
  },
  header: {
    position: "fixed",
    right: 5,
    top: 5,
    width: "30%",
    "text-align": "center",
    "border-width": "medium",
  },
  callButton: {
    width: "30%",
    "background-color": "dodgerBlue",
  },
  hangupButton: {
    width: "100%",
    "background-color": "red",
  },
  input: {
    height: 30,
    margin: 12,
    borderWidth: 1,
  },
}));

const EventList = ({
  nexmoApp,
  events,
  setEvents,
  outboundCall,
  setOutboundCall,
}) => {
  const classes = useStyles();
  const [number, onChangeNumber] = useState("");

  if (!nexmoApp.me) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {nexmoApp.me ? (
          `Hello ${nexmoApp.me.application.me.name}`
        ) : (
          <Link to="/">Login</Link>
        )}
      </Typography>

      {outboundCall ? (
        <div></div>
      ) : (
        <div className={classes.header}>
          <input
            className={classes.input}
            type="text"
            value={number}
            onChange={(event) => {onChangeNumber(event.target.value)}}
          />
          <Button
            onClick={() => {
              nexmoApp.me.application.callServer(number).then((call) => {
                setOutboundCall(call);
              });
            }}
            className={classes.callButton}
          >
            Call
          </Button>
        </div>
      )}

      {outboundCall ? (
        <div className={classes.header}>
          <Button
            onClick={() => {
              outboundCall.hangUp().then(() => {
                setOutboundCall(undefined);
              });
            }}
            className={classes.hangupButton}
          >
            Hangup Call
          </Button>
        </div>
      ) : (
        <div></div>
      )}

      {events.map((event) => {
        return (
          <Accordion key={event.id + event.cid}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>{event.type}</Typography>
              <Typography className={classes.secondaryHeading}>
                From: {event?._embedded?.from_member?.id}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography className={classes.secondaryHeading}>
                Display name:{" "}
                {event?._embedded?.from_user?.display_name ??
                  event?._embedded?.from_user?.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{`Body: ${JSON.stringify(event)}`} </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
      <div className={classes.footer}>
        <Button onClick={() => setEvents([])} className={classes.clearButton}>
          Clear Events
        </Button>
      </div>
    </Container>
  );
};

export default EventList;
