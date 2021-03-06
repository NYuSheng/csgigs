import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Assigned from "@material-ui/icons/AssignmentInd";

// Stylesheet
import tasksStyle from "assets/jss/material-dashboard-pro-react/components/tasksStyle.jsx";

class Tasks extends React.Component {
    render() {
        const { classes, tasksIndexes, tasks, editTask, removeTask, assignUsers } = this.props;
        return (
            <Table className={classes.table}>
                <TableBody>
                    {tasksIndexes.map(value => (
                        <TableRow key={value} className={classes.tableRow}>
                            <TableCell className={classes.tableCell} style={{width: "60%"}}>
                                {tasks[value].task_name}
                            </TableCell>
                            <TableCell className={classes.tableCell} style={{width: "20%"}}>
                                {tasks[value].status}
                            </TableCell>
                            <TableCell className={classes.tableActions} style={{width: "20%", textAlign: "center"}}>
                                <Tooltip
                                    id="tooltip-top"
                                    title="Edit Assigned"
                                    placement="top"
                                    classes={{tooltip: classes.tooltip}}
                                >
                                    <IconButton
                                        aria-label="Edit"
                                        className={classes.tableActionButton}
                                        onClick={()=> {assignUsers(tasks[value])}}
                                    >
                                        <Assigned
                                            className={
                                                classes.tableActionButtonIcon + " " + classes.assigned
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    id="tooltip-top"
                                    title="Edit Task"
                                    placement="top"
                                    classes={{tooltip: classes.tooltip}}
                                >
                                    <IconButton
                                        aria-label="Edit"
                                        className={classes.tableActionButton}
                                        onClick={()=> {editTask(tasks[value])}}
                                    >
                                        <Edit
                                            className={
                                                classes.tableActionButtonIcon + " " + classes.edit
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    id="tooltip-top-start"
                                    title="Remove"
                                    placement="top"
                                    classes={{tooltip: classes.tooltip}}
                                >
                                    <IconButton
                                        aria-label="Close"
                                        className={classes.tableActionButton}
                                        onClick={()=> {removeTask(tasks[value])}}
                                    >
                                        <Close
                                            className={
                                                classes.tableActionButtonIcon + " " + classes.close
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

Tasks.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(tasksStyle)(Tasks);
