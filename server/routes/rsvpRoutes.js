const express = require('express');
const router = express.Router();
const rsvpController = require('../controllers/rsvpController');

router.post('/', rsvpController.createRsvp);
router.get('/:eventId', rsvpController.getRsvpsByEventId);
router.get('/:eventId/count', rsvpController.getRsvpCountByEventId);

module.exports = router;
