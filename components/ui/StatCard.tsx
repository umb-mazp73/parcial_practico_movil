import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  bgColor?: string;
}

export const StatCard: React.FC<Props> = ({
  title,
  value,
  icon,
  color = '#3b82f6',
  bgColor = '#eff6ff',
}) => {
  return (
    <View className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4 mx-1 shadow-sm border border-gray-100 dark:border-gray-700">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: bgColor }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-2xl font-bold text-gray-900 dark:text-white">{value}</Text>
      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{title}</Text>
    </View>
  );
};
