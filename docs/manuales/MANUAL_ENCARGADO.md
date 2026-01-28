# Manual de Usuario - Encargado

## Old Texas BBQ - Sistema de Gestión

---

## Contenido

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Dashboard de Supervisión](#dashboard-de-supervisión)
4. [Gestión de Pedidos](#gestión-de-pedidos)
5. [Reportes y Métricas](#reportes-y-métricas)
6. [Gestión de Productos](#gestión-de-productos)
7. [Gestión de Turnos](#gestión-de-turnos)
8. [Gestión de Repartidores](#gestión-de-repartidores)
9. [Notificaciones y Alertas](#notificaciones-y-alertas)
10. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

Este manual está diseñado para los encargados de sucursal de Old Texas BBQ. Como encargado, tienes acceso a funciones de supervisión, reportes y gestión operativa.

### Tus Responsabilidades

- Supervisar la operación general del día
- Revisar y resolver incidencias
- Generar reportes de ventas y desempeño
- Gestionar productos y precios
- Supervisar turnos y cortes de caja
- Atender alertas de pedidos urgentes

---

## Acceso al Sistema

### Iniciar Sesión

1. Ve a la dirección del sistema
2. Ingresa tu correo y contraseña
3. Haz clic en **"Iniciar Sesión"**

### Tu Panel

Como encargado, verás más opciones en el menú lateral que el resto del personal.

---

## Dashboard de Supervisión

### Vista General

El dashboard muestra en tiempo real:

| Métrica | Descripción |
|---------|-------------|
| **Pedidos del día** | Total de pedidos creados |
| **Ventas totales** | Ingresos del día |
| **Pedidos activos** | En preparación o en reparto |
| **Pedidos urgentes** | Con más de 30 minutos |
| **Repartidores activos** | Repartidores trabajando |

### Gráficas en Tiempo Real

- **Pedidos por hora** - Volumen a lo largo del día
- **Ventas por canal** - WhatsApp, Mostrador, Apps, etc.
- **Estado de pedidos** - Distribución por estado

### Alertas Visibles

Las alertas aparecen destacadas:
- **Pedidos urgentes** (>30 min)
- **Incidencias reportadas**
- **Diferencias en cortes de caja**

---

## Gestión de Pedidos

### Ver Todos los Pedidos

Ve a `/pedidos` para ver la lista completa.

### Filtros Avanzados

| Filtro | Opciones |
|--------|----------|
| **Estado** | Todos los estados disponibles |
| **Canal** | Todos los canales |
| **Fecha** | Rango de fechas personalizado |
| **Repartidor** | Filtrar por repartidor |
| **Turno** | Matutino/Vespertino |

### Acciones de Supervisión

| Acción | Descripción |
|--------|-------------|
| **Ver historial** | Ver todos los cambios del pedido |
| **Cambiar estado** | Modificar estado manualmente |
| **Reasignar repartidor** | Cambiar el repartidor asignado |
| **Cancelar pedido** | Cancelar con motivo documentado |
| **Ver incidencias** | Revisar problemas reportados |

### Resolver Incidencias

1. Ve a la sección de **Notificaciones**
2. Filtra por **"Incidencias"**
3. Revisa el detalle del problema
4. Contacta al repartidor/cajera según necesidad
5. Toma la decisión apropiada
6. Documenta la resolución

---

## Reportes y Métricas

### Acceder a Reportes

Ve a `/reportes` para ver todos los reportes disponibles.

### Resumen Diario

| Métrica | Descripción |
|---------|-------------|
| **Total ventas** | Suma de todos los pedidos |
| **Ticket promedio** | Venta promedio por pedido |
| **Pedidos completados** | Entregados exitosamente |
| **Pedidos cancelados** | Con motivo de cancelación |
| **Tiempo promedio** | Desde creación hasta entrega |

### Ventas por Canal

Gráfica de distribución:
- WhatsApp
- Mostrador
- Uber Eats
- Didi Food
- Llamada
- Web

### Productos Más Vendidos

Tabla con:
- Nombre del producto
- Cantidad vendida
- Ingresos generados
- Porcentaje del total

### Desempeño de Repartidores

| Métrica | Descripción |
|---------|-------------|
| **Entregas realizadas** | Total del período |
| **Tiempo promedio** | De entrega |
| **Incidencias** | Problemas reportados |
| **Comisiones** | Total ganado |

### Comparativa

- Ventas vs día anterior
- Ventas vs semana anterior
- Ventas vs mismo día semana pasada

### Exportar Reportes

1. Selecciona el rango de fechas
2. Elige los datos a incluir
3. Haz clic en **"Exportar Excel"**
4. Se descargará un archivo .xlsx

---

## Gestión de Productos

### Ver Catálogo

Ve a `/productos` para ver todos los productos.

### Vistas Disponibles

- **Lista** - Tabla con todos los detalles
- **Grid** - Tarjetas con fotos

### Filtros de Productos

| Filtro | Opciones |
|--------|----------|
| **Categoría** | Todas las categorías |
| **Disponibilidad** | Disponible/Agotado |
| **Búsqueda** | Por nombre |

### Crear Nuevo Producto

1. Haz clic en **"Nuevo Producto"**
2. Completa el formulario:

| Campo | Descripción | Requerido |
|-------|-------------|-----------|
| **Nombre** | Nombre del producto | Sí |
| **Descripción** | Descripción detallada | No |
| **Precio** | Precio de venta | Sí |
| **Categoría** | Categoría del producto | Sí |
| **Foto** | Imagen del producto | No |
| **Disponible** | Si está a la venta | Sí |
| **Destacado** | Mostrar como destacado | No |
| **Promoción** | Si tiene precio especial | No |

3. Haz clic en **"Guardar"**

### Editar Producto

1. Encuentra el producto en la lista
2. Haz clic en **"Editar"**
3. Modifica los campos necesarios
4. Haz clic en **"Guardar"**

### Marcar como Agotado

1. Encuentra el producto
2. Haz clic en el toggle de **"Disponible"**
3. El producto se ocultará del selector de pedidos

### Gestionar Categorías

Ve a `/productos/categorias`:

1. **Crear categoría** - Agregar nueva categoría
2. **Editar** - Cambiar nombre
3. **Eliminar** - Solo si no tiene productos
4. **Ordenar** - Cambiar orden de aparición

### Subir Foto de Producto

1. En el formulario del producto
2. Arrastra una imagen o haz clic para seleccionar
3. La imagen se sube automáticamente
4. Verás la preview antes de guardar

> **Formatos aceptados:** JPG, PNG, WebP
> **Tamaño máximo:** 5 MB

---

## Gestión de Turnos

### Ver Estado de Turnos

Ve a `/turnos` para ver:
- Turno actualmente abierto
- Quién lo abrió
- Totales en tiempo real

### Supervisar Cortes

Ve a `/caja/corte` para ver historial:

| Dato | Descripción |
|------|-------------|
| **Fecha** | Fecha del turno |
| **Tipo** | Matutino/Vespertino |
| **Cajero** | Quién realizó el corte |
| **Fondo inicial** | Dinero de inicio |
| **Total ventas** | Por método de pago |
| **Efectivo real** | Contado al cerrar |
| **Diferencia** | Sobrante o faltante |

### Revisar Diferencias

Si hay diferencia significativa:
1. Haz clic en **"Ver Detalles"**
2. Revisa las transacciones del turno
3. Verifica las observaciones del cajero
4. Documenta tu revisión si es necesario

### Exportar Corte

1. Selecciona el turno
2. Haz clic en **"Exportar PDF"**
3. Se genera un reporte profesional para archivo

---

## Gestión de Repartidores

### Ver Repartidores

Puedes ver la lista de repartidores y su estado.

### Información Disponible

| Dato | Descripción |
|------|-------------|
| **Nombre** | Nombre del repartidor |
| **Estado** | Activo/Inactivo |
| **Entregas del día** | Cantidad de entregas |
| **Comisiones** | Ganancia acumulada |
| **Liquidaciones** | Pendientes/Completadas |

### Asignar Pedidos Manualmente

Si un pedido no tiene repartidor:
1. Ve al pedido en la lista
2. Haz clic en **"Asignar Repartidor"**
3. Selecciona el repartidor disponible
4. Confirma la asignación

---

## Notificaciones y Alertas

### Tipos de Alertas

| Alerta | Prioridad | Acción |
|--------|-----------|--------|
| **Pedido urgente** | Alta | Revisar y coordinar |
| **Incidencia** | Alta | Resolver problema |
| **Diferencia en corte** | Media | Revisar y documentar |
| **Pedido web nuevo** | Normal | Supervisar |

### Centro de Notificaciones

1. Haz clic en el **icono de campana**
2. Ve las notificaciones no leídas
3. Filtra por tipo si necesitas
4. Marca como leídas al atender

### Alertas Automáticas

El sistema te notifica automáticamente cuando:
- Un pedido supera 30 minutos
- Un repartidor reporta incidencia
- Hay diferencia en corte de caja
- Llega un pedido web

---

## Bitácora y Auditoría

### Ver Bitácora

Ve a `/bitacora` para ver todos los pedidos del día en formato tabla.

### Información de Auditoría

Cada pedido registra:
- Quién lo creó
- Cuándo se modificó
- Cambios de estado
- Quién realizó cada cambio

### Exportar Datos

1. Selecciona el rango de fechas
2. Haz clic en **"Exportar CSV"**
3. Abre en Excel para análisis

---

## Preguntas Frecuentes

### Un repartidor no puede entregar y el pedido está urgente

1. Contacta al repartidor para entender el problema
2. Si es necesario, reasigna a otro repartidor
3. Documenta la incidencia
4. Si el cliente cancela, procesa la cancelación

### Hay una diferencia grande en el corte de caja

1. Revisa las transacciones del turno
2. Verifica pedidos cancelados
3. Revisa si hubo cambios manuales
4. Habla con el cajero responsable
5. Documenta la situación

### Un producto se agotó a mitad del día

1. Ve a `/productos`
2. Marca el producto como no disponible
3. El producto dejará de aparecer en nuevos pedidos
4. Notifica a cajeras si es necesario

### Necesito ver las ventas de un día específico

1. Ve a `/reportes`
2. Selecciona el rango de fechas deseado
3. El sistema mostrará las métricas de ese período
4. Exporta si necesitas guardar

### Un cliente se queja de su pedido

1. Busca el pedido por número o nombre
2. Revisa el historial del pedido
3. Verifica quién lo atendió y cuándo
4. Revisa si hay incidencias registradas
5. Toma la acción apropiada

---

## Reportes Programados

### Reporte de Fin de Día

Al cierre, revisa:
- Total de ventas
- Pedidos completados vs cancelados
- Diferencias en corte
- Incidencias del día
- Desempeño de repartidores

### Reporte Semanal

Cada semana, genera:
- Comparativa de ventas
- Productos más vendidos
- Canales más utilizados
- Áreas de mejora

---

## Contacto de Soporte

Si tienes problemas técnicos:
- Contacta al **administrador del sistema**
- Documenta el problema con capturas de pantalla

---

**Versión del Manual:** 1.0
**Última actualización:** Enero 2026
