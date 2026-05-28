import { Stack } from 'expo-router';

export default function ClientesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1e40af' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Clientes' }} />
      <Stack.Screen name="crear" options={{ title: 'Nuevo Cliente' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle Cliente' }} />
      <Stack.Screen name="editar/[id]" options={{ title: 'Editar Cliente' }} />
    </Stack>
  );
}
