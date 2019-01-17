import React from "react";
import PropTypes from "prop-types";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

// @material-ui/icons
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

// core components
import styles from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";

class CustomRadio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: this.props.selectedItem || ""
    };

    this.props.inputProps.onChange(this.state.selectedValue);
  }

  handleChangeEnabled = event => {
    this.setState({ selectedValue: event.target.value });
    this.props.inputProps.onChange(event.target.value);
  };

  render() {
    const { classes, id, items, labelText } = this.props;
    return (
      <div id={id}>
        {labelText && (
          <FormLabel
            style={{ marginBottom: "15px", display: "block" }}
            htmlFor={id}
          >
            {labelText}
          </FormLabel>
        )}
        {items.map(item => (
          <div
            key={item.key}
            className={
              classes.checkboxAndRadio +
              " " +
              classes.checkboxAndRadioHorizontal
            }
          >
            <FormControlLabel
              control={
                <Radio
                  checked={this.state.selectedValue === item.key}
                  onChange={this.handleChangeEnabled}
                  value={item.key}
                  name={item.value}
                  aria-label={item.key}
                  icon={
                    <FiberManualRecord className={classes.radioUnchecked} />
                  }
                  checkedIcon={
                    <FiberManualRecord className={classes.radioChecked} />
                  }
                  classes={{
                    checked: classes.radio
                  }}
                />
              }
              classes={{
                label: classes.label
              }}
              label={item.value}
            />
          </div>
        ))}
      </div>
    );
  }
}

CustomRadio.propTypes = {
  classes: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  items: PropTypes.array,
  selectedItem: PropTypes.string
};

export default withStyles(styles)(CustomRadio);
