const express = require('express');
const router = express.Router();
const gig_controller = require('../controllers/gig.controller');

router.get('/get_name_by_id/:id', gig_controller.get_gig_name);
router.get('/:admin_name', gig_controller.get_user_all_gigs);
router.get('/:admin_name/:id', gig_controller.get_user_gig);
router.put('/:admin_name/:id', gig_controller.update_gig);
router.post('/create', gig_controller.create_gig);

//update routes
router.put('/addAdmin/:name/:admin_username', gig_controller.gig_add_user_admin);
router.put('/addParticipant/:name/:participant_username', gig_controller.gig_add_user_participant);
router.put('/addAttendee/:name/:attendee_username', gig_controller.gig_add_user_attendee);
router.put('/deleteAdmin/:name/:admin_username', gig_controller.gig_delete_user_admin);

router.post('/getGigsByStatus/:status', gig_controller.gigs_by_status);

module.exports = router;
