import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;

  clienteFilter: string;
  articuloFilter: string;
  facturaFilter: string;
  setClienteFilter: (f: string) => void;
  setArticuloFilter: (f: string) => void;
  setFacturaFilter: (f: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),

  clienteFilter: '',
  articuloFilter: '',
  facturaFilter: '',
  setClienteFilter: (clienteFilter) => set({ clienteFilter }),
  setArticuloFilter: (articuloFilter) => set({ articuloFilter }),
  setFacturaFilter: (facturaFilter) => set({ facturaFilter }),
}));
