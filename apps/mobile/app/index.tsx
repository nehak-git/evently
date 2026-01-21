import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import useSWR, { mutate } from 'swr';
import * as React from 'react';
import { ScrollView, View, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { api, type Event } from '@/lib/api';

const SCREEN_OPTIONS = {
  title: 'Evently',
  headerRight: () => <ThemeToggle />,
};

const INDIA_CENTER = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 15,
  longitudeDelta: 15,
};

export default function Screen() {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [latitude, setLatitude] = React.useState('');

  const { data: events, error, isLoading } = useSWR<Event[]>('/events', () => api.getEvents());

  const handleSubmit = async () => {
    try {
      await api.createEvent({
        title,
        date: new Date(date).toISOString(),
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      });
      mutate('/events');
      setTitle('');
      setDate('');
      setLongitude('');
      setLatitude('');
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView className="flex-1 bg-background">
        <View className="h-64">
          <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            style={{ flex: 1 }}
            initialRegion={INDIA_CENTER}>
            {events?.map((event) => (
              <Marker
                key={event._id}
                coordinate={{
                  latitude: event.location.coordinates[1],
                  longitude: event.location.coordinates[0],
                }}
                title={event.title}
                description={new Date(event.date).toLocaleString()}
              />
            ))}
          </MapView>
        </View>

        <View className="gap-4 p-4">
          <Text className="text-2xl font-bold">Create Event</Text>

          <View className="gap-2">
            <Text className="text-sm font-medium">Title</Text>
            <Input
              placeholder="Event title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium">Date</Text>
            <Input
              placeholder="2024-01-21T12:00:00Z"
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium">Longitude</Text>
            <Input
              placeholder="-122.4194"
              value={longitude}
              onChangeText={setLongitude}
              keyboardType="decimal-pad"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium">Latitude</Text>
            <Input
              placeholder="37.7749"
              value={latitude}
              onChangeText={setLatitude}
              keyboardType="decimal-pad"
            />
          </View>

          <Button onPress={handleSubmit} className="mt-2">
            <Text>Create Event</Text>
          </Button>

          <View className="h-4" />

          <Text className="text-xl font-bold">Events</Text>

          {isLoading ? (
            <Text className="text-muted-foreground">Loading...</Text>
          ) : error ? (
            <Text className="text-red-500">Failed to load events</Text>
          ) : events && events.length > 0 ? (
            events.map((event) => (
              <View key={event._id} className="rounded-lg border border-border bg-card p-4">
                <Text className="text-lg font-semibold">{event.title}</Text>
                <Text className="text-sm text-muted-foreground">
                  {new Date(event.date).toLocaleString()}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Lat: {event.location.coordinates[1]}, Lon: {event.location.coordinates[0]}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-muted-foreground">No events yet</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

function ThemeToggle() {
  const toggleTheme = () => {
    // Placeholder for theme toggle
  };

  return (
    <Button onPressIn={toggleTheme} size="icon" variant="ghost" className="ios:size-9 web:mx-4 rounded-full">
      <Text>🌓</Text>
    </Button>
  );
}
