import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";

// @material-ui/icons
import Cancel from "@material-ui/icons/Cancel";

// core components
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import Table from "components/Gigs/Table/Table";
import AutoComplete from 'components/Gigs/AutoComplete/AutoComplete';

// dependencies
import Loader from 'react-loader-spinner';
import {NotificationManager} from "react-notifications";

// style sheets
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx"

class AssignUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: [],
            status: "",
        };
    }

    componentDidMount() {
        const {task} = this.props;
        this.setState({
            selectedUsers: task.assignees,
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
        const existingUsers = selectedUsers.filter(selectedUser => selectedUser.id === user.id)
        if (existingUsers.length >= 1) {
            NotificationManager.error("User " + user.name + " has been selected");
        } else {
            this.setState({
                selectedUsers: [user].concat(selectedUsers)
            });
        }
    }

    deselectUser(user) {
        const selectedUsers = this.state.selectedUsers;
        const usersAfterRemoval = selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
        this.setState({
            selectedUsers: usersAfterRemoval
        });
    }

    confirmUserAssign() {
        const {hideTask} = this.props;
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
        } else {
            hideTask("assignUsers");
        }
    }

    render() {
        const {classes, hideTask} = this.props;
        const {selectedUsers, status} = this.state;

        return (
            <SweetAlert
                success={(status === "success")}
                style={{
                    display: "block",
                    overflow: "visible"
                }}
                title={(status === "working") ? "Assign Users" : (status === "success") ? "Users Assigned" : false}
                onConfirm={() => this.confirmUserAssign()}
                onCancel={() => {
                    if (status !== "loading") {
                        hideTask("assignUsers")
                    }
                }}
                confirmBtnCssClass={
                    classes.button + " " + classes.success
                }
                cancelBtnCssClass={
                    classes.button + " " + classes.danger
                }
                cancelBtnText="Cancel"
                showCancel={(!status.match("loading|success"))}
                showConfirm={(status !== "loading")}
            >
                {
                    status === "loading" ?
                        (
                            <Loader
                                type="ThreeDots"
                                color="black"
                                height="100"
                                width="100"
                            />
                        ) : null
                }
                {
                    status === "working" ?
                        (
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
                        ) : null
                }
            </SweetAlert>
        );
    }

    buildPayLoad() {
        // Construct your payload using state fields
    }
}

export default withStyles(sweetAlertStyle)(AssignUsers);