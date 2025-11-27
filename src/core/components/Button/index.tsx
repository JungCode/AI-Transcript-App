import type {
  ActivityIndicatorProps,
  TouchableOpacityProps,
} from 'react-native';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface IButton extends TouchableOpacityProps {
  type?: 'primary' | 'ghost';
  isLoading?: boolean;
  textClassName?: string;
  loadingIconProps?: ActivityIndicatorProps;
  numberOfLines?: number;
}

const buttonVariants: Record<NonNullable<IButton['type']>, string> = {
  primary:
    'bg-mirai-greenDark items-center py-3 rounded-xl flex-row justify-center gap-1',
  ghost: 'bg-transparent items-center flex-row justify-center gap-1',
  // add other types later
  // secondary: "...",
  // outline: "...",
  // danger: "...",
};

const Button = ({
  type = 'primary',
  children,
  className,
  textClassName,
  isLoading,
  loadingIconProps,
  numberOfLines,
  ...rest
}: IButton) => {
  const baseClass = buttonVariants[type];

  return (
    <TouchableOpacity
      {...rest}
      className={`${baseClass} ${className ?? ''} ${isLoading ? 'opacity-70' : ''}`}
      disabled={isLoading}
    >
      {isLoading && <ActivityIndicator color="white" {...loadingIconProps} />}
      <Text
        numberOfLines={numberOfLines}
        className={`text-primary font-bold text-lg font-nunito ${textClassName}`}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export { Button };
