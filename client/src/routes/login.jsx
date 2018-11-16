import LoginPage from "views/Login/LoginPage.jsx";

var loginRoutes = [
    {
        path: "/login",
        name: "Gig Login Page",
        short: "Gig Login",
        component: LoginPage
    },
    {redirect: true, path: "/", pathTo: "/login", name: "Gig Login"}
];
export default loginRoutes;
