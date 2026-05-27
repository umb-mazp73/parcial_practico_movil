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

  async updateEstado(id: string, estado: 'PENDIENTE' | 'PAGADA' | 'CANCELADA'): Promise<Factura> {
    const { data, error } = await supabase
      .from('facturas')
      .update({ estado })
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
};
