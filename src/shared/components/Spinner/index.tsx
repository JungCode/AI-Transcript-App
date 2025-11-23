import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

interface ISpinner
  extends Omit<React.ComponentProps<typeof EvilIcons>, 'name'> {}

const Spinner = (props: ISpinner) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // tốc độ xoay
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <EvilIcons {...props} name="spinner-3" />
    </Animated.View>
  );
};

export { Spinner };
