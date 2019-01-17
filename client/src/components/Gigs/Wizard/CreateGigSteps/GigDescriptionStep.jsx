import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/Gigs/CustomInput/CustomInput";

// dependencies
import PictureUpload from "components/Gigs/CustomUpload/PictureUpload";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  }
};

class GigDescriptionStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gigImage: "",
      gigDescription: ""
    };
  }

  sendState() {
    return this.state;
  }

  isValidated() {
    return true;
  }

  onChangeGigImage(file) {
    this.setState({
      gigImage: file
    });
  }

  onChangeGigDescription(event) {
    this.setState({
      gigDescription: event.target.value
    });
  }

  render() {
    return (
      <GridContainer justify="center">
        <GridItem xs={10} sm={10} md={10} lg={5} align="right">
          <PictureUpload onFileChange={this.onChangeGigImage.bind(this)} />
        </GridItem>
        <GridItem xs={10} sm={10} md={10} lg={5} align="left">
          <h4>Gig Description</h4>
          <CustomInput
            labelText={<span>Gig Description</span>}
            id="gigDescription"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              multiline: true,
              onChange: event => this.onChangeGigDescription(event)
            }}
            inputType="text"
          />
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(style)(GigDescriptionStep);
