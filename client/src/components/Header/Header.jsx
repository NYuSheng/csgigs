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

// dependencies
import {matchPath} from 'react-router';

// style sheets
import headerStyle from "assets/jss/material-dashboard-pro-react/components/headerStyle.jsx";

function Header({...props}) {
    function makeBrand() {
        var name = "";
        for (var i = 0; i < props.routes.length; i++) {
            if (name) {
                break;
            }

            var prop = props.routes[i];
            if (prop.collapse) {
                for (var j = 0; j < prop.views.length; j++) {
                    var propp = prop.views[j];

                    if (name) {
                        break;
                    }
                    if (propp.path === props.location.pathname) {
                        name = propp.name;
                    } else {
                        const match = matchPath(props.history.location.pathname, {
                            path: propp.path,
                            exact: true,
                            strict: false
                        });
                        if (match) {
                            // const response = await fetch(`/admin-ui/api/gigs/get_name_by_id/${match.params.gigId}`);
                            // const json = await response.json();
                            // name = json.name;
                            name = props.history.location.headername;
                        }
                    }
                }
            }

            if (!name && prop.path === props.location.pathname) {
                name = prop.name;
            }
        }

        if (name) {
            return name;
        } else {
            return "";
        }
    }

    const {classes, color, rtlActive} = props;
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
                        {props.miniActive ? (
                            <Button
                                justIcon
                                round
                                color="white"
                                onClick={props.sidebarMinimize}
                            >
                                <ViewList className={classes.sidebarMiniIcon}/>
                            </Button>
                        ) : (
                            <Button
                                justIcon
                                round
                                color="white"
                                onClick={props.sidebarMinimize}
                            >
                                <MoreVert className={classes.sidebarMiniIcon}/>
                            </Button>
                        )}
                    </div>
                </Hidden>
                <div className={classes.flex}>
                    {/* Here we create navbar brand, based on route name */}
                    <CardHeader className={classes.title}>
                        {makeBrand()}
                    </CardHeader>
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
                        onClick={props.handleDrawerToggle}
                    >
                        <Menu/>
                    </Button>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
    rtlActive: PropTypes.bool
};

export default withStyles(headerStyle)(Header);
