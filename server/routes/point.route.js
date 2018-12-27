const express = require('express');
const router = express.Router();

const point_controller = require('../controllers/point.controller');

router.post('/:user_id', point_controller.assign_points);

module.exports = router;
