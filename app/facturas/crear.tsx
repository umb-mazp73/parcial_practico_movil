import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useClientes } from '../../hooks/useClientes';
import { useArticulos } from '../../hooks/useArticulos';
import { useCreateFactura } from '../../hooks/useFacturas';
import { useCartStore } from '../../store/useCartStore';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { formatCurrency } from '../../utils/formatters';
import { Articulo, Cliente } from '../../types';

export default function CrearFacturaScreen() {
  const router = useRouter();
  const { data: clientes = [] } = useClientes();
  const { data: articulos = [] } = useArticulos();
  const createFactura = useCreateFactura();

  const { clienteId, items, subtotal, impuesto, total, setClienteId, addItem, updateItem, removeItem, clearCart } = useCartStore();

  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showArticuloModal, setShowArticuloModal] = useState(false);
  const [cantidadMap, setCantidadMap] = useState<Record<string, string>>({});

  const clienteSeleccionado = clientes.find((c) => c.id === clienteId);

  const handleAddArticulo = (articulo: Articulo) => {
    const cant = parseInt(cantidadMap[articulo.id] ?? '1', 10);
    if (isNaN(cant) || cant <= 0) {
      Alert.alert('Error', 'La cantidad debe ser mayor a 0');
      return;
    }
    addItem(articulo, cant);
    setShowArticuloModal(false);
    setCantidadMap({});
  };

  const handleSubmit = async () => {
    if (!clienteId) {
      Alert.alert('Error', 'Selecciona un cliente');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Error', 'Agrega al menos un artículo');
      return;
    }
    try {
      await createFactura.mutateAsync({ clienteId, items });
      clearCart();
      Alert.alert('Éxito', 'Factura creada correctamente');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo crear la factura');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ padding: 16 }}>
      {/* Seleccionar cliente */}
      <Text className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Cliente *</Text>
      <TouchableOpacity
        onPress={() => setShowClienteModal(true)}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 mb-4 flex-row items-center justify-between"
      >
        {clienteSeleccionado ? (
          <View>
            <Text className="font-semibold text-gray-900 dark:text-white">
              {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
            </Text>
            <Text className="text-sm text-gray-500">{clienteSeleccionado.correo}</Text>
          </View>
        ) : (
          <Text className="text-gray-400">Seleccionar cliente...</Text>
        )}
        <Ionicons name="chevron-down" size={20} color="#9ca3af" />
      </TouchableOpacity>

      {/* Artículos del carrito */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-semibold text-gray-700 dark:text-gray-300">Artículos</Text>
        <TouchableOpacity
          onPress={() => setShowArticuloModal(true)}
          className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-lg"
        >
          <Ionicons name="add" size={16} color="#3b82f6" />
          <Text className="text-blue-600 text-sm font-medium ml-1">Agregar</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <AppCard className="items-center py-8 mb-4">
          <Ionicons name="cart-outline" size={32} color="#d1d5db" />
          <Text className="text-gray-400 mt-2">Sin artículos</Text>
        </AppCard>
      ) : (
        <View className="mb-4">
          {items.map((item) => (
            <AppCard key={item.articulo.id} className="mb-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 dark:text-white">{item.articulo.nombre}</Text>
                  <Text className="text-sm text-gray-500">{formatCurrency(item.precio_unitario)} c/u</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => item.cantidad > 1 ? updateItem(item.articulo.id, item.cantidad - 1) : removeItem(item.articulo.id)}
                    className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center"
                  >
                    <Ionicons name={item.cantidad > 1 ? 'remove' : 'trash-outline'} size={16} color={item.cantidad > 1 ? '#374151' : '#ef4444'} />
                  </TouchableOpacity>
                  <Text className="font-bold text-gray-900 dark:text-white w-6 text-center">{item.cantidad}</Text>
                  <TouchableOpacity
                    onPress={() => updateItem(item.articulo.id, item.cantidad + 1)}
                    className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center"
                  >
                    <Ionicons name="add" size={16} color="#374151" />
                  </TouchableOpacity>
                </View>
                <Text className="font-bold text-blue-600 ml-3 w-20 text-right">{formatCurrency(item.total)}</Text>
              </View>
            </AppCard>
          ))}
        </View>
      )}

      {/* Resumen */}
      {items.length > 0 && (
        <AppCard className="mb-4">
          <Text className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Resumen</Text>
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          <Row label="Impuesto (19%)" value={formatCurrency(impuesto)} />
          <View className="h-px bg-gray-100 dark:bg-gray-700 my-2" />
          <Row label="Total" value={formatCurrency(total)} bold />
        </AppCard>
      )}

      <AppButton
        title="Crear Factura"
        onPress={handleSubmit}
        loading={createFactura.isPending}
        fullWidth
      />

      {/* Modal Clientes */}
      <Modal visible={showClienteModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-4 max-h-[70%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Seleccionar Cliente</Text>
              <TouchableOpacity onPress={() => setShowClienteModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={clientes}
              keyExtractor={(c) => c.id}
              renderItem={({ item }: { item: Cliente }) => (
                <TouchableOpacity
                  onPress={() => { setClienteId(item.id); setShowClienteModal(false); }}
                  className={`p-4 rounded-xl mb-2 ${clienteId === item.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 dark:bg-gray-700'}`}
                >
                  <Text className="font-semibold text-gray-900 dark:text-white">{item.nombre} {item.apellido}</Text>
                  <Text className="text-sm text-gray-500">{item.correo}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Artículos */}
      <Modal visible={showArticuloModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-4 max-h-[70%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Agregar Artículo</Text>
              <TouchableOpacity onPress={() => setShowArticuloModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={articulos}
              keyExtractor={(a) => a.id}
              renderItem={({ item }: { item: Articulo }) => (
                <View className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 mb-2 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900 dark:text-white">{item.nombre}</Text>
                    <Text className="text-blue-600 text-sm font-medium">{formatCurrency(item.precio)}</Text>
                    <Text className="text-xs text-gray-400">Stock: {item.stock}</Text>
                  </View>
                  <View className="flex-row items-center gap-2 ml-3">
                    <TextInput
                      value={cantidadMap[item.id] ?? '1'}
                      onChangeText={(v) => setCantidadMap((m) => ({ ...m, [item.id]: v }))}
                      keyboardType="number-pad"
                      className="w-12 text-center border border-gray-200 rounded-lg py-1 text-base"
                    />
                    <TouchableOpacity
                      onPress={() => handleAddArticulo(item)}
                      className="bg-blue-600 px-3 py-2 rounded-lg"
                    >
                      <Text className="text-white text-sm font-semibold">Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View className="flex-row justify-between items-center py-1">
      <Text className={`text-sm ${bold ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{label}</Text>
      <Text className={`text-sm ${bold ? 'font-bold text-blue-600 text-base' : 'text-gray-800 dark:text-gray-200'}`}>{value}</Text>
    </View>
  );
}
