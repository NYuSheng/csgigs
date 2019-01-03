import React from "react";

// @material-ui/core components
import TableCell from "@material-ui/core/TableCell";

import Accept from "@material-ui/icons/Done";

// core components
import CustomInput from "components/Gigs/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";

// dependencies
import Loader from "react-loader-spinner";

class EditableTableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      status: ""
    };
  }

  componentDidMount() {
    const { cellValue } = this.props;
    this.setState({
      value: cellValue,
      status: "success"
    });
  }

  componentWillUnmount() {}

  setStatusState(status) {
    this.setState({
      status: status
    });
  }

  async onChangeCellValue(event) {
    const { validateFunction } = this.props;
    const cellValue = event.target.value;
    await this.setState({
      value: cellValue
    });
    const isValidated = validateFunction();
    this.setState({
      status: isValidated ? "success" : "error"
    });
  }

  validateValue() {
    const { status, value } = this.state;
    const cellValue = parseInt(value, 10);
    return (
      status === "error" ||
      status === "loading" ||
      isNaN(cellValue) ||
      cellValue < 0
    );
  }

  render() {
    const { classes, assignPointsFunction } = this.props;
    const tableCellClasses = classes.tableCell;

    const { status, value } = this.state;

    return (
      <TableCell
        colSpan="1"
        className={tableCellClasses}
        style={{ paddingRight: 0 }}
      >
        <CustomInput
          success={status === "success"}
          error={status === "error"}
          labelText={status === "error" ? "Invalid" : null}
          inputProps={{
            style: { width: 50 },
            value: value,
            onChange: event => this.onChangeCellValue(event)
          }}
          inputType="number"
        />
        <Button
          simple
          justIcon
          color="success"
          onClick={() => assignPointsFunction(this)}
          disabled={this.validateValue()}
        >
          {status === "loading" ? (
            <Loader type="ThreeDots" color="black" />
          ) : (
            <Accept className={classes.buttonIcon} fontSize="small" />
          )}
        </Button>
      </TableCell>
    );
  }
}

export default EditableTableCell;
