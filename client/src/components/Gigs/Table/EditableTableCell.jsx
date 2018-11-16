import React from "react";

// @material-ui/core components
import TableCell from "@material-ui/core/TableCell";

// core components
import CustomInput from "components/Gigs/CustomInput/CustomInput";

class EditableTableCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cellValueState: ""
        };
    }

    componentDidMount() {
        this.clearState();
    }

    clearState() {
        this.setState({
            cellValueState: "success"
        })
    }

    onChangeCellValue(event) {
        const {inputRefId, reRenderAllEditableCells} = this.props;
        const cellValue = event.target.value;
        if (cellValue) {
            this.validateCellValue(cellValue);
            if (reRenderAllEditableCells) {
                reRenderAllEditableCells(inputRefId);
            }
        }
    }

    validateCellValue(cellValue) {
        const {editValidation, inputRefId} = this.props;
        if (editValidation(parseInt(cellValue, 10), inputRefId)) {
            this.setState({
                cellValueState: "success"
            })
        } else {
            this.setState({
                cellValueState: "error"
            })
        }
    }

    render() {
        const {classes, cellValue} = this.props;
        const tableCellClasses = classes.tableCell;

        const {cellValueState} = this.state;

        return (
            <TableCell colSpan="1" className={tableCellClasses}>
                <CustomInput
                    success={cellValueState === "success"}
                    error={cellValueState === "error"}
                    labelText={
                        <span>
                                    Brownie Points
                                </span>
                    }
                    inputProps={{
                        style: {width: 100},
                        value: cellValue,
                        onChange: event => this.onChangeCellValue(event)
                    }}
                    inputType="number"
                />
            </TableCell>
        )
    }
}

export default (EditableTableCell);