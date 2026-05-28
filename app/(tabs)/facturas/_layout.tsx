import { Stack } from 'expo-router';

export default function FacturasLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1e40af' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Facturas' }} />
      <Stack.Screen name="crear" options={{ title: 'Nueva Factura' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle Factura' }} />
    </Stack>
  );
}
