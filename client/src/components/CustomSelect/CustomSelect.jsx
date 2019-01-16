import React from "react";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

import styles from "assets/jss/material-dashboard-pro-react/customSelectStyle.jsx";

const gigTypes = ["Event", "Training", "Announcement"];

class CustomSelect extends React.Component {
  state = {
    selectedValue: ""
  };
  handleOnChange = event => {
    this.setState({ selectedValue: event.target.value });
  };
  render() {
    const { classes, id, labelText } = this.props;

    return (
      <FormControl fullWidth>
        {labelText && <InputLabel htmlFor={id}>{labelText}</InputLabel>}
        <Select
          MenuProps={{
            className: classes.selectMenu
          }}
          classes={{
            select: classes.select
          }}
          value={this.state.selectedValue}
          onChange={this.handleOnChange}
          inputProps={{
            name: "simpleSelect",
            id
          }}
        >
          {gigTypes.map(x => (
            <MenuItem
              key={x}
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected
              }}
              value={x}
            >
              {x}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(CustomSelect);
