import React, { useEffect, useRef, useState } from 'react';
import type { ViewStyle } from 'react-native';
import {
  Animated,
  Modal,
  PanResponder,
  TouchableOpacity,
  View,
} from 'react-native';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
  snapPoint?: number;
  containerStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  className?: string;
}

const BottomSheet = ({
  visible,
  onClose,
  children,
  height = 300,
  snapPoint = 100,
  containerStyle,
  overlayStyle,
  className,
}: BottomSheetProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useState(new Animated.Value(500))[0];
  const opacity = useState(new Animated.Value(0))[0];
  const prevVisibleRef = useRef(visible);

  const panResponder = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > snapPoint) {
          closeBottomSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  )[0];

  const openBottomSheet = () => {
    setModalVisible(true);
    translateY.setValue(500);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeBottomSheet = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 500,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  useEffect(() => {
    if (visible && !prevVisibleRef.current) {
      // Opening
      openBottomSheet();
    } else if (!visible && prevVisibleRef.current) {
      // Closing
      closeBottomSheet();
    }
    prevVisibleRef.current = visible;
  }, [visible]);

  if (!modalVisible) return null;

  return (
    <Modal
      visible={modalVisible}
      animationType="none"
      transparent
      onRequestClose={closeBottomSheet}
      statusBarTranslucent
    >
      <View className="flex-1">
        <Animated.View
          style={[
            {
              opacity,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            overlayStyle,
          ]}
          className="absolute inset-0"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeBottomSheet}
            className="flex-1"
          />
        </Animated.View>

        <View className="flex-1 justify-end" pointerEvents="box-none">
          <Animated.View
            style={{ transform: [{ translateY }] }}
            {...panResponder.panHandlers}
          >
            <View
              style={[{ minHeight: height }, containerStyle]}
              className={className ?? 'bg-surface rounded-t-3xl'}
            >
              <View className="w-12 h-1 bg-gray-400 rounded-full self-center mb-4" />
              {children}
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export { BottomSheet };
