import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
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
        if (gig.status === "Cancelled") {
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
        const {classes, modalOpen, gig, channelUpdate, cancelGig} = this.props;
        const {modalState, publishState, cancelState} = this.state;

        return (
            <Dialog
                open={modalOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    this.closeModal()
                }}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
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
                                <GridItem xs={10} sm={10} md={10} lg={10}>
                                    <Card>
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
                                    <Card>
                                        <CardBody>
                                            <Button className={classes.marginRight}
                                                // onClick={this.completeGig.bind(this)}
                                                    color="success"
                                                    style={{width: "100%"}}
                                            >
                                                Complete
                                            </Button>
                                        </CardBody>
                                    </Card>
                                    <Card style={{
                                        border: "1px solid",
                                        borderColor: "red"}}
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

export default withStyles(notificationsStyle)(GigActions);