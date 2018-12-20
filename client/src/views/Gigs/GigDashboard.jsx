import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import MUIButton from "@material-ui/core/Button";

// material-ui icons
import BrowniePoints from "@material-ui/icons/AttachMoney";
import Status from "@material-ui/icons/Timeline";
import Chat from "@material-ui/icons/Chat";
import People from "@material-ui/icons/People";
import Participants from "@material-ui/icons/PeopleOutline";
import Edit from "@material-ui/icons/Edit";

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
import EditGigParticipants from "components/Gigs/PopupModals/SweetAlert/Participants";
import RemoveTask from "components/Gigs/PopupModals/Dialog/RemoveTask";
import AssignUsers from "components/Gigs/PopupModals/Dialog/AssignUsers";
import EditTask from "components/Gigs/PopupModals/Dialog/EditTask";
import EditGigAdmins from "components/Gigs/PopupModals/Dialog/EditGigAdmins";
import AddTask from "components/Gigs/PopupModals/Dialog/AddTask";
import GigActions from "components/Gigs/PopupModals/Dialog/GigActions";
import GigDetails from "components/Gigs/PopupModals/Dialog/GigDetails";
import BrownieAllocation from "components/Gigs/PopupModals/Dialog/BrownieAllocation";
import Table from "components/Gigs/Table/Table";
import UserProfile from "components/Gigs/Authentication/UserProfile";


// dependencies
import CircularProgressbar from 'react-circular-progressbar';
import {NotificationManager} from "react-notifications";

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
    "@media screen and (max-width:480px)": {
        muiButtonText: {
            display: "none"
        }
    },
    "@media screen and (min-width:480px)": {
        muiButtonIcon: {
            display: "none"
        }
    }
};

class GigDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gig: null,
            removeTask: null,
            assignUsers: null,
            editGigParticipants: null,
            editTask: false,
            editGigAdmins: false,
            addTask: false,
            brownieAllocation: false,
            gigActions: false,
            gigDetails: false,
            Draft: "info",
            Active: "warning",
            Completed: "success",
            Cancelled: "danger"
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
            const {match: {params}} = this.props;
            this.setupData(params.gigId);
        }
    }

    setupData(gigId) {
        fetch(`/admin-ui/api/gigs/getGigs/${gigId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                data.json().then(json => {
                    this.setState({
                        gig: json.gig
                    })
                });
            }
        });
    }

    setupAdminTableCells(admin) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <TableCell colSpan="1" className={tableCellClasses}>
                {admin.name}
            </TableCell>
        );
    }

    setupParticipantTableCells(group) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <TableCell colSpan="1" className={tableCellClasses}>
                {group.name}
            </TableCell>
        );
    }

    gigDetails() {
        this.setState({
            gigDetails: true
        })
    }

    editDetailsAction(payload) {
        const {gig} = this.state;
        gig.photo = payload.photo;
        gig.description = payload.description;
        this.setState({
            gig: gig
        })
    }

    completeGig() {
        // TODO: Complete the gig
        const {history} = this.props;
        history.push({
            pathname: '/gigs/manage'
        });
    }

    notifyGigChannelUpdate(gig) {
        this.setState({
            gig: gig
        })
        NotificationManager.success("Gig Published!");
    }

    notifyGigStatusCancelled(gig) {
        this.setState({
            gig: gig
        })
        NotificationManager.success("Gig Cancelled!");
    }

    buildPayLoad() {
        const {gig} = this.state;
        var payload = {};
        payload["name"] = gig.name.replace(/ /g, '');
        return payload;
    }

    gigActions() {
        this.setState({
            gigActions: true
        })
    }

    editTask(task) {
        this.setState({
            editTask: (
                <EditTask hideTask={this.hidePopup.bind(this)}
                          task={task}
                          editTaskAction={this.editTaskAction.bind(this)}
                />
            )
        });
    }

    editTaskAction(payload) {
        const {gig} = this.state;
        const tasks = gig.tasks;
        var taskToEdit = tasks.find(task => {
            return task._id === payload.id
        });
        taskToEdit.task_name = payload.taskName;
        taskToEdit.task_description = payload.taskDescription;
        taskToEdit.task_category = payload.taskCategory;
    }

    addTask() {
        this.setState({
            addTask: true
        })
    }

    removeTask(task) {
        const {gig} = this.state;
        this.setState({
            removeTask: (
                <RemoveTask hideTask={this.hidePopup.bind(this)}
                            task={task}
                            gig={gig}
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

    editGigParticipants(group) {
        this.setState({
            editGigParticipants: (
                <EditGigParticipants hidePopup={this.hidePopup.bind(this)}
                                     participants={group}
                />
            )
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

        if (tasks) {
            tasks.forEach(function (task) {
                var category = task.task_category;
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
        }

        return toReturn;
    }

    calculatePoints(gig) {
        var tasksAllocations = 0;

        if (gig.tasks) {
            gig.tasks.forEach(function (task) {
                tasksAllocations += task.points;
            });
        }

        return tasksAllocations;
    }

    calculatePointsPercentage(gig) {
        return this.calculatePoints(gig) / gig.points_budget * 100;
    }

    render() {
        const {classes} = this.props;
        const {
            gig,
            assignUsers,
            removeTask,
            editTask,
            editGigParticipants,
            editGigAdmins,
            addTask,
            brownieAllocation,
            gigActions,
            gigDetails
        } = this.state;

        if (gig) {
            return (
                <div>
                    {assignUsers}
                    {removeTask}
                    {editTask}
                    {editGigParticipants}
                    <GigActions modalOpen={gigActions} hidePopup={this.hidePopup.bind(this)}
                                gig={gig} channelUpdate={this.notifyGigChannelUpdate.bind(this)}
                                cancelGig={this.notifyGigStatusCancelled.bind(this)}
                    />
                    <GigDetails modalOpen={gigDetails} hidePopup={this.hidePopup.bind(this)}
                                gig={gig} editDetailsAction={this.editDetailsAction.bind(this)}
                    />
                    <AddTask modalOpen={addTask} hideTask={this.hidePopup.bind(this)} gig={gig}/>
                    <EditGigAdmins modalOpen={editGigAdmins} hidePopup={this.hidePopup.bind(this)}
                                   admins={gig.user_admins}/>
                    <BrownieAllocation modalOpen={brownieAllocation} hidePopup={this.hidePopup.bind(this)} gig={gig}/>

                    <GridContainer justify="center">
                        <GridItem xs={6}>
                            <Button className={classes.marginRight} onClick={this.gigDetails.bind(this)}>
                                Details
                            </Button>
                        </GridItem>
                        <GridItem xs={6} style={{textAlign: "right"}}>
                            <Button className={classes.marginRight}
                                    onClick={this.gigActions.bind(this)}
                            >
                                Actions
                            </Button>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={8} lg={8}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6} lg={6}>
                                    <Card>
                                        <CardHeader color="warning" stats icon>
                                            <CardIcon color={this.state[gig.status]}>
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
                                        <CardHeader color="chat" stats icon>
                                            <CardIcon color="chat">
                                                <Chat/>
                                            </CardIcon>
                                            <p className={classes.cardCategory}>Gigs Channel</p>
                                            <h3 className={classes.cardTitle}>
                                                {
                                                    gig.rc_channel_id ? (

                                                        <a href={'https://csgigs.com/channel/' + gig.rc_channel_id}
                                                           target="_blank" rel="noopener noreferrer">
                                                            {gig.rc_channel_id}
                                                        </a>
                                                    ) : (
                                                        "Not Published"
                                                    )
                                                }
                                            </h3>
                                        </CardHeader>
                                        <CardFooter/>
                                    </Card>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={12} lg={12}>
                                    <Card>
                                        <CardHeader color="rose" icon>
                                            <GridContainer style={{width: "100%", margin: 0}}>
                                                <GridItem xs={9} sm={9} md={9} lg={9} style={{paddingLeft: 0}}>
                                                    <CardIcon color="rose">
                                                        <People/>
                                                    </CardIcon>
                                                    <h4 className={classes.cardCategory}>Gig Admin(s)</h4>
                                                </GridItem>
                                                <GridItem xs={3} sm={3} md={3} lg={3} style={{textAlign: 'right', padding: 10}}>
                                                    {/*TODO: Edit admins (only super admin)*/}
                                                    <MUIButton color="default"
                                                               onClick={this.editGigAdmins.bind(this)}
                                                               variant="contained"
                                                               size="small"
                                                               style={{height: "100%", padding: 0}}
                                                    >
                                                        <div className={classes.muiButtonText}>Edit</div>
                                                        <Edit className={classes.muiButtonIcon} style={{margin: 0}}/>
                                                    </MUIButton>
                                                </GridItem>
                                            </GridContainer>
                                        </CardHeader>
                                        <CardBody>
                                            <GigTable
                                                tableData={gig.user_admins}
                                                setupTableCells={this.setupAdminTableCells.bind(this)}
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
                                        text={`${this.calculatePoints(gig)}/${gig.points_budget}`}
                                        strokeWidth={2}
                                        styles={{
                                            root: {},
                                            path: {
                                                stroke: '#ff9800',
                                                strokeLinecap: 'butt',
                                                transition: 'stroke-dashoffset 0.5s ease 0s',
                                            },
                                            trail: {
                                                stroke: '#d6d6d6',
                                            },
                                            text: {
                                                fill: '#ff9800',
                                                fontSize: '20px',
                                            },
                                        }}
                                    />
                                    <h6 className={classes.cardCategory}>Brownie Points Total Budget</h6>
                                    <Button round color="warning" onClick={this.editBrownieAllocation.bind(this)}>
                                        Edit Allocation
                                    </Button>
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} lg={4}>
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
                                        hover
                                        tableHeaderColor="primary"
                                        tableData={gig.user_participants}
                                        tableFooter="false"
                                        notFoundMessage="No participants found"
                                        setupTableCells={this.setupParticipantTableCells.bind(this)}
                                        handleTableRowOnClick={this.editGigParticipants.bind(this)}
                                    />
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={8} lg={8}>
                            <GigCustomTabs
                                title="Tasks:"
                                headerColor="teal"
                                tabs={this.organizeTabContent(gig.tasks)}
                                addContent={this.addTask.bind(this)}
                            />
                        </GridItem>
                    </GridContainer>
                </div>
            );
        } else {
            return null;
        }

    }
}

export default withStyles(style)(GigDashboard);



