import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChartData, useDashboardStats } from '../../hooks/useFacturas';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { AppCard } from '../../components/ui/AppCard';
import { formatCurrency } from '../../utils/formatters';

const CHART_HEIGHT = 130;

function abreviar(valor: number): string {
  if (valor >= 1_000_000) return `${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `${(valor / 1_000).toFixed(0)}K`;
  return `${valor}`;
}

export default function GraficasScreen() {
  const { data, isLoading, refetch } = useChartData();
  const { data: stats, refetch: refetchStats } = useDashboardStats();

  const onRefresh = () => {
    refetch();
    refetchStats();
  };

  const porEstado = data?.porEstado ?? { PAGADA: 0, PENDIENTE: 0, CANCELADA: 0 };
  const ingresosMensuales = data?.ingresosMensuales ?? Array.from({ length: 6 }, (_, i) => ({ label: '', total: 0 }));
  const totalFacturas = porEstado.PAGADA + porEstado.PENDIENTE + porEstado.CANCELADA;
  const maxIngreso = Math.max(...ingresosMensuales.map((m) => m.total), 1);

  const estadoItems = [
    { label: 'Pagadas', value: porEstado.PAGADA, color: '#10b981' },
    { label: 'Pendientes', value: porEstado.PENDIENTE, color: '#f59e0b' },
    { label: 'Canceladas', value: porEstado.CANCELADA, color: '#ef4444' },
  ];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="bg-blue-700 px-5 pt-8 pb-10">
        <Text className="text-white text-sm font-medium opacity-80">Analítica</Text>
        <Text className="text-white text-2xl font-bold mt-1">Gráficas</Text>
        <Text className="text-blue-200 text-sm mt-1">Resumen visual del negocio</Text>
      </View>

      <View className="px-4 -mt-5">

        {/* Distribución por estado */}
        <AppCard className="mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-3">
              <Ionicons name="pie-chart-outline" size={18} color="#3b82f6" />
            </View>
            <View>
              <Text className="font-bold text-gray-900 text-base">Estado de Facturas</Text>
              <Text className="text-xs text-gray-400">{totalFacturas} facturas en total</Text>
            </View>
          </View>

          {isLoading ? (
            <SkeletonLoader height={80} borderRadius={8} />
          ) : totalFacturas === 0 ? (
            <View className="items-center py-6">
              <Ionicons name="receipt-outline" size={28} color="#d1d5db" />
              <Text className="text-gray-400 text-sm mt-2">Sin datos disponibles</Text>
            </View>
          ) : (
            <>
              {estadoItems.map((item) => {
                const pct = totalFacturas > 0 ? (item.value / totalFacturas) * 100 : 0;
                return (
                  <View key={item.label} className="mb-3">
                    <View className="flex-row justify-between mb-1.5">
                      <View className="flex-row items-center">
                        <View
                          style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 6 }}
                        />
                        <Text className="text-sm text-gray-600">{item.label}</Text>
                      </View>
                      <Text className="text-sm font-semibold text-gray-800">
                        {item.value} · {pct.toFixed(0)}%
                      </Text>
                    </View>
                    <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <View
                        style={{
                          width: `${Math.max(pct, item.value > 0 ? 2 : 0)}%`,
                          height: 10,
                          backgroundColor: item.color,
                          borderRadius: 5,
                        }}
                      />
                    </View>
                  </View>
                );
              })}

              {/* Leyenda de colores */}
              <View className="flex-row justify-around mt-2 pt-3 border-t border-gray-100">
                {estadoItems.map((item) => (
                  <View key={item.label} className="flex-row items-center">
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color, marginRight: 4 }} />
                    <Text className="text-xs text-gray-400">{item.label}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </AppCard>

        {/* Ingresos mensuales */}
        <AppCard className="mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center mr-3">
              <Ionicons name="bar-chart-outline" size={18} color="#10b981" />
            </View>
            <View>
              <Text className="font-bold text-gray-900 text-base">Ingresos Mensuales</Text>
              <Text className="text-xs text-gray-400">Últimos 6 meses · solo facturas pagadas</Text>
            </View>
          </View>

          {isLoading ? (
            <SkeletonLoader height={160} borderRadius={8} />
          ) : (
            <View>
              <View className="flex-row items-end justify-between" style={{ height: CHART_HEIGHT }}>
                {ingresosMensuales.map((mes, i) => {
                  const barH = mes.total > 0 ? Math.max((mes.total / maxIngreso) * (CHART_HEIGHT - 24), 6) : 0;
                  const isMax = mes.total > 0 && mes.total === maxIngreso;
                  return (
                    <View key={i} className="flex-1 items-center justify-end">
                      {mes.total > 0 && (
                        <Text style={{ fontSize: 9, color: '#9ca3af', marginBottom: 3 }}>
                          {abreviar(mes.total)}
                        </Text>
                      )}
                      <View
                        style={{
                          height: barH > 0 ? barH : 4,
                          width: 28,
                          backgroundColor: isMax ? '#1d4ed8' : barH > 0 ? '#3b82f6' : '#e5e7eb',
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
              <View className="flex-row justify-between mt-2">
                {ingresosMensuales.map((mes, i) => (
                  <View key={i} className="flex-1 items-center">
                    <Text style={{ fontSize: 10, color: '#9ca3af' }} className="capitalize">
                      {mes.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </AppCard>

        {/* Resumen financiero */}
        <AppCard className="mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-purple-50 rounded-full items-center justify-center mr-3">
              <Ionicons name="stats-chart-outline" size={18} color="#7c3aed" />
            </View>
            <Text className="font-bold text-gray-900 text-base">Resumen Financiero</Text>
          </View>

          {isLoading ? (
            <SkeletonLoader height={100} borderRadius={8} />
          ) : (
            <>
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-green-50 rounded-xl p-3">
                  <Text className="text-xs text-gray-500 mb-1">Ingresos reales</Text>
                  <Text className="font-bold text-green-700 text-sm" numberOfLines={1}>
                    {formatCurrency(stats?.totalIngresos ?? 0)}
                  </Text>
                </View>
                <View className="flex-1 bg-blue-50 rounded-xl p-3">
                  <Text className="text-xs text-gray-500 mb-1">Tasa de cobro</Text>
                  <Text className="font-bold text-blue-700 text-xl">
                    {totalFacturas > 0 ? `${((porEstado.PAGADA / totalFacturas) * 100).toFixed(0)}%` : '—'}
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-yellow-50 rounded-xl p-3">
                  <Text className="text-xs text-gray-500 mb-1">Por cobrar</Text>
                  <Text className="font-bold text-yellow-700 text-base">{porEstado.PENDIENTE} fact.</Text>
                </View>
                <View className="flex-1 bg-red-50 rounded-xl p-3">
                  <Text className="text-xs text-gray-500 mb-1">Canceladas</Text>
                  <Text className="font-bold text-red-600 text-base">{porEstado.CANCELADA} fact.</Text>
                </View>
              </View>
            </>
          )}
        </AppCard>

        <View className="h-6" />
      </View>
    </ScrollView>
  );
}
