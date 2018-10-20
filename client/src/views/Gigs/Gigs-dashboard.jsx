import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// material-ui icons
import Home from "@material-ui/icons/Home";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

import Button from "components/CustomButtons/Button.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Card from "components/Card/Card.jsx";

import {
    cardTitle,
    roseColor
} from "assets/jss/material-dashboard-pro-react.jsx";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";

import Icon from "@material-ui/core/Icon";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import Warning from "@material-ui/icons/Warning";

// core components
import Danger from "components/Typography/Danger.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomTabs from "../../components/CustomTabs/CustomTabs";

import { bugs, website, server } from "variables/general.jsx";
import GigTasks from "../../components/Tasks/GigTasks";

const style = {
    cardTitle,
    cardTitleWhite: {
        ...cardTitle,
        color: "#FFFFFF",
        marginTop: "0"
    },
    cardCategory: {
        color: "#999999",
        marginTop: "10px"
    },
    icon: {
        color: "#333333",
        margin: "10px auto 0",
        width: "130px",
        height: "130px",
        border: "1px solid #E5E5E5",
        borderRadius: "50%",
        lineHeight: "174px",
        "& svg": {
            width: "55px",
            height: "55px"
        },
        "& .fab,& .fas,& .far,& .fal,& .material-icons": {
            width: "55px",
            fontSize: "55px"
        }
    },
    iconRose: {
        color: roseColor
    },

};

class GigDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gig: null
        };
    }

    componentDidMount() {
        if (this.props.location) {
            this.setState({
                gig: this.props.location.state.gig
            });
        }
    }

    returnToHomepage() {
        const {history} = this.props;
        history.push({
            pathname: '/homepage'
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <GridContainer>
                <GridItem xs={12}>
                    <Button className={classes.marginRight} onClick={this.returnToHomepage.bind(this)}>
                        <KeyboardArrowLeft className={classes.icons}/> Back
                    </Button>
                </GridItem>
                <GridItem xs={4}>
                    <Card>
                        <CardHeader color="warning" stats icon>
                            <CardIcon color="warning">
                                <Icon>content_copy</Icon>
                            </CardIcon>
                            <p className={classes.cardCategory}>Gigs Status</p>
                            <h3 className={classes.cardTitle}>
                                49/50 <small>GB</small>
                            </h3>
                        </CardHeader>
                        <CardFooter stats>
                            <div className={classes.stats}>
                                <Danger>
                                    <Warning/>
                                </Danger>
                                <a href="#pablo" onClick={e => e.preventDefault()}>
                                    Get more space
                                </a>
                            </div>
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={4}>
                    <Card>
                        <CardHeader color="warning" stats icon>
                            <CardIcon color="warning">
                                <Icon>content_copy</Icon>
                            </CardIcon>
                            <p className={classes.cardCategory}>Gigs Admin</p>
                            <h3 className={classes.cardTitle}>
                                49/50 <small>GB</small>
                            </h3>
                        </CardHeader>
                        <CardFooter stats>
                            <div className={classes.stats}>
                                <Danger>
                                    <Warning/>
                                </Danger>
                                <a href="#pablo" onClick={e => e.preventDefault()}>
                                    Get more space
                                </a>
                            </div>
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={4}>
                    <Card>
                        <CardHeader color="warning" stats icon>
                            <CardIcon color="warning">
                                <Icon>content_copy</Icon>
                            </CardIcon>
                            <p className={classes.cardCategory}>Gigs Channel</p>
                            <h3 className={classes.cardTitle}>
                                49/50 <small>GB</small>
                            </h3>
                        </CardHeader>
                        <CardFooter stats>
                            <div className={classes.stats}>
                                <Danger>
                                    <Warning/>
                                </Danger>
                                <a href="#pablo" onClick={e => e.preventDefault()}>
                                    Get more space
                                </a>
                            </div>
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={4}>
                    <Card pricing>
                        <CardBody pricing>
                            <h6 className={classes.cardCategory}>Brownie Points Total Budget</h6>
                            <div className={classes.icon}>
                                <Home className={classes.iconRose}/>
                            </div>
                            <h3 className={`${classes.cardTitle} ${classes.marginTop30}`}>
                                {this.state.gig}
                            </h3>
                            <p className={classes.cardDescription}>
                                This is good if your company size is between 2 and 10
                                Persons.
                            </p>
                            <Button round color="rose">
                                Choose plan
                            </Button>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={8}>
                    <CustomTabs
                        title="Tasks:"
                        headerColor="rose"
                        tabs={[
                            {
                                tabName: "Bugs",
                                tabIcon: BugReport,
                                tabContent: (
                                    <GigTasks
                                        tasksIndexes={[0, 1, 2, 3]}
                                        tasks={bugs}
                                    />
                                )
                            },
                            {
                                tabName: "Website",
                                tabIcon: Code,
                                tabContent: (
                                    <GigTasks
                                        tasksIndexes={[0, 1]}
                                        tasks={website}
                                    />
                                )
                            },
                            {
                                tabName: "Server",
                                tabIcon: Cloud,
                                tabContent: (
                                    <GigTasks
                                        tasksIndexes={[0, 1, 2]}
                                        tasks={server}
                                    />
                                )
                            }
                        ]}
                    />
                </GridItem>
            </GridContainer>
        );
    }
}

export default withStyles(style)(GigDashboard);



