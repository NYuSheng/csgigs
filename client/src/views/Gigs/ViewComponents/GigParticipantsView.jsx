import React from "react";

// @material-ui/core components
import TableCell from "@material-ui/core/TableCell";

// core components
import Table from "components/Gigs/Table/Table";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import EditGigParticipants from "components/Gigs/PopupModals/Dialog/EditGigParticipants";

// material-ui icons
import Participants from "@material-ui/icons/PeopleOutline";

class GigParticipantsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            modalOpen: false
        };
    }

    componentWillMount() {
        const {gigId} = this.props;
        console.log(gigId);
        this.setupData(gigId);
    }

    setupData(gigId) {
        // call api to get out gig admins
        // set state of this component
    }

    setupTableCells(participant) {
        const {classes} = this.props;
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
        })
    }

    hidePopup() {
        this.setState({
            modalOpen: false
        });
    }

    render() {
        const {classes} = this.props;
        const {modalOpen, participants} = this.state;

        return (
            <div>
                <EditGigParticipants modalOpen={modalOpen} hidePopup={this.hidePopup.bind(this)}
                               admins={participants}/>
                <Card pricing>
                    <CardHeader color="brown" stats icon>
                        <CardIcon color="brown">
                            <Participants/>
                        </CardIcon>
                        <p className={classes.cardCategory} style={{fontSize: 20, marginTop: 15}}>Gig
                            Participants</p>
                    </CardHeader>
                    <CardBody pricing>
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