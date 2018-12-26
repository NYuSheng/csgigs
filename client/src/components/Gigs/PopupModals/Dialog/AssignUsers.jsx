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
import Cancel from "@material-ui/icons/Cancel";
import Close from "@material-ui/icons/Close";
import Success from "@material-ui/icons/CheckCircle";

// core components
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import Table from "components/Gigs/Table/Table";
import AutoComplete from 'components/Gigs/AutoComplete/AutoComplete';
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";

// dependencies
import Loader from 'react-loader-spinner';
import {NotificationManager} from "react-notifications";

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class AssignUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: "",
            selectedUsers: [],
            status: "",
        };
    }

    componentDidMount() {
        const {task} = this.props;
        this.setState({
            taskId: task["_id"],
            selectedUsers: task.users_assigned,
            status: "working"
        })
    }

    setupTableCells(user) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <React.Fragment>
                <TableCell colSpan="1" className={tableCellClasses}>
                    {user.name}
                </TableCell>
                <TableCell colSpan="1" className={tableCellClasses} style={{textAlign: 'right'}}>
                    <Cancel className={classes.icon}/>
                </TableCell>
            </React.Fragment>
        );
    }

    selectUsers(user) {
        const selectedUsers = this.state.selectedUsers;
        const existingUsers = selectedUsers.filter(selectedUser => selectedUser["_id"] === user["_id"])
        if (existingUsers.length >= 1) {
            NotificationManager.error("User " + user.name + " has been selected");
        } else {
            this.setState({
                selectedUsers: [user].concat(selectedUsers)
            });
        }
        console.log(selectedUsers);
    }

    deselectUser(user) {
        const selectedUsers = this.state.selectedUsers;
        const usersAfterRemoval = selectedUsers.filter(selectedUser => selectedUser["_id"] !== user["_id"]);
        this.setState({
            selectedUsers: usersAfterRemoval
        });
        console.log(this.state.selectedUsers);
    }

    confirmUserAssign() {
        const {task} = this.props;
        const {status} = this.state;
        if (status !== "success") {
            this.setState({
                status: "loading"
            });
            console.log(this.state.taskId);
            fetch('/admin-ui/api/tasks/updateTask/' + this.state.taskId, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.buildPayLoad())
            }).then(data => {
                if (data.status !== 200) {
                    data.json().then(json =>{
                        NotificationManager.error(json.error.errmsg);
                    });
                } else {
                    task.users_assigned = this.state.selectedUsers;
                    this.setState({
                        status: "success"
                    });
                }
            });
        }
    }

    closeModal() {
        const {hideTask} = this.props;
        hideTask("assignUsers");
    }

    render() {
        const {classes, fullScreen} = this.props;
        const {selectedUsers, status} = this.state;

        return (
            <Dialog
                open={true}
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
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                >
                    <GridContainer className={classes.modalHeader}>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{textAlign: "left"}}>
                            <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>
                                Assign Users
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
                    style={{paddingBottom: 35, paddingTop: 0}}
                >
                    <GridContainer justify="center">
                        <GridItem xs={10} sm={10} md={10} lg={10}>
                            <p style={{
                                textAlign: "justify",
                                paddingBottom: 9,
                                borderBottom: "1px solid grey",
                                fontSize: 13
                            }}>
                                Manage your task volunteers here
                            </p>
                        </GridItem>
                        <GridItem xs={10} sm={10} md={10} lg={10} style={{textAlign: "center"}}>
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
                                        <GridContainer>
                                            <GridItem xs={12} sm={12} md={12} lg={12} style={{padding: 0}}>
                                                <Card>
                                                    <CardHeader>
                                                        <AutoComplete selectInput={this.selectUsers.bind(this)}/>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <Table
                                                            tableHeight="100px"
                                                            hover
                                                            tableHeaderColor="primary"
                                                            tableData={selectedUsers}
                                                            tableFooter="false"
                                                            notFoundMessage="No users selected"
                                                            setupTableCells={this.setupTableCells.bind(this)}
                                                            handleTableRowOnClick={this.deselectUser.bind(this)}
                                                        />
                                                    </CardBody>
                                                </Card>
                                            </GridItem>
                                        </GridContainer>
                                    ) : null
                            }
                            {
                                status === "success" ? (
                                    <div style={{paddingTop: 25}}>
                                        <Success className={classes.icon} style={{height: 100, width: 100, fill: "green"}}/>
                                        <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>Users Assigned</h4>
                                    </div>
                                ) : null
                            }
                        </GridItem>
                    </GridContainer>
                </DialogContent>
                {
                    status === "working" ? (
                        <DialogActions className={classes.modalFooter} style={{padding: 24}}>
                            <Button onClick={() => this.confirmUserAssign()}
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
        var selectedUsernames = this.state.selectedUsers.map(selectedUser => selectedUser.username);
        console.log(selectedUsernames);
        return {
            users_assigned: selectedUsernames
        }
        // Construct your payload using state fields
    }
}

export default withMobileDialog()(withStyles(notificationsStyle)(AssignUsers));