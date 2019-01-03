import React from "react";

// @material-ui/core components
import TableCell from "@material-ui/core/TableCell";
import MUIButton from "@material-ui/core/Button";

// @material-ui/icons
import People from "@material-ui/icons/People";
import Edit from "@material-ui/icons/Edit";

// core components
import Table from "components/Gigs/Table/Table";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import EditGigAdmins from "components/Gigs/PopupModals/Dialog/EditGigAdmins";
import { getUserAdminsByGigId } from "components/Gigs/API/Gigs/UserAdmins";

class GigAdminsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      modalOpen: false
    };
  }

  componentWillMount() {
    const { gigId } = this.props;
    this.setupData(gigId);
  }

  setupData(gigId) {
    getUserAdminsByGigId(gigId, this.setAdminsState.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.modalOpen !== prevState.modalOpen) {
      const { gigId } = this.props;
      getUserAdminsByGigId(gigId, this.setAdminsState.bind(this));
    }
  }

  setAdminsState(admins) {
    this.setState({
      admins: admins
    });
  }

  setupTableCells(admin) {
    const { classes } = this.props;
    const tableCellClasses = classes.tableCell;
    return (
      <TableCell colSpan="1" className={tableCellClasses}>
        {admin.name}
      </TableCell>
    );
  }

  openPopup() {
    this.setState({
      modalOpen: true
    });
  }

  hidePopup() {
    this.setState({
      modalOpen: false
    });
  }

  render() {
    const { classes, gigId, gigRoomId } = this.props;
    const { modalOpen, admins } = this.state;

    return (
      <div>
        <EditGigAdmins
          modalOpen={modalOpen}
          hidePopup={this.hidePopup.bind(this)}
          admins={admins}
          gigId={gigId}
          gigRoomId={gigRoomId}
        />
        <Card>
          <CardHeader color="rose" icon>
            <GridContainer style={{ width: "100%", margin: 0 }}>
              <GridItem xs={9} sm={9} md={9} lg={9} style={{ paddingLeft: 0 }}>
                <CardIcon color="rose">
                  <People />
                </CardIcon>
                <h4 className={classes.cardCategory}>Admin(s)</h4>
              </GridItem>
              <GridItem
                xs={3}
                sm={3}
                md={3}
                lg={3}
                style={{ textAlign: "right", padding: 10 }}
              >
                {/*TODO: Edit admins (only super admin)*/}
                <MUIButton
                  color="default"
                  onClick={this.openPopup.bind(this)}
                  variant="contained"
                  size="small"
                  style={{ height: "100%", padding: 0 }}
                >
                  <div className={classes.muiButtonText}>Edit</div>
                  <Edit
                    className={classes.muiButtonIcon}
                    style={{ margin: 0 }}
                  />
                </MUIButton>
              </GridItem>
            </GridContainer>
          </CardHeader>
          <CardBody>
            <Table
              tableHeight="100px"
              tableData={admins}
              notFoundMessage="No admins found"
              setupTableCells={this.setupTableCells.bind(this)}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default GigAdminsView;
