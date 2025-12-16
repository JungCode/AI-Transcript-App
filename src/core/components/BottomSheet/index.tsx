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
  isHeightAuto?: boolean;
  containerStyle?: ViewStyle;
  overlayStyle?: ViewStyle;
  className?: string;
}

const BottomSheet = ({
  visible,
  onClose,
  children,
  height = 300,
  isHeightAuto = false,
  containerStyle,
  overlayStyle,
  className,
}: BottomSheetProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const translateY = useRef(new Animated.Value(500)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const isClosing = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0 && !isClosing.current) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isClosing.current) return;

        const shouldClose = gestureState.dy > 80 || gestureState.vy > 0.5;

        if (shouldClose) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            tension: 200,
            friction: 20,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleClose = () => {
    if (isClosing.current) return;
    isClosing.current = true;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 500,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      isClosing.current = false;
      onClose();
    });
  };

  const handleOpen = () => {
    setIsVisible(true);
    isClosing.current = false;
    translateY.setValue(500);
    opacity.setValue(0);

    requestAnimationFrame(() => {
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
    });
  };

  useEffect(() => {
    if (visible && !isVisible && !isClosing.current) {
      handleOpen();
    } else if (!visible && isVisible && !isClosing.current) {
      handleClose();
    }
  }, [visible]);

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="none"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1 }}>
        <Animated.View
          style={[
            {
              opacity,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
            overlayStyle,
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleClose}
            style={{ flex: 1 }}
          />
        </Animated.View>

        <View
          style={{ flex: 1, justifyContent: 'flex-end' }}
          pointerEvents="box-none"
        >
          <Animated.View style={{ transform: [{ translateY }] }}>
            <View
              style={[
                { minHeight: isHeightAuto ? undefined : height },
                containerStyle,
              ]}
              className={className ?? 'bg-surface rounded-t-3xl'}
            >
              {/* Drag Handle */}
              <View
                style={{
                  width: '100%',
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                {...panResponder.panHandlers}
              >
                <View
                  style={{
                    width: 48,
                    height: 4,
                    backgroundColor: '#9CA3AF',
                    borderRadius: 2,
                  }}
                />
              </View>

              {/* Content */}
              <View style={isHeightAuto ? {} : { flex: 1 }}>{children}</View>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export { BottomSheet };
