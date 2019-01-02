import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from '@material-ui/core/withMobileDialog';

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Danger from "@material-ui/icons/Warning";
import Success from "@material-ui/icons/CheckCircle";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import {cancel, complete} from "components/Gigs/API/Gigs/Gigs";
import {setRoomTypeToPublic} from "components/Gigs/API/RocketChat/RocketChat";

// dependencies
import Loader from 'react-loader-spinner';

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class GigActions extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            action: "",
            status: "",
            publishState: false,
            cancelState: false
        };
    }

    componentWillMount() {
        this.resetState();
    }

    componentWillReceiveProps(){
        this.resetState();
    }

    resetState() {
        const {gig} = this.props;
        if (gig.status !== "Draft") {
            this.setState({
                publishState: true
            })
        }
        if (gig.status.match("Cancelled|Completed")) {
            this.setState({
                cancelState: true
            })
        }
        this.setStatusState("working");
    }

    closeModal() {
        const {hidePopup} = this.props;
        hidePopup("gigActions");
    }

    setStatusState(status) {
        this.setState({
            status: status
        })
    }

    setActionState(action) {
        this.setState({
            action: action
        })
    }

    publishGig() {
        this.setActionState("published");
        const {gig} = this.props;
        setRoomTypeToPublic(gig._id, gig.rc_channel_id._id, this.setStatusState.bind(this))
    }

    cancelGig() {
        this.setActionState("cancelled");
        const {gig} = this.props;
        const cancelPayload = {
            status: "Cancelled"
        };
        cancel(gig._id, gig.rc_channel_id._id, cancelPayload, this.setStatusState.bind(this));
    }

    completeGig() {
        this.setActionState("completed");
        const {gig} = this.props;
        const completePayload = {
            status: "Completed"
        };
        complete(gig._id, gig.rc_channel_id._id, completePayload, this.setStatusState.bind(this));
    }

    render() {
        const {classes, modalOpen, gig, fullScreen} = this.props;
        const {status, publishState, cancelState, action} = this.state;

        return (
            <Dialog
                open={modalOpen}
                fullScreen={fullScreen}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    this.closeModal()
                }}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
                maxWidth="xs"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    style={{paddingBottom: 0}}
                >
                    <GridContainer className={classes.modalHeader}>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{textAlign: "left"}}>
                            <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>
                                Gig Actions
                            </h4>
                        </GridItem>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{paddingRight: 5}}>
                            <Button
                                justIcon
                                className={classes.modalCloseButton}
                                key="close"
                                aria-label="Close"
                                color="transparent"
                                onClick={() => {
                                    this.closeModal()
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
                    style={{paddingBottom: 35, paddingTop: 0, minWidth: 326.4}}
                >
                    <GridContainer justify="center">
                    {
                        status === "loading" ?
                            (
                                <GridItem xs={10} sm={10} md={10} lg={10} style={{textAlign: "center"}}>
                                    <div style={{paddingTop: 25}}>
                                        <Loader
                                            type="ThreeDots"
                                            color="black"
                                            height="100"
                                            width="100"
                                        />
                                    </div>
                                </GridItem>
                            ) : null
                    }
                    {
                        (status === "cancelling") ? (
                            <React.Fragment>
                                <GridItem xs={10} sm={10} md={10} lg={10} style={{paddingTop: 30, paddingBottom: 30}}>
                                    <p style={{textAlign: "justify"}}>
                                        Are you sure you want to cancel this gig?
                                        To reinstate this gig later on, please contact the super admin
                                    </p>
                                </GridItem>
                                <GridItem xs={10} sm={10} md={10} lg={10} style={{textAlign: "center"}}>
                                    <Button className={classes.marginRight}
                                            color="danger"
                                            onClick={() => {this.cancelGig()}}
                                    >
                                        Yes
                                    </Button>
                                    <Button className={classes.marginRight}
                                            color="success"
                                            onClick={() => {
                                                this.setStatusState("working")
                                            }}
                                    >
                                        No
                                    </Button>
                                </GridItem>
                            </React.Fragment>
                        ) : null
                    }
                    {
                        (status === "working") ? (
                            <React.Fragment>
                                <GridItem xs={10} sm={10} md={10} lg={10} style={{paddingTop: 10}}>
                                    <Card style={{marginTop: 0, marginBottom: 10}}>
                                        <CardBody>
                                            <Button className={classes.marginRight}
                                                    onClick={() => {this.publishGig()}}
                                                    color="warning"
                                                    disabled={publishState}
                                                    style={{width: "100%"}}
                                            >
                                                Publish
                                            </Button>
                                        </CardBody>
                                    </Card>
                                    <p style={{textAlign: "justify", paddingBottom: 9, borderBottom: "1px solid grey", fontSize: 13}}>
                                        Publishing the gig sets the status to "Active", making the Rocket Chat group public.
                                    </p>
                                </GridItem>
                                <GridItem xs={10} sm={10} md={10} lg={10}>
                                    <Card style={{marginTop: 0, marginBottom: 10}}>
                                        <CardBody>
                                            <Button className={classes.marginRight}
                                                    onClick={() => {this.completeGig()}}
                                                    color="success"
                                                    disabled={!publishState || gig.status === "Completed" || gig.status === "Cancelled"}
                                                    style={{width: "100%"}}
                                            >
                                                Complete
                                            </Button>
                                        </CardBody>
                                    </Card>
                                    <p style={{textAlign: "justify", paddingBottom: 9, borderBottom: "1px solid grey", fontSize: 13}}>
                                        Completing the gig sets the status to "Completed".
                                    </p>
                                </GridItem>
                                <GridItem xs={10} sm={10} md={10} lg={10}>
                                    <Card style={{
                                        border: "1px solid",
                                        borderColor: "red",
                                        marginTop: 0,
                                        marginBottom: 10}}
                                    >
                                        <CardBody>
                                            <Button className={classes.marginRight}
                                                    onClick={() => {this.setStatusState("cancelling")}}
                                                    color="danger"
                                                    disabled={cancelState}
                                                    style={{width: "100%"}}
                                            >
                                                Cancel
                                            </Button>
                                        </CardBody>
                                    </Card>
                                    <div style={{overflow: "auto", display: "block"}}>
                                        <Danger color="error" style={{float: "left", position: "relative", clear: "both", marginRight: 5}} fontSize="small"/>
                                        <p style={{textAlign: "justify", fontSize: 13}}>
                                            Cancelling the gig disables the gig. This action cannot be undone.
                                        </p>
                                    </div>
                                </GridItem>
                            </React.Fragment>
                        ) : null
                    }
                    {
                        status === "success" ? (
                            <GridItem xs={10} sm={10} md={10} lg={10} style={{textAlign: "center"}}>
                                <div style={{paddingTop: 25}}>
                                    <Success className={classes.icon}
                                             style={{height: 100, width: 100, fill: "green"}}/>
                                    <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>
                                        Gig has been {action}
                                    </h4>
                                </div>
                            </GridItem>
                        ) : null
                    }
                    </GridContainer>
                </DialogContent>
            </Dialog>
        );
    }
}

export default withMobileDialog()(withStyles(notificationsStyle)(GigActions));