import Pages from "layouts/Pages.jsx";
import RTL from "layouts/RTL.jsx";
import Dashboard from "layouts/Dashboard.jsx";
import LoginPage from "views/Login/LoginPage.jsx";

var indexRoutes = [
  { path: "/rtl", name: "RTL", component: RTL },
  { path: "/login", name: "LoginPage", component: LoginPage },
  { path: "/", name: "Dashboard", component: Dashboard }
];

export default indexRoutes;
