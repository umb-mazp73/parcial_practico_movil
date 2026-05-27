import { supabase } from '../utils/supabase';
import { Articulo } from '../types';

export const articuloService = {
  async getAll(): Promise<Articulo[]> {
    const { data, error } = await supabase
      .from('articulos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Articulo> {
    const { data, error } = await supabase
      .from('articulos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(articulo: Omit<Articulo, 'id' | 'created_at'>): Promise<Articulo> {
    const { data, error } = await supabase
      .from('articulos')
      .insert(articulo)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, articulo: Partial<Omit<Articulo, 'id' | 'created_at'>>): Promise<Articulo> {
    const { data, error } = await supabase
      .from('articulos')
      .update(articulo)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('articulos').delete().eq('id', id);
    if (error) throw error;
  },

  async search(query: string): Promise<Articulo[]> {
    const { data, error } = await supabase
      .from('articulos')
      .select('*')
      .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};
