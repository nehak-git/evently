const API_BASE_URL = 'http://localhost:3000/api';

export interface Event {
  _id: string;
  title: string;
  date: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  date: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const fetcher = async (url: string) => {
  const response = await fetch(`${API_BASE_URL}${url}`);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export const api = {
  getEvents: (): Promise<Event[]> => fetcher('/events'),

  getEventById: (id: string): Promise<Event> => fetcher(`/events/${id}`),

  createEvent: async (data: CreateEventInput): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json();
  },

  updateEvent: async (id: string, data: Partial<CreateEventInput>): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    return response.json();
  },

  deleteEvent: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  },

  getEventsNearby: async (longitude: number, latitude: number, maxDistance?: number): Promise<Event[]> => {
    const params = new URLSearchParams({
      longitude: longitude.toString(),
      latitude: latitude.toString(),
    });
    if (maxDistance) {
      params.append('maxDistance', maxDistance.toString());
    }
    return fetcher(`/events/nearby?${params.toString()}`);
  },
};
