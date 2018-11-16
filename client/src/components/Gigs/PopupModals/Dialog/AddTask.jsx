import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Success from "@material-ui/icons/CheckCircle";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/Gigs/CustomInput/CustomInput";
import {renderTaskCategories, fetchTaskCategories} from "components/Gigs/Data/TaskCategories";
import Button from "components/CustomButtons/Button";

// dependencies
import Loader from 'react-loader-spinner';
import {NotificationManager} from "react-notifications";

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class AddTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskName: "",
            taskDescription: "",
            taskNameState: "",
            taskCategory: "",
            taskCategoryState: "",
            status: "",
        };
    }

    componentDidMount() {
        fetchTaskCategories();
        this.setState({
            status: "working"
        })
    }

    onChangeTaskCategory = event => {
        const category = event.target.value;
        this.setState({
            taskCategory: category
        });
        this.validateTaskCategory(category)
    };

    onChangeTaskDescription(event) {
        this.setState({
            taskDescription: event.target.value
        })
    }

    validateTaskCategory(category) {
        category ?
            this.setState({taskCategoryState: "success"})
            :
            this.setState({taskCategoryState: "error"})
    }

    validateTaskName(event) {
        const name = event.target.value;
        this.setState({taskName: name});
        name ?
            this.setState({taskNameState: "success"})
            :
            this.setState({taskNameState: "error"})
    }

    isValidated() {
        const {taskNameState, taskCategoryState} = this.state;
        if (taskNameState === "success" && taskCategoryState === "success") {
            return true;
        } else {
            if (taskNameState !== "success") {
                this.setState({taskNameState: "error"});
            }
            if (taskCategoryState !== "success") {
                this.setState({taskCategoryState: "error"});
            }
        }
        return false;
    }

    confirmTaskAdd() {
        const {gig} = this.props;
        const {status} = this.state;
        if (status !== "success") {
            if (this.isValidated()) {
                this.setState({
                    status: "loading"
                });

                fetch('/admin-ui/tasks/addTask', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(this.buildPayLoad())
                }).then(data => {
                    if (data.status !== 200) {
                        data.json().then(json =>{
                            NotificationManager.error(json.error.errmsg);
                        });
                        this.setState({
                            status: "working"
                        });
                    } else {
                        data.json().then(json =>{
                            gig.tasks.push(json.task);
                        });
                        this.setState({
                            status: "success"
                        });
                    }
                });
            }
        }
    }

    closeModal() {
        const {hideTask} = this.props;
        const {status} = this.state;
        hideTask("addTask");
        if (status === "success") {
            this.setState({
                taskName: "",
                taskDescription: "",
                taskNameState: "",
                taskCategory: "",
                status: "working"
            })
        }
    }

    render() {
        const {classes, modalOpen} = this.props;
        const {taskNameState, taskCategoryState, status} = this.state;

        return (
            <Dialog
                classes={{
                    root: classes.center + " " + classes.modalRoot,
                    paper: classes.modal
                }}
                open={modalOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    if (status !== "loading") {
                        this.closeModal();
                    }
                }}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                >
                    <GridContainer className={classes.modalHeader}>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{textAlign: "left"}}>
                            <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>
                                {
                                    (status === "working") ?
                                        "Add New Task"
                                        : null
                                }
                            </h4>
                        </GridItem>
                        <GridItem xs={6} sm={6} md={6} lg={6}>
                            <Button
                                justIcon
                                className={classes.modalCloseButton}
                                key="close"
                                aria-label="Close"
                                color="transparent"
                                onClick={() => {
                                    if (status !== "loading") {
                                        this.closeModal();
                                    }
                                }}
                            >
                                <Close className={classes.modalClose}/>
                            </Button>
                        </GridItem>
                    </GridContainer>
                </DialogTitle>
                <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                    style={{paddingBottom: 35, paddingTop: 0, width: 500}}
                >
                    {
                        status === "loading" ?
                            (
                                <GridContainer justify="center">
                                    <GridItem xs={10} sm={10} md={10} lg={10}>
                                        <Loader
                                            type="ThreeDots"
                                            color="black"
                                            height="100"
                                            width="100"
                                        />
                                    </GridItem>
                                </GridContainer>
                            ) : null
                    }
                    {
                        status === "working" ?
                            (
                                <GridContainer justify="center">
                                    <GridItem xs={10} sm={10} md={10} lg={10}>
                                        <CustomInput
                                            success={taskNameState === "success"}
                                            error={taskNameState === "error"}
                                            labelText={
                                                <span>
                                            Task Name <small>(required)</small>
                                        </span>
                                            }
                                            id="taskname"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event => this.validateTaskName(event)
                                            }}
                                            inputType="text"
                                        />
                                    </GridItem>
                                    <GridItem xs={10} sm={10} md={10} lg={10}>
                                        <CustomInput
                                            labelText={
                                                <span>
                                            Task Description
                                        </span>
                                            }
                                            id="taskdescription"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                multiline: true,
                                                onChange: event => this.onChangeTaskDescription(event)
                                            }}
                                            inputType="text"
                                        />
                                    </GridItem>
                                    <GridItem xs={10} sm={10} md={10} lg={10}>
                                        <FormControl
                                            fullWidth
                                            className={classes.selectFormControl}
                                            error={taskCategoryState === "error"}
                                        >
                                            <InputLabel
                                                htmlFor="taskcategory"
                                                className={classes.selectLabel}
                                            >
                                                Choose a Task Category
                                            </InputLabel>
                                            <Select
                                                native
                                                MenuProps={{
                                                    className: classes.selectMenu
                                                }}
                                                classes={{
                                                    select: classes.select
                                                }}
                                                onChange={this.onChangeTaskCategory}
                                                inputProps={{
                                                    name: "taskcategory",
                                                    id: "taskcategory"
                                                }}
                                            >
                                                {renderTaskCategories()}
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                </GridContainer>
                            ) : null
                    }
                    {
                        status === "success" ? (
                            <React.Fragment>
                                <Success className={classes.icon} style={{height: 100, width: 100, fill: "green"}}/>
                                <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>Task Added</h4>
                            </React.Fragment>
                        ) : null
                    }
                </DialogContent>
                {
                    status === "working" ? (
                        <DialogActions className={classes.modalFooter} style={{paddingTop: 15}}>
                            <Button onClick={() => this.confirmTaskAdd()}
                                    className={classes.button + " " + classes.success}
                                    color="success">
                                Add
                            </Button>
                            <Button onClick={() => this.closeModal()}
                                    className={classes.button + " " + classes.danger}
                                    color="danger">
                                Cancel
                            </Button>
                        </DialogActions>) : null
                }
            </Dialog>
        );
    }

    buildPayLoad() {
        const {gig} = this.props;
        // Construct your payload using state fields
        var payload = {};
        payload["gig_name"] = gig.name;
        payload["task_name"] = this.state.taskName;
        payload["task_category"] = this.state.taskCategory;
        payload["task_description"] = this.state.taskDescription;
        return payload;
    }
}

export default withStyles(notificationsStyle)(AddTask);