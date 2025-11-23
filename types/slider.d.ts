declare module '@react-native-community/slider' {
  import { Component } from 'react';
  import type { StyleProp, ViewStyle } from 'react-native';

  export interface SliderProps {
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    maximumValue?: number;
    minimumTrackTintColor?: string;
    minimumValue?: number;
    onSlidingComplete?: (value: number) => void;
    onValueChange?: (value: number) => void;
    step?: number;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
    value?: number;
  }

  export default class Slider extends Component<SliderProps> {}
}
