import React from "react";

// core components
import Wizard from "components/Gigs/Wizard/Wizard";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CreateAGig from "components/Gigs/PopupModals/SweetAlert/CreateAGig";
import {CreateGigSteps} from "components/Gigs/Wizard/CreateGigSteps/CompiledGigSteps";
import UserProfile from "components/Gigs/Authentication/UserProfile";
import {create} from "components/Gigs/API/Gigs/Gigs";

class CreateGig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            createGigSuccess: null,
        };
    }

    componentDidMount() {
        const authenticated = UserProfile.authenticate();
        if (!authenticated) {
            const {history} = this.props;
            history.push({
                pathname: "/login"
            });
        }
    }

    finishButtonClick(step) {
        create(step, this.createGigSuccess.bind(this));
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