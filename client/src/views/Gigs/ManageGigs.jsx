import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Filter from "components/Gigs/Filter/Filter.jsx";
import Table from "components/Gigs/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

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
                    </GridContainer>
                </CardHeader>
                <CardBody>
                    <Table
                        hover
                        tableHeaderColor="primary"
                        tableHead={["Gig Name", "Gig Admin", "Gig Status"]}
                        // TO-DO: Pass in the array of gigs
                        tableData={this.state.filtered}
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