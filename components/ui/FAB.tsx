import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const FAB: React.FC<Props> = ({ onPress, icon = 'add' }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg active:bg-blue-700"
      style={{
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Ionicons name={icon} size={28} color="#fff" />
    </TouchableOpacity>
  );
};
