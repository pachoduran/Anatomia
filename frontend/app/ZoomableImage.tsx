import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';

interface Props {
  source: any;
  style?: any;
  children?: React.ReactNode;
}

export function ZoomableImage({ source, style, children }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const baseScale = useRef(1);
  const baseX = useRef(0);
  const baseY = useRef(0);

  const onPinch = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const newScale = Math.min(Math.max(baseScale.current * event.nativeEvent.scale, 1), 5);
      setScale(newScale);
    }
  };

  const onPinchEnd = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      baseScale.current = scale;
      if (scale <= 1.05) {
        setScale(1);
        setTranslateX(0);
        setTranslateY(0);
        baseScale.current = 1;
        baseX.current = 0;
        baseY.current = 0;
      }
    }
  };

  const onPan = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE && scale > 1) {
      setTranslateX(baseX.current + event.nativeEvent.translationX);
      setTranslateY(baseY.current + event.nativeEvent.translationY);
    }
  };

  const onPanEnd = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      baseX.current = translateX;
      baseY.current = translateY;
    }
  };

  const resetZoom = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    baseScale.current = 1;
    baseX.current = 0;
    baseY.current = 0;
  };

  const zoomIn = () => {
    const ns = Math.min(scale + 0.5, 5);
    setScale(ns);
    baseScale.current = ns;
  };

  const zoomOut = () => {
    const ns = Math.max(scale - 0.5, 1);
    setScale(ns);
    baseScale.current = ns;
    if (ns <= 1) { resetZoom(); }
  };

  return (
    <View style={[zs.container, style]}>
      <View style={zs.relative}>
        <Image source={source} style={[zs.image, style]} contentFit="contain" />
        {children}
      </View>
      <TouchableOpacity style={zs.zoomBtn} onPress={() => setModalVisible(true)}>
        <Ionicons name="expand-outline" size={18} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" statusBarTranslucent>
        <View style={zs.modalBg}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler onGestureEvent={onPan} onHandlerStateChange={onPanEnd} minDist={10}>
              <View style={{ flex: 1 }}>
                <PinchGestureHandler onGestureEvent={onPinch} onHandlerStateChange={onPinchEnd}>
                  <View style={zs.modalContent}>
                    <Image
                      source={source}
                      style={[zs.modalImg, {
                        transform: [
                          { scale },
                          { translateX: translateX / scale },
                          { translateY: translateY / scale },
                        ]
                      }]}
                      contentFit="contain"
                    />
                  </View>
                </PinchGestureHandler>
              </View>
            </PanGestureHandler>
          </GestureHandlerRootView>

          <View style={zs.controls}>
            <TouchableOpacity style={zs.ctrlBtn} onPress={zoomOut}>
              <Ionicons name="remove" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={zs.ctrlBtn} onPress={resetZoom}>
              <Ionicons name="scan-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={zs.ctrlBtn} onPress={zoomIn}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={zs.closeBtn} onPress={() => { resetZoom(); setModalVisible(false); }}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const zs = StyleSheet.create({
  container: { position: 'relative' },
  relative: { position: 'relative' },
  image: { width: '100%' },
  zoomBtn: { position: 'absolute', top: 8, right: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 20 },
  modalBg: { flex: 1, backgroundColor: '#000' },
  modalContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalImg: { width: '100%', height: '100%' },
  controls: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  ctrlBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 },
  closeBtn: { position: 'absolute', top: 50, right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
});
