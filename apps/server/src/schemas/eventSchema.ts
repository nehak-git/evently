import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  date: z.string().datetime('Invalid date format'),
  location: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

export const updateEventSchema = createEventSchema.partial();

export const getEventsNearbySchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  maxDistance: z.number().optional().default(10000), // meters
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type GetEventsNearbyInput = z.infer<typeof getEventsNearbySchema>;
