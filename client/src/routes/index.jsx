import Pages from "layouts/Pages.jsx";
import RTL from "layouts/RTL.jsx";
import Dashboard from "layouts/Dashboard.jsx";
import Login from "layouts/Pages.jsx";

var indexRoutes = [
  { path: "/rtl", name: "RTL", component: RTL },
  { path: "/pages", name: "Pages", component: Pages },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/", name: "Login", component: Login }
];

export default indexRoutes;
