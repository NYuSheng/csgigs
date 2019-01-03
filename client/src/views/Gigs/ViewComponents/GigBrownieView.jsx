import React from "react";

// @material-ui/icons
import BrowniePoints from "@material-ui/icons/AttachMoney";

// core components
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardBody from "components/Card/CardBody";
import Button from "components/CustomButtons/Button";
import BrownieAllocation from "components/Gigs/PopupModals/Dialog/BrownieAllocation";
import { getGigAllocations } from "components/Gigs/API/Gigs/PointAllocations";
import { getGigUsers } from "components/Gigs/API/Gigs/Gigs";
// dependencies
import CircularProgressbar from "react-circular-progressbar";

const style = {
  root: {},
  path: {
    stroke: "#ff9800",
    strokeLinecap: "butt",
    transition: "stroke-dashoffset 0.5s ease 0s"
  },
  trail: {
    stroke: "#d6d6d6"
  },
  text: {
    fill: "#ff9800",
    fontSize: "20px"
  }
};

class GigBrownieView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allocations: null,
      users: null,
      modalOpen: false,
      userAllocations: []
    };
  }

  componentWillMount() {
    const { gigId } = this.props;
    this.setupData(gigId);
  }

  setupData(gigId) {
    getGigAllocations(gigId, this.setAllocationsState.bind(this));
    getGigUsers(gigId, this.setUsersState.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    const { gigId } = this.props;
    const { allocations, users } = this.state;
    if (allocations && users) {
      const userAllocations = [];
      users.forEach(user => {
        const userId = user._id;
        const allocationUser = allocations.find(
          allocation => allocation.user_id === userId
        );
        userAllocations.push({
          user: user,
          points: !allocationUser ? 0 : allocationUser.points,
          assigned: !allocationUser ? false : true
        });
      });
      this.setState({
        userAllocations: userAllocations,
        allocations: null,
        users: null
      });
    }

    if (this.state.modalOpen !== prevState.modalOpen) {
      this.setupData(gigId);
    }
  }

  setAllocationsState(allocations) {
    this.setState({
      allocations: allocations
    });
  }

  setUsersState(users) {
    this.setState({
      users: users
    });
  }

  calculatePoints() {
    const { userAllocations } = this.state;
    let totalPoints = 0;
    userAllocations.forEach(userAllocation => {
      totalPoints += userAllocation.points;
    });
    return totalPoints;
  }

  calculatePointsPercentage() {
    const { gigBudget } = this.props;
    return (this.calculatePoints() / gigBudget) * 100;
  }

  openPopup() {
    this.setState({
      modalOpen: true
    });
  }

  hidePopup() {
    this.setState({
      modalOpen: false
    });
  }

  render() {
    const { classes, gigBudget, gigRoomId, gigId } = this.props;
    const { modalOpen, userAllocations } = this.state;

    return (
      <div>
        <BrownieAllocation
          modalOpen={modalOpen}
          userAllocations={userAllocations}
          gigBudget={gigBudget}
          hidePopup={this.hidePopup.bind(this)}
          gigId={gigId}
        />
        <Card pricing>
          <CardHeader color="warning" stats icon>
            <CardIcon color="warning">
              <BrowniePoints />
            </CardIcon>
          </CardHeader>
          <CardBody pricing>
            <CircularProgressbar
              className={classes.icon}
              percentage={this.calculatePointsPercentage()}
              text={`${this.calculatePoints()}/${gigBudget}`}
              strokeWidth={2}
              styles={style}
            />
            <h6 className={classes.cardCategory}>
              Brownie Points Total Budget
            </h6>
            <Button round color="warning" onClick={this.openPopup.bind(this)}>
              Edit Allocation
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default GigBrownieView;
