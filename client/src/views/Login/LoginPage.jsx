import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";
import pagesStyle from "assets/jss/material-dashboard-pro-react/layouts/pagesStyle.jsx";
import PagesHeader from "../../components/Header/PagesHeader";
import bgImage from "assets/img/register.jpeg";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden",
            username: '',
            password: ''
        };
    }

    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        this.timeOutFunction = setTimeout(
            function () {
                this.setState({cardAnimaton: ""});
            }.bind(this),
            700
        );
    }

    componentWillUnmount() {
        clearTimeout(this.timeOutFunction);
        this.timeOutFunction = null;
    }

    render() {
        const {classes, ...rest} = this.props;
        return (
            <div>
                <PagesHeader {...rest} />
                <div className={classes.wrapper} ref="wrapper">
                    <div
                        className={classes.fullPage}
                        style={{backgroundImage: "url(" + bgImage + ")"}}
                    >
                        <div className={classes.container}>
                            <GridContainer justify="center">
                                <GridItem xs={12} sm={6} md={4}>
                                    <form action="/admin-ui/dashboard">
                                        <Card login className={classes[this.state.cardAnimaton]}>
                                            <CardHeader
                                                className={`${classes.cardHeader} ${classes.textCenter}`}
                                                color="info"
                                            >
                                                <h4 className={classes.cardTitle}>Log in using RocketChat
                                                    credentials</h4>

                                            </CardHeader>
                                            <CardBody>
                                                <CustomInput
                                                    labelText="Username"
                                                    id="username"
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Face className={classes.inputAdornmentIcon}/>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                                <CustomInput
                                                    labelText="Password"
                                                    id="password"
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Icon className={classes.inputAdornmentIcon}>
                                                                    lock_outline
                                                                </Icon>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </CardBody>
                                            <CardFooter className={classes.justifyContentCenter}>
                                                <Button type="submit" color="info" simple size="lg" block>
                                                    Login
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </form>
                                </GridItem>
                            </GridContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(loginPageStyle)(LoginPage);
