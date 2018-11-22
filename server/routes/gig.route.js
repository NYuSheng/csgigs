const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const gig_controller = require('../controllers/gig.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/:username', gig_controller.gigs_details);
// router.post('/create', gig_controller.gig_create);
router.post('/create', gig_controller.gig_create_temp);
router.get('/getGigs/:name', gig_controller.gig_details);

//update routes
router.put('/update/:name', gig_controller.gig_update);
router.put('/addParticipant/:name/:participant_name', gig_controller.gig_add_user_participant);
router.put('/addAttendee/:name/:attendee_name', gig_controller.gig_add_user_attendee);

router.post('/getGigsByStatus/:status', gig_controller.get_gigs_status);
router.post('/getGigsDetails/:gigname', gig_controller.get_gigs_everything);

module.exports = router;
