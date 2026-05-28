import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppInput } from '../../../components/ui/AppInput';
import { AppButton } from '../../../components/ui/AppButton';
import { useCreateCliente } from '../../../hooks/useClientes';

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  apellido: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  correo: z.string().email('Correo inválido'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CrearClienteScreen() {
  const router = useRouter();
  const createMutation = useCreateCliente();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data);
      Alert.alert('Éxito', 'Cliente creado correctamente');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo crear el cliente');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" contentContainerStyle={{ padding: 16 }}>
      <Controller
        control={control}
        name="nombre"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Nombre *" value={value} onChangeText={onChange} error={errors.nombre?.message} placeholder="Juan" />
        )}
      />
      <Controller
        control={control}
        name="apellido"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Apellido *" value={value} onChangeText={onChange} error={errors.apellido?.message} placeholder="Pérez" />
        )}
      />
      <Controller
        control={control}
        name="correo"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Correo *" value={value} onChangeText={onChange} error={errors.correo?.message} placeholder="juan@email.com" keyboardType="email-address" autoCapitalize="none" />
        )}
      />
      <Controller
        control={control}
        name="telefono"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Teléfono" value={value} onChangeText={onChange} error={errors.telefono?.message} placeholder="+57 300 0000000" keyboardType="phone-pad" />
        )}
      />
      <Controller
        control={control}
        name="direccion"
        render={({ field: { onChange, value } }) => (
          <AppInput label="Dirección" value={value} onChangeText={onChange} error={errors.direccion?.message} placeholder="Calle 123 #45-67" multiline numberOfLines={3} />
        )}
      />
      <View className="mt-2">
        <AppButton
          title="Guardar Cliente"
          onPress={handleSubmit(onSubmit)}
          loading={createMutation.isPending}
          fullWidth
        />
      </View>
    </ScrollView>
  );
}
