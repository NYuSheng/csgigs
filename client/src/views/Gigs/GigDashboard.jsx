import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";

// material-ui icons
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import BrowniePoints from "@material-ui/icons/AttachMoney";
import Status from "@material-ui/icons/Timeline";
import Icon from "@material-ui/core/Icon";
import Chat from "@material-ui/icons/Chat";
import People from "@material-ui/icons/People";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";

// core components
import Card from "components/Card/Card";
import CardIcon from "components/Card/CardIcon";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import CardFooter from "components/Card/CardFooter";
import GigCustomTabs from "components/CustomTabs/GigCustomTabs";
import GigTasks from "components/Gigs/Tasks/Tasks";
import GigTable from "components/Gigs/Table/Table";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import EditTask from "components/Gigs/PopupModals/EditTask";
import RemoveTask from "components/Gigs/PopupModals/RemoveTask";
import AssignUsers from "components/Gigs/PopupModals/AssignUsers";
import EditGigAdmins from "components/Gigs/PopupModals/EditGigAdmins";
import AddTask from "components/Gigs/PopupModals/AddTask";
import BrownieAllocation from "components/Gigs/PopupModals/BrownieAllocation";

// dependencies
import CircularProgressbar from 'react-circular-progressbar';

// style sheets
import {cardTitle, roseColor} from "assets/jss/material-dashboard-pro-react.jsx";
import 'react-circular-progressbar/dist/styles.css';

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
            editTask: null,
            removeTask: null,
            assignUsers: null,
            editGigAdmins: false,
            addTask: false,
            brownieAllocation: false
        };
    }

    setupTableCells(admin) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <TableCell colSpan="1" className={tableCellClasses}>
                {admin.name}
            </TableCell>
        );
    }

    returnToHomepage() {
        const {history} = this.props;
        history.push({
            pathname: '/gigs/manage'
        });
    }

    editTask(task) {
        this.setState({
            editTask: (
                <EditTask hideTask={this.hidePopup.bind(this)}
                          task={task}
                />
            )
        });
    }

    addTask() {
        this.setState({
            addTask: true
        })
    }

    removeTask(task) {
        this.setState({
            removeTask: (
                <RemoveTask hideTask={this.hidePopup.bind(this)}
                            task={task}
                />
            )
        });
    }

    assignUsers(task) {
        this.setState({
            assignUsers: (
                <AssignUsers hideTask={this.hidePopup.bind(this)}
                             task={task}
                />
            )
        })
    }

    editGigAdmins() {
        this.setState({
            editGigAdmins: true
        })
    }

    editBrownieAllocation() {
        this.setState({
            brownieAllocation: true
        })
    }

    hidePopup(popupState) {
        this.setState({
            [popupState]: false
        });
    }

    organizeTabContent(tasks) {
        var toReturn = [];
        var organizedContent = [];

        tasks.forEach(function (task) {
            var category = task.category;
            if (organizedContent.hasOwnProperty(category)) {
                organizedContent[category].push(task)
            } else {
                organizedContent[category] = [];
                organizedContent[category].push(task)
            }
        });

        for (var key in organizedContent) {
            if (organizedContent.hasOwnProperty(key)) {
                var i;
                var tasksIndexesArray = []
                for (i = 0; i < organizedContent[key].length; i++) {
                    tasksIndexesArray.push(i);
                }
                toReturn.push({
                    tabName: key,
                    tabContent: (
                        <GigTasks
                            tasksIndexes={tasksIndexesArray}
                            tasks={organizedContent[key]}
                            editTask={this.editTask.bind(this)}
                            removeTask={this.removeTask.bind(this)}
                            assignUsers={this.assignUsers.bind(this)}
                        />
                    )
                });
            }
        }

        return toReturn;
    }

    calculatePoints(gig) {
        var tasksAllocations = 0;
        gig.tasks.forEach(function (task) {
            tasksAllocations += task.points;
        });
        return tasksAllocations;
    }

    calculatePointsPercentage(gig) {
        return this.calculatePoints(gig) / gig.points * 100;
    }

    render() {
        const {classes} = this.props;
        const {
            assignUsers,
            removeTask,
            editTask,
            editGigAdmins,
            addTask,
            brownieAllocation
        } = this.state;
        const gig = this.props.location.state.gig;

        return (
            <div>
                {assignUsers}
                {removeTask}
                {editTask}
                <AddTask modalOpen={addTask} hideTask={this.hidePopup.bind(this)}/>
                <EditGigAdmins modalOpen={editGigAdmins} hidePopup={this.hidePopup.bind(this)} admins={gig.admins}/>
                <BrownieAllocation modalOpen={brownieAllocation} hidePopup={this.hidePopup.bind(this)} gig={gig}/>
                <GridContainer justify="center">
                    <GridItem xs={12}>
                        <Button className={classes.marginRight} onClick={this.returnToHomepage.bind(this)}>
                            <KeyboardArrowLeft className={classes.icons}/> Back
                        </Button>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8} lg={8}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={6} lg={6}>
                                <Card>
                                    <CardHeader color="warning" stats icon>
                                        <CardIcon color="warning">
                                            <Status/>
                                        </CardIcon>
                                        <p className={classes.cardCategory}>Gigs Status</p>
                                        <h3 className={classes.cardTitle}>
                                            {gig.status}
                                        </h3>
                                    </CardHeader>
                                    <CardFooter/>
                                </Card>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6} lg={6}>
                                <Card>
                                    <CardHeader color="warning" stats icon>
                                        <CardIcon color="warning">
                                            <Chat/>
                                        </CardIcon>
                                        <p className={classes.cardCategory}>Gigs Channel</p>
                                        <h3 className={classes.cardTitle}>
                                            {/*link to rocketchat*/}
                                            <a href="https://csgigs.com/group/csgigs-dev" target="_blank">
                                                {gig.channel}
                                            </a>
                                        </h3>
                                    </CardHeader>
                                    <CardFooter/>
                                </Card>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12} lg={12}>
                                <Card>
                                    <CardHeader color="rose" icon>
                                        <GridContainer>
                                            <GridItem xs={10} sm={10} md={10} lg={10}>
                                                <CardIcon color="rose">
                                                    <People/>
                                                </CardIcon>
                                                <h4 className={classes.cardCategory}>Gig Admin(s)</h4>
                                            </GridItem>
                                            <GridItem xs={2} sm={2} md={2} lg={2} style={{textAlign: 'right'}}>
                                                {/*Edit admins (only super admin)*/}
                                                <Button onClick={this.editGigAdmins.bind(this)}>Edit</Button>
                                            </GridItem>
                                        </GridContainer>
                                    </CardHeader>
                                    <CardBody>
                                        <GigTable
                                            hover
                                            tableData={gig.admins}
                                            setupTableCells={this.setupTableCells.bind(this)}
                                            handleTableRowOnClick={null}
                                        />
                                    </CardBody>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                        <Card pricing>
                            <CardHeader color="warning" stats icon>
                                <CardIcon color="warning">
                                    <BrowniePoints/>
                                </CardIcon>
                            </CardHeader>
                            <CardBody pricing>
                                <CircularProgressbar
                                    className={classes.icon}
                                    percentage={this.calculatePointsPercentage(gig)}
                                    text={`${this.calculatePoints(gig)}/${gig.points}`}
                                    strokeWidth={2}
                                    styles={{
                                        root: {},
                                        path: {
                                            stroke: '#f88',
                                            strokeLinecap: 'butt',
                                            transition: 'stroke-dashoffset 0.5s ease 0s',
                                        },
                                        trail: {
                                            stroke: '#d6d6d6',
                                        },
                                        text: {
                                            fill: '#f88',
                                            fontSize: '20px',
                                        },
                                    }}
                                />
                                <h6 className={classes.cardCategory}>Brownie Points Total Budget</h6>
                                <Button round color="rose" onClick={this.editBrownieAllocation.bind(this)}>
                                    Edit Allocation
                                </Button>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
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
                                    INSERT PARTICIPANTS HERE
                                </p>
                                <Button round color="rose">
                                    {/*TO-DO: Popup for task points allocation view*/}
                                    View Allocation
                                </Button>
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8} lg={8}>
                        <GigCustomTabs
                            title="Tasks:"
                            headerColor="rose"
                            tabs={this.organizeTabContent(gig.tasks)}
                            addContent={this.addTask.bind(this)}
                        />
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(style)(GigDashboard);



