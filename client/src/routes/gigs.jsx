import GigDashboard from "views/Gigs/Gigs-dashboard.jsx";
import dashboardRoutes from "routes/dashboard.jsx";

var gigRoutes = [
    { name: "Gig", component: GigDashboard }
].concat(dashboardRoutes)

export default gigRoutes