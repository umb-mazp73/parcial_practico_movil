import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export const AppInput: React.FC<Props> = ({ label, error, ...rest }) => {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</Text>
      <TextInput
        className={`
          border rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          ${error ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'}
          focus:border-blue-500
        `}
        placeholderTextColor="#9ca3af"
        {...rest}
      />
      {error ? <Text className="text-red-500 text-xs mt-1">{error}</Text> : null}
    </View>
  );
};
