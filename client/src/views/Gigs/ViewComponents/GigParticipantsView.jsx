import React from "react";

// @material-ui/core components
import TableCell from "@material-ui/core/TableCell";
import MUIButton from "@material-ui/core/Button";

// core components
import Table from "components/Gigs/Table/Table";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import EditGigParticipants from "components/Gigs/PopupModals/Dialog/EditGigParticipants";
import { getUserParticipantsByGigId } from "components/Gigs/API/Gigs/UserParticipants";

// material-ui icons
import Participants from "@material-ui/icons/PeopleOutline";
import Edit from "@material-ui/icons/Edit";

class GigParticipantsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      modalOpen: false
    };
  }

  componentWillMount() {
    const { gigId } = this.props;
    this.setupData(gigId);
  }

  setupData(gigId) {
    getUserParticipantsByGigId(gigId, this.setParticipantsState.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.modalOpen !== prevState.modalOpen) {
      const { gigId } = this.props;
      getUserParticipantsByGigId(gigId, this.setParticipantsState.bind(this));
    }
  }

  setParticipantsState(participants) {
    this.setState({
      participants: participants
    });
    // console.log("STATE");
    // console.log(this.state.participants);
  }

  setupTableCells(participant) {
    const { classes } = this.props;
    const tableCellClasses = classes.tableCell;
    return (
      <TableCell colSpan="1" className={tableCellClasses}>
        {participant.name}
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
    const { classes } = this.props;
    const { modalOpen, participants } = this.state;

    return (
      <div>
        <EditGigParticipants
          modalOpen={modalOpen}
          hidePopup={this.hidePopup.bind(this)}
          participants={participants}
        />
        <Card>
          <CardHeader color="brown" stats icon>
            <GridContainer style={{ width: "100%", margin: 0 }}>
              <GridItem xs={9} sm={9} md={9} lg={9} style={{ paddingLeft: 0 }}>
                <CardIcon color="brown">
                  <Participants />
                </CardIcon>
                <h4
                  className={classes.cardCategory}
                  style={{ fontSize: 20, textAlign: "left", paddingTop: 20 }}
                >
                  Gig Participant(s)
                </h4>
              </GridItem>
              {/*<p className={classes.cardCategory} style={{fontSize: 20, marginTop: 15}}>Gig*/}
              {/*Participants</p>*/}
              <GridItem
                xs={3}
                sm={3}
                md={3}
                lg={3}
                style={{ textAlign: "right", padding: 10 }}
              >
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
              tableHeight="250px"
              tableHeaderColor="primary"
              tableData={participants}
              tableFooter="false"
              notFoundMessage="No participants found"
              setupTableCells={this.setupTableCells.bind(this)}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default GigParticipantsView;
