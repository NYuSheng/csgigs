import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons
import BrowniePoints from "@material-ui/icons/AttachMoney";
import Status from "@material-ui/icons/Timeline";
import Chat from "@material-ui/icons/Chat";

// core components
import Card from "components/Card/Card";
import CardIcon from "components/Card/CardIcon";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import GigActions from "components/Gigs/PopupModals/Dialog/GigActions";
import GigDetails from "components/Gigs/PopupModals/Dialog/GigDetails";
import BrownieAllocation from "components/Gigs/PopupModals/Dialog/BrownieAllocation";
import UserProfile from "components/Gigs/Authentication/UserProfile";
import GigAdminsView from "views/Gigs/ViewComponents/GigAdminsView";
import GigTasksView from "views/Gigs/ViewComponents/GigTasksView";
import GigParticipantsView from "views/Gigs/ViewComponents/GigParticipantsView";
import { getUserGig } from "components/Gigs/API/Gigs/Gigs";

// dependencies
import CircularProgressbar from "react-circular-progressbar";

// style sheets
import {
  cardTitle,
  roseColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import "react-circular-progressbar/dist/styles.css";

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
  "@media screen and (max-width:480px)": {
    muiButtonText: {
      display: "none"
    }
  },
  "@media screen and (min-width:480px)": {
    muiButtonIcon: {
      display: "none"
    }
  }
};

class GigDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gig: null,
      brownieAllocation: false,
      gigActionsModalOpen: false,
      gigDetailsModalOpen: false,
      Draft: "info",
      Active: "warning",
      Completed: "success",
      Cancelled: "danger"
    };
  }

  componentDidMount() {
    var authenticated = UserProfile.authenticate();
    if (!authenticated) {
      const { history } = this.props;
      history.push({
        pathname: "/login"
      });
    } else {
      const {
        match: { params }
      } = this.props;
      this.setupData(params.gigId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.isAnyPopupClicked(prevState)) {
      const {
        match: { params }
      } = this.props;
      getUserGig(params.gigId, this.setGigState.bind(this));
    }
  }

  isAnyPopupClicked(prevState) {
    return (
      this.state.gigDetailsModalOpen !== prevState.gigDetailsModalOpen ||
      this.state.gigActionsModalOpen !== prevState.gigActionsModalOpen
    );
  }

  setupData(gigId) {
    getUserGig(gigId, this.setGigState.bind(this));
  }

  setGigState(gig) {
    this.setState({
      gig: gig
    });
  }

  openGigDetailsPopup() {
    this.setState({
      gigDetailsModalOpen: true
    });
  }

  openGigActionsPopup() {
    this.setState({
      gigActionsModalOpen: true
    });
  }

  editBrownieAllocation() {
    this.setState({
      brownieAllocation: true
    });
  }

  hidePopup(popupState) {
    this.setState({
      [popupState + "ModalOpen"]: false
    });
  }

  calculatePoints(gig) {
    var tasksAllocations = 0;

    if (gig.tasks) {
      gig.tasks.forEach(function(task) {
        tasksAllocations += task.points;
      });
    }

    return tasksAllocations;
  }

  calculatePointsPercentage(gig) {
    return (this.calculatePoints(gig) / gig.points_budget) * 100;
  }

  render() {
    const { classes } = this.props;
    const {
      gig,
      brownieAllocation,
      gigActionsModalOpen,
      gigDetailsModalOpen
    } = this.state;

    if (gig) {
      return (
        <div>
          <GigActions
            modalOpen={gigActionsModalOpen}
            hidePopup={this.hidePopup.bind(this)}
            gig={gig}
          />
          <GigDetails
            modalOpen={gigDetailsModalOpen}
            hidePopup={this.hidePopup.bind(this)}
            gig={gig}
          />
          <BrownieAllocation
            modalOpen={brownieAllocation}
            hidePopup={this.hidePopup.bind(this)}
            gig={gig}
          />
          <GridContainer justify="center">
            <GridItem xs={6}>
              <Button
                className={classes.marginRight}
                onClick={this.openGigDetailsPopup.bind(this)}
              >
                Details
              </Button>
            </GridItem>
            <GridItem xs={6} style={{ textAlign: "right" }}>
              <Button
                className={classes.marginRight}
                onClick={this.openGigActionsPopup.bind(this)}
              >
                Actions
              </Button>
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <Card>
                    <CardHeader color="warning" stats icon>
                      <CardIcon color={this.state[gig.status]}>
                        <Status />
                      </CardIcon>
                      <p className={classes.cardCategory}>Gigs Status</p>
                      <h3 className={classes.cardTitle}>{gig.status}</h3>
                    </CardHeader>
                    <CardFooter />
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={6} lg={6}>
                  <Card>
                    <CardHeader color="chat" stats icon>
                      <CardIcon color="chat">
                        <Chat />
                      </CardIcon>
                      <p className={classes.cardCategory}>Gigs Channel</p>
                      <h3 className={classes.cardTitle}>
                        {gig.rc_channel_id ? (
                          <a
                            href={
                              "https://csgigs.com/channel/" +
                              gig.rc_channel_id.name
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {gig.rc_channel_id.name}
                          </a>
                        ) : (
                          "Not Published"
                        )}
                      </h3>
                    </CardHeader>
                    <CardFooter />
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12}>
                  <GigAdminsView
                    gigId={gig._id}
                    gigRoomId={gig.rc_channel_id._id}
                    {...this.props}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem xs={12} sm={12} md={4} lg={4}>
              <Card pricing>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <BrowniePoints />
                  </CardIcon>
                </CardHeader>
                <CardBody pricing>
                  <CircularProgressbar
                    className={classes.icon}
                    percentage={this.calculatePointsPercentage(gig)}
                    text={`${this.calculatePoints(gig)}/${gig.points_budget}`}
                    strokeWidth={2}
                    styles={{
                      root: {},
                      path: {
                        stroke: "#ff9800",
                        strokeLinecap: "butt",
                        transition: "stroke-dashoffset 0.5s ease 0s"
                      },
                      trail: {
                        stroke: "#d6d6d6"
                      },
                      text: {
                        fill: "#ff9800",
                        fontSize: "20px"
                      }
                    }}
                  />
                  <h6 className={classes.cardCategory}>
                    Brownie Points Total Budget
                  </h6>
                  <Button
                    round
                    color="warning"
                    onClick={this.editBrownieAllocation.bind(this)}
                  >
                    Edit Allocation
                  </Button>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4} lg={4}>
              <GigParticipantsView gigId={gig._id} {...this.props} />
            </GridItem>
            <GridItem xs={12} sm={12} md={8} lg={8}>
              <GigTasksView gigId={gig._id} gigRoomId={gig.rc_channel_id._id} />
            </GridItem>
          </GridContainer>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default withStyles(style)(GigDashboard);
