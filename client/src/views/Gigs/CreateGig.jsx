import React from "react";

// @material-ui/core components
import Wizard from "components/Gigs/Wizard/Wizard";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import {CreateGigSteps} from "components/Gigs/Wizard/CreateGigSteps/CompiledGigSteps";
import {NotificationManager, NotificationContainer} from "react-notifications";

class CreateGig extends React.Component {
    finishButtonClick(step) {
        const {history} = this.props;
        console.log(step);
        fetch('/gigs/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name :step.name,
                points_budget : step.budget,
                status : "NOT STARTED",
                user_admins: step.selectedAdmins.map(admin => admin.id)
            })
        }).then(data => {
            if (data.status !== 200) {
                data.json().then(json =>{
                    NotificationManager.error(json.error.errmsg);
                });
                
            } else {
                //If success
                //Redirect to gigs individual dashboard
                
                // data.json().then(json =>{
                //     history.push({
                //         headername: `${json.gig.name}`,
                //         pathname: `/gigs/${json.gig.name}`,
                //         state: {
                //             gig: json.gig
                //         }
                //     });
                // });
            }
        });
    }

    render() {
        return (
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
        );
    }
}

export default CreateGig;