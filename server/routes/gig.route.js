const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const gig_controller = require('../controllers/gig.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/', gig_controller.gigs_details);
router.post('/create', gig_controller.gig_create);
router.put('/update/:id', gig_controller.gig_update);

module.exports = router;
