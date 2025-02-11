const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/locations', eventController.getUniqueLocations);
router.get('/stats', eventController.getEventStats);
router.get('/top5', eventController.getTop5Events);
router.get('/registration-stats', eventController.getEventRegistrationStats);
router.get('/registrations-by-venue', eventController.getRegistrationCountByVenue);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
