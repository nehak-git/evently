import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsNearby,
} from '../controllers/eventController.js';

const router = Router();

router.post('/events', createEvent);
router.get('/events', getEvents);
router.get('/events/nearby', getEventsNearby);
router.get('/events/:id', getEventById);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;
