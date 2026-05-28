import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClientes, useDeleteCliente } from '../../../hooks/useClientes';
import { SearchBar } from '../../../components/ui/SearchBar';
import { EmptyState } from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/SkeletonLoader';
import { FAB } from '../../../components/ui/FAB';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { Cliente } from '../../../types';

export default function ClientesScreen() {
  const router = useRouter();
  const { data: clientes = [], isLoading, refetch } = useClientes();
  const deleteMutation = useDeleteCliente();

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return clientes;
    const q = search.toLowerCase();
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.apellido.toLowerCase().includes(q) ||
        c.correo.toLowerCase().includes(q)
    );
  }, [clientes, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el cliente');
    }
  };

  const renderItem = ({ item }: { item: Cliente }) => (
    <TouchableOpacity
      onPress={() => router.push(`/clientes/${item.id}`)}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-100 dark:border-gray-700 active:opacity-80"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-11 h-11 bg-blue-100 rounded-full items-center justify-center mr-3">
            <Text className="text-blue-600 font-bold text-base">
              {item.nombre[0]}{item.apellido[0]}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-gray-900 dark:text-white text-base">
              {item.nombre} {item.apellido}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm" numberOfLines={1}>
              {item.correo}
            </Text>
            {item.telefono ? (
              <Text className="text-gray-400 text-xs mt-0.5">{item.telefono}</Text>
            ) : null}
          </View>
        </View>
        <View className="flex-row gap-1">
          <TouchableOpacity
            onPress={() => router.push(`/clientes/editar/${item.id}`)}
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
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar clientes..." />
      </View>

      {isLoading ? (
        <View className="px-4">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title="Sin clientes"
              subtitle={search ? 'No hay resultados para tu búsqueda' : 'Agrega tu primer cliente'}
            />
          }
        />
      )}

      <FAB onPress={() => router.push('/clientes/crear')} />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Eliminar cliente"
        message={`¿Eliminar a ${deleteTarget?.nombre} ${deleteTarget?.apellido}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Eliminar"
      />
    </View>
  );
}
