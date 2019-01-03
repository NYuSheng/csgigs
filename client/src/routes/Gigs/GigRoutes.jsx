// core components
import ManageGigs from "views/Gigs/ManageGigs";
import GigDashboard from "views/Gigs/GigDashboard";
import CreateGig from "views/Gigs/CreateGig";
import CancelledGigs from "views/Gigs/CancelledGigs";

// @material-ui/icons
import ViewList from "@material-ui/icons/ViewList";
import Create from "@material-ui/icons/Create";
import Cancel from "@material-ui/icons/CancelPresentation";
import Complete from "@material-ui/icons/DoneOutline";

const gigsRoutes = [
  {
    hide: true,
    path: "/gigs/manage/:gigId",
    name: "Gig",
    component: GigDashboard
  },
  {
    path: "/gigs/manage",
    name: "Manage",
    icon: ViewList,
    component: ManageGigs
  },
  {
    path: "/gigs/create",
    name: "Create",
    icon: Create,
    component: CreateGig
  },
  {
    path: "/gigs/cancelled",
    name: "Cancelled",
    icon: Cancel,
    component: CancelledGigs
  },
  {
    hide: true,
    path: "/gigs/completed",
    name: "Completed",
    icon: Complete,
    component: CreateGig
  }
];

export default gigsRoutes;
