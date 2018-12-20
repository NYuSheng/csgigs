import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";

// core components
// import Filter from "components/Gigs/Filter/Filter";
import Table from "components/Gigs/Table/Table";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import ReinstateGig from "components/Gigs/PopupModals/SweetAlert/ReinstateGig";
import Button from "components/CustomButtons/Button";
import UserProfile from "components/Gigs/Authentication/UserProfile";

// material-ui icons
import Event from "@material-ui/icons/Event";
import Reinstate from "@material-ui/icons/Replay";
// import FilterIcon from "@material-ui/icons/Filter";

// dependencies
import {NotificationManager} from "react-notifications";

// style sheets
import {cardTitle} from "assets/jss/material-dashboard-pro-react.jsx";
import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";

const style = theme => ({
    ...dashboardStyle,
    cardIconTitle: {
        ...cardTitle,
        marginTop: "15px",
        marginBottom: "0px"
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    "@media screen and (max-width:480px)": {
        buttonText: {
            display: "none"
        }
    }
});

class CancelledGigs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gigs: [],
            // filtered: []
            isLoading: false,
            reinstateGig: null
        };
    }

    componentDidMount() {
        var authenticated = UserProfile.authenticate();
        if (!authenticated) {
            const {history} = this.props;
            history.push({
                pathname: "/login"
            });
        } else {
            this.setupData();
        }
    }

    reinstateGig(gig) {
        this.setState({
            reinstateGig: (
                <ReinstateGig
                    gig={gig}
                    hidePopup={this.hidePopup.bind(this)}
                    reinstateGigAction={this.notifyGigStatusReinstated.bind(this)}
                />
            )
        })
    }

    notifyGigStatusReinstated(gidId) {
        const {gigs} = this.state;
        const gigsAfterRemoval = gigs.filter(gig => gig._id !== gidId);
        this.setState({
            gigs: gigsAfterRemoval
        })
        NotificationManager.success("Gig Reinstated!");
    }

    hidePopup(popupState) {
        this.setState({
            [popupState]: false
        });
    }

    setupData() {
        const user = UserProfile.getUser();
        this.setState({
            isLoading: true
        });
        fetch(`/admin-ui/api/gigs/${user.me.username}?status=Cancelled`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json =>{
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                data.json().then(json =>{
                    this.setState({
                        gigs: json.gigs
                    })
                });
            }
            this.setState({
                isLoading: false
            })
        });
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
                    <Tooltip
                        id="tooltip-top"
                        title="Reinstate"
                        placement="top"
                        classes={{ tooltip: classes.tooltip }}
                    >
                        <Button onClick={() => this.reinstateGig(gig)} id="reinstate" simple color="rose" justIcon>
                            <Reinstate className={classes.buttonIcon} fontSize="small"/>
                        </Button>
                    </Tooltip>
                </TableCell>
            </React.Fragment>
        );
    }

    render() {
        const {classes} = this.props;
        const {isLoading, reinstateGig} = this.state;

        return (
            <div>
                {reinstateGig}
                <Card>
                    <CardHeader color="rose" icon>
                        <GridContainer>
                            <GridItem xs={8} sm={8} md={10} lg={10}>
                                <CardIcon color="rose">
                                    <Event/>
                                </CardIcon>
                                <h4 className={classes.cardIconTitle}>Cancelled Gigs</h4>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={2} lg={2} style={{textAlign: 'right', padding: 10}}>
                                {/*<GridContainer  style={{textAlign: 'right'}}>*/}
                                {/*<GridItem xs={6} sm={6} md={6} lg={6}>*/}
                                {/*<Filter filterName="filter"*/}
                                {/*filterFunction={this.filterGigsResults.bind(this)}*/}
                                {/*buttonIcon={FilterIcon}*/}
                                {/*/>*/}
                                {/*</GridItem>*/}
                                {/*</GridContainer>*/}
                            </GridItem>
                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        <Table
                            isLoading={isLoading}
                            tableHeaderColor="primary"
                            tableHead={["Name", "Action"]}
                            tableData={this.state.gigs}
                            tableFooter="true"
                            notFoundMessage="No gigs found"
                            setupTableCells={this.setupTableCells.bind(this)}
                        />
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default withStyles(style)(CancelledGigs);