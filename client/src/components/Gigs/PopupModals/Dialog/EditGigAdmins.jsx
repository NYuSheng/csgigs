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
import { retrieveAllTasks } from "components/Gigs/API/Tasks/Tasks";
import { kick_user } from "components/Gigs/API/RocketChat/RocketChat";
import { remove_owner_from_group } from "components/Gigs/API/RocketChat/RocketChat";
// dependencies
import Loader from "react-loader-spinner";
import { NotificationManager } from "react-notifications";

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class EditGigAdmins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAdmins: [],
      status: ""
    };
  }

  componentWillReceiveProps() {
    const { admins } = this.props;
    this.setState({
      selectedAdmins: admins,
      status: "working"
    });
  }

  setupTableCells(admin) {
    const { classes } = this.props;
    const tableCellClasses = classes.tableCell;
    return (
      <React.Fragment>
        <TableCell colSpan="1" className={tableCellClasses}>
          {admin.name}
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

  selectAdmin(admin) {
    const selectedAdmins = this.state.selectedAdmins;
    const existingAdmins = selectedAdmins.filter(
      selectedAdmin => selectedAdmin._id === admin._id
    );
    if (existingAdmins.length >= 1) {
      NotificationManager.error("User " + admin.name + " has been selected");
    } else {
      this.setState({
        selectedAdmins: [admin].concat(selectedAdmins)
      });
    }
  }

  deselectAdmin(admin) {
    const selectedAdmins = this.state.selectedAdmins;
    const adminsAfterRemoval = selectedAdmins.filter(
      selectedAdmin => selectedAdmin._id !== admin._id
    );
    this.setState({
      selectedAdmins: adminsAfterRemoval
    });
  }

  confirmAdminAssign() {
    const { gigId, admins } = this.props;
    const { status } = this.state;
    if (status !== "success") {
      const adminArrays = this.findRemovedAndNewAdmins();
      const removedAdmins = adminArrays.removed;
      const newAdmins = adminArrays.new;
      // TODO: Remove and new admins
      this.checkAdminBeforeDeassign(removedAdmins, gigId);
      update(gigId, this.buildPayLoad(), this.setStatusState.bind(this));
    }
  }

  async checkAdminBeforeDeassign(removedAdmins, gigId) {
    const { gigRoomId } = this.props;
    for (let i = 0; i < removedAdmins.length; i++) {
      const admin_user_id = removedAdmins[i]._id;
      const tasks_assigned_to_user = await retrieveAllTasks(
        gigId,
        admin_user_id
      );
      await remove_owner_from_group(gigRoomId, admin_user_id);
      if (!tasks_assigned_to_user.length) {
        await kick_user(gigRoomId, admin_user_id);
      }
    }
  }

  findRemovedAndNewAdmins() {
    const { selectedAdmins } = this.state;
    const { admins } = this.props;
    const toReturn = {
      removed: [],
      new: []
    };

    admins.forEach(admin => {
      const existingAdmin = selectedAdmins.find(
        selectedAdmin => selectedAdmin._id === admin._id
      );
      if (!existingAdmin) {
        toReturn.removed.push(admin);
      }
    });

    selectedAdmins.forEach(selectedAdmin => {
      const newAdmin = admins.find(admin => admin._id === selectedAdmin._id);
      if (!newAdmin) {
        toReturn.new.push(selectedAdmin);
      }
    });

    return toReturn;
  }

  buildPayLoad() {
    const { selectedAdmins } = this.state;
    const payload = {
      user_admins: selectedAdmins.map(admin => admin._id)
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
    const { selectedAdmins, status } = this.state;

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
                Edit Admins
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
                Manage your event admins here
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
                          selectInput={this.selectAdmin.bind(this)}
                        />
                      </CardHeader>
                      <CardBody>
                        <Table
                          tableHeight="150px"
                          hover
                          tableHeaderColor="primary"
                          tableData={selectedAdmins}
                          tableFooter="false"
                          notFoundMessage="No admins selected"
                          setupTableCells={this.setupTableCells.bind(this)}
                          handleTableRowOnClick={this.deselectAdmin.bind(this)}
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
                    Admins Edited
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
              onClick={() => this.confirmAdminAssign()}
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
  withStyles(notificationsStyle)(EditGigAdmins)
);
