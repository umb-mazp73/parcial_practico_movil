import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCliente } from '../../hooks/useClientes';
import { AppCard } from '../../components/ui/AppCard';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { formatDate } from '../../utils/formatters';

export default function DetalleClienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: cliente, isLoading } = useCliente(id);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 p-4 gap-3">
        <SkeletonLoader height={100} borderRadius={16} />
        <SkeletonLoader height={150} borderRadius={16} />
      </View>
    );
  }

  if (!cliente) return null;

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <AppCard>
        <View className="items-center py-4">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
            <Text className="text-blue-600 font-bold text-2xl">
              {cliente.nombre[0]}{cliente.apellido[0]}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            {cliente.nombre} {cliente.apellido}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">{cliente.correo}</Text>
        </View>
      </AppCard>

      <AppCard>
        <Text className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Información</Text>
        <InfoRow icon="mail-outline" label="Correo" value={cliente.correo} />
        <InfoRow icon="call-outline" label="Teléfono" value={cliente.telefono ?? '—'} />
        <InfoRow icon="location-outline" label="Dirección" value={cliente.direccion ?? '—'} />
        <InfoRow icon="calendar-outline" label="Registrado" value={formatDate(cliente.created_at)} />
      </AppCard>

      <TouchableOpacity
        onPress={() => router.push(`/clientes/editar/${cliente.id}`)}
        className="bg-blue-600 rounded-xl py-3.5 items-center"
      >
        <Text className="text-white font-semibold text-base">Editar Cliente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View className="flex-row items-center py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <View className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg items-center justify-center mr-3">
        <Ionicons name={icon} size={16} color="#6b7280" />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-gray-400">{label}</Text>
        <Text className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</Text>
      </View>
    </View>
  );
}
