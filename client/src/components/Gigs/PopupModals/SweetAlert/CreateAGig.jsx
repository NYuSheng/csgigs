import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components

// dependencies

// style sheets
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

class CreateAGig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gig: null
        };
    }

    componentDidMount() {
        const {gig} = this.props;
        this.setState({
            gig: gig
        })
    }

    redirectToDashboard() {
        const {history} = this.props;
        const {gig} = this.state;

        history.push({
            headername: `${gig.name}`,
            pathname: `/gigs/manage/${gig.name}`
        });
    }

    render() {
        const {classes, hidePopup} = this.props;

        return (
            <SweetAlert
                success={true}
                style={{display: "block", marginTop: "-100px"}}
                title="Gig Created"
                onConfirm={() => this.redirectToDashboard()}
                onCancel={hidePopup}
                confirmBtnCssClass={classes.button + " " + classes.success}
                cancelBtnCssClass={classes.button + " " + classes.danger}
                confirmBtnText="Individual Gig Dashboard"
                cancelBtnText="Close"
                showConfirm
                showCancel
            />
        );
    }
}

export default withStyles(sweetAlertStyle)(CreateAGig);