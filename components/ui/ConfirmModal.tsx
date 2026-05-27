import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
}

export const ConfirmModal: React.FC<Props> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  confirmVariant = 'danger',
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
          <View className="items-center mb-4">
            <View className="w-14 h-14 bg-red-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="warning-outline" size={28} color="#ef4444" />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white text-center">{title}</Text>
            <Text className="text-sm text-gray-500 text-center mt-1">{message}</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 py-3 bg-gray-100 rounded-xl items-center"
            >
              <Text className="font-semibold text-gray-700">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 py-3 rounded-xl items-center ${confirmVariant === 'danger' ? 'bg-red-500' : 'bg-blue-600'}`}
            >
              <Text className="font-semibold text-white">{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
