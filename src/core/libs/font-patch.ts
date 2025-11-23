import React from 'react';
import { Text, TextInput } from 'react-native';

export function applyGlobalFont() {
  const TextRender = (Text as any).render;
  (Text as any).render = function (...args: any[]) {
    const origin = TextRender.apply(this, args);
    return React.cloneElement(origin, {
      style: [{ fontFamily: 'Nunito' }, origin.props.style],
    });
  };

  const InputRender = (TextInput as any).render;
  (TextInput as any).render = function (...args: any[]) {
    const origin = InputRender.apply(this, args);
    return React.cloneElement(origin, {
      style: [{ fontFamily: 'Nunito' }, origin.props.style],
    });
  };
}
