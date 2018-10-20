import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";

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

    function handleTableRowOnClick(gig) {
        history.push({
            headername: `${gig[0]}`,
            pathname: `/homepage/${gig[1]}`,
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
                <Table
                    hover
                    tableHeaderColor="primary"
                    tableHead={["Gig", "Gig Admin", "Gig Status"]}
                    tableData={[
                        ["Dakota Rice", "Niger", "Oud-Turnhout"],
                        ["Minerva Hooper", "Curaçao", "Sinaai-Waas"],
                        ["Sage Rodriguez", "Netherlands", "Baileux"],
                        ["Philip Chaney", "Korea, South", "Overland Park"],
                        ["Doris Greene", "Malawi", "Feldkirchen in Kärnten"],
                        ["Mason Porter", "Chile", "Gloucester"]
                    ]}
                    coloredColls={[3]}
                    colorsColls={["primary"]}
                    handleTableRowOnClick={handleTableRowOnClick}
                />
            </CardBody>
        </Card>
    );
}

export default withStyles(style)(Homepage);