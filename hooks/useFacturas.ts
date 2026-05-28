import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facturaService } from '../services/factura.service';
import { CartItem } from '../types';

const QUERY_KEY = 'facturas';

export const useFacturas = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: facturaService.getAll,
  });
};

export const useFactura = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => facturaService.getById(id),
    enabled: !!id,
  });
};

export const useCreateFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clienteId, items }: { clienteId: string; items: CartItem[] }) =>
      facturaService.create(clienteId, items),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useUpdateEstadoFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: 'PENDIENTE' | 'PAGADA' | 'CANCELADA' }) =>
      facturaService.updateEstado(id, estado),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: ['articulos'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => facturaService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: facturaService.getDashboardStats,
    refetchInterval: 30000,
  });
};

export const useUltimasFacturas = () => {
  return useQuery({
    queryKey: ['ultimasFacturas'],
    queryFn: () => facturaService.getUltimasFacturas(5),
  });
};

export const useChartData = () => {
  return useQuery({
    queryKey: ['chartData'],
    queryFn: facturaService.getChartData,
    refetchInterval: 30000,
  });
};
