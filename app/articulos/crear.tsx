import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { useCreateArticulo } from '../../hooks/useArticulos';

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(150),
  descripcion: z.string().optional(),
  precio: z.coerce.number().min(0, 'El precio debe ser positivo'),
  stock: z.coerce.number().int().min(0, 'El stock debe ser positivo'),
});

type FormData = z.infer<typeof schema>;

export default function CrearArticuloScreen() {
  const router = useRouter();
  const createMutation = useCreateArticulo();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { stock: 0, precio: 0 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data);
      Alert.alert('Éxito', 'Artículo creado correctamente');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo crear el artículo');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ padding: 16 }}>
      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Nombre *" value={value} onChangeText={onChange} error={errors.nombre?.message} placeholder="Laptop Dell XPS" />
        )}
      />
      <Controller
        control={control}
        name="descripcion"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Descripción" value={value} onChangeText={onChange} placeholder="Descripción del artículo..." multiline numberOfLines={3} />
        )}
      />
      <Controller
        control={control}
        name="precio"
        render={({ field: { onChange, value } }) => (
          <AppInput
            label="Precio *"
            value={String(value ?? '')}
            onChangeText={onChange}
            error={errors.precio?.message}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        )}
      />
      <Controller
        control={control}
        name="stock"
        render={({ field: { onChange, value } }) => (
          <AppInput
            label="Stock *"
            value={String(value ?? '')}
            onChangeText={onChange}
            error={errors.stock?.message}
            keyboardType="number-pad"
            placeholder="0"
          />
        )}
      />
      <View className="mt-2">
        <AppButton
          title="Guardar Artículo"
          onPress={handleSubmit(onSubmit)}
          loading={createMutation.isPending}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}
