import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';

export default function ConfiguracionScreen() {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Apariencia</Text>

      <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-4">
        <View className="flex-row items-center px-4 py-3.5 justify-between">
          <View className="flex-row items-center">
            <View className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl items-center justify-center mr-3">
              <Ionicons name={isDark ? 'moon' : 'sunny-outline'} size={18} color={isDark ? '#a78bfa' : '#f59e0b'} />
            </View>
            <Text className="font-medium text-gray-800 dark:text-white">Modo Oscuro</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
            thumbColor={isDark ? '#fff' : '#fff'}
          />
        </View>
      </View>

      <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Información</Text>

      <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-4">
        <InfoItem icon="information-circle-outline" label="Versión" value="1.0.0" />
        <InfoItem icon="code-slash-outline" label="Stack" value="React Native + Expo" />
        <InfoItem icon="server-outline" label="Backend" value="Supabase" />
      </View>

      <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Base de Datos</Text>

      <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <InfoItem icon="people-outline" label="Módulo" value="Clientes" />
        <InfoItem icon="cube-outline" label="Módulo" value="Artículos" />
        <InfoItem icon="receipt-outline" label="Módulo" value="Facturas" />
        <InfoItem icon="list-outline" label="Módulo" value="Detalle Factura" />
      </View>

      <View className="mt-8 items-center">
        <Text className="text-xs text-gray-300">Sistema de Gestión de Facturas v1.0</Text>
        <Text className="text-xs text-gray-300 mt-1">Desarrollado con React Native + Expo</Text>
      </View>
    </ScrollView>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center px-4 py-3.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <View className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl items-center justify-center mr-3">
        <Ionicons name={icon} size={16} color="#6b7280" />
      </View>
      <Text className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      <Text className="text-sm text-gray-400">{value}</Text>
    </View>
  );
}
