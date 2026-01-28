# Manual de Usuario - Cajera

## Old Texas BBQ - Sistema de Gestión

---

## Contenido

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Panel Principal](#panel-principal)
4. [Captura de Pedidos](#captura-de-pedidos)
5. [Gestión de Pedidos](#gestión-de-pedidos)
6. [Bitácora Digital](#bitácora-digital)
7. [Gestión de Turnos](#gestión-de-turnos)
8. [Corte de Caja](#corte-de-caja)
9. [Notificaciones](#notificaciones)
10. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

Este manual está diseñado para el personal de caja de Old Texas BBQ. Como cajera, tienes acceso a las funciones principales de captura de pedidos, cobro, gestión de clientes y corte de caja.

### Tus Responsabilidades

- Capturar pedidos de todos los canales (WhatsApp, llamada, mostrador, web)
- Asignar repartidores a los pedidos
- Gestionar métodos de pago
- Realizar corte de caja al final del turno
- Mantener la bitácora del día actualizada

---

## Acceso al Sistema

### Iniciar Sesión

1. Abre el navegador y ve a la dirección del sistema
2. Ingresa tu correo electrónico y contraseña
3. Haz clic en **"Iniciar Sesión"**

### Cerrar Sesión

1. Haz clic en tu nombre en la esquina superior derecha
2. Selecciona **"Cerrar Sesión"**

> **Importante:** Siempre cierra sesión al terminar tu turno para proteger los datos del sistema.

---

## Panel Principal

Al iniciar sesión, verás el panel principal con:

| Elemento | Descripción |
|----------|-------------|
| **Resumen del día** | Total de pedidos, ventas, pedidos pendientes |
| **Accesos rápidos** | Botones para crear pedido, ver bitácora, etc. |
| **Notificaciones** | Alertas de pedidos entregados, incidencias |
| **Estado del turno** | Si hay turno abierto y su información |

---

## Captura de Pedidos

### Crear un Nuevo Pedido

1. Haz clic en **"Nuevo Pedido"** o ve a `/pedidos/nuevo`

### Paso 1: Seleccionar Canal

Elige cómo llegó el pedido:
- **WhatsApp** - Pedido por mensaje
- **Llamada** - Pedido telefónico
- **Mostrador** - Cliente en el local
- **Uber Eats** - Desde la app de Uber
- **Didi Food** - Desde la app de Didi
- **Web** - Desde el formulario público

### Paso 2: Datos del Cliente

| Campo | Descripción | Requerido |
|-------|-------------|-----------|
| **Nombre** | Nombre completo del cliente | Sí |
| **Teléfono** | Número de contacto | Sí |
| **Dirección** | Dirección de entrega | Sí (para delivery) |
| **Colonia** | Selecciona la colonia para calcular envío | Sí (para delivery) |

### Paso 3: Seleccionar Productos

1. Usa el **buscador** para encontrar productos
2. Filtra por **categoría** si lo necesitas
3. Haz clic en **"Agregar"** junto al producto
4. Ajusta la **cantidad** si es necesario
5. Agrega **personalizaciones** (salsas, extras) si aplica

### Paso 4: Método de Pago

| Método | Campos adicionales |
|--------|-------------------|
| **Efectivo** | Monto con el que paga el cliente (para calcular cambio) |
| **Tarjeta** | Ninguno |
| **Transferencia** | Ninguno |
| **App** | Ninguno (Uber/Didi ya pagaron) |

### Paso 5: Asignar Repartidor (opcional)

- Si el pedido es para **delivery**, selecciona un repartidor
- Si no hay repartidor disponible, el pedido quedará pendiente de asignación
- Puedes asignar repartidor después desde la lista de pedidos

### Paso 6: Observaciones

Agrega notas especiales:
- "Sin cebolla"
- "Entregar en puerta 2"
- "Cliente frecuente"

### Paso 7: Confirmar Pedido

1. Revisa el **resumen del pedido**
2. Verifica que los datos estén correctos
3. Haz clic en **"Crear Pedido"**
4. El sistema asignará un **número de pedido** automáticamente
5. Opcionalmente, **imprime el ticket**

---

## Gestión de Pedidos

### Ver Lista de Pedidos

Ve a `/pedidos` para ver todos los pedidos del día.

### Filtros Disponibles

| Filtro | Opciones |
|--------|----------|
| **Estado** | Pendiente, En preparación, Listo, En reparto, Entregado, Cancelado |
| **Canal** | WhatsApp, Llamada, Mostrador, Uber, Didi, Web |
| **Fecha** | Selecciona rango de fechas |
| **Repartidor** | Filtra por repartidor asignado |
| **Búsqueda** | Busca por número, nombre de cliente o teléfono |

### Acciones por Pedido

| Acción | Cuándo usar |
|--------|-------------|
| **Ver detalles** | Para revisar información completa |
| **Asignar repartidor** | Si el pedido no tiene repartidor |
| **Cambiar estado** | Para actualizar manualmente el estado |
| **Cancelar** | Si el cliente cancela (requiere motivo) |
| **Imprimir ticket** | Para dar comprobante al cliente |

### Estados del Pedido

```
Pendiente → En Preparación → Listo → En Reparto → Entregado
                                                      ↓
                                                 Cancelado
```

---

## Bitácora Digital

La bitácora es el registro completo de todos los pedidos del día.

### Acceder a la Bitácora

Ve a `/bitacora`

### Información Mostrada

| Columna | Descripción |
|---------|-------------|
| **#** | Número de pedido |
| **Cliente** | Nombre del cliente |
| **Colonia** | Zona de entrega |
| **Total** | Monto total del pedido |
| **Envío** | Costo del envío |
| **Cambio** | Cambio a entregar |
| **Repartidor** | Quién entrega |
| **Método** | Forma de pago |
| **Estado** | Estado actual |
| **Hora** | Hora de creación |

### Totales Automáticos

Al final de la bitácora verás:
- **Total Efectivo**
- **Total Tarjeta**
- **Total Transferencia**
- **Total Envíos**
- **Total General**

### Exportar Bitácora

1. Haz clic en **"Exportar CSV"**
2. Se descargará un archivo que puedes abrir en Excel

---

## Gestión de Turnos

### Abrir Turno

1. Ve a `/turnos`
2. Haz clic en **"Abrir Turno"**
3. Selecciona el tipo de turno:
   - **Matutino** (apertura)
   - **Vespertino** (cierre)
4. Ingresa el **fondo inicial** de caja
5. Confirma la apertura

> **Importante:** Solo puede haber un turno abierto a la vez.

### Durante el Turno

El sistema registra automáticamente:
- Todos los pedidos creados
- Métodos de pago utilizados
- Cambio entregado
- Pedidos cancelados

### Ver Estado del Turno

En `/turnos` puedes ver:
- Hora de apertura
- Fondo inicial
- Total de ventas por método de pago
- Cantidad de pedidos
- Resumen en tiempo real

---

## Corte de Caja

### Realizar Corte de Turno

1. Ve a `/turnos`
2. Haz clic en **"Cerrar Turno"**
3. El sistema mostrará los totales esperados
4. Cuenta el efectivo en caja
5. Ingresa el **efectivo real** contado
6. El sistema calculará la **diferencia** automáticamente
7. Agrega **observaciones** si hay alguna nota
8. Confirma el cierre

### Cálculo de Diferencia

```
Diferencia = Efectivo Real - (Fondo Inicial + Total Efectivo - Cambio Entregado)
```

| Resultado | Significado |
|-----------|-------------|
| **0** | Cuadra perfectamente |
| **Positivo** | Sobra dinero |
| **Negativo** | Falta dinero |

### Ver Cortes Anteriores

Ve a `/caja/corte` para ver el historial de cortes:
- Filtrar por fecha
- Filtrar por tipo de turno
- Buscar por cajero
- Ver detalles de cada turno
- Exportar a PDF

---

## Notificaciones

### Tipos de Notificaciones

| Notificación | Descripción |
|--------------|-------------|
| **Pedido Entregado** | Cuando un repartidor confirma entrega |
| **Pedido Web** | Cuando llega un pedido del formulario público |
| **Incidencia** | Cuando un repartidor reporta un problema |

### Ver Notificaciones

1. Haz clic en el **icono de campana** en el menú
2. Las notificaciones no leídas tienen un indicador
3. Haz clic en una notificación para verla completa
4. Marca como leída o elimina

### Activar Notificaciones del Navegador

Si no recibes notificaciones:
1. Haz clic en el banner de activación cuando aparezca
2. Permite las notificaciones en tu navegador
3. Las recibirás incluso con la pestaña en segundo plano

---

## Preguntas Frecuentes

### El cliente quiere cambiar su pedido

1. Si el pedido está **pendiente**: Puedes editarlo directamente
2. Si está **en preparación**: Contacta a cocina y actualiza las observaciones
3. Si está **listo o en reparto**: No se puede modificar, considera cancelar si es necesario

### El repartidor no puede entregar

1. El repartidor debe reportar la incidencia desde su app
2. Recibirás una notificación
3. Contacta al cliente para resolver
4. Actualiza el estado del pedido según corresponda

### La diferencia en el corte es grande

1. Revisa que todos los pedidos estén registrados
2. Verifica que los métodos de pago estén correctos
3. Revisa si hubo cambios manuales en efectivo
4. Documenta en las observaciones del corte
5. Notifica al encargado si es necesario

### No puedo ver pedidos de otros días

Los pedidos del día actual se muestran por defecto. Para ver otros días:
1. Ve a `/bitacora`
2. Usa el filtro de fecha para seleccionar el rango deseado

### El sistema está lento

1. Recarga la página (F5)
2. Verifica tu conexión a internet
3. Si persiste, cierra sesión y vuelve a entrar
4. Contacta al administrador si el problema continúa

---

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + N` | Nuevo pedido |
| `Ctrl + F` | Buscar en lista |
| `Escape` | Cerrar modal |

---

## Contacto de Soporte

Si tienes problemas técnicos:
- Contacta al **encargado de turno**
- O al **administrador del sistema**

---

**Versión del Manual:** 1.0
**Última actualización:** Enero 2026
