import React from "react";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import LockOutline from "@material-ui/icons/LockOutlined";

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardFooter from "components/Card/CardFooter";
import UserProfile from "components/Gigs/Authentication/UserProfile";
import PagesHeader from "components/Header/PagesHeader";

// dependencies
import {NotificationManager, NotificationContainer} from "react-notifications";
import bgImage from "assets/img/register.jpeg";

// style sheets
import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cardAnimaton: "cardHidden",
            username: '',
            password: '',
            usernameState: '',
            passwordState: ''
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(e) {
        const username = e.target.value;
        this.setState({
            username: username
        });
        username ?
            this.setState({usernameState: "success"})
            :
            this.setState({usernameState: "error"})
    }

    handlePasswordChange(e) {
        const password = e.target.value;
        this.setState({
            password: e.target.value
        });
        password ?
            this.setState({passwordState: "success"})
            :
            this.setState({passwordState: "error"})
    }

    isValidated() {
        if (
            this.state.usernameState === "success" &&
            this.state.passwordState === "success"
        ) {
            return true;
        } else {
            if (this.state.usernameState !== "success") {
                this.setState({usernameState: "error"});
            }
            if (this.state.passwordState !== "success") {
                this.setState({passwordState: "error"});
            }
        }
        return false;
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

    login() {
        const loginDetails = {
            username: this.state.username,
            password: this.state.password
        }

        fetch('/admin-ui/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginDetails)
        }).then(loginoutput => loginoutput.json()).then(data => {
            if (data.error) {
                NotificationManager.error(data.error);
            } else {
                UserProfile.login(data.user);
                const {history} = this.props;
                history.push({
                    pathname: "/dashboard"
                });
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        if(this.isValidated()){
            this.login();
        }
    }

    forgetPassword() {
        window.location.href = "https://csgigs.com/home/"
    }

    render() {
        const {classes, ...rest} = this.props;
        const {usernameState, passwordState} = this.state;
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
                                <GridItem xs={8} sm={8} md={4} lg={4}>
                                    <form onSubmit={this.handleSubmit}>
                                        <Card login className={classes[this.state.cardAnimaton]}>
                                            <CardHeader
                                                className={`${classes.cardHeader} ${classes.textCenter}`}
                                                color="info"
                                            >
                                                <h4 className={classes.cardTitle}>
                                                    Log in using RocketChat credentials
                                                </h4>
                                            </CardHeader>
                                            <CardBody>
                                                <CustomInput
                                                    success={usernameState === "success"}
                                                    error={usernameState === "error"}
                                                    labelText={
                                                        usernameState === "error" ?
                                                            "Username (required)" :
                                                            "Username"
                                                    }
                                                    id="username"
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        onChange: event => this.handleUsernameChange(event),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Face className={classes.inputAdornmentIcon}/>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    value={this.state.username}
                                                />
                                                <CustomInput
                                                    success={passwordState === "success"}
                                                    error={passwordState === "error"}
                                                    labelText={
                                                        passwordState === "error" ?
                                                            "Password (required)" :
                                                            "Password"
                                                    }
                                                    id="password"
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        onChange: event => this.handlePasswordChange(event),
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <LockOutline className={classes.inputAdornmentIcon}/>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    inputType="password"
                                                />
                                            </CardBody>
                                            <CardFooter className={classes.justifyContentCenter}>
                                                <GridContainer>
                                                    <GridItem xs={12} sm={12} md={12} lg={12}>
                                                        <Button id="login" type="submit"
                                                                color="info" simple size="lg"
                                                                block style={{paddingBottom: 0}}
                                                        >
                                                            Login
                                                        </Button>
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={12} lg={12}>
                                                        <Button id="forget_password" onClick={this.forgetPassword}
                                                                color="info" simple size="lg" block
                                                                style={{paddingTop: 0, paddingBottom: 0}}
                                                        >
                                                            Forget Password
                                                        </Button>
                                                    </GridItem>
                                                </GridContainer>
                                            </CardFooter>
                                        </Card>
                                    </form>
                                </GridItem>
                            </GridContainer>
                        </div>
                    </div>
                </div>
                <NotificationContainer/>
            </div>
        );
    }
}

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(loginPageStyle)(LoginPage);
