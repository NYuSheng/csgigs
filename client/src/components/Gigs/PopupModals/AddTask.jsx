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
import {renderTaskCategories} from "components/Gigs/Data/TaskCategories";

// dependencies
import Loader from 'react-loader-spinner';

// style sheets
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

class AddTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskName: "",
            taskDescription: "",
            taskNameState: "",
            taskCategory: "",
            status: "",
        };
    }

    componentDidMount() {
        const {task} = this.props;
        this.setState({
            status: "working"
        })
    }

    onChangeTaskCategory = event => {
        this.setState({
            taskCategory: event.target.value
        });
    };

    onChangeTaskDescription(event) {
        this.setState({
            taskDescription: event.target.value
        })
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
        const { taskNameState } = this.state;
        if ( taskNameState === "success" ) {
            return true;
        } else {
            if (taskNameState !== "success") {
                this.setState({taskNameState: "error"});
            }
        }
        return false;
    }

    confirmTaskEdit() {
        const { hideTask } = this.props;
        const { status } = this.state;
        if (status !== "success") {
            if (this.isValidated()) {
                this.setState({
                    status: "loading"
                });

                // API call here to post the edited task
                // Build your payload using buildPayLoad() method below

                // dummy function to simulate api call
                setTimeout(() => {
                    this.setState({
                        status: "success"
                    });
                }, 1000);
            }
        } else {
            hideTask("addTask");
        }
    }

    render() {
        const {classes, hideTask} = this.props;
        const {taskNameState, status} = this.state;

        return (
            <SweetAlert
                success={(status === "success")}
                style={{
                    display: "block",
                    overflow: "visible"
                }}
                title={(status === "working") ? "Add New Task" : (status === "success") ? "Task Added" : false}
                onConfirm={() => this.confirmTaskEdit()}
                onCancel={() => {
                    if (status !== "loading") {
                        hideTask("addTask")
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
            </SweetAlert>
        );
    }

    buildPayLoad() {
        // Construct your payload using state fields
    }
}

export default withStyles(sweetAlertStyle)(AddTask);