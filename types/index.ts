export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  created_at?: string;
}

export interface Articulo {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  created_at?: string;
}

export interface Factura {
  id: string;
  cliente_id: string;
  fecha?: string;
  subtotal: number;
  impuesto: number;
  total: number;
  estado: 'PENDIENTE' | 'PAGADA' | 'CANCELADA';
  created_at?: string;
  clientes?: Cliente;
  detalle_factura?: DetalleFactura[];
}

export interface DetalleFactura {
  id: string;
  factura_id: string;
  articulo_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  impuesto: number;
  total: number;
  created_at?: string;
  articulos?: Articulo;
}

export interface CartItem {
  articulo: Articulo;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  impuesto: number;
  total: number;
}

export type EstadoFactura = 'PENDIENTE' | 'PAGADA' | 'CANCELADA';
