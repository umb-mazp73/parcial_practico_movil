import { supabase } from '../utils/supabase';
import { Cliente } from '../types';

export const clienteService = {
  async getAll(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(cliente: Omit<Cliente, 'id' | 'created_at'>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, cliente: Partial<Omit<Cliente, 'id' | 'created_at'>>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (error) throw error;
  },

  async search(query: string): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .or(`nombre.ilike.%${query}%,apellido.ilike.%${query}%,correo.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};
