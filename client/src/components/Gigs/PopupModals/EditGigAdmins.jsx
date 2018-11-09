import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// @material-ui/icons
import Cancel from "@material-ui/icons/Cancel";
import Close from "@material-ui/icons/Close";

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

class EditGigAdmins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAdmins: [],
            status: "",
        };
    }

    componentWillReceiveProps() {
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
        hidePopup("editGigAdmins");
    }

    render() {
        const {classes, modalOpen} = this.props;
        const {selectedAdmins, status} = this.state;

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
                        <GridItem xs={6} sm={6} md={6} lg={6}>
                            <h4 className={classes.modalTitle}>
                                {
                                    (status === "working") ?
                                        "Edit Admins"
                                        : (status === "success") ?
                                        "Admins Edited" : null
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
                    style={{paddingBottom: 35, paddingTop: 0, width: 450}}
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
                </DialogContent>
                <DialogActions className={classes.modalFooter} style={{paddingTop: 15}}>
                    {
                        status === "working" ? (
                            <Button onClick={() => this.confirmAdminAssign()}
                                    className={classes.button + " " + classes.success}
                                    color="success">
                                Edit
                            </Button>) : null
                    }

                    {
                        status !== "loading" ? (
                            <Button onClick={() => this.closeModal()}
                                    className={classes.button + " " + classes.danger}
                                    color="danger">
                                {
                                    status === "working" ? "Cancel" : "Close"
                                }
                            </Button>) : null
                    }

                </DialogActions>
            </Dialog>
            // <SweetAlert
            //     success={(status === "success")}
            //     style={{
            //         display: "block",
            //         overflow: "visible"
            //     }}
            //     title={(status === "working") ? "Edit Admins" : (status === "success") ? "Admins Edited" : false}
            //     onConfirm={() => this.confirmAdminAssign()}
            //     onCancel={() => {
            //         if (status !== "loading") {
            //             hidePopup("editGigAdmins")
            //         }
            //     }}
            //     confirmBtnCssClass={
            //         classes.button + " " + classes.success
            //     }
            //     cancelBtnCssClass={
            //         classes.button + " " + classes.danger
            //     }
            //     cancelBtnText="Cancel"
            //     showCancel={(!status.match("loading|success"))}
            //     showConfirm={(status !== "loading")}
            // >
            //     {
            //         status === "loading" ?
            //             (
            //                 <Loader
            //                     type="ThreeDots"
            //                     color="black"
            //                     height="100"
            //                     width="100"
            //                 />
            //             ) : null
            //     }
            //     {
            //         status === "working" ?
            //             (
            //
            //             ) : null
            //     }
            // </SweetAlert>
        );
    }

    buildPayLoad() {
        // Construct your payload using state fields
    }
}

export default withStyles(notificationsStyle)(EditGigAdmins);