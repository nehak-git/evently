import { Request, Response } from 'express';
import Event from '../models/Event.js';
import {
  createEventSchema,
  updateEventSchema,
  getEventsNearbySchema,
  CreateEventInput,
  UpdateEventInput,
} from '../schemas/eventSchema.js';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData: CreateEventInput = createEventSchema.parse(req.body);
    const event = await Event.create({
      ...validatedData,
      date: new Date(validatedData.date),
    });
    res.status(201).json(event);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData: UpdateEventInput = updateEventSchema.parse(req.body);

    const updateData: any = { ...validatedData };
    if (validatedData.date) {
      updateData.date = new Date(validatedData.date as unknown as string);
    }

    const event = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

export const getEventsNearby = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = getEventsNearbySchema.parse({
      longitude: Number(req.query.longitude),
      latitude: Number(req.query.latitude),
      maxDistance: req.query.maxDistance ? Number(req.query.maxDistance) : 10000,
    });

    const events = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [validatedData.longitude, validatedData.latitude],
          },
          $maxDistance: validatedData.maxDistance,
        },
      },
    }).sort({ date: 1 });

    res.status(200).json(events);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to fetch nearby events' });
  }
};
