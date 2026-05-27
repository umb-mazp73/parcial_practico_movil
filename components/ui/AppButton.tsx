import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-blue-600 active:bg-blue-700',
  secondary: 'bg-gray-200 active:bg-gray-300',
  danger: 'bg-red-500 active:bg-red-600',
  success: 'bg-emerald-500 active:bg-emerald-600',
};

const textClasses = {
  primary: 'text-white',
  secondary: 'text-gray-800',
  danger: 'text-white',
  success: 'text-white',
};

export const AppButton: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        px-6 py-3.5 rounded-xl flex-row items-center justify-center
        ${disabled || loading ? 'opacity-50' : ''}
      `}
    >
      {loading && <ActivityIndicator size="small" color="#fff" className="mr-2" />}
      <Text className={`font-semibold text-base ${textClasses[variant]}`}>{title}</Text>
    </TouchableOpacity>
  );
};
