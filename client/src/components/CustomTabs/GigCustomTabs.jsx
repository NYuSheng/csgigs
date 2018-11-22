import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from '@material-ui/core/AppBar';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// core components
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import Button from "components/CustomButtons/Button";

import customTabsStyle from "assets/jss/material-dashboard-pro-react/components/customTabsStyle.jsx";

class GigCustomTabs extends React.Component {
    state = {
        value: 0
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {
            classes,
            headerColor,
            plainTabs,
            tabs,
            title,
            rtlActive,
            addContent
        } = this.props;
        const cardTitle = classNames({
            [classes.cardTitle]: true,
            [classes.cardTitleRTL]: rtlActive
        });

        return (
            <Card plain={plainTabs}>
                <CardHeader color={headerColor} plain={plainTabs}>
                    <GridContainer style={{width: "100%", margin: 0}}>
                        <GridItem xs={9} sm={9} md={9} lg={9}>
                            <div className={cardTitle}>
                                {title}
                            </div>
                            <Tabs
                                scrollable
                                scrollButtons="off"
                                value={this.state.value}
                                onChange={this.handleChange}
                                classes={{
                                    root: classes.tabsRoot,
                                    indicator: classes.displayNone
                                }}
                            >
                                {tabs.map((prop, key) => {
                                    var icon = {};
                                    if (prop.tabIcon) {
                                        icon = {
                                            icon: <prop.tabIcon/>
                                        };
                                    }
                                    return (
                                        <Tab
                                            classes={{
                                                root: classes.tabRootButton,
                                                labelContainer: classes.tabLabelContainer,
                                                label: classes.tabLabel,
                                                selected: classes.tabSelected,
                                                wrapper: classes.tabWrapper
                                            }}
                                            key={key}
                                            label={prop.tabName}
                                            {...icon}
                                        />
                                    );
                                })}
                            </Tabs>
                        </GridItem>
                        <GridItem xs={3} sm={3} md={3} lg={3} style={{textAlign: 'right'}}>
                            <Button style={{width: 100, maxWidth: "100%"}}
                                    onClick={addContent}
                            >
                                Add
                            </Button>
                        </GridItem>
                    </GridContainer>
                </CardHeader>
                <CardBody>
                    {tabs.map((prop, key) => {
                        if (key === this.state.value) {
                            return <div key={key}>{prop.tabContent}</div>;
                        }
                        return null;
                    })}
                </CardBody>
            </Card>
        );
    }
}

GigCustomTabs.propTypes = {
    classes: PropTypes.object.isRequired,
    headerColor: PropTypes.oneOf([
        "warning",
        "success",
        "danger",
        "info",
        "primary",
        "rose",
        "teal"
    ]),
    title: PropTypes.string,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            tabName: PropTypes.string.isRequired,
            tabIcon: PropTypes.func,
            tabContent: PropTypes.node.isRequired
        })
    ),
    rtlActive: PropTypes.bool,
    plainTabs: PropTypes.bool
};

export default withStyles(customTabsStyle)(GigCustomTabs);
