import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<Props> = ({
  icon = 'folder-open-outline',
  title,
  subtitle,
}) => {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-4">
        <Ionicons name={icon} size={40} color="#3b82f6" />
      </View>
      <Text className="text-lg font-semibold text-gray-700 mb-1">{title}</Text>
      {subtitle ? <Text className="text-sm text-gray-400 text-center px-8">{subtitle}</Text> : null}
    </View>
  );
};
