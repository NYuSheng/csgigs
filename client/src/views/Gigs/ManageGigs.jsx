import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
// import Filter from "components/Gigs/Filter/Filter";
import Table from "components/Gigs/Table/Table";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import TableCell from "@material-ui/core/TableCell";

// material-ui icons
import Event from "@material-ui/icons/Event";
import Create from "@material-ui/icons/NoteAdd";
// import FilterIcon from "@material-ui/icons/Filter";

// style sheets
import {cardTitle} from "assets/jss/material-dashboard-pro-react.jsx";

const style = {
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    }
};

class ManageGigs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gigs: [],
            // filtered: []
        };
    }

    componentDidMount() {
        // insert api call to retrieve all gigs
        this.setupRawData();
    }

    setupTableCells(gig) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <React.Fragment>
                <TableCell colSpan="1" className={tableCellClasses}>
                    {gig.name}
                </TableCell>
                <TableCell colSpan="1" className={tableCellClasses}>
                    {gig.admins.map(function(admin){
                        return admin.name;
                    }).join(", ")}
                </TableCell>
                <TableCell colSpan="1" className={tableCellClasses}>
                    {gig.status}
                </TableCell>
            </React.Fragment>
        );
    }

    handleTableRowOnClick(gig) {
        const {history} = this.props;
        history.push({
            headername: `${gig.name}`,
            pathname: `/gigs/${gig.name}`,
            state: {
                gig: gig
            }
        });
    }

    handleCreateGigPage() {
        const {history} = this.props;
        history.push({
            pathname: "/gigs/create"
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <Card>
                <CardHeader color="rose" icon>
                    <GridContainer>
                        <GridItem xs={8} sm={8} md={10} lg={10}>
                            <CardIcon color="rose">
                                <Event/>
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>Gigs</h4>
                        </GridItem>
                        <GridItem xs={4} sm={4} md={2} lg={2} style={{textAlign: 'right'}}>
                            {/*<GridContainer  style={{textAlign: 'right'}}>*/}
                                {/*<GridItem xs={6} sm={6} md={6} lg={6}>*/}
                                    {/*<Filter filterName="filter"*/}
                                            {/*filterFunction={this.filterGigsResults.bind(this)}*/}
                                            {/*buttonIcon={FilterIcon}*/}
                                    {/*/>*/}
                                {/*</GridItem>*/}
                                {/*<GridItem xs={6} sm={6} md={6} lg={6}>*/}
                                    <Button color="warning"
                                            onClick={this.handleCreateGigPage.bind(this)}
                                            style={{width: '100%'}}>
                                        <Create className={classes.buttonIcon}/>
                                        Create Gig
                                    </Button>
                                {/*</GridItem>*/}
                            {/*</GridContainer>*/}
                        </GridItem>
                    </GridContainer>
                </CardHeader>
                <CardBody>
                    <Table
                        hover
                        tableHeaderColor="primary"
                        tableHead={["Gig Name", "Gig Admin(s)", "Gig Status"]}
                        tableData={this.state.gigs}
                        tableFooter="true"
                        notFoundMessage="No gigs found"
                        setupTableCells={this.setupTableCells.bind(this)}
                        handleTableRowOnClick={this.handleTableRowOnClick.bind(this)}
                    />
                </CardBody>
            </Card>
        );
    }

    setupRawData() {
        // Fake data for gigs
        let gigs = [];
        gigs.push({
            id: 10000,
            name: "Hackathon 2018",
            status: "Active",
            // Could potentially be a user object
            admins: [{ id: 123, name: "Yu Sheng"}, { id: 234, name: "Ernest"}],
            channel: "gigs chat",
            points: 400,
            tasks: [
                {
                    id: 1,
                    category: "Logistics",
                    taskname: "Prepare food",
                    description: "Meet at Woodlands at 10am to collect food and set up food area by 3pm",
                    status: "Unassigned",
                    points: 100,
                    assignees: [{
                        id: "123",
                        name: "Brandon"
                    }]
                },
                {
                    id: 2,
                    category: "Admin",
                    taskname: "Get sign ups",
                    description: "",
                    status: "Unassigned",
                    points: 100,
                    assignees: []
                },
                {
                    id: 3,
                    category: "Operation",
                    taskname: "Man the area during event",
                    description: "",
                    status: "Unassigned",
                    points: 100,
                    assignees: []
                }
            ]
        });
        this.setState({
            gigs: gigs,
            // filtered: gigs
        });
    }
}

export default withStyles(style)(ManageGigs);