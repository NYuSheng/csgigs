import React from "react";
import ReactDOM from "react-dom";
import {createBrowserHistory} from "history";
import {BrowserRouter, Router, Route, Switch} from "react-router-dom";

import indexRoutes from "routes/index.jsx";

import "assets/scss/material-dashboard-pro-react.css?v=1.4.0";

const hist = createBrowserHistory();

ReactDOM.render(
    <Router history={hist}>
        <BrowserRouter basename='/admin-ui'>
            <Switch>
                {indexRoutes.map((prop, key) => {
                    return <Route path={prop.path} component={prop.component} key={key}/>;
                })}
            </Switch>
        </BrowserRouter>
    </Router>,
    document.getElementById("root")
);
