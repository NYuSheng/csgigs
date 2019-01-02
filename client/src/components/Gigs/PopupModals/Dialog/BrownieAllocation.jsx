import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";

// @material-ui/icons
import Close from "@material-ui/icons/Close";

// core components
import Table from "components/Gigs/Table/Table";
import EditableTableCell from "components/Gigs/Table/EditableTableCell";
import Button from "components/CustomButtons/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import { assignPointsToUser } from "components/Gigs/API/Gigs/PointAllocations";

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class BrownieAllocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAllocations: [],
      total: ""
    };
    this.cells = React.createRef();
  }

  componentDidMount() {
    this.cells = {};
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.modalOpen !== prevProps.modalOpen) {
      this.setState({
        userAllocations: this.props.userAllocations
      });

      this.resetEditableCellValues();
    }
  }

  setupTableCells(allocation) {
    const { classes } = this.props;
    const tableCellClasses = classes.tableCell;
    return (
      <React.Fragment>
        <TableCell colSpan="1" className={tableCellClasses}>
          {allocation.user.name}
        </TableCell>
        {!allocation.assigned ? (
          <EditableTableCell
            id={allocation.user._id}
            ref={component =>
              (this.cells[`${allocation.user._id}`] = component)
            }
            cellValue={allocation.points}
            classes={classes}
            validateFunction={this.validateCurrentTotal.bind(this)}
            assignPointsFunction={this.assignPoints.bind(this)}
          />
        ) : (
          <TableCell colSpan="1" className={tableCellClasses}>
            {allocation.points}
          </TableCell>
        )}
      </React.Fragment>
    );
  }

  resetEditableCellValues() {
    const { userAllocations } = this.state;
    userAllocations.forEach(userAllocation => {
      const cell = this.cells[`${userAllocation.user._id}`];
      if (cell) {
        cell.setState({
          value: userAllocation.points
        });
      }
    });
    this.validateCurrentTotal();
  }

  resetEditableCellStates() {
    const { userAllocations } = this.state;
    userAllocations.forEach(userAllocation => {
      const cell = this.cells[`${userAllocation.user._id}`];
      if (cell) {
        cell.setState({
          status: "success"
        });
      }
    });
  }

  validateCurrentTotal() {
    const { gigBudget } = this.props;
    const { userAllocations } = this.state;
    var currentTotal = 0;
    userAllocations.forEach(userAllocation => {
      if (!userAllocation.assigned) {
        const cell = this.cells[`${userAllocation.user._id}`];
        if (cell) {
          const cellValue = cell.state.value ? cell.state.value : 0;
          currentTotal += parseInt(cellValue, 10);
        }
      } else {
        currentTotal += parseInt(userAllocation.points, 10);
      }
    });
    this.setState({
      total: currentTotal
    });

    if (currentTotal <= gigBudget) {
      this.resetEditableCellStates();
      return true;
    } else {
      return false;
    }
  }

  setUserAssignedState(userId, points) {
    const { userAllocations } = this.state;
    const allocation = userAllocations.find(
      userAllocation => userAllocation.user._id === userId
    );
    allocation.assigned = true;
    allocation.points = parseInt(points, 10);
    this.setState({
      userAllocations: userAllocations
    });
  }

  assignPoints(cell) {
    const { gigId } = this.props;
    assignPointsToUser(
      cell.props.id,
      gigId,
      cell.state.value,
      this.setUserAssignedState.bind(this),
      cell.setStatusState.bind(cell)
    );
  }

  closeModal() {
    const { hidePopup } = this.props;
    hidePopup();
  }

  render() {
    const { classes, modalOpen, fullScreen, gigBudget } = this.props;
    const { userAllocations, total } = this.state;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          this.closeModal();
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
              style={{ textAlign: "left", paddingRight: 0 }}
            >
              <h4 className={classes.modalTitle} style={{ fontWeight: "bold" }}>
                Edit Allocations
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
                  this.closeModal();
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
          style={{ padding: 24, paddingTop: 0 }}
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
                Allocate your brownie points here
              </p>
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ paddingTop: 10, textAlign: "center" }}
            >
              <Card style={{ padding: 0, margin: "15px 0px 25px 0px" }}>
                <CardBody style={{ padding: 8 }}>
                  <Table
                    tableHeaderColor="primary"
                    tableData={userAllocations}
                    tableFooter="false"
                    notFoundMessage="No tasks created"
                    setupTableCells={this.setupTableCells.bind(this)}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={10} sm={10} md={10} lg={10}>
              <h4 style={{ fontWeight: "bold" }}>
                Budget: {total} / {gigBudget} Points
              </h4>
            </GridItem>
          </GridContainer>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withMobileDialog()(
  withStyles(notificationsStyle)(BrownieAllocation)
);
