// ##############################
// // // LoginPage view styles
// #############################

import {
  container,
  cardTitle
} from "assets/jss/material-dashboard-pro-react.jsx";

const loginPageStyle = theme => ({
  container: {
    ...container,
    zIndex: "4",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "100px"
    }
  },
  cardTitle: {
    ...cardTitle,
    color: "#FFFFFF"
  },
  textCenter: {
    textAlign: "center"
  },
  justifyContentCenter: {
    justifyContent: "center !important"
  },
  customButtonClass: {
    "&,&:focus,&:hover": {
      color: "#FFFFFF"
    },
    marginLeft: "5px",
    marginRight: "5px"
  },
  inputAdornment: {
    marginRight: "18px"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  cardHidden: {
    opacity: "0",
    transform: "translate3d(0, -60px, 0)"
  },
  cardHeader: {
    marginBottom: "20px"
  },
  socialLine: {
    padding: "0.9375rem 0"
  },
    fullPage: {
        padding: "120px 0",
        position: "relative",
        minHeight: "100vh",
        display: "flex!important",
        margin: "0",
        border: "0",
        color: "#fff",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "100%",
        [theme.breakpoints.down("sm")]: {
            minHeight: "fit-content!important"
        },
        "& footer": {
            position: "absolute",
            bottom: "0",
            width: "100%",
            border: "none !important"
        },
        "&:before": {
            backgroundColor: "rgba(0, 0, 0, 0.65)"
        },
        "&:before,&:after": {
            display: "block",
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0",
            left: "0",
            zIndex: "2"
        }
    }
});

export default loginPageStyle;
