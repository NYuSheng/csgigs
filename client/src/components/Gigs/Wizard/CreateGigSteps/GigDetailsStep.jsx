import React from "react";
import moment from "moment-timezone";

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
import AutoComplete from "components/Gigs/AutoComplete/AutoComplete";

// dependencies
import { NotificationManager } from "react-notifications";
import CustomSelect from "../../../CustomSelect/CustomSelect";
import CustomRadio from "../../../CustomRadio/CustomRadio";

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
      budgetState: "",
      errorMessage: ""
    };
  }

  formatTimezone(tz) {
    return "(GMT " + moment.tz(tz).format("Z") + ") " + tz;
  }

  getAllTimeZones() {
    let timeZones = moment.tz.names();

    const timeZonesWithOffset = timeZones
      .map(tz => this.formatTimezone(tz))
      .sort();

    return timeZonesWithOffset;
  }

  getCurrentTimeZone() {
    const currentTimeZone = moment.tz.guess();

    const currentTimeZoneWithOffset = this.formatTimezone(currentTimeZone);

    return currentTimeZoneWithOffset;
  }

  sendState() {
    return this.state;
  }

  setupTableCells(admin) {
    const { classes } = this.props;
    const tableCellClasses = classes.tableCell;
    return (
      <React.Fragment>
        <TableCell colSpan="1" className={tableCellClasses}>
          {admin.name}
        </TableCell>
        <TableCell
          colSpan="1"
          className={tableCellClasses}
          style={{ textAlign: "right" }}
        >
          <Cancel className={classes.icon} />
        </TableCell>
      </React.Fragment>
    );
  }

  selectAdmin(admin) {
    const selectedAdmins = this.state.selectedAdmins;
    const existingAdmins = selectedAdmins.filter(
      selectedAdmin => selectedAdmin["_id"] === admin["_id"]
    );
    if (existingAdmins.length >= 1) {
      NotificationManager.error("User " + admin.name + " has been selected");
    } else {
      selectedAdmins.push(admin);
    }
    this.setState({
      selectedAdmins: selectedAdmins,
      adminState: "success"
    });
  }

  deselectAdmin(admin) {
    const selectedAdmins = this.state.selectedAdmins;
    const adminsAfterRemoval = selectedAdmins.filter(
      selectedAdmin => selectedAdmin["_id"] !== admin["_id"]
    );
    if (!adminsAfterRemoval.length) {
      this.setState({
        adminState: ""
      });
    }
    this.setState({
      selectedAdmins: adminsAfterRemoval
    });
  }

  selectOwner(owner) {
    let selectedOwner = this.state.selectedOwner;
    if (selectedOwner && selectedOwner["_id"] === owner["_id"]) {
      NotificationManager.error("User " + owner.name + " has been selected");
    } else if (selectedOwner) {
      NotificationManager.error("Only one owner can be selected");
    } else {
      selectedOwner = owner;
    }
    this.setState({
      selectedOwner
    });
  }

  deselectOwner(owner) {
    const selectedOwner = this.state.selectedOwner;
    if (selectedOwner && selectedOwner["_id"] === owner["_id"]) {
      this.setState({
        selectedOwner: undefined
      });
    }
  }

  validateBudget(event) {
    const budget = event.target.value;
    this.setState({
      budget: budget,
      budgetState: budget > 0 ? "success" : "error"
    });
  }

  selectHandle(selectedValue, field) {
    this.setState({ [field]: selectedValue });
  }

  inputHandle(event, field) {
    this.setState({ [field]: event.target.value });
  }

  validateName(event) {
    const name = event.target.value;
    this.setState({ name: name });
    const reg = /^\w+$/;
    reg.test(name)
      ? this.setState({
          errorMessage: "",
          nameState: "success"
        })
      : this.setState({
          errorMessage: "Special characters in gig name: " + name,
          nameState: "error"
        });
  }

  isValidated() {
    // console.log(this.state);
    if (
      this.state.nameState === "success" &&
      this.state.budgetState === "success" &&
      this.state.adminState === "success"
    ) {
      return true;
    } else {
      if (this.state.nameState !== "success") {
        this.setState({
          nameState: "error",
          errorMessage: "Field should not be empty."
        });
      }
      if (this.state.budgetState !== "success") {
        this.setState({ budgetState: "error" });
      }
      if (this.state.adminState !== "success") {
        this.setState({ adminState: "error" });
      }
    }
    return false;
  }

  render() {
    const { classes } = this.props;
    const {
      nameState,
      adminState,
      budgetState,
      selectedAdmins,
      selectedOwner,
      errorMessage
    } = this.state;

    return (
      <GridContainer justify="center">
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomSelect
            labelText={"Type of Gig"}
            id="eventtype"
            items={["Event", "Training", "Announcement"]}
            inputProps={{
              onChange: selectedValue =>
                this.selectHandle(selectedValue, "type")
            }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomInput
            success={nameState === "success"}
            error={nameState === "error"}
            labelText={errorMessage || "Name your Gig"}
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
                  <Event className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
            inputType="text"
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
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
              onChange: event => this.validateBudget(event),
              endAdornment: (
                <InputAdornment
                  position="end"
                  className={classes.inputAdornment}
                >
                  <Budget className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
            inputType="number"
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomInput
            labelText="Venue"
            id="venue"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.inputHandle(event, "venue")
            }}
            inputType="text"
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomInput
            labelText="Address"
            id="address"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.inputHandle(event, "address")
            }}
            inputType="text"
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomInput
            labelText="Region"
            id="region"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.inputHandle(event, "region")
            }}
            inputType="text"
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomSelect
            labelText={"Timezone"}
            id="timezone"
            items={this.getAllTimeZones()}
            selectedItem={this.getCurrentTimeZone()}
            inputProps={{
              onChange: selectedValue =>
                this.selectHandle(selectedValue, "timezone")
            }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomSelect
            labelText={"Format"}
            id="format"
            items={["Face-to-face", "Audio", "Video", "Telephonic"]}
            inputProps={{
              onChange: selectedValue =>
                this.selectHandle(selectedValue, "format")
            }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomInput
            labelText="Max number of participants"
            id="maxParticipants"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.inputHandle(event, "maxParticipants")
            }}
            inputType="number"
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomInput
            labelText="Related link"
            id="link"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.inputHandle(event, "link")
            }}
            inputType="text"
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomInput
            labelText="Contact Email"
            id="contact"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => this.inputHandle(event, "contact")
            }}
            inputType="email"
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <CustomRadio
            labelText={"Require Registration?"}
            id="requireRegistration"
            selectedItem="Y"
            items={[
              {
                key: "Y",
                value: "Yes"
              },
              {
                key: "N",
                value: "No"
              }
            ]}
            inputProps={{
              onChange: selectedValue =>
                this.selectHandle(selectedValue, "requireRegistration")
            }}
          />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <h4>Assign Owner</h4>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={8} align="center">
          <Card>
            <CardHeader>
              <AutoComplete selectInput={this.selectOwner.bind(this)} />
            </CardHeader>
            <CardBody>
              <Table
                tableHeight="75px"
                hover
                tableHeaderColor="primary"
                tableData={selectedOwner ? [selectedOwner] : []}
                tableFooter="false"
                notFoundMessage="No owner selected"
                setupTableCells={this.setupTableCells.bind(this)}
                handleTableRowOnClick={this.deselectOwner.bind(this)}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={8} align="left">
          <h4>Assign Gigs Admins</h4>
        </GridItem>
        <GridItem xs={11} sm={11} md={11} lg={8} align="center">
          <Card>
            <CardHeader>
              <AutoComplete selectInput={this.selectAdmin.bind(this)} />
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
