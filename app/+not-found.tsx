import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página no encontrada' }} />
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-6xl mb-4">404</Text>
        <Text className="text-xl font-bold text-gray-800 mb-2">Pantalla no encontrada</Text>
        <Link href="/" className="text-blue-600 font-medium mt-4">
          Ir al inicio
        </Link>
      </View>
    </>
  );
}
