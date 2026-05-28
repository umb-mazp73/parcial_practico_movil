import React, { useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppInput } from '../../../../components/ui/AppInput';
import { AppButton } from '../../../../components/ui/AppButton';
import { useCliente, useUpdateCliente } from '../../../../hooks/useClientes';

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  apellido: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  correo: z.string().email('Correo inválido'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditarClienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: cliente } = useCliente(id);
  const updateMutation = useUpdateCliente();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (cliente) {
      reset({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        correo: cliente.correo,
        telefono: cliente.telefono ?? '',
        direccion: cliente.direccion ?? '',
      });
    }
  }, [cliente, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      Alert.alert('Éxito', 'Cliente actualizado correctamente');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo actualizar el cliente');
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
        name="apellido"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Apellido *" value={value} onChangeText={onChange} error={errors.apellido?.message} />
        )}
      />
      <Controller
        control={control}
        name="correo"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Correo *" value={value} onChangeText={onChange} error={errors.correo?.message} keyboardType="email-address" autoCapitalize="none" />
        )}
      />
      <Controller
        control={control}
        name="telefono"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Teléfono" value={value} onChangeText={onChange} keyboardType="phone-pad" />
        )}
      />
      <Controller
        control={control}
        name="direccion"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Dirección" value={value} onChangeText={onChange} multiline numberOfLines={3} />
        )}
      />
      <View className="mt-2">
        <AppButton
          title="Actualizar Cliente"
          onPress={handleSubmit(onSubmit)}
          loading={updateMutation.isPending}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}
