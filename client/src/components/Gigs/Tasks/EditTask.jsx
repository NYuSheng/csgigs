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

// style sheets
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

class EditTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskName: "",
            taskNameState: "",
            taskCategory: "",
            status: "",
        };
    }

    onChangeTaskCategory = event => {
        this.setState({taskCategory: event.target.value});
    };

    validateTaskName(event) {
        const name = event.target.value;
        this.setState({taskName: name});
        name ?
            this.setState({taskNameState: "success"})
            :
            this.setState({taskNameState: "error"})
    }

    render() {
        const {classes, hideEditTask, task} = this.props;
        const {taskNameState, status} = this.state;

        return (
            <SweetAlert
                style={{
                    display: "block",
                    overflow: "visible"
                }}
                title="Edit Task"
                onConfirm={() => hideEditTask()}
                onCancel={() => hideEditTask()}
                confirmBtnCssClass={
                    classes.button + " " + classes.success
                }
                cancelBtnCssClass={
                    classes.button + " " + classes.danger
                }
                cancelBtnText="Cancel"
                showCancel={(status === "loading") ? false : true}
                showConfirm={(status === "loading") ? false : true}
            >
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
                                defaultValue: task.taskname,
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
                                defaultValue: task.description,
                                multiline: true,
                                onChange: event => this.validateTaskName(event)
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
                                    defaultValue: task.category,
                                    name: "taskcategory",
                                    id: "taskcategory"
                                }}
                            >
                                {renderTaskCategories()}
                            </Select>
                        </FormControl>
                    </GridItem>
                </GridContainer>
            </SweetAlert>
        );
    }
}

export default withStyles(sweetAlertStyle)(EditTask);