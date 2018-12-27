import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";

// core components
// import Filter from "components/Gigs/Filter/Filter";
import Table from "components/Gigs/Table/Table";
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import MUIButton from "@material-ui/core/Button";
import EditGigAdmins from "components/Gigs/PopupModals/Dialog/EditGigAdmins";

// material-ui icons
import People from "@material-ui/icons/People";
import Edit from "@material-ui/icons/Edit";

// dependencies

// style sheets
import {cardTitle} from "assets/jss/material-dashboard-pro-react.jsx";

// import FilterIcon from "@material-ui/icons/Filter";


class GigAdminView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            admins: [],
            modalOpen: false
        };
    }

    componentWillMount() {
        const {gigId} = this.props;
        console.log(gigId);
        this.setupData(gigId);
    }

    setupData(gigId) {
        // call api to get out gig admins
        // set state of this component
    }

    setupTableCells(admin) {
        const {classes} = this.props;
        const tableCellClasses = classes.tableCell;
        return (
            <TableCell colSpan="1" className={tableCellClasses}>
                {admin.name}
            </TableCell>
        );
    }

    openPopup() {
        this.setState({
            modalOpen: true
        })
    }

    hidePopup() {
        this.setState({
            modalOpen: false
        });
    }

    render() {
        const {classes} = this.props;
        const {modalOpen, admins} = this.state;

        return (
            <div>
                <EditGigAdmins modalOpen={modalOpen} hidePopup={this.hidePopup.bind(this)}
                               admins={admins}/>
                <Card>
                    <CardHeader color="rose" icon>
                        <GridContainer style={{width: "100%", margin: 0}}>
                            <GridItem xs={9} sm={9} md={9} lg={9} style={{paddingLeft: 0}}>
                                <CardIcon color="rose">
                                    <People/>
                                </CardIcon>
                                <h4 className={classes.cardCategory}>Gig Admin(s)</h4>
                            </GridItem>
                            <GridItem xs={3} sm={3} md={3} lg={3} style={{textAlign: 'right', padding: 10}}>
                                {/*TODO: Edit admins (only super admin)*/}
                                <MUIButton color="default"
                                           onClick={this.openPopup.bind(this)}
                                           variant="contained"
                                           size="small"
                                           style={{height: "100%", padding: 0}}
                                >
                                    <div className={classes.muiButtonText}>Edit</div>
                                    <Edit className={classes.muiButtonIcon} style={{margin: 0}}/>
                                </MUIButton>
                            </GridItem>
                        </GridContainer>
                    </CardHeader>
                    <CardBody>
                        <Table
                            tableData={admins}
                            setupTableCells={this.setupTableCells.bind(this)}
                        />
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default (GigAdminView);