import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="divisions/[animalId]" />
        <Stack.Screen name="subdivisions/[animalId]/[divisionId]" />
        <Stack.Screen name="exam-new/[animalId]/[divisionId]/[subdivisionId]" />
        <Stack.Screen name="regions/[animalId]" />
        <Stack.Screen name="exam/[animalId]/[regionId]" />
      </Stack>
    </>
  );
}
