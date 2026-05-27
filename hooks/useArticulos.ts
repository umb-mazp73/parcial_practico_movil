import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articuloService } from '../services/articulo.service';
import { Articulo } from '../types';

const QUERY_KEY = 'articulos';

export const useArticulos = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: articuloService.getAll,
  });
};

export const useArticulo = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => articuloService.getById(id),
    enabled: !!id,
  });
};

export const useCreateArticulo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Articulo, 'id' | 'created_at'>) => articuloService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateArticulo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Articulo, 'id' | 'created_at'>> }) =>
      articuloService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDeleteArticulo = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articuloService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};
