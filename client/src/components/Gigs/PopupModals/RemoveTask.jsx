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

class RemoveTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: "",
            status: ""
        };
    }

    componentDidMount() {
        const {task} = this.props;
        this.setState({
            taskId: task,
            status: "working"
        })
    }

    confirmTaskRemove() {
        const { hideTask } = this.props;
        const { status } = this.state;
        if (status !== "success") {
            this.setState({
                status: "loading"
            });

            // API call here to remove the selected task
            // Build your payload using buildPayLoad() method below

            // dummy function to simulate api call
            setTimeout(() => {
                this.setState({
                    status: "success"
                });
            }, 1000);
        } else {
            hideTask("removeTask");
        }
    }

    render() {
        const {classes, hideTask, task} = this.props;
        const {status} = this.state;

        return (
            <SweetAlert
                success={(status === "success")}
                warning={(status === "working")}
                style={{display: "block", marginTop: "-100px"}}
                title={(status === "working") ? "Are you sure?" : (status === "success") ? "Task Removed" : false}
                onConfirm={() => this.confirmTaskRemove()}
                onCancel={() => {
                    if (status !== "loading") {
                        hideTask("removeTask")
                    }
                }}
                confirmBtnCssClass={
                    this.props.classes.button + " " + this.props.classes.success
                }
                cancelBtnCssClass={
                    this.props.classes.button + " " + this.props.classes.danger
                }
                confirmBtnText="Remove"
                cancelBtnText="Cancel"
                showCancel={status === "working" ? true : false}
                showConfirm={status === "working" ? true : false}
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
                    (status === "working") ?
                        "You will not be able to recover this task"
                        : null
                }

            </SweetAlert>
        );
    }

    buildPayLoad() {
        // Construct your payload using state fields
    }
}

export default withStyles(sweetAlertStyle)(RemoveTask);