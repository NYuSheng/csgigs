import React from "react";

// @material-ui/icons
import Event from "@material-ui/icons/Event";
import Budget from "@material-ui/icons/AttachMoney";
import Cancel from "@material-ui/icons/Cancel";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import TableCell from "@material-ui/core/TableCell";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/Gigs/CustomInput/CustomInput.jsx";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import Table from "components/Gigs/Table/Table";
import AutoComplete from 'components/Gigs/AutoComplete/AutoComplete';

// dependencies
import {NotificationManager} from "react-notifications";

const style = {
    infoText: {
        fontWeight: "300",
        margin: "10px 0 30px",
        textAlign: "center"
    },
    inputAdornmentIcon: {
        color: "#555"
    },
    inputAdornment: {
        position: "relative"
    }
};

class GigDetailsStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            nameState: "",
            selectedAdmins: [],
            adminState: "",
            budget: 0,
            budgetState: ""
        };
    }

    sendState() {
        return this.state;
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
        var selectedAdmins = this.state.selectedAdmins;
        const existingAdmins = selectedAdmins.filter(selectedAdmin => selectedAdmin["_id"] === admin["_id"])
        if (existingAdmins.length >= 1) {
            NotificationManager.error("User " + admin.name + " has been selected");
        } else {
            selectedAdmins.push(admin);
        }
        this.setState({
            selectedAdmins: selectedAdmins,
            adminState: "success"
        })
    }

    deselectAdmin(admin) {
        const selectedAdmins = this.state.selectedAdmins;
        const adminsAfterRemoval = selectedAdmins.filter(selectedAdmin => selectedAdmin["_id"] !== admin["_id"]);
        if (!adminsAfterRemoval.length) {
            this.setState({
                adminState: ""
            });
        }
        this.setState({
            selectedAdmins: adminsAfterRemoval
        });
    }

    validateNumber(event) {
        const budget = event.target.value;
        this.setState({budget: budget});
        budget > 0 ?
            this.setState({budgetState: "success"})
            :
            this.setState({budgetState: "error"})
    }

    validateName(event) {
        const name = event.target.value;
        this.setState({name: name});
        name ?
            this.setState({nameState: "success"})
            :
            this.setState({nameState: "error"})
    }

    isValidated() {
        if (
            this.state.nameState === "success" &&
            this.state.budgetState === "success" &&
            this.state.adminState === "success"
        ) {
            return true;
        } else {
            if (this.state.nameState !== "success") {
                this.setState({nameState: "error"});
            }
            if (this.state.budgetState !== "success") {
                this.setState({budgetState: "error"});
            }
            if (this.state.adminState !== "success") {
                this.setState({adminState: "error"});
            }

        }
        return false;
    }

    render() {
        const {classes} = this.props;
        const {nameState, adminState, budgetState, selectedAdmins} = this.state;

        return (
            <GridContainer justify="center">
                <GridItem xs={10} sm={10} md={10} lg={8} align="left">
                    <h4>Name of Gig</h4>
                    <CustomInput
                        success={nameState === "success"}
                        error={nameState === "error"}
                        labelText={
                            <span>
                                Gig Name <small>(required)</small>
                            </span>
                        }
                        id="gigname"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            onChange: event => this.validateName(event),
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    className={classes.inputAdornment}
                                >
                                    <Event className={classes.inputAdornmentIcon}/>
                                </InputAdornment>
                            )
                        }}
                        inputType="text"
                    />
                </GridItem>
                <GridItem xs={10} sm={10} md={10} lg={8} align="left">
                    <h4>Budget for Brownie Points</h4>
                    <CustomInput
                        success={budgetState === "success"}
                        error={budgetState === "error"}
                        labelText={
                            <span>
                                Brownie Points <small>(required)</small>
                            </span>
                        }
                        id="budgetpoints"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            onChange: event => this.validateNumber(event),
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    className={classes.inputAdornment}
                                >
                                    <Budget className={classes.inputAdornmentIcon}/>
                                </InputAdornment>
                            )
                        }}
                        inputType="number"
                    />
                </GridItem>
                <GridItem xs={10} sm={10} md={10} lg={8} align="left">
                    <h4>Assign Gigs Admins</h4>
                </GridItem>
                <GridItem xs={11} sm={11} md={11} lg={8} align="center">
                    <Card>
                        <CardHeader>
                            <AutoComplete selectInput={this.selectAdmin.bind(this)}/>
                        </CardHeader>
                        <CardBody>
                            <Table
                                error={adminState === "error"}
                                tableHeight="200px"
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
        );
    }
}

export default withStyles(style)(GigDetailsStep);