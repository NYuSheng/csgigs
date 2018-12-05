import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog from '@material-ui/core/withMobileDialog';

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Success from "@material-ui/icons/CheckCircle";

// core components
import Table from "components/Gigs/Table/Table";
import EditableTableCell from "components/Gigs/Table/EditableTableCell";
import Button from "components/CustomButtons/Button";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";

// dependencies
import Loader from 'react-loader-spinner';
import {NotificationManager} from "react-notifications";

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
            status: ""
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
            return task._id === inputRefId
        })
        result.points = points;
        this.setState({
            tasks: tasks
        })

        const {gig} = this.props;
        tasks.filter(task => task._id !== inputRefId).forEach(function (task) {
            points += task.points;
        });

        return points <= gig.points_budget
    }

    reRenderAllEditableCells = (inputRefId) => {
        const {tasks} = this.state;
        tasks.filter(task => task._id !== inputRefId).forEach((task) => {
            const editableTableCell = this.cells[`task${task._id}`];
            editableTableCell.validateCellValue(task.points);
        });
    }

    setupTableCells(task) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <React.Fragment>
                <TableCell colSpan="1" className={tableCellClasses}>
                    {task.task_name}
                </TableCell>
                <EditableTableCell ref={(cell) => this.cells[`task${task._id}`] = cell}
                                   inputRefId={task._id}
                                   classes={classes}
                                   cellValue={task.points}
                                   editValidation={this.validatePointAllocation}
                                   reRenderAllEditableCells={this.reRenderAllEditableCells}
                />
            </React.Fragment>
        );
    }

    isValidated() {
        const {tasks} = this.state;
        var BreakException = {};

        try {
            tasks.forEach((task) => {
                const editableTableCell = this.cells[`task${task._id}`];
                if (editableTableCell.state.cellValueState !== "success") {
                    throw BreakException;
                }
            });
        } catch (exception) {
            return false;
        }

        return true;
    }

    calculateCurrentTotal() {
        const {tasks} = this.state;

        var currentTotal = 0;
        tasks.forEach(function (task) {
            currentTotal += task.points;
        });

        return currentTotal;
    }

    allocationEditAction() {
        const {gig} = this.props;
        const {tasks} = this.state;

        gig.tasks = tasks;
    }

    confirmAllocationEdit() {
        const {status} = this.state;
        if (status !== "success") {
            if (this.isValidated()) {
                this.setState({
                    status: "loading"
                });

                fetch("/admin-ui/api/tasks/updateTasksPoints", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(this.buildPayLoad())
                }).then(data => {
                    if (data.status !== 200) {
                        data.json().then(json => {
                            NotificationManager.error(json.error.errmsg);
                        });
                        this.setState({
                            status: "working"
                        });
                    } else {
                        this.allocationEditAction();
                        this.setState({
                            status: "success"
                        });
                    }
                });
            }
        }
    }

    closeModal() {
        const {hidePopup} = this.props;
        const {tasks} = this.state;
        tasks.forEach((task) => {
            const editableTableCell = this.cells[`task${task._id}`];
            if (editableTableCell) editableTableCell.clearState();
        });

        hidePopup("brownieAllocation");
    }

    render() {
        const {classes, modalOpen, gig, fullScreen} = this.props;
        const {tasks, status} = this.state;

        return (

            <Dialog
                fullScreen={fullScreen}
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
                maxWidth="xs"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                >
                    <GridContainer className={classes.modalHeader}>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{textAlign: "left", paddingRight: 0}}>
                            <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>
                                Edit Allocations
                            </h4>
                        </GridItem>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{paddingRight: 0}}>
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
                    style={{padding: 24, paddingTop: 0}}
                >
                    <GridContainer justify="center">
                        <GridItem xs={10} sm={10} md={10} lg={10}>
                            <p style={{
                                textAlign: "justify",
                                paddingBottom: 9,
                                borderBottom: "1px solid grey",
                                fontSize: 13
                            }}>
                                Allocate your brownie points here
                            </p>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12} lg={12} style={{paddingTop: 10, textAlign: "center"}}>
                            {
                                status === "loading" ?
                                    (
                                        <div style={{paddingTop: 25}}>
                                            <Loader
                                                type="ThreeDots"
                                                color="black"
                                                height="100"
                                                width="100"
                                            />
                                        </div>
                                    ) : null
                            }
                            {
                                status === "working" ?
                                    (
                                        <Card style={{padding: 0, margin: "15px 0px 25px 0px"}}>
                                            <CardBody style={{padding: 8}}>
                                                <Table
                                                    tableHeight="200px"
                                                    tableHeaderColor="primary"
                                                    tableHead={["Task Name", "Points Allocation"]}
                                                    tableData={tasks}
                                                    tableFooter="false"
                                                    notFoundMessage="No tasks created"
                                                    setupTableCells={this.setupTableCells.bind(this)}
                                                />
                                            </CardBody>
                                        </Card>
                                    ) : null
                            }
                            {
                                status === "success" ? (
                                    <div style={{paddingTop: 25, paddingBottom: 21}}>
                                        <Success className={classes.icon}
                                                 style={{height: 100, width: 100, fill: "green"}}/>
                                        <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>Allocations
                                            Edited</h4>
                                    </div>
                                ) : null
                            }
                        </GridItem>
                        {
                            status === "working" ? (
                                <GridItem xs={10} sm={10} md={10} lg={10}>
                                    <h4 style={{fontWeight: "bold"}}>Budget: {this.calculateCurrentTotal()} / {gig.points_budget} Points</h4>
                                </GridItem>
                            ) : null
                        }
                    </GridContainer>
                </DialogContent>
                {
                    status === "working" ? (
                        <DialogActions className={classes.modalFooter} style={{padding: 24}}>
                            <Button onClick={() => this.confirmAllocationEdit()}
                                    className={classes.button + " " + classes.success}
                                    color="success">
                                Save
                            </Button>
                            <Button onClick={() => this.closeModal()}
                                    className={classes.button + " " + classes.danger}
                                    color="danger">
                                Cancel
                            </Button>
                        </DialogActions>) : null
                }
            </Dialog>
        );
    }

    buildPayLoad() {
        const {tasks} = this.state;

        var payload = {};
        payload["tasks"] = tasks;

        return payload;
    }
}

export default withMobileDialog()(withStyles(notificationsStyle)(BrownieAllocation));