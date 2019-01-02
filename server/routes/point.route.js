const express = require('express');
const router = express.Router();

const point_controller = require('../controllers/point.controller');

router.post('/:user_id', point_controller.assign_points);
router.get('/gigs/:gig_id', point_controller.get_points_gig);

module.exports = router;
