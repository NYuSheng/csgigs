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
            edit: "",
            onFocus: ""
        };

        this.enableEdit = this.enableEdit.bind(this);
    }

    componentDidMount() {
        this.setState({
            cellValueState: "success",
            edit: false,
            onFocus: false
        })
    }

    enableEdit() {
        this.setState({
            edit: true,
            onFocus: true
        })
    }

    disableEdit() {
        const {cellValueState} = this.state;
        if (cellValueState === "success") {
            this.setState({
                edit: false
            })
        }
        this.setState({
            onFocus: false
        })
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
        const {onFocus} = this.state;
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
                                defaultValue: cellValue,
                                onChange: event => this.onChangeCellValue(event)
                            }}
                            inputType="number"
                        />
                    ) : cellValue
                }
            </TableCell>
        )
    }
}

export default (EditableTableCell);