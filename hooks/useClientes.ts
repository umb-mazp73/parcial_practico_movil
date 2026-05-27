import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService } from '../services/cliente.service';
import { Cliente } from '../types';

const QUERY_KEY = 'clientes';

export const useClientes = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: clienteService.getAll,
  });
};

export const useCliente = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => clienteService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCliente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Cliente, 'id' | 'created_at'>) => clienteService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateCliente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Cliente, 'id' | 'created_at'>> }) =>
      clienteService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteCliente = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clienteService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
