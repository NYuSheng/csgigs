import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Filter from "components/Gigs/Filter/Filter";
import Table from "components/Gigs/Table/Table";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import TableCell from "@material-ui/core/TableCell";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Create from "@material-ui/icons/NoteAdd";

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
            filtered: []
        };
    }

    componentDidMount() {
        this.setupRawData();
    }

    filterGigsResults(filterKey, filterValue) {
        let gigs = this.state.gigs;
        let filtered = gigs.filter(gig => gig[filterKey].toUpperCase() === filterValue.toUpperCase());

        this.setState({
            filtered: filtered
        })
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
                    {gig.admin}
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
            pathname: `/gigs/${gig.id}`,
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
                    <CardIcon color="rose">
                        <Assignment/>
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>G I G S</h4>
                    <GridContainer>
                        <GridItem xs={12} sm={3} md={3} lg={3}>
                            <Filter filterName="FILTER"
                                    filterFunction={this.filterGigsResults.bind(this)}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={3} md={3} lg={3}>
                            <Button color="warning"
                                    className={classes.marginRight}
                                    onClick={this.handleCreateGigPage.bind(this)}>
                                <Create className={classes.icons} />
                                Create Gig
                            </Button>
                        </GridItem>
                    </GridContainer>
                </CardHeader>
                <CardBody>
                    <Table
                        hover
                        tableHeaderColor="primary"
                        tableHead={["Gig Name", "Gig Admin", "Gig Status"]}
                        // TO-DO: Pass in the array of gigs
                        tableData={this.state.filtered}
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
            admin: "Yu Sheng",
            channel: "gigs chat",
            points: 400,
            tasks: [
                {
                    category: "Logistics",
                    taskname: "Prepare food",
                    status: "Unassigned",
                    assignees: []
                },
                {
                    category: "Admin",
                    taskname: "Get sign ups",
                    status: "Unassigned",
                    assignees: []
                },
                {
                    category: "Operation",
                    taskname: "Man the area during event",
                    status: "Unassigned",
                    assignees: []
                }
            ]
        });
        this.setState({
            gigs: gigs,
            filtered: gigs
        });
    }
}

export default withStyles(style)(ManageGigs);