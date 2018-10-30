import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/Gigs/CustomInput/CustomInput.jsx";

// style sheets
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

class EditTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskName: "",
            taskNameState: ""
        };
    }

    validateTaskName(event) {
        const name = event.target.value;
        this.setState({taskName: name});
        name ?
            this.setState({taskNameState: "success"})
            :
            this.setState({taskNameState: "error"})
    }

    render() {
        const { classes, hideEditTask, task } = this.props;
        const { taskNameState } = this.state;

        return (
            <SweetAlert
                style={{
                    display: "block",
                    marginTop: "-100px",
                }}
                title="Edit Task"
                onConfirm={() => hideEditTask()}
                onCancel={() => hideEditTask()}
                confirmBtnCssClass={
                    this.props.classes.button + " " + this.props.classes.success
                }
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


                </GridContainer>
            </SweetAlert>
        );
    }
}

export default withStyles(sweetAlertStyle)(EditTask);