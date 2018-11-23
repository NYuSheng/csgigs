import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/Gigs/CustomInput/CustomInput";
import {renderTaskCategories, fetchTaskCategories} from "components/Gigs/Data/TaskCategories";

// dependencies
import Loader from 'react-loader-spinner';
import {NotificationManager} from "react-notifications";

// style sheets
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

class EditTask extends React.Component {
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
        const {task} = this.props;
        this.setState({
            taskName: task.task_name,
            taskNameState: "success",
            taskDescription: task.task_description,
            taskCategory: task.task_category,
            taskCategoryState: "success",
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

    onChangeTaskName(event) {
        const name = event.target.value;
        this.setState({taskName: name});
        this.validateTaskName(name);
    }

    validateTaskName(name) {
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

    taskEditAction() {
        const {editTaskAction, task} = this.props;
        const {taskName, taskDescription, taskCategory} = this.state;

        var payload = {};
        payload["id"] = task._id;
        payload["taskName"] = taskName;
        payload["taskDescription"] = taskDescription;
        payload["taskCategory"] = taskCategory;
        editTaskAction(payload);
    }

    confirmTaskEdit() {
        const {hideTask, task} = this.props;
        const {status} = this.state;
        if (status !== "success") {
            if (this.isValidated()) {
                this.setState({
                    status: "loading"
                });

                fetch(`/admin-ui/api/tasks/updateTask/${task._id}`, {
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
                        this.taskEditAction();
                        this.setState({
                            status: "success"
                        });
                    }
                });
            }
        } else {
            hideTask("editTask");
        }
    }

    render() {
        const {classes, hideTask, task} = this.props;
        const {taskNameState, taskCategoryState, status} = this.state;

        return (
            <SweetAlert
                success={(status === "success")}
                style={{
                    display: "block",
                    overflow: "visible"
                }}
                title={(status === "working") ? "Edit Task" : (status === "success") ? "Task Edited" : false}
                onConfirm={() => this.confirmTaskEdit()}
                onCancel={() => {
                    if (status !== "loading") {
                        hideTask("editTask")
                    }
                }}
                confirmBtnCssClass={
                    classes.button + " " + classes.success
                }
                cancelBtnCssClass={
                    classes.button + " " + classes.danger
                }
                cancelBtnText="Cancel"
                showCancel={(!status.match("loading|success"))}
                showConfirm={(status !== "loading")}
            >
                {
                    status === "loading" ?
                        (
                            <Loader
                                type="ThreeDots"
                                color="black"
                                height="100"
                                width="100"
                            />
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
                                            defaultValue: task.task_name,
                                            onChange: event => this.onChangeTaskName(event)
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
                                            defaultValue: task.task_description,
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
                                                defaultValue: task.task_category,
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
            </SweetAlert>
        );
    }

    buildPayLoad() {
        const {taskName, taskDescription, taskCategory} = this.state;

        var payload = {};
        payload["task_name"] = taskName;
        payload["task_description"] = taskDescription;
        payload["task_category"] = taskCategory;
        return payload;
    }
}

export default withStyles(sweetAlertStyle)(EditTask);