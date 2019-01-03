import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";

// material-ui icons
import Menu from "@material-ui/icons/Menu";
import MoreVert from "@material-ui/icons/MoreVert";
import ViewList from "@material-ui/icons/ViewList";

// core components
// import HeaderLinks from "./HeaderLinks";
import Button from "components/CustomButtons/Button.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import { getGigName } from "components/Gigs/API/Gigs/Gigs";

// dependencies
import { matchPath } from "react-router";

// style sheets
import headerStyle from "assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }

  componentDidMount() {
    this.makeBrand();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.makeBrand();
    }
  }

  async makeBrand() {
    const { routes } = this.props;
    let name = "";
    for (let i = 0; i < routes.length; i++) {
      if (name) {
        break;
      }

      const prop = routes[i];
      if (prop.collapse) {
        for (let j = 0; j < prop.views.length; j++) {
          const propp = prop.views[j];

          if (name) {
            break;
          }
          if (propp.path === this.props.location.pathname) {
            name = propp.name;
          } else {
            const match = matchPath(this.props.history.location.pathname, {
              path: propp.path,
              exact: true,
              strict: false
            });
            if (match && match.params.gigId) {
              name = await getGigName(match.params.gigId);
            }
          }
        }
      }

      if (!name && prop.path === this.props.location.pathname) {
        name = prop.name;
      }
    }

    this.setState({
      name: name ? name : ""
    });
  }

  render() {
    const { classes, color, rtlActive } = this.props;
    const { name } = this.state;

    const appBarClasses = cx({
      [" " + classes[color]]: color
    });
    const sidebarMinimize =
      classes.sidebarMinimize +
      " " +
      cx({
        [classes.sidebarMinimizeRTL]: rtlActive
      });
    return (
      <AppBar className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <Hidden smDown implementation="css">
            <div className={sidebarMinimize}>
              {this.props.miniActive ? (
                <Button
                  justIcon
                  round
                  color="white"
                  onClick={this.props.sidebarMinimize}
                >
                  <ViewList className={classes.sidebarMiniIcon} />
                </Button>
              ) : (
                <Button
                  justIcon
                  round
                  color="white"
                  onClick={this.props.sidebarMinimize}
                >
                  <MoreVert className={classes.sidebarMiniIcon} />
                </Button>
              )}
            </div>
          </Hidden>
          <div className={classes.flex}>
            {/* Here we create navbar brand, based on route name */}
            <CardHeader className={classes.title}>{name}</CardHeader>
          </div>
          {/*<Hidden smDown implementation="css">*/}
          {/*<HeaderLinks rtlActive={rtlActive}/>*/}
          {/*</Hidden>*/}
          <Hidden mdUp implementation="css">
            <Button
              className={classes.appResponsive}
              color="transparent"
              justIcon
              aria-label="open drawer"
              onClick={this.props.handleDrawerToggle}
            >
              <Menu />
            </Button>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool
};

export default withStyles(headerStyle)(Header);
