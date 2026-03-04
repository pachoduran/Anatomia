import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';

interface Props {
  source: any;
  style?: any;
  children?: React.ReactNode;
}

export function ZoomableImage({ source, style, children }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const baseScale = useRef(1);
  const lastScale = useRef(1);

  const onPinch = Animated.event([{ nativeEvent: { scale } }], { useNativeDriver: true });

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      lastScale.current = Math.min(Math.max(lastScale.current, 1), 4);
      baseScale.current = lastScale.current;
      if (lastScale.current <= 1.05) {
        lastScale.current = 1;
        baseScale.current = 1;
      }
      scale.setValue(lastScale.current);
    }
  };

  const animatedScale = scale.interpolate({
    inputRange: [0.5, 1, 4],
    outputRange: [Math.max(0.5 * baseScale.current, 1), baseScale.current, 4],
    extrapolate: 'clamp',
  });

  return (
    <GestureHandlerRootView style={zs.root}>
      <PinchGestureHandler onGestureEvent={onPinch} onHandlerStateChange={onPinchStateChange}>
        <Animated.View style={[zs.container, { transform: [{ scale: animatedScale }] }]}>
          <Image source={source} style={[zs.image, style]} contentFit="contain" />
          {children}
        </Animated.View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

const zs = StyleSheet.create({
  root: { overflow: 'hidden' },
  container: {},
  image: { width: '100%' },
});
