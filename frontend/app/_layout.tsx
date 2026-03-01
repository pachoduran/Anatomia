import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="divisions/[animalId]" />
        <Stack.Screen name="subdivisions/[animalId]/[divisionId]" />
        <Stack.Screen name="exam-new/[animalId]/[divisionId]/[regionId]" />
        <Stack.Screen name="study/[animalId]/[divisionId]/[regionId]" />
        <Stack.Screen name="views/[animalId]/[divisionId]/[regionId]" />
        <Stack.Screen name="study-view/[animalId]/[divisionId]/[regionId]/[viewId]" />
        <Stack.Screen name="exam-view/[animalId]/[divisionId]/[regionId]/[viewId]" />
      </Stack>
    </SafeAreaProvider>
  );
}
