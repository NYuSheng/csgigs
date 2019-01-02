import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog from "@material-ui/core/withMobileDialog";

// @material-ui/icons
import Cancel from "@material-ui/icons/Cancel";
import Close from "@material-ui/icons/Close";
import Success from "@material-ui/icons/CheckCircle";

// core components
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import Table from "components/Gigs/Table/Table";
import AutoComplete from "components/Gigs/AutoComplete/AutoComplete";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import { update } from "components/Gigs/API/Gigs/Gigs";

// dependencies
import Loader from "react-loader-spinner";
import { NotificationManager } from "react-notifications";

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class EditGigParticipants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedParticipants: [],
      status: ""
    };
  }

  componentWillReceiveProps() {
    const { participants } = this.props;
    this.setState({
      selectedParticipants: participants,
      status: "working"
    });
  }

  setupTableCells(participant) {
    const { classes } = this.props;
    const tableCellClasses = classes.tableCell;
    return (
      <React.Fragment>
        <TableCell colSpan="1" className={tableCellClasses}>
          {participant.name}
        </TableCell>
        <TableCell
          colSpan="1"
          className={tableCellClasses}
          style={{ textAlign: "right" }}
        >
          <Cancel className={classes.icon} />
        </TableCell>
      </React.Fragment>
    );
  }

  selectParticipant(participant) {
    const selectedParticipants = this.state.selectedParticipants;
    const existingParticipants = selectedParticipants.filter(
      selectedParticipant => selectedParticipant._id === participant._id
    );
    if (existingParticipants.length >= 1) {
      NotificationManager.error(
        "User " + participant.name + " has been selected"
      );
    } else {
      this.setState({
        selectedParticipants: [participant].concat(selectedParticipants)
      });
    }
  }

  deselectParticipant(participant) {
    const selectedParticipants = this.state.selectedParticipants;
    const participantsAfterRemoval = selectedParticipants.filter(
      selectedParticipant => selectedParticipant._id !== participant._id
    );
    this.setState({
      selectedParticipants: participantsAfterRemoval
    });
  }

  confirmParticipantAssign() {
    const { gigId, participants } = this.props;
    const { status } = this.state;
    if (status !== "success") {
      const participantArrays = this.findRemovedAndNewParticipants();
      const removedParticipants = participantArrays.removed;
      const newParticipants = participantArrays.new;
      // TODO: Remove and new participants
      update(gigId, this.buildPayLoad(), this.setStatusState.bind(this));
    }
  }

  findRemovedAndNewParticipants() {
    const { selectedParticipants } = this.state;
    const { participants } = this.props;
    const toReturn = {
      removed: [],
      new: []
    };

    participants.forEach(participant => {
      const existingParticipant = selectedParticipants.find(
        existingParticipant => existingParticipant._id === participant._id
      );
      if (!existingParticipant) {
        toReturn.removed.push(participant);
      }
    });

    selectedParticipants.forEach(selectedParticipant => {
      const newParticipant = participants.find(
        participant => participant._id === selectedParticipant._id
      );
      if (!newParticipant) {
        toReturn.new.push(selectedParticipant);
      }
    });

    return toReturn;
  }

  buildPayLoad() {
    const { selectedParticipants } = this.state;
    const payload = {
      user_participants: selectedParticipants.map(
        participant => participant._id
      )
    };
    return payload;
  }

  setStatusState(status) {
    this.setState({
      status: status
    });
  }

  closeModal() {
    this.props.hidePopup();
  }

  render() {
    const { classes, modalOpen, fullScreen } = this.props;
    const { selectedParticipants, status } = this.state;
    return (
      <Dialog
        open={modalOpen}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          if (status !== "loading") {
            this.closeModal();
          }
        }}
        aria-labelledby="classic-modal-slide-title"
        aria-describedby="classic-modal-slide-description"
        maxWidth="xs"
      >
        <DialogTitle id="classic-modal-slide-title" disableTypography>
          <GridContainer className={classes.modalHeader}>
            <GridItem xs={6} sm={6} md={6} lg={6} style={{ textAlign: "left" }}>
              <h4 className={classes.modalTitle} style={{ fontWeight: "bold" }}>
                Edit Participants
              </h4>
            </GridItem>
            <GridItem xs={6} sm={6} md={6} lg={6} style={{ paddingRight: 0 }}>
              <Button
                justIcon
                className={classes.modalCloseButton}
                key="close"
                aria-label="Close"
                color="transparent"
                onClick={() => {
                  if (status !== "loading") {
                    this.closeModal();
                  }
                }}
              >
                <Close className={classes.modalClose} />
              </Button>
            </GridItem>
          </GridContainer>
        </DialogTitle>
        <DialogContent
          id="classic-modal-slide-description"
          className={classes.modalBody}
          style={{ paddingBottom: 35, paddingTop: 0 }}
        >
          <GridContainer justify="center">
            <GridItem xs={10} sm={10} md={10} lg={10}>
              <p
                style={{
                  textAlign: "justify",
                  paddingBottom: 9,
                  borderBottom: "1px solid grey",
                  fontSize: 13
                }}
              >
                Manage your event participants here
              </p>
            </GridItem>
            <GridItem
              xs={10}
              sm={10}
              md={10}
              lg={10}
              style={{ textAlign: "center" }}
            >
              {status === "loading" ? (
                <div style={{ paddingTop: 25 }}>
                  <Loader
                    type="ThreeDots"
                    color="black"
                    height="100"
                    width="100"
                  />
                </div>
              ) : null}
              {status === "working" ? (
                <GridContainer>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ padding: 0 }}
                  >
                    <Card>
                      <CardHeader>
                        <AutoComplete
                          selectInput={this.selectParticipant.bind(this)}
                        />
                      </CardHeader>
                      <CardBody>
                        <Table
                          tableHeight="150px"
                          hover
                          tableHeaderColor="primary"
                          tableData={selectedParticipants}
                          tableFooter="false"
                          notFoundMessage="No participants selected"
                          setupTableCells={this.setupTableCells.bind(this)}
                          handleTableRowOnClick={this.deselectParticipant.bind(
                            this
                          )}
                        />
                      </CardBody>
                    </Card>
                  </GridItem>
                </GridContainer>
              ) : null}
              {status === "success" ? (
                <div style={{ paddingTop: 25 }}>
                  <Success
                    className={classes.icon}
                    style={{ height: 100, width: 100, fill: "green" }}
                  />
                  <h4
                    className={classes.modalTitle}
                    style={{ fontWeight: "bold" }}
                  >
                    Participants Edited
                  </h4>
                </div>
              ) : null}
            </GridItem>
          </GridContainer>
        </DialogContent>
        {status === "working" ? (
          <DialogActions
            className={classes.modalFooter}
            style={{ padding: 24 }}
          >
            <Button
              onClick={() => this.confirmParticipantAssign()}
              className={classes.button + " " + classes.success}
              color="success"
            >
              Save
            </Button>
            <Button
              onClick={() => this.closeModal()}
              className={classes.button + " " + classes.danger}
              color="danger"
            >
              Cancel
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    );
  }
}

export default withMobileDialog()(
  withStyles(notificationsStyle)(EditGigParticipants)
);
