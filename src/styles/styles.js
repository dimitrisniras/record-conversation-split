import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  alignItemsAndJustifyContent: {
    display: "flex",
    "flex-direction": "column",
    alignItems: "center",
    justifyContent: "center",
    "margin-top": "-78px",
    height: "100vh",
  },
  linearProgress: {
    height: "5px",
    width: "200px",
    top: "50%",
    left: "50%",
    position: "absolute",
    "margin-left": "-100px",
  },
  root: {
    gridColumn: 2,
    backgroundColor: theme.palette.background.paper,
  },
  sentMessageComponent: {
    "align-self": "flex-end",
    display: "flex",
  },
  box: {
    display: "flex",
    height: "100vh",
    "flex-direction": "column",
    "background-color": "#f6f0d791",
  },
  link: {
    "margin-top": "15px",
    display: "block",
  },

  conversations: {
    overflow: "hidden",
  },

  messagesEndDiv: {
    display: "inline-block",
    float: "left",
  },
  username: {
    padding: "5px 7px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  topnav: {
    "background-color": "#333",
    overflow: "hidden"
  },
  navItem: {
    float: "left",
    color: "#f2f2f2",
    "text-align": "center",
    padding: "14px 16px",
    "text-decoration": "none",
    "font-size": "17px"
  },
}));

export default useStyles;
