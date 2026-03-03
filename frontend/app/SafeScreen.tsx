import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SafeScreen({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {
      paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 48 : 0),
      paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 24 : 0),
      paddingLeft: Math.max(insets.left, 0),
      paddingRight: Math.max(insets.right, 0),
    }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
});
