import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useArticulos, useDeleteArticulo } from '../../../hooks/useArticulos';
import { SearchBar } from '../../../components/ui/SearchBar';
import { EmptyState } from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/SkeletonLoader';
import { FAB } from '../../../components/ui/FAB';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { Articulo } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';

export default function ArticulosScreen() {
  const router = useRouter();
  const { data: articulos = [], isLoading, refetch } = useArticulos();
  const deleteMutation = useDeleteArticulo();

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Articulo | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return articulos;
    const q = search.toLowerCase();
    return articulos.filter(
      (a) => a.nombre.toLowerCase().includes(q) || (a.descripcion ?? '').toLowerCase().includes(q)
    );
  }, [articulos, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el artículo');
    }
  };

  const renderItem = ({ item }: { item: Articulo }) => (
    <TouchableOpacity
      onPress={() => router.push(`/articulos/${item.id}`)}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-100 dark:border-gray-700 active:opacity-80"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-11 h-11 bg-purple-100 rounded-xl items-center justify-center mr-3">
            <Ionicons name="cube-outline" size={22} color="#7c3aed" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-gray-900 dark:text-white text-base">{item.nombre}</Text>
            {item.descripcion ? (
              <Text className="text-gray-500 text-sm" numberOfLines={1}>{item.descripcion}</Text>
            ) : null}
            <View className="flex-row items-center gap-3 mt-1">
              <Text className="text-blue-600 font-bold text-sm">{formatCurrency(item.precio)}</Text>
              <View className={`px-2 py-0.5 rounded-full ${item.stock > 10 ? 'bg-emerald-100' : item.stock > 0 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <Text className={`text-xs font-medium ${item.stock > 10 ? 'text-emerald-700' : item.stock > 0 ? 'text-yellow-700' : 'text-red-700'}`}>
                  Stock: {item.stock}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-row gap-1">
          <TouchableOpacity
            onPress={() => router.push(`/articulos/editar/${item.id}`)}
            className="w-9 h-9 bg-blue-50 rounded-xl items-center justify-center"
          >
            <Ionicons name="pencil-outline" size={16} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteTarget(item)}
            className="w-9 h-9 bg-red-50 rounded-xl items-center justify-center"
          >
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-4 pt-4 pb-2">
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar artículos..." />
      </View>

      {isLoading ? (
        <View className="px-4">{[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}</View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="cube-outline"
              title="Sin artículos"
              subtitle={search ? 'No hay resultados' : 'Agrega tu primer artículo'}
            />
          }
        />
      )}

      <FAB onPress={() => router.push('/articulos/crear')} />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Eliminar artículo"
        message={`¿Eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Eliminar"
      />
    </View>
  );
}
