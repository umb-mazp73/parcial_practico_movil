export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calcularDetalle = (cantidad: number, precioUnitario: number) => {
  const subtotal = cantidad * precioUnitario;
  const impuesto = subtotal * 0.19;
  const total = subtotal + impuesto;
  return { subtotal, impuesto, total };
};

export const calcularTotalesFactura = (items: { subtotal: number; impuesto: number; total: number }[]) => {
  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const impuesto = items.reduce((acc, i) => acc + i.impuesto, 0);
  const total = items.reduce((acc, i) => acc + i.total, 0);
  return { subtotal, impuesto, total };
};
