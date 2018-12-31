import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem";
import { update } from "components/Gigs/API/Gigs/Gigs";

// dependencies
import Loader from "react-loader-spinner";

// style sheets
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

class ReinstateGig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "working"
    };
  }

  setStatusState(status) {
    this.setState({
      status: status
    });
  }

  confirmReinstateGig() {
    const { gig, hidePopup } = this.props;
    const { status } = this.state;
    if (status !== "success") {
      // TODO: Determine if Draft/Active depending on the rocket chat group/channel room type
      const reinstateGigPayload = {
        status: "Active"
      };
      update(gig._id, reinstateGigPayload, this.setStatusState.bind(this));
    } else {
      hidePopup();
    }
  }

  render() {
    const { classes, gig, hidePopup } = this.props;
    const { status } = this.state;

    return (
      <SweetAlert
        success={status === "success"}
        warning={status === "working"}
        style={{ display: "block" }}
        title={
          status === "working"
            ? `Do you want to reinstate ${gig.name} ?`
            : status === "success"
            ? `${gig.name} reinstated`
            : false
        }
        onConfirm={() => this.confirmReinstateGig()}
        onCancel={() => {
          hidePopup();
        }}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Ok"
        cancelBtnText="Cancel"
        showCancel={!status.match("loading|success")}
        showConfirm={status !== "loading"}
      >
        {status === "loading" ? (
          <GridItem
            xs={10}
            sm={10}
            md={10}
            lg={10}
            style={{ textAlign: "center", margin: 40 }}
          >
            <div style={{ paddingTop: 25 }}>
              <Loader type="ThreeDots" color="black" height="100" width="100" />
            </div>
          </GridItem>
        ) : null}
      </SweetAlert>
    );
  }
}

export default withStyles(sweetAlertStyle)(ReinstateGig);
