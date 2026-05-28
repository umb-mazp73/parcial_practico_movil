import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFacturas, useDeleteFactura } from '../../../hooks/useFacturas';
import { SearchBar } from '../../../components/ui/SearchBar';
import { EmptyState } from '../../../components/ui/EmptyState';
import { SkeletonCard } from '../../../components/ui/SkeletonLoader';
import { FAB } from '../../../components/ui/FAB';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { EstadoBadge } from '../../../components/ui/EstadoBadge';
import { Factura } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export default function FacturasScreen() {
  const router = useRouter();
  const { data: facturas = [], isLoading, refetch } = useFacturas();
  const deleteMutation = useDeleteFactura();

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Factura | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return facturas;
    const q = search.toLowerCase();
    return facturas.filter((f) => {
      const cliente = f.clientes as any;
      return (
        f.id.includes(q) ||
        (cliente?.nombre ?? '').toLowerCase().includes(q) ||
        (cliente?.apellido ?? '').toLowerCase().includes(q)
      );
    });
  }, [facturas, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      Alert.alert('Error', 'No se pudo eliminar la factura');
    }
  };

  const renderItem = ({ item }: { item: Factura }) => {
    const cliente = item.clientes as any;
    return (
      <TouchableOpacity
        onPress={() => router.push(`/facturas/${item.id}`)}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-100 dark:border-gray-700 active:opacity-80"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
      >
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <Text className="font-semibold text-gray-900 dark:text-white">
              {cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente'}
            </Text>
            <Text className="text-xs text-gray-400 mt-0.5">{formatDate(item.fecha)}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <EstadoBadge estado={item.estado} />
            <TouchableOpacity
              onPress={() => setDeleteTarget(item)}
              className="w-8 h-8 bg-red-50 rounded-xl items-center justify-center"
            >
              <Ionicons name="trash-outline" size={14} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-px bg-gray-50 dark:bg-gray-700 my-2" />

        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs text-gray-400">Subtotal</Text>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatCurrency(item.subtotal)}</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-400">Impuesto (19%)</Text>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatCurrency(item.impuesto)}</Text>
          </View>
          <View>
            <Text className="text-xs text-gray-400">Total</Text>
            <Text className="text-base font-bold text-blue-600">{formatCurrency(item.total)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-4 pt-4 pb-2">
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar facturas..." />
      </View>

      {isLoading ? (
        <View className="px-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title="Sin facturas"
              subtitle={search ? 'No hay resultados' : 'Crea tu primera factura'}
            />
          }
        />
      )}

      <FAB onPress={() => router.push('/facturas/crear')} />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Eliminar factura"
        message="¿Eliminar esta factura? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Eliminar"
      />
    </View>
  );
}
