import { create } from 'zustand';
import { Articulo, CartItem } from '../types';
import { calcularDetalle, calcularTotalesFactura } from '../utils/formatters';

interface CartState {
  clienteId: string | null;
  items: CartItem[];

  setClienteId: (id: string) => void;
  addItem: (articulo: Articulo, cantidad: number) => void;
  updateItem: (articuloId: string, cantidad: number) => void;
  removeItem: (articuloId: string) => void;
  clearCart: () => void;

  subtotal: number;
  impuesto: number;
  total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  clienteId: null,
  items: [],
  subtotal: 0,
  impuesto: 0,
  total: 0,

  setClienteId: (clienteId) => set({ clienteId }),

  addItem: (articulo, cantidad) => {
    const existing = get().items.find((i) => i.articulo.id === articulo.id);
    if (existing) {
      get().updateItem(articulo.id, existing.cantidad + cantidad);
      return;
    }
    const calcs = calcularDetalle(cantidad, articulo.precio);
    const newItem: CartItem = { articulo, cantidad, precio_unitario: articulo.precio, ...calcs };
    const items = [...get().items, newItem];
    const totals = calcularTotalesFactura(items);
    set({ items, ...totals });
  },

  updateItem: (articuloId, cantidad) => {
    const items = get().items.map((i) => {
      if (i.articulo.id !== articuloId) return i;
      const calcs = calcularDetalle(cantidad, i.precio_unitario);
      return { ...i, cantidad, ...calcs };
    });
    const totals = calcularTotalesFactura(items);
    set({ items, ...totals });
  },

  removeItem: (articuloId) => {
    const items = get().items.filter((i) => i.articulo.id !== articuloId);
    const totals = calcularTotalesFactura(items);
    set({ items, ...totals });
  },

  clearCart: () => set({ clienteId: null, items: [], subtotal: 0, impuesto: 0, total: 0 }),
}));
