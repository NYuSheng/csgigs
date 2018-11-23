import React from "react";

// core components
import Wizard from "components/Gigs/Wizard/Wizard";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CreateAGig from "components/Gigs/PopupModals/SweetAlert/CreateAGig";
import {CreateGigSteps} from "components/Gigs/Wizard/CreateGigSteps/CompiledGigSteps";
import UserProfile from "components/Gigs/Authentication/UserProfile";

// dependencies
import {NotificationManager} from "react-notifications";

class CreateGig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            createGigSuccess: null,
        };
    }

    componentDidMount() {
        var authenticated = UserProfile.authenticate();
        if (!authenticated) {
            const {history} = this.props;
            history.push({
                pathname: "/login"
            });
        }
    }

    finishButtonClick(step) {
        fetch('/admin-ui/api/gigs/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name :step.name,
                points_budget : step.budget,
                status : "Draft",
                user_admins: step.selectedAdmins.map(admin => admin.username)
            })
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json =>{
                    NotificationManager.error(json.error.errmsg);
                });
            } else {
                data.json().then(json =>{
                    this.createGigSuccess(json.gig);
                });
            }
        });
    }

    createGigSuccess(gig) {
        this.setState({
            createGigSuccess: (
                <CreateAGig {...this.props}
                            hidePopup={this.hidePopup.bind(this)}
                            gig={gig}
                />
            )
        })
    }

    hidePopup() {
        this.setState({
            createGigSuccess: null
        });
        window.location.reload();
    }

    render() {
        const {createGigSuccess} = this.state;

        return (
            <div>
                {createGigSuccess}
                <GridContainer justify="center">
                    <GridItem xs={12} sm={8}>
                        <Wizard
                            validate
                            steps={CreateGigSteps}
                            title="Create a Gig"
                            subtitle="Please fill in the below information to create a gig."
                            finishButtonClick={this.finishButtonClick.bind(this)}
                        />
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default CreateGig;