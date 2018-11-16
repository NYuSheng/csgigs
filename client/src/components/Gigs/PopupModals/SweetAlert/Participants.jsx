import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";

// core components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import Table from "components/Gigs/Table/Table";

// dependencies
import Loader from 'react-loader-spinner';

// style sheets
import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

class Participants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            status: "",
        };
    }

    componentDidMount() {
        const {participants} = this.props;
        this.setState({
            members: participants.members,
            status: "working"
        })
    }

    setupTableCells(participant) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <React.Fragment>
                <TableCell colSpan="1" className={tableCellClasses}>
                    {participant.name}
                </TableCell>
                {/*<TableCell colSpan="1" className={tableCellClasses} style={{textAlign: 'right'}}>*/}
                    {/*<Cancel className={classes.icon}/>*/}
                {/*</TableCell>*/}
            </React.Fragment>
        );
    }

    confirmParticipantsEdit() {
        const {hidePopup} = this.props;
        const {status} = this.state;
        if (status !== "success") {
            this.setState({
                status: "loading"
            });

            // API call here to post the edited task
            // Build your payload using buildPayLoad() method below

            // dummy function to simulate api call
            setTimeout(() => {
                this.setState({
                    status: "success"
                });
            }, 1000);
        } else {
            hidePopup("editGigParticipants");
        }
    }

    render() {
        const {classes, hidePopup} = this.props;
        const {members, status} = this.state;

        return (
            <SweetAlert
                success={(status === "success")}
                style={{
                    display: "block",
                    overflow: "visible"
                }}
                title={(status === "working") ? "Edit Participants" : (status === "success") ? "Participants Edited" : false}
                onConfirm={() => this.confirmParticipantsEdit()}
                onCancel={() => {
                    if (status !== "loading") {
                        hidePopup("editGigParticipants")
                    }
                }}
                confirmBtnCssClass={
                    classes.button + " " + classes.success
                }
                cancelBtnCssClass={
                    classes.button + " " + classes.danger
                }
                cancelBtnText="Cancel"
                showCancel={(!status.match("loading|success"))}
                showConfirm={(status !== "loading")}
            >
                {
                    status === "loading" ?
                        (
                            <Loader
                                type="ThreeDots"
                                color="black"
                                height="100"
                                width="100"
                            />
                        ) : null
                }
                {
                    status === "working" ?
                        (
                            <Card>
                                <CardBody>
                                    <Table
                                        tableHeight="100px"
                                        // hover
                                        tableHeaderColor="primary"
                                        tableData={members}
                                        tableFooter="false"
                                        notFoundMessage="No Participants in this group"
                                        setupTableCells={this.setupTableCells.bind(this)}
                                        // handleTableRowOnClick={this.deselectUser.bind(this)}
                                    />
                                </CardBody>
                            </Card>
                        ) : null
                }
            </SweetAlert>
        );
    }

    buildPayLoad() {
        // Construct your payload using state fields
    }
}

export default withStyles(sweetAlertStyle)(Participants);