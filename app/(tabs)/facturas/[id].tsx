import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFactura, useUpdateEstadoFactura } from '../../../hooks/useFacturas';
import { AppCard } from '../../../components/ui/AppCard';
import { EstadoBadge } from '../../../components/ui/EstadoBadge';
import { SkeletonLoader } from '../../../components/ui/SkeletonLoader';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { DetalleFactura, EstadoFactura } from '../../../types';

const ESTADOS: EstadoFactura[] = ['PENDIENTE', 'PAGADA', 'CANCELADA'];

export default function DetalleFacturaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: factura, isLoading } = useFactura(id);
  const updateEstado = useUpdateEstadoFactura();
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 p-4 gap-3">
        <SkeletonLoader height={80} borderRadius={16} />
        <SkeletonLoader height={200} borderRadius={16} />
        <SkeletonLoader height={120} borderRadius={16} />
      </View>
    );
  }

  if (!factura) return null;

  const cliente = factura.clientes as any;
  const detalles = (factura.detalle_factura ?? []) as DetalleFactura[];

  const handleChangeEstado = async (estado: EstadoFactura) => {
    try {
      await updateEstado.mutateAsync({ id, estado });
      setShowEstadoModal(false);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ padding: 16, gap: 12 }}>
      {/* Header */}
      <AppCard>
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-xs text-gray-400 mb-1">Cliente</Text>
            {cliente ? (
              <>
                <Text className="font-bold text-gray-900 dark:text-white text-base">
                  {cliente.nombre} {cliente.apellido}
                </Text>
                <Text className="text-sm text-gray-500">{cliente.correo}</Text>
              </>
            ) : null}
          </View>
          <TouchableOpacity onPress={() => setShowEstadoModal(true)}>
            <EstadoBadge estado={factura.estado} />
          </TouchableOpacity>
        </View>
        <View className="h-px bg-gray-100 dark:bg-gray-700 my-3" />
        <Text className="text-xs text-gray-400">Fecha: {formatDate(factura.fecha)}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">ID: {factura.id.slice(0, 8).toUpperCase()}</Text>
      </AppCard>

      {/* Detalle de artículos */}
      <Text className="font-semibold text-gray-700 dark:text-gray-300 px-1">Artículos ({detalles.length})</Text>
      {detalles.map((item) => {
        const art = item.articulos as any;
        return (
          <AppCard key={item.id}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-white">{art?.nombre ?? 'Artículo'}</Text>
                <Text className="text-sm text-gray-500">
                  {item.cantidad} × {formatCurrency(item.precio_unitario)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="font-bold text-blue-600">{formatCurrency(item.total)}</Text>
                <Text className="text-xs text-gray-400">imp: {formatCurrency(item.impuesto)}</Text>
              </View>
            </View>
          </AppCard>
        );
      })}

      {/* Totales */}
      <AppCard>
        <Text className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Resumen</Text>
        <TRow label="Subtotal" value={formatCurrency(factura.subtotal)} />
        <TRow label="Impuesto (19%)" value={formatCurrency(factura.impuesto)} />
        <View className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
        <TRow label="Total" value={formatCurrency(factura.total)} bold />
      </AppCard>

      {/* Modal estado */}
      <Modal visible={showEstadoModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full">
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cambiar Estado</Text>
            {ESTADOS.map((estado) => (
              <TouchableOpacity
                key={estado}
                onPress={() => handleChangeEstado(estado)}
                className={`p-4 rounded-xl mb-2 ${factura.estado === estado ? 'bg-blue-50 border border-blue-300' : 'bg-gray-50'}`}
              >
                <Text className={`font-semibold ${factura.estado === estado ? 'text-blue-700' : 'text-gray-800'}`}>{estado}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowEstadoModal(false)} className="mt-2 py-3 items-center">
              <Text className="text-gray-500 font-medium">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function TRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View className="flex-row justify-between items-center py-1.5">
      <Text className={`text-sm ${bold ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{label}</Text>
      <Text className={`text-sm ${bold ? 'font-bold text-blue-600 text-base' : 'text-gray-800 dark:text-gray-200'}`}>{value}</Text>
    </View>
  );
}
