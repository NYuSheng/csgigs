import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// material-ui icons
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import BrowniePoints from "@material-ui/icons/AttachMoney";


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

// core components
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import GigCustomTabs from "../../components/CustomTabs/GigCustomTabs";

import {bugs, website, server} from "variables/general.jsx";
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

    returnToHomepage() {
        const {history} = this.props;
        history.push({
            pathname: '/homepage'
        });
    }

    organizeTabContent(tasks) {
        var toReturn = [];
        var organizedContent = [];
/*
        {
            tabName: "Bugs",
                tabIcon
        :
            BugReport,
                tabContent
        :
            (
                <GigTasks
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={bugs}
                />
            )
        }
        */
        tasks.forEach(function(task) {
            var category = task.category;
            if (organizedContent.hasOwnProperty(category)){
                organizedContent[category].push(task)
            } else {
                organizedContent[category] = [];
                organizedContent[category].push(task)
            }
        });
////////
        organizedContent.forEach((key) => {
            console.log(key);
           toReturn.push({
               tabName: key,
               tabContent: (
                   <GigTasks
                       tasksIndexes={[0, 1, 2, 3]}
                       tasks={key}
                   />
               )
           });
        });

        console.log(toReturn);
    }

    render() {
        const {classes} = this.props;
        const gig = this.props.location.state.gig;

        this.organizeTabContent(gig.tasks)

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
                                {gig.status}
                            </h3>
                        </CardHeader>
                        <CardFooter/>
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
                                {gig.admin}
                            </h3>
                        </CardHeader>
                        <CardFooter/>
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
                                {gig.channel}
                                {/*link to rocketchat*/}
                            </h3>
                        </CardHeader>
                        <CardFooter/>
                    </Card>
                </GridItem>
                <GridItem xs={4}>
                    <Card pricing>
                        <CardBody pricing>
                            <h6 className={classes.cardCategory}>Brownie Points Total Budget</h6>
                            <div className={classes.icon}>
                                <BrowniePoints className={classes.iconRose}/>
                            </div>
                            <h3 className={`${classes.cardTitle} ${classes.marginTop30}`}>
                                {gig.points}
                            </h3>
                            <p className={classes.cardDescription}>
                                The budget of {gig.name} is {gig.points} brownie points
                            </p>
                            <Button round color="rose">
                                {/*TO-DO: Popup for task points allocation view*/}
                                View Allocation
                            </Button>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={8}>
                    <GigCustomTabs
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



