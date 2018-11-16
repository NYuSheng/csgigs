import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Success from "@material-ui/icons/CheckCircle";

// core components
import Table from "components/Gigs/Table/Table";
import EditableTableCell from "components/Gigs/Table/EditableTableCell";
import Button from "components/CustomButtons/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";

// dependencies
import Loader from 'react-loader-spinner';
// import {NotificationManager} from "react-notifications";

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class BrownieAllocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            status: "",
        };
        this.cells = React.createRef();
    }

    componentWillReceiveProps() {
        const {gig} = this.props;
        this.setState({
            status: "working"
        })

        if (gig.tasks) {
            this.setState({
                tasks: JSON.parse(JSON.stringify(gig.tasks)),
            })
        }

        this.cells = {}
    }

    validatePointAllocation = (points, inputRefId) => {
        const {tasks} = this.state;

        if (isNaN(points)) {
            points = 0;
        }

        var result = tasks.find(task => {
            return task.id === inputRefId
        })
        result.points = points;
        this.setState({
            tasks: tasks
        })

        const {gig} = this.props;
        tasks.filter(task => task.id !== inputRefId).forEach(function (task) {
            points += task.points;
        });

        return points <= gig.points_budget
    }

    reRenderAllEditableCells = (inputRefId) => {
        const {tasks} = this.state;
        tasks.filter(task => task.id !== inputRefId).forEach((task) => {
            const editableTableCell = this.cells[`task${task.id}`];
            editableTableCell.validateCellValue(task.points);
            // editableTableCell.disableEdit();
        });
    }

    setupTableCells(task) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <React.Fragment>
                <TableCell colSpan="1" className={tableCellClasses}>
                    {task.taskname}
                </TableCell>
                <EditableTableCell ref={(cell) => this.cells[`task${task.id}`] = cell}
                                   inputRefId={task.id}
                                   classes={classes}
                                   cellValue={task.points}
                                   editValidation={this.validatePointAllocation}
                                   reRenderAllEditableCells={this.reRenderAllEditableCells}
                />
            </React.Fragment>
        );
    }

    editTaskAllocation(task) {
        const editableTableCell = this.cells[`task${task.id}`];
        editableTableCell.enableEdit();
    }

    confirmAdminAssign() {
        const {status} = this.state;
        if (status !== "success") {
            this.setState({
                status: "loading"
            });

            // API call here to post the updated assigned users
            // Build your payload using buildPayLoad() method below

            // dummy function to simulate api call
            setTimeout(() => {
                this.setState({
                    status: "success"
                });
            }, 1000);
        }
    }

    closeModal() {
        const {hidePopup} = this.props;
        const {tasks} = this.state;
        tasks.forEach((task) => {
            const editableTableCell = this.cells[`task${task.id}`];
            if (editableTableCell) editableTableCell.clearState();
        });

        hidePopup("brownieAllocation");
    }

    render() {
        const {classes, modalOpen, gig} = this.props;
        const {tasks, status} = this.state;

        return (

            <Dialog
                classes={{
                    root: classes.center + " " + classes.modalRoot,
                    paper: classes.modal
                }}
                open={modalOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    if (status !== "loading") {
                        this.closeModal();
                    }
                }}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                >
                    <GridContainer className={classes.modalHeader}>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{textAlign: "left"}}>
                            <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>
                                {
                                    (status === "working") ?
                                        "Edit Allocations"
                                        : null
                                }
                            </h4>
                        </GridItem>
                        <GridItem xs={6} sm={6} md={6} lg={6}>
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
                                <Close className={classes.modalClose}/>
                            </Button>
                        </GridItem>
                    </GridContainer>
                </DialogTitle>
                <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                    style={{padding: 35, paddingTop: 0, width: 500}}
                >
                    {
                        status === "loading" ?
                            (
                                <GridContainer justify="center">
                                    <GridItem xs={10} sm={10} md={10} lg={10}>
                                        <Loader
                                            type="ThreeDots"
                                            color="black"
                                            height="100"
                                            width="100"
                                        />
                                    </GridItem>
                                </GridContainer>
                            ) : null
                    }
                    {
                        status === "working" ?
                            (
                                <Table
                                    tableHeight="200px"
                                    hover
                                    tableHeaderColor="primary"
                                    tableHead={["Task Name", "Points Allocation"]}
                                    tableData={tasks}
                                    tableFooter="false"
                                    notFoundMessage="No tasks created"
                                    setupTableCells={this.setupTableCells.bind(this)}
                                    // handleTableRowOnClick={this.editTaskAllocation.bind(this)}
                                />
                            ) : null
                    }
                    {
                        status === "success" ? (
                            <React.Fragment>
                                <Success className={classes.icon} style={{height: 100, width: 100, fill: "green"}}/>
                                <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>Allocations Edited</h4>
                            </React.Fragment>
                        ) : null
                    }
                </DialogContent>
                {
                    status === "working" ? (
                        <DialogActions className={classes.modalFooter}>
                            <GridContainer>
                                <GridItem xs={6} sm={6} md={6} lg={6} style={{textAlign: "left"}}>
                                    {
                                        status === "working" ? (
                                            <h4 style={{fontWeight: "bold"}}>Budget: {gig.points_budget} Points</h4>
                                        ) : null
                                    }
                                </GridItem>
                                <GridItem xs={6} sm={6} md={6} lg={6} style={{textAlign: "right"}}>

                                    <Button onClick={() => this.confirmAdminAssign()}
                                            className={classes.button + " " + classes.success}
                                            color="success">
                                        Save
                                    </Button>
                                    <Button onClick={() => this.closeModal()}
                                            className={classes.button + " " + classes.danger}
                                            color="danger">
                                        Cancel
                                    </Button>
                                </GridItem>
                            </GridContainer>
                        </DialogActions>) : null
                }
            </Dialog>
        );
    }

    buildPayLoad() {
        // Construct your payload using state fields
    }
}

export default withStyles(notificationsStyle)(BrownieAllocation);