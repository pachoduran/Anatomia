import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, LayoutChangeEvent, Image as RNImage } from 'react-native';
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
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  // Get the actual image dimensions for accurate marker positioning
  const imageAspect = useMemo(() => {
    try {
      const resolved = RNImage.resolveAssetSource(source);
      if (resolved && resolved.width && resolved.height) {
        return resolved.width / resolved.height;
      }
    } catch {}
    return 1.5; // fallback
  }, [source]);

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

  // Calculate where the image is actually rendered (accounting for contentFit="contain" letterboxing)
  const markerOverlayStyle = useMemo(() => {
    if (layout.width === 0 || layout.height === 0) {
      return { position: 'absolute' as const, left: 0, top: 0, width: '100%' as const, height: '100%' as const };
    }
    const containerAspect = layout.width / layout.height;
    if (containerAspect > imageAspect) {
      // Container wider than image - letterboxed horizontally
      const renderedW = layout.height * imageAspect;
      return {
        position: 'absolute' as const,
        left: (layout.width - renderedW) / 2,
        top: 0,
        width: renderedW,
        height: layout.height,
      };
    } else {
      // Container taller than image - letterboxed vertically
      const renderedH = layout.width / imageAspect;
      return {
        position: 'absolute' as const,
        left: 0,
        top: (layout.height - renderedH) / 2,
        width: layout.width,
        height: renderedH,
      };
    }
  }, [layout.width, layout.height, imageAspect]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ width, height });
  };

  return (
    <GestureHandlerRootView style={zs.root}>
      <PinchGestureHandler onGestureEvent={onPinch} onHandlerStateChange={onPinchStateChange}>
        <Animated.View style={[zs.container, { transform: [{ scale: animatedScale }] }]}>
          <View style={[zs.imageWrapper, style]} onLayout={handleLayout}>
            <Image source={source} style={zs.image} contentFit="contain" />
            <View style={[markerOverlayStyle, { pointerEvents: 'box-none' }]}>
              {children}
            </View>
          </View>
        </Animated.View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}

const zs = StyleSheet.create({
  root: { overflow: 'hidden' },
  container: {},
  imageWrapper: { width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%' },
});
