import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import withMobileDialog from '@material-ui/core/withMobileDialog';

// @material-ui/icons
import Close from "@material-ui/icons/Close";
import Success from "@material-ui/icons/CheckCircle";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";
import CustomInput from "components/Gigs/CustomInput/CustomInput";
import PictureUpload from "components/Gigs/CustomUpload/PictureUpload";
import UserProfile from "components/Gigs/Authentication/UserProfile";

// dependencies
import {NotificationManager} from "react-notifications";
import Loader from 'react-loader-spinner';

// style sheets
import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class GigDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "working",
            photo: "",
            description: ""
        };
        this.upload = React.createRef();
    }

    componentWillMount() {
        const {gig} = this.props;
        if (gig.photo) {
            this.setState({
                photo: gig.photo
            })
        }
        if (gig.description) {
            this.setState({
                description: gig.description
            })
        }
    }

    onChangeGigImage(file) {
        this.setState({
            photo: file
        })
    }

    onChangeGigDescription(event) {
        this.setState({
            description: event.target.value
        })
    }

    closeModal() {
        const {hidePopup} = this.props;
        this.resetState();
        hidePopup("gigDetails");
    }

    resetState() {
        const {gig} = this.props;
        let photo = "";
        let description = "";
        if (gig.photo) {
            photo = gig.photo;
        }
        if (gig.description) {
            description = gig.description;
        }
        if (this.upload) {
            this.upload.resetPhoto(photo);
        }
        this.setState({
            status: "working",
            photo: photo,
            description: description
        });
    }

    confirmGigDetailsEdit() {
        const user = UserProfile.getUser();
        const {gig, editDetailsAction} = this.props;
        this.setState({
            status: "loading"
        });
        let payload = this.buildPayLoad();

        fetch(`/admin-ui/api/gigs/${user.me.username}/${gig._id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json => {
                    NotificationManager.error(json.error.errmsg);
                });
                this.setState({
                    status: "working"
                });
            } else {
                this.setState({
                    status: "success"
                });
                editDetailsAction(payload);
            }
        });
    }

    buildPayLoad() {
        const {photo, description} = this.state;

        var payload = {};
        payload["photo"] = photo;
        payload["description"] = description;
        return payload;
    }

    render() {
        const {classes, modalOpen, fullScreen} = this.props;
        const {photo, description, status} = this.state;

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
                >
                    <GridContainer className={classes.modalHeader}>
                        <GridItem xs={6} sm={6} md={6} lg={6} style={{textAlign: "left"}}>
                            <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>
                                Gig Details
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
                    style={{paddingBottom: 35, paddingTop: 0, minWidth: 326.4}}
                >
                    <GridContainer justify="center">
                        <GridItem xs={10} sm={10} md={10} lg={10}>
                            <p style={{
                                textAlign: "justify",
                                paddingBottom: 9,
                                borderBottom: "1px solid grey",
                                fontSize: 13
                            }}>
                                Edit gig details here
                            </p>
                        </GridItem>
                        {
                            status === "loading" ?
                                (
                                    <GridItem xs={10} sm={10} md={10} lg={10} style={{paddingTop: 10, textAlign: "center"}}>
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
                            status === "working" ?
                                (
                                    <React.Fragment>
                                        <GridItem xs={10} sm={10} md={10} lg={10} style={{paddingTop: 10}}>
                                            <PictureUpload ref={(upload) => this.upload = upload}
                                                           onFileChange={this.onChangeGigImage.bind(this)}
                                                           existingPhoto={photo}
                                            />
                                        </GridItem>
                                        <GridItem xs={10} sm={10} md={10} lg={10}>
                                            <CustomInput
                                                labelText={
                                                    <span>
                                            Gig Description
                                        </span>
                                                }
                                                id="taskdescription"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    value: description,
                                                    multiline: true,
                                                    onChange: event => this.onChangeGigDescription(event)
                                                }}
                                                inputType="text"
                                            />
                                        </GridItem>

                                    </React.Fragment>) : null
                        }
                        {
                            status === "success" ? (
                                <GridItem xs={10} sm={10} md={10} lg={10} style={{textAlign: "center"}}>
                                    <div style={{paddingTop: 25}}>
                                        <Success className={classes.icon}
                                                 style={{height: 100, width: 100, fill: "green"}}/>
                                        <h4 className={classes.modalTitle} style={{fontWeight: "bold"}}>Details
                                            Edited</h4>
                                    </div>
                                </GridItem>
                            ) : null
                        }
                    </GridContainer>
                </DialogContent>
                {
                    status === "working" ? (
                        <DialogActions className={classes.modalFooter} style={{padding: 24}}>
                            <Button onClick={() => this.confirmGigDetailsEdit()}
                                    className={classes.button + " " + classes.success}
                                    color="success">
                                Save
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
}

export default withMobileDialog()(withStyles(notificationsStyle)(GigDetails));