import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { Text, TextInput } from 'react-native';

interface ComponentWithRender {
  render: (...args: unknown[]) => React.ReactElement;
}

type ElementWithStyleProps = React.ReactElement<{
  style?: StyleProp<TextStyle>;
}>;

export function applyGlobalFont() {
  const TextRender = (Text as unknown as ComponentWithRender).render;
  (Text as unknown as ComponentWithRender).render = function (
    ...args: unknown[]
  ): ElementWithStyleProps {
    const origin = TextRender.apply(this, args) as ElementWithStyleProps;
    return React.cloneElement(origin, {
      style: [{ fontFamily: 'Nunito' }, origin.props.style],
    } as Partial<{ style: StyleProp<TextStyle> }>);
  };

  const InputRender = (TextInput as unknown as ComponentWithRender).render;
  (TextInput as unknown as ComponentWithRender).render = function (
    ...args: unknown[]
  ): ElementWithStyleProps {
    const origin = InputRender.apply(this, args) as ElementWithStyleProps;
    return React.cloneElement(origin, {
      style: [{ fontFamily: 'Nunito' }, origin.props.style],
    } as Partial<{ style: StyleProp<TextStyle> }>);
  };
}
