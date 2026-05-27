import React, { useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { useArticulo, useUpdateArticulo } from '../../../hooks/useArticulos';

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(150),
  descripcion: z.string().optional(),
  precio: z.coerce.number().min(0, 'El precio debe ser positivo'),
  stock: z.coerce.number().int().min(0, 'El stock debe ser positivo'),
});

type FormData = z.infer<typeof schema>;

export default function EditarArticuloScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: articulo } = useArticulo(id);
  const updateMutation = useUpdateArticulo();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (articulo) {
      reset({
        nombre: articulo.nombre,
        descripcion: articulo.descripcion ?? '',
        precio: articulo.precio,
        stock: articulo.stock,
      });
    }
  }, [articulo, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      Alert.alert('Éxito', 'Artículo actualizado correctamente');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo actualizar el artículo');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ padding: 16 }}>
      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Nombre *" value={value} onChangeText={onChange} error={errors.nombre?.message} />
        )}
      />
      <Controller
        control={control}
        name="descripcion"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Descripción" value={value} onChangeText={onChange} multiline numberOfLines={3} />
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
          />
        )}
      />
      <View className="mt-2">
        <AppButton
          title="Actualizar Artículo"
          onPress={handleSubmit(onSubmit)}
          loading={updateMutation.isPending}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}
