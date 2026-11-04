
export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria_id: number;
  categoria_nombre?: string;
  unidad_medida: string;
  precio_unitario: number;
  stock_minimo: number;
  stock_actual: number;
  fecha_vencimiento: string | null;
  activo: boolean;
}
