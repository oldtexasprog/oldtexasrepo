# 🧩 Documentación de Componentes Principales

## FormPedido

**Ubicación**: `components/forms/FormPedido.tsx`

**Propósito**: Formulario completo para crear/editar pedidos (cajera)

**Props**:
```typescript
interface FormPedidoProps {
  pedidoId?: string; // Para edición
  onSuccess?: (pedidoId: string) => void;
}
```

**Uso**:
```tsx
<FormPedido onSuccess={(id) => router.push(`/pedidos/${id}`)} />
```

**Características**:
- Selector de canal de venta
- Búsqueda de productos
- Carrito con cantidades
- Cálculo automático de totales
- Validación con React Hook Form
- Integración con productosService

---

## TableroComandas

**Ubicación**: `components/cocina/TableroComandas.tsx`

**Propósito**: Vista Kanban para cocina (pendiente, en preparación, listo)

**Props**: Ninguna (autónomo)

**Uso**:
```tsx
<TableroComandas />
```

**Características**:
- Drag & drop con @dnd-kit
- Actualización en tiempo real
- Alertas visuales para retrasos >30min
- Contador de pedidos por columna
- Sonido en nuevos pedidos

---

## ProductosManager

**Ubicación**: `components/productos/ProductosManager.tsx`

**Propósito**: CRUD completo de productos (admin/encargado)

**Props**: Ninguna

**Uso**:
```tsx
<ProductosManager />
```

**Características**:
- Vista lista/grid toggle
- Búsqueda y filtros
- Modal crear/editar
- Upload de imágenes con Cloudinary
- Toggle disponibilidad
- Export/Import CSV

---

## GestionTurnos

**Ubicación**: `components/turnos/GestionTurnos.tsx`

**Propósito**: Apertura/cierre de turnos y corte de caja

**Props**: Ninguna

**Uso**:
```tsx
<GestionTurnos />
```

**Características**:
- Abrir turno (matutino/vespertino)
- Ver estado actual
- Cerrar con corte automático
- Cálculo de diferencias
- Validaciones

---

## PanelReparto

**Ubicación**: `components/reparto/PanelReparto.tsx`

**Propósito**: Vista de repartidores (listos, asignados, liquidación)

**Props**:
```typescript
interface PanelRepartoProps {
  repartidorId?: string; // Para vista específica
}
```

**Uso**:
```tsx
<PanelReparto repartidorId={currentUser.id} />
```

**Características**:
- Lista de pedidos listos
- Mis pedidos asignados
- Botón aceptar/entregar
- Historial del día
- Liquidación pendiente

---

**Última actualización**: Enero 2026
