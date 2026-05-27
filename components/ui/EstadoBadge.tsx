import React from 'react';
import { View, Text } from 'react-native';
import { EstadoFactura } from '../../types';

interface Props {
  estado: EstadoFactura;
}

const config: Record<EstadoFactura, { bg: string; text: string; label: string }> = {
  PENDIENTE: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendiente' },
  PAGADA: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Pagada' },
  CANCELADA: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelada' },
};

export const EstadoBadge: React.FC<Props> = ({ estado }) => {
  const { bg, text, label } = config[estado] ?? config.PENDIENTE;
  return (
    <View className={`px-2.5 py-1 rounded-full ${bg}`}>
      <Text className={`text-xs font-semibold ${text}`}>{label}</Text>
    </View>
  );
};
