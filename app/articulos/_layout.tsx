import { Stack } from 'expo-router';

export default function ArticulosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1e40af' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Artículos' }} />
      <Stack.Screen name="crear" options={{ title: 'Nuevo Artículo', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle Artículo' }} />
      <Stack.Screen name="editar/[id]" options={{ title: 'Editar Artículo', presentation: 'modal' }} />
    </Stack>
  );
}
