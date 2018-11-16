import React from "react";

// @material-ui/core components
import TableCell from "@material-ui/core/TableCell";

// core components
import CustomInput from "components/Gigs/CustomInput/CustomInput";

class EditableTableCell extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cellValueState: "",
            edit: ""
        };

        this.enableEdit = this.enableEdit.bind(this);
    }

    componentDidMount() {
        this.clearState();
    }

    clearState() {
        this.setState({
            cellValueState: "success",
            edit: false
        })
    }

    enableEdit() {
        this.setState({
            edit: true
        })
    }

    disableEdit() {
        const {cellValueState} = this.state;
        if (cellValueState === "success") {
            this.setState({
                edit: false
            })
        }
    }

    onChangeCellValue(event) {
        const {inputRefId, reRenderAllEditableCells} = this.props;
        const cellValue = event.target.value;
        this.validateCellValue(cellValue);
        if (reRenderAllEditableCells) {
            reRenderAllEditableCells(inputRefId);
        }
    }

    validateCellValue(cellValue) {
        const {editValidation, inputRefId} = this.props;
        if (editValidation(parseInt(cellValue), inputRefId)) {
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

        const {edit, cellValueState} = this.state;

        return (
            <TableCell colSpan="1" className={tableCellClasses}>
                {
                    edit ? (
                        <CustomInput
                            success={cellValueState === "success"}
                            error={cellValueState === "error"}
                            labelText={
                                <span>
                                    Brownie Points
                                </span>
                            }
                            inputProps={{
                                onBlur: this.disableEdit.bind(this),
                                style: {width: 100},
                                value: (isNaN(cellValue)) ? 0 : cellValue,
                                onChange: event => this.onChangeCellValue(event)
                            }}
                            inputType="number"
                            inputFocus={true}
                        />
                    ) : cellValue
                }
            </TableCell>
        )
    }
}

export default (EditableTableCell);