import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem";
// dependencies
import Loader from 'react-loader-spinner';
import {NotificationManager} from "react-notifications";

// style sheets
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

class ReinstateGig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status:"working"
        };
    }

    componentDidMount() {
        this.setState({
            status: "working"
        })
    }

    confirmReinstateGig() {
        const {gig, hidePopup, reinstateGigAction} = this.props;
        const {status} = this.state;
        if (status !== "success") {
            this.setState({
                status: "loading"
            });
            const reinstateGigPayload = {
                status:"Draft"
            }

            fetch(`/admin-ui/api/gigs/update/${gig._id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(reinstateGigPayload)
            }).then(data => {
                if (data.status !== 200) {
                    data.json().then(json =>{
                        NotificationManager.error(json.error.errmsg);
                    });
                    this.setState({
                        status: "working"
                    });
                } else {
                    reinstateGigAction(gig._id);
                    this.setState({
                        status: "success"
                    });
                }
            });
        } else {
            hidePopup("reinstateGig");
        }

    }

    render() {
        const {classes, gig, hidePopup} = this.props;
        const {status} = this.state;

        return (
            <SweetAlert
                success={(status === "success")}
                warning={(status === "working")}
                style={{display: "block"}}
                title={(status === "working") ? `Do you want to reinstate ${gig.name} ?` : (status === "success") ? `${gig.name} reinstated` : false}
                onConfirm={() => this.confirmReinstateGig()}
                onCancel={() => {hidePopup("reinstateGig")}}
                confirmBtnCssClass={classes.button + " " + classes.success}
                cancelBtnCssClass={classes.button + " " + classes.danger}
                confirmBtnText="Ok"
                cancelBtnText="Cancel"
                showCancel={(!status.match("loading|success"))}
                showConfirm={(status !== "loading")}
            >
            {
                status === "loading" ?
                    (
                        <GridItem xs={10} sm={10} md={10} lg={10} style={{textAlign: "center", margin:40}}>
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
            </SweetAlert>
        );
    }
}

export default withStyles(sweetAlertStyle)(ReinstateGig);