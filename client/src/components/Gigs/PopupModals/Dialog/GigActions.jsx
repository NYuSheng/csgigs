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

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import Actions from "components/Gigs/Actions/Actions";

// dependencies

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class GigActions extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modalState: "",
            publishState: false,
            cancelState: false
        };
    }

    componentWillMount() {
        const {gig} = this.props;
        if (gig.rc_channel_id) {
            this.setState({
                publishState: true
            })
        }
        if (gig.status === "Cancelled") {
            this.setState({
                cancelState: true
            })
        }
        this.setState({
            modalState: "working"
        })
    }

    componentWillReceiveProps(){
        const {gig} = this.props;
        if (gig.rc_channel_id) {
            this.setState({
                publishState: true
            })
        }
        if (gig.status.match("Cancelled|Completed")) {
            this.setState({
                cancelState: true
            })
        }
    }

    closeModal() {
        const {hidePopup} = this.props;
        this.resetCancelGigAction();
        hidePopup("gigActions");
    }

    cancelGigAction() {
        this.setState({
            modalState: "cancelling"
        })
    }

    resetCancelGigAction() {
        this.setState({
            modalState: "working"
        })
    }

    render() {
        const {classes, modalOpen, gig, channelUpdate, cancelGig, completeGig, fullScreen} = this.props;
        const {modalState, publishState, cancelState} = this.state;

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
                    {
                        (modalState === "cancelling") ? (
                            <GridContainer justify="center">
                                <GridItem xs={10} sm={10} md={10} lg={10} style={{paddingTop: 30, paddingBottom: 30}}>
                                    <p style={{textAlign: "justify"}}>
                                        Are you sure you want to cancel this gig?
                                        To reinstate this gig later on, please contact the super admin
                                    </p>
                                </GridItem>
                                <GridItem xs={10} sm={10} md={10} lg={10} style={{textAlign: "center"}}>
                                    <Button className={classes.marginRight}
                                            color="danger"
                                            onClick={() => {Actions.cancel(gig, cancelGig, this.resetCancelGigAction.bind(this))}}
                                    >
                                        Yes
                                    </Button>
                                    <Button className={classes.marginRight}
                                            color="success"
                                            onClick={() => {
                                                this.resetCancelGigAction()
                                            }}
                                    >
                                        No
                                    </Button>
                                </GridItem>
                            </GridContainer>
                        ) : null
                    }
                    {
                        (modalState === "working") ? (
                            <GridContainer justify="center">
                                <GridItem xs={10} sm={10} md={10} lg={10} style={{paddingTop: 10}}>
                                    <Card style={{marginTop: 0, marginBottom: 10}}>
                                        <CardBody>
                                            <Button className={classes.marginRight}
                                                    onClick={() => {Actions.publish(gig, channelUpdate)}}
                                                    color="warning"
                                                    disabled={publishState}
                                                    style={{width: "100%"}}
                                            >
                                                Publish
                                            </Button>
                                        </CardBody>
                                    </Card>
                                    <p style={{textAlign: "justify", paddingBottom: 9, borderBottom: "1px solid grey", fontSize: 13}}>
                                        Publishing the gig allows you to create a channel in Rocket Chat
                                    </p>
                                </GridItem>
                                <GridItem xs={10} sm={10} md={10} lg={10}>
                                    <Card style={{marginTop: 0, marginBottom: 10}}>
                                        <CardBody>
                                            <Button className={classes.marginRight}
                                                    onClick={() => {Actions.complete(gig, completeGig)}}
                                                    color="success"
                                                    disabled={!publishState || gig.status === "Completed"}
                                                    style={{width: "100%"}}
                                            >
                                                Complete
                                            </Button>
                                        </CardBody>
                                    </Card>
                                    <p style={{textAlign: "justify", paddingBottom: 9, borderBottom: "1px solid grey", fontSize: 13}}>
                                        Completing the gig wraps up the gig and distributes the Brownie points as allocated
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
                                                    onClick={() => {this.cancelGigAction()}}
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
                            </GridContainer>
                        ) : null
                    }
                </DialogContent>
                {/*<DialogActions className={classes.modalFooter} style={{paddingTop: 15}}/>*/}
            </Dialog>
        );
    }
}

export default withMobileDialog()(withStyles(notificationsStyle)(GigActions));