import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// material-ui icons
import Home from "@material-ui/icons/Home";

import Button from "components/CustomButtons/Button.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Card from "components/Card/Card.jsx";

import {
  cardTitle,
  roseColor
} from "assets/jss/material-dashboard-pro-react.jsx";

const style = {
cardTitle,
  cardTitleWhite: {
    ...cardTitle,
    color: "#FFFFFF",
    marginTop: "0"
  },
  cardCategory: {
      color: "#999999",
      marginTop: "10px"
    },
    icon: {
        color: "#333333",
        margin: "10px auto 0",
        width: "130px",
        height: "130px",
        border: "1px solid #E5E5E5",
        borderRadius: "50%",
        lineHeight: "174px",
        "& svg": {
          width: "55px",
          height: "55px"
        },
        "& .fab,& .fas,& .far,& .fal,& .material-icons": {
          width: "55px",
          fontSize: "55px"
        }
      },
      iconRose: {
        color: roseColor
      },

};

function GigDashboard({ ...props }) {
  const { classes } = props;
  const gig = props.location.state.gig
  return (
    <Card pricing>
        <CardBody pricing>
          <h6 className={classes.cardCategory}>SMALL COMPANY</h6>
          <div className={classes.icon}>
            <Home className={classes.iconRose} />
          </div>
          <h3
            className={`${classes.cardTitle} ${classes.marginTop30}`}
          >
            {gig[0]}
          </h3>
          <p className={classes.cardDescription}>
            This is good if your company size is between 2 and 10
            Persons.
          </p>
          <Button round color="rose">
            Choose plan
          </Button>
        </CardBody>
    </Card>
  );
}

export default withStyles(style)(GigDashboard);



