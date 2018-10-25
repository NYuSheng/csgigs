import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Wizard from "components/Gigs/Wizard/Wizard";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import {CreateGigSteps} from "components/Gigs/Wizard/CreateGigSteps/CompiledGigSteps";

class CreateGig extends React.Component {
    submitCreateForm() {
        alert("hello");
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
                        finishButtonClick={this.submitCreateForm.bind(this)}
                    />
                </GridItem>
            </GridContainer>
        );
    }
}

export default CreateGig;