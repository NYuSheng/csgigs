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

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/Gigs/CustomInput/CustomInput";
import {renderTaskCategories} from "components/Gigs/Data/TaskCategories";
import Button from "components/CustomButtons/Button";

// dependencies
import Loader from 'react-loader-spinner';

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
            status: "",
        };
    }

    componentDidMount() {
        this.setState({
            taskName: "",
            taskDescription: "",
            taskNameState: "",
            taskCategory: "",
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
        const {taskNameState} = this.state;
        if (taskNameState === "success") {
            return true;
        } else {
            if (taskNameState !== "success") {
                this.setState({taskNameState: "error"});
            }
        }
        return false;
    }

    confirmTaskEdit() {
        const {status} = this.state;
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
        const {taskNameState, status} = this.state;

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
                        <GridItem xs={6} sm={6} md={6} lg={6}>
                            <h4 className={classes.modalTitle}>
                                {
                                    (status === "working") ?
                                        "Add New Task"
                                        : (status === "success") ?
                                        "Task Added" : null
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
                    style={{paddingBottom: 35, paddingTop: 0}}
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
                </DialogContent>
                <DialogActions className={classes.modalFooter} style={{paddingTop: 15}}>
                    {
                        status === "working" ? (
                            <Button onClick={() => this.confirmTaskEdit()}
                                    className={classes.button + " " + classes.success}
                                    color="success">
                                Add
                            </Button>) : null
                    }

                    {
                        status !== "loading" ? (
                        <Button onClick={() => this.closeModal()}
                                className={classes.button + " " + classes.danger}
                                color="danger">
                            {
                                status === "working" ? "Cancel" : "Close"
                            }
                        </Button>) : null
                    }

                </DialogActions>
            </Dialog>
        );
    }

    buildPayLoad() {
        // Construct your payload using state fields
    }
}

export default withStyles(notificationsStyle)(AddTask);