// core components
import ManageGigs from "views/Gigs/ManageGigs.jsx";
import GigDashboard from "views/Gigs/GigDashboard.jsx";

// @material-ui/icons
import ViewList from "@material-ui/icons/ViewList";

const gigsRoutes = [
    {
        path: "/gigs/manage",
        name: "Manage Gigs",
        icon: ViewList,
        component: ManageGigs
    },
    {hide: true, path: "/gigs/:gigId", name: "Gig", mini: "", component: GigDashboard}
];

export default gigsRoutes;
