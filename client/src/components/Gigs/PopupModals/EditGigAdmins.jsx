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

class EditGigAdmins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAdmins: [],
            status: "",
        };
    }

    componentDidMount() {
        const {admins} = this.props;
        this.setState({
            selectedAdmins: admins,
            status: "working"
        })
    }

    setupTableCells(admin) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <React.Fragment>
                <TableCell colSpan="1" className={tableCellClasses}>
                    {admin.name}
                </TableCell>
                <TableCell colSpan="1" className={tableCellClasses} style={{textAlign: 'right'}}>
                    <Cancel className={classes.icon}/>
                </TableCell>
            </React.Fragment>
        );
    }

    selectAdmin(admin) {
        const selectedAdmins = this.state.selectedAdmins;
        const existingAdmins = selectedAdmins.filter(selectedAdmin => selectedAdmin.id === admin.id)
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
        const adminsAfterRemoval = selectedAdmins.filter(selectedAdmin => selectedAdmin.id !== admin.id);
        this.setState({
            selectedAdmins: adminsAfterRemoval
        });
    }

    confirmAdminAssign() {
        const {hidePopup} = this.props;
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
            hidePopup("editGigAdmins");
        }
    }

    render() {
        const {classes, hidePopup} = this.props;
        const {selectedAdmins, status} = this.state;

        return (
            <SweetAlert
                success={(status === "success")}
                style={{
                    display: "block",
                    overflow: "visible"
                }}
                title={(status === "working") ? "Edit Admins" : (status === "success") ? "Admins Edited" : false}
                onConfirm={() => this.confirmAdminAssign()}
                onCancel={() => {
                    if (status !== "loading") {
                        hidePopup("assignUsers")
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
                                    <AutoComplete selectInput={this.selectAdmin.bind(this)}/>
                                </CardHeader>
                                <CardBody>
                                    <Table
                                        tableHeight="100px"
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
                        ) : null
                }
            </SweetAlert>
        );
    }

    buildPayLoad() {
        // Construct your payload using state fields
    }
}

export default withStyles(sweetAlertStyle)(EditGigAdmins);