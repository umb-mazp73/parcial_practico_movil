import { supabase } from '../utils/supabase';
import { Factura, DetalleFactura, CartItem } from '../types';
import { calcularTotalesFactura } from '../utils/formatters';

export const facturaService = {
  async getAll(): Promise<Factura[]> {
    const { data, error } = await supabase
      .from('facturas')
      .select('*, clientes(nombre, apellido, correo)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Factura> {
    const { data, error } = await supabase
      .from('facturas')
      .select('*, clientes(*), detalle_factura(*, articulos(*))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(clienteId: string, items: CartItem[]): Promise<Factura> {
    const { subtotal, impuesto, total } = calcularTotalesFactura(items);

    const { data: factura, error: facturaError } = await supabase
      .from('facturas')
      .insert({ cliente_id: clienteId, subtotal, impuesto, total })
      .select()
      .single();
    if (facturaError) throw facturaError;

    const detalles = items.map((item) => ({
      factura_id: factura.id,
      articulo_id: item.articulo.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.subtotal,
      impuesto: item.impuesto,
      total: item.total,
    }));

    const { error: detalleError } = await supabase.from('detalle_factura').insert(detalles);
    if (detalleError) throw detalleError;

    return factura;
  },

  async updateEstado(id: string, nuevoEstado: 'PENDIENTE' | 'PAGADA' | 'CANCELADA'): Promise<Factura> {
    // Fetch current estado + detalles in one query
    const { data: actual, error: fetchError } = await supabase
      .from('facturas')
      .select('estado, detalle_factura(articulo_id, cantidad)')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;

    const estadoAnterior = actual.estado as 'PENDIENTE' | 'PAGADA' | 'CANCELADA';
    const detalles = actual.detalle_factura as { articulo_id: string; cantidad: number }[];

    const descuenta = nuevoEstado === 'PAGADA' && estadoAnterior !== 'PAGADA';
    const restaura = estadoAnterior === 'PAGADA' && nuevoEstado !== 'PAGADA';

    if ((descuenta || restaura) && detalles?.length) {
      for (const detalle of detalles) {
        const { data: art } = await supabase
          .from('articulos')
          .select('stock')
          .eq('id', detalle.articulo_id)
          .single();
        if (!art) continue;

        const nuevoStock = descuenta
          ? Math.max(0, art.stock - detalle.cantidad)
          : art.stock + detalle.cantidad;

        await supabase
          .from('articulos')
          .update({ stock: nuevoStock })
          .eq('id', detalle.articulo_id);
      }
    }

    const { data, error } = await supabase
      .from('facturas')
      .update({ estado: nuevoEstado })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('facturas').delete().eq('id', id);
    if (error) throw error;
  },

  async getDashboardStats() {
    const [clientes, articulos, facturas] = await Promise.all([
      supabase.from('clientes').select('id', { count: 'exact', head: true }),
      supabase.from('articulos').select('id', { count: 'exact', head: true }),
      supabase.from('facturas').select('total, estado'),
    ]);

    const totalIngresos = (facturas.data ?? [])
      .filter((f) => f.estado === 'PAGADA')
      .reduce((acc, f) => acc + Number(f.total), 0);

    return {
      totalClientes: clientes.count ?? 0,
      totalArticulos: articulos.count ?? 0,
      totalFacturas: facturas.data?.length ?? 0,
      totalIngresos,
    };
  },

  async getUltimasFacturas(limit = 5): Promise<Factura[]> {
    const { data, error } = await supabase
      .from('facturas')
      .select('*, clientes(nombre, apellido)')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  },

  async getChartData() {
    const { data, error } = await supabase
      .from('facturas')
      .select('total, estado, created_at');
    if (error) throw error;
    const facturas = data ?? [];

    const porEstado = {
      PAGADA: facturas.filter((f) => f.estado === 'PAGADA').length,
      PENDIENTE: facturas.filter((f) => f.estado === 'PENDIENTE').length,
      CANCELADA: facturas.filter((f) => f.estado === 'CANCELADA').length,
    };

    const now = new Date();
    const ingresosMensuales = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const label = d.toLocaleString('es', { month: 'short' });
      const total = facturas
        .filter((f) => {
          if (!f.created_at) return false;
          const fd = new Date(f.created_at);
          return fd.getFullYear() === year && fd.getMonth() === month && f.estado === 'PAGADA';
        })
        .reduce((acc, f) => acc + Number(f.total), 0);
      return { label, total };
    });

    return { porEstado, ingresosMensuales };
  },
};
