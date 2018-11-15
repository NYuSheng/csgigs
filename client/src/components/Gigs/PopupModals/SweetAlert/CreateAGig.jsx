import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components

// dependencies
import Loader from 'react-loader-spinner';

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
            pathname: `/gigs/${gig.name}`,
            state: {
                gig: gig
            }
        });
    }

    render() {
        const {classes} = this.props;

        return (
            <SweetAlert
                success={true}
                style={{display: "block", marginTop: "-100px"}}
                title="Gig Created"
                onConfirm={() => this.redirectToDashboard()}
                confirmBtnCssClass={classes.button + " " + classes.success}
                confirmBtnText="Individual Gig Dashboard"
                showConfirm={true}
            />
        );
    }
}

export default withStyles(sweetAlertStyle)(CreateAGig);