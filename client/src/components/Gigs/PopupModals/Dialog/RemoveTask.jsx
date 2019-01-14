import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog from "@material-ui/core/withMobileDialog";

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Success from "@material-ui/icons/CheckCircle";
import Warning from "@material-ui/icons/ErrorOutline";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import { remove } from "components/Gigs/API/Tasks";

// dependencies
import Loader from "react-loader-spinner";

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class RemoveTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ""
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.task !== prevProps.task) {
      this.setState({
        status: "working"
      });
    }
  }

  confirmTaskRemove() {
    const { gigRoomId, task } = this.props;
    const { status } = this.state;
    if (status !== "success") {
      remove(
        gigRoomId,
        task._id,
        task.task_name,
        this.setStatusState.bind(this)
      );
    }
  }

  setStatusState(status) {
    this.setState({
      status: status
    });
  }

  closeModal() {
    const { hideTask } = this.props;
    hideTask("removeTask");
  }

  render() {
    const { classes, fullScreen, task, modalOpen } = this.props;
    const { status } = this.state;

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
            <GridItem
              xs={6}
              sm={6}
              md={6}
              lg={6}
              style={{ textAlign: "left", paddingLeft: 3 }}
            >
              <h4 className={classes.modalTitle} style={{ fontWeight: "bold" }}>
                Remove Task
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
                Task Name: {task ? task.task_name : null}
              </p>
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
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
                <div style={{ paddingTop: 35 }}>
                  <Warning
                    className={classes.icon}
                    style={{ height: 100, width: 100, fill: "yellow" }}
                  />
                  <p>You will not be able to recover this task!</p>
                </div>
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
                    Task Removed
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
              onClick={() => this.confirmTaskRemove()}
              className={classes.button + " " + classes.success}
              color="success"
            >
              Confirm
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

export default withMobileDialog()(withStyles(notificationsStyle)(RemoveTask));
