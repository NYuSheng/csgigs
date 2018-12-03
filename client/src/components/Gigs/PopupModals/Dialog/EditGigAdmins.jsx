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
        const {classes, modalOpen, fullScreen} = this.props;
        const {selectedAdmins, status} = this.state;

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
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                >
                    <GridContainer className={classes.modalHeader}>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{textAlign: "left"}}>
                            <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>
                                Edit Admins
                            </h4>
                        </GridItem>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{paddingRight: 5}}>
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
                                Manage your event admins here
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
                                                        <AutoComplete selectInput={this.selectAdmin.bind(this)}/>
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
                                    ) : null
                            }
                            {
                                status === "success" ? (
                                    <div style={{paddingTop: 25}}>
                                        <Success className={classes.icon} style={{height: 100, width: 100, fill: "green"}}/>
                                        <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>Admins Edited</h4>
                                    </div>
                                ) : null
                            }
                        </GridItem>
                    </GridContainer>
                </DialogContent>
                {
                    status === "working" ? (
                        <DialogActions className={classes.modalFooter} style={{paddingTop: 15}}>
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
                        </DialogActions>) : null
                }
            </Dialog>
        );
    }

    buildPayLoad() {
        // Construct your payload using state fields
    }
}

export default withMobileDialog()(withStyles(notificationsStyle)(EditGigAdmins));