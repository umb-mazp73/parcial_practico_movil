import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArticulo } from '../../../hooks/useArticulos';
import { AppCard } from '../../../components/ui/AppCard';
import { SkeletonLoader } from '../../../components/ui/SkeletonLoader';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function DetalleArticuloScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: articulo, isLoading } = useArticulo(id);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 p-4 gap-3">
        <SkeletonLoader height={100} borderRadius={16} />
        <SkeletonLoader height={200} borderRadius={16} />
      </View>
    );
  }

  if (!articulo) return null;

  const stockColor = articulo.stock > 10 ? '#10b981' : articulo.stock > 0 ? '#f59e0b' : '#ef4444';

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <AppCard>
        <View className="items-center py-4">
          <View className="w-20 h-20 bg-purple-100 rounded-2xl items-center justify-center mb-3">
            <Ionicons name="cube-outline" size={40} color="#7c3aed" />
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">{articulo.nombre}</Text>
          {articulo.descripcion ? (
            <Text className="text-gray-500 text-sm mt-1 text-center px-4">{articulo.descripcion}</Text>
          ) : null}
        </View>
      </AppCard>

      <View className="flex-row gap-3">
        <AppCard className="flex-1 items-center">
          <Text className="text-xs text-gray-400 mb-1">Precio</Text>
          <Text className="text-lg font-bold text-blue-600">{formatCurrency(articulo.precio)}</Text>
        </AppCard>
        <AppCard className="flex-1 items-center">
          <Text className="text-xs text-gray-400 mb-1">Stock</Text>
          <Text className="text-lg font-bold" style={{ color: stockColor }}>{articulo.stock} uds</Text>
        </AppCard>
      </View>

      <AppCard>
        <Text className="text-xs text-gray-400 mb-1">Registrado</Text>
        <Text className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDate(articulo.created_at)}</Text>
      </AppCard>

      <TouchableOpacity
        onPress={() => router.push(`/articulos/editar/${articulo.id}`)}
        className="bg-blue-600 rounded-xl py-3.5 items-center"
      >
        <Text className="text-white font-semibold text-base">Editar Artículo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
