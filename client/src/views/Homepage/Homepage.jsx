import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GigTable from "components/Table/GigTable.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";

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

function Homepage({...props}) {
    const {classes, history} = props;
    const gigs = setupRawData();

    function handleTableRowOnClick(gig) {
        history.push({
            headername: `${gig.name}`,
            pathname: `/homepage/${gig.id}`,
            state: {
                gig: gig
            }
        });
    }

    return (
        <Card>
            <CardHeader color="rose" icon>
                <CardIcon color="rose">
                    <Assignment/>
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Simple Table</h4>
            </CardHeader>
            <CardBody>
                <GigTable
                    hover
                    tableHeaderColor="primary"
                    tableHead={["Gig", "Gig Admin", "Gig Status"]}
                    // TO-DO: Pass in the array of gigs
                    tableData={gigs}
                    handleTableRowOnClick={handleTableRowOnClick}
                />
            </CardBody>
        </Card>
    );
}

function setupRawData() {
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
    })
    return gigs;
}

export default withStyles(style)(Homepage);