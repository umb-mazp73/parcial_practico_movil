import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDashboardStats, useUltimasFacturas } from '../../hooks/useFacturas';
import { StatCard } from '../../components/ui/StatCard';
import { EstadoBadge } from '../../components/ui/EstadoBadge';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { AppCard } from '../../components/ui/AppCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Factura } from '../../types';

export default function DashboardScreen() {
  const router = useRouter();
  const { data: stats, isLoading: loadingStats, refetch: refetchStats } = useDashboardStats();
  const { data: ultimasFacturas = [], isLoading: loadingFacturas, refetch: refetchFacturas } = useUltimasFacturas();

  const onRefresh = () => {
    refetchStats();
    refetchFacturas();
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="bg-blue-700 px-5 pt-8 pb-10">
        <Text className="text-white text-sm font-medium opacity-80">Bienvenido</Text>
        <Text className="text-white text-2xl font-bold mt-1">Panel de Control</Text>
        <Text className="text-blue-200 text-sm mt-1">Sistema de Gestión de Facturas</Text>
      </View>

      <View className="px-4 -mt-5">
        {/* Stats cards */}
        {loadingStats ? (
          <View className="flex-row gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <View key={i} className="flex-1">
                <SkeletonLoader height={90} borderRadius={16} />
              </View>
            ))}
          </View>
        ) : (
          <>
            <View className="flex-row gap-2 mb-2">
              <StatCard
                title="Clientes"
                value={stats?.totalClientes ?? 0}
                icon="people-outline"
                color="#3b82f6"
                bgColor="#eff6ff"
              />
              <StatCard
                title="Artículos"
                value={stats?.totalArticulos ?? 0}
                icon="cube-outline"
                color="#7c3aed"
                bgColor="#f5f3ff"
              />
            </View>
            <View className="flex-row gap-2 mb-4">
              <StatCard
                title="Facturas"
                value={stats?.totalFacturas ?? 0}
                icon="receipt-outline"
                color="#f59e0b"
                bgColor="#fffbeb"
              />
              <StatCard
                title="Ingresos"
                value={formatCurrency(stats?.totalIngresos ?? 0)}
                icon="cash-outline"
                color="#10b981"
                bgColor="#ecfdf5"
              />
            </View>
          </>
        )}

        {/* Accesos rápidos */}
        <AppCard className="mb-4">
          <Text className="font-bold text-gray-900 dark:text-white mb-3">Acciones Rápidas</Text>
          <View className="flex-row flex-wrap gap-3">
            <QuickAction
              label="Nuevo Cliente"
              icon="person-add-outline"
              color="#3b82f6"
              onPress={() => router.push('/clientes/crear')}
            />
            <QuickAction
              label="Nuevo Artículo"
              icon="add-circle-outline"
              color="#7c3aed"
              onPress={() => router.push('/articulos/crear')}
            />
            <QuickAction
              label="Nueva Factura"
              icon="document-text-outline"
              color="#f59e0b"
              onPress={() => router.push('/facturas/crear')}
            />
          </View>
        </AppCard>

        {/* Últimas facturas */}
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-bold text-gray-900 dark:text-white text-base">Últimas Facturas</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/facturas')}>
            <Text className="text-blue-600 text-sm font-medium">Ver todas</Text>
          </TouchableOpacity>
        </View>

        {loadingFacturas ? (
          [...Array(3)].map((_, i) => <SkeletonLoader key={i} height={70} borderRadius={16} className="mb-3" />)
        ) : ultimasFacturas.length === 0 ? (
          <AppCard className="items-center py-8 mb-4">
            <Ionicons name="receipt-outline" size={32} color="#d1d5db" />
            <Text className="text-gray-400 mt-2">Sin facturas recientes</Text>
          </AppCard>
        ) : (
          ultimasFacturas.map((factura: Factura) => {
            const cliente = factura.clientes as any;
            return (
              <TouchableOpacity
                key={factura.id}
                onPress={() => router.push(`/facturas/${factura.id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl p-3.5 mb-2.5 border border-gray-100 dark:border-gray-700 flex-row items-center justify-between active:opacity-80"
              >
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 dark:text-white text-sm">
                    {cliente ? `${cliente.nombre} ${cliente.apellido}` : '—'}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-0.5">{formatDate(factura.fecha)}</Text>
                </View>
                <View className="items-end gap-1">
                  <EstadoBadge estado={factura.estado} />
                  <Text className="font-bold text-blue-600 text-sm">{formatCurrency(factura.total)}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View className="h-6" />
      </View>
    </ScrollView>
  );
}

function QuickAction({
  label,
  icon,
  color,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-gray-50 dark:bg-gray-700 px-4 py-2.5 rounded-xl"
    >
      <Ionicons name={icon} size={18} color={color} />
      <Text className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
    </TouchableOpacity>
  );
}
