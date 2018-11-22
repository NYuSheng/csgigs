// core components
import ManageGigs from "views/Gigs/ManageGigs";
import GigDashboard from "views/Gigs/GigDashboard";
import CreateGig from "views/Gigs/CreateGig";

// @material-ui/icons
import ViewList from "@material-ui/icons/ViewList";
import Create from "@material-ui/icons/Create";

const gigsRoutes = [
    {hide: true, path: "/gigs/manage/:gigId", name: "Gig", component: GigDashboard},
    {
        path: "/gigs/manage",
        name: "Manage Gigs",
        icon: ViewList,
        component: ManageGigs
    },
    {
        path: "/gigs/create",
        name: "Create Gig",
        icon: Create,
        component: CreateGig
    }
];

export default gigsRoutes;
