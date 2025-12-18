# 📊 Módulo de Reportes y Métricas

## Descripción General

El módulo de Reportes y Métricas proporciona análisis detallados de ventas, desempeño y operaciones del restaurante Old Texas BBQ. Permite visualizar datos históricos, exportar reportes y tomar decisiones basadas en datos.

## ✨ Características Implementadas

### 1. **Resumen Diario**
- Total de ventas del día
- Total de pedidos completados
- Ticket promedio por pedido
- Total de envíos cobrados
- Comparativa con el día anterior (variación porcentual)
- Pedidos agrupados por estado
- Ventas agrupadas por método de pago

### 2. **Gráfica de Ventas por Hora**
- Visualización de ventas por hora del día
- Doble eje Y: cantidad de pedidos y monto total
- Identificación automática de hora pico
- Resumen de total del día

### 3. **Visualización de Pedidos por Canal**
- Gráfica de pie (pastel) mostrando distribución por canal
- Canales: WhatsApp, Mostrador, Uber Eats, Didi Food, Llamada, Web
- Porcentaje de ventas por cada canal
- Lista detallada con cantidad y monto por canal

### 4. **Productos Más Vendidos**
- Top 10 productos más vendidos del día
- Indicadores visuales para primeros 3 lugares (medallas)
- Cantidad total vendida por producto
- Monto total generado por producto

### 5. **Desempeño de Repartidores**
- Ranking de repartidores por pedidos entregados
- Total entregado y comisiones ganadas
- Tiempo promedio de entrega
- Identificación del mejor repartidor del día

### 6. **Filtro por Fecha**
- Selector de fecha con calendario
- Botón rápido "Hoy"
- Formato de fecha en español

### 7. **Exportación a Excel**
- Exportación completa del reporte del día
- Múltiples hojas:
  - Resumen general
  - Ventas por hora
  - Ventas por canal
  - Productos más vendidos
  - Desempeño de repartidores
- Formato profesional con encabezados y totales

### 8. **Comparativa con Día Anterior**
- Variación porcentual en ventas totales
- Variación porcentual en cantidad de pedidos
- Variación porcentual en ticket promedio
- Indicadores visuales (▲ ▼) según tendencia

## 🗂️ Estructura de Archivos

```
lib/
├── services/
│   └── reportes.service.ts       # Servicio con lógica de negocio
├── hooks/
│   └── useReportes.ts            # Hook con React Query
│
components/
└── reportes/
    ├── ResumenDiario.tsx         # Métricas clave del día
    ├── GraficaVentasPorHora.tsx  # Gráfica de barras
    ├── GraficaVentasPorCanal.tsx # Gráfica de pie
    ├── TablaProductosMasVendidos.tsx
    └── TablaDesempenoRepartidores.tsx
│
app/
└── (dashboard)/
    └── reportes/
        └── page.tsx              # Página principal de reportes
```

## 🔧 Servicios y Funciones

### `reportesService`

#### Métodos principales:

- **`getResumenDiario(fecha: Date)`**: Obtiene el resumen completo del día
- **`getVentasPorHora(fecha: Date)`**: Agrupa ventas por hora
- **`getVentasPorCanal(fecha: Date)`**: Agrupa ventas por canal
- **`getProductosMasVendidos(fecha: Date, limite: number)`**: Top productos vendidos
- **`getDesempenoRepartidores(fecha: Date)`**: Estadísticas de repartidores
- **`getComparativaConDiaAnterior(fecha: Date)`**: Comparativa con ayer
- **`getReporteFull(fecha: Date)`**: Reporte completo (todos los datos)
- **`getReportePorRango(fechaInicio: Date, fechaFin: Date)`**: Reporte de rango de fechas

### `useReportes` Hook

Hook personalizado que utiliza React Query para gestionar el estado y cache de los datos:

```typescript
const {
  resumenDiario,
  ventasPorHora,
  ventasPorCanal,
  productosMasVendidos,
  desempenoRepartidores,
  comparativa,
  isLoading,
  refetchResumen,
} = useReportes(fecha);
```

### `useExportarReporte` Hook

Hook para exportar reportes a Excel:

```typescript
const { exportarAExcel } = useExportarReporte();

// Exportar reporte del día
await exportarAExcel(fecha, 'Reporte_2025-01-15.xlsx');
```

## 📈 Tipos de Datos

### `ResumenDiario`
```typescript
interface ResumenDiario {
  fecha: string;
  totalPedidos: number;
  totalVentas: number;
  ticketPromedio: number;
  pedidosPorEstado: Record<EstadoPedido, number>;
  ventasPorMetodoPago: Record<MetodoPago, number>;
  totalEnvios: number;
  totalDescuentos: number;
}
```

### `VentasPorHora`
```typescript
interface VentasPorHora {
  hora: string; // "08:00", "09:00", etc.
  cantidad: number;
  total: number;
}
```

### `VentasPorCanal`
```typescript
interface VentasPorCanal {
  canal: CanalVenta;
  cantidad: number;
  total: number;
  porcentaje: number;
}
```

### `ProductoMasVendido`
```typescript
interface ProductoMasVendido {
  productoId: string;
  productoNombre: string;
  cantidad: number;
  total: number;
}
```

### `DesempenoRepartidor`
```typescript
interface DesempenoRepartidor {
  repartidorId: string;
  repartidorNombre: string;
  pedidosEntregados: number;
  totalEntregado: number;
  comisionesGanadas: number;
  tiempoPromedioEntrega: number; // en minutos
}
```

## 🎨 Componentes UI

### ResumenDiario

Muestra 4 tarjetas principales:
- Total Ventas
- Total Pedidos
- Ticket Promedio
- Total Envíos

Cada tarjeta incluye:
- Icono representativo
- Valor actual
- Variación vs día anterior
- Descripción

### GraficaVentasPorHora

Gráfica de barras con doble eje Y:
- Eje izquierdo: Cantidad de pedidos
- Eje derecho: Total en pesos
- Tooltip interactivo
- Identificación de hora pico

### GraficaVentasPorCanal

Gráfica de pie con:
- Colores personalizados por canal
- Porcentajes visibles
- Lista detallada lateral
- Identificación de canal principal

### TablaProductosMasVendidos

Tabla con:
- Ranking (1°, 2°, 3° con medallas)
- Nombre del producto
- Cantidad vendida
- Total generado
- Resumen de totales

### TablaDesempenoRepartidores

Tabla con:
- Nombre del repartidor
- Pedidos entregados
- Total entregado
- Comisiones ganadas
- Tiempo promedio de entrega
- Identificación del mejor del día

## 🚀 Uso del Módulo

### Acceso a la Página

Navegar a: `/reportes`

Disponible para roles: **Encargado** y **Admin**

### Cambiar Fecha

1. Usar el selector de fecha en el header
2. Hacer clic en "Hoy" para datos actuales
3. Los datos se actualizan automáticamente

### Exportar Reporte

1. Seleccionar la fecha deseada
2. Hacer clic en "Exportar a Excel"
3. El archivo se descarga automáticamente

### Refrescar Datos

Hacer clic en el botón de refrescar (🔄) para actualizar los datos manualmente.

## 🔍 Cache y Performance

- **React Query** gestiona automáticamente el cache
- Tiempo de stale: 5 minutos
- Los datos se revalidan en segundo plano
- Lazy loading de gráficas pesadas

## 📦 Dependencias

- **recharts**: ^2.x (gráficas)
- **xlsx**: ^0.x (exportación a Excel)
- **date-fns**: ^4.x (manejo de fechas)
- **@tanstack/react-query**: ^5.x (gestión de estado)

## 🎯 Próximas Mejoras

- [ ] Reporte por rango de fechas personalizado
- [ ] Filtros avanzados (por canal, repartidor, etc.)
- [ ] Gráfica de tendencias semanal/mensual
- [ ] Exportación a PDF
- [ ] Comparativa entre semanas/meses
- [ ] Dashboard en tiempo real
- [ ] Alertas automáticas (metas alcanzadas, etc.)

## 📝 Notas Técnicas

### Aggregaciones

Todas las agregaciones se realizan en el cliente usando JavaScript nativo. Firestore no soporta funciones de agregación avanzadas, por lo que:

1. Se obtienen todos los pedidos del rango de fechas
2. Se filtran pedidos cancelados
3. Se agrupan y suman en memoria

Para grandes volúmenes de datos, considerar:
- Implementar paginación
- Usar Cloud Functions para pre-agregaciones
- Cachear resultados en Firestore

### Optimizaciones Aplicadas

- Queries limitadas por rango de fechas
- Cache de React Query (5 min)
- Lazy loading de componentes pesados
- Memoización de cálculos complejos

## 🐛 Troubleshooting

### No se muestran datos

1. Verificar que existan pedidos para la fecha seleccionada
2. Revisar permisos de Firestore
3. Verificar conexión a Firebase
4. Revisar console del navegador

### Error al exportar Excel

1. Verificar que el navegador permita descargas
2. Revisar que haya datos para exportar
3. Revisar console para errores de XLSX

### Gráficas no se renderizan

1. Verificar que recharts esté instalado
2. Revisar errores en console
3. Verificar formato de datos

## 📚 Referencias

- [Recharts Documentation](https://recharts.org/)
- [SheetJS (XLSX) Documentation](https://docs.sheetjs.com/)
- [React Query Documentation](https://tanstack.com/query)

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
