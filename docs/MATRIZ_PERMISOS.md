# 🔐 Matriz de Permisos por Rol - Old Texas BBQ CRM

## 📊 Roles del Sistema

### 1. **Admin** (Administrador Total)
- **Descripción**: Acceso completo al sistema
- **Usuarios típicos**: Dueño del negocio
- **Nivel de acceso**: 100%

### 2. **Encargado** (Manager)
- **Descripción**: Gestión operativa completa
- **Usuarios típicos**: Manager del restaurante
- **Nivel de acceso**: 95%

### 3. **Cajera**
- **Descripción**: Gestión de pedidos y caja
- **Usuarios típicos**: Personal de mostrador
- **Nivel de acceso**: 40%

### 4. **Cocina**
- **Descripción**: Visualización y actualización de pedidos
- **Usuarios típicos**: Chef, cocineros
- **Nivel de acceso**: 25%

### 5. **Repartidor**
- **Descripción**: Ver y actualizar sus entregas
- **Usuarios típicos**: Repartidores
- **Nivel de acceso**: 20%

---

## 📋 Matriz de Permisos por Colección

### ✅ = Permitido | ❌ = Denegado | 🔒 = Con restricciones

| Colección | Admin | Encargado | Cajera | Cocina | Repartidor |
|-----------|-------|-----------|--------|--------|------------|
| **usuarios** | ✅ CRUD | ✅ CR 🔒 U | ❌ (solo su perfil) | ❌ (solo su perfil) | ❌ (solo su perfil) |
| **pedidos** | ✅ CRUD | ✅ CRUD | ✅ CR 🔒 U | 🔒 R 🔒 U | 🔒 R 🔒 U |
| **productos** | ✅ CRUD | ✅ CRUD | ✅ R | ✅ R | ❌ |
| **categorias** | ✅ CRUD | ✅ CRUD | ✅ R | ✅ R | ❌ |
| **repartidores** | ✅ CRUD | ✅ CRUD | ✅ R | ❌ | 🔒 R (solo su perfil) |
| **turnos** | ✅ CRUD | ✅ CRUD | 🔒 CRU (su turno) | ✅ R | ✅ R |
| **colonias** | ✅ CRUD | ✅ CRUD | ✅ R | ❌ | ✅ R |
| **configuracion** | ✅ CRUD | ✅ RU | ✅ R | ✅ R | ❌ |
| **notificaciones** | ✅ CRUD | ✅ CRUD | 🔒 RU (sus notif) | 🔒 RU (sus notif) | 🔒 RU (sus notif) |

---

## 🔍 Detalle de Permisos por Rol

### 👑 ADMIN (Dios del Sistema)

#### **usuarios**
- ✅ **CREATE**: Crear cualquier usuario con cualquier rol
- ✅ **READ**: Ver todos los usuarios
- ✅ **UPDATE**: Modificar cualquier usuario (incluyendo rol y activo)
- ✅ **DELETE**: Eliminar usuarios

#### **pedidos**
- ✅ **CREATE**: Crear pedidos
- ✅ **READ**: Ver todos los pedidos sin restricción
- ✅ **UPDATE**: Modificar cualquier campo de cualquier pedido
- ✅ **DELETE**: Eliminar pedidos

#### **productos**
- ✅ **CRUD completo**: Sin restricciones

#### **categorias**
- ✅ **CRUD completo**: Sin restricciones

#### **repartidores**
- ✅ **CRUD completo**: Sin restricciones

#### **turnos**
- ✅ **CRUD completo**: Sin restricciones

#### **colonias**
- ✅ **CRUD completo**: Sin restricciones

#### **configuracion**
- ✅ **CRUD completo**: Sin restricciones

#### **notificaciones**
- ✅ **CRUD completo**: Sin restricciones

---

### 👔 ENCARGADO (Manager)

#### **usuarios**
- ✅ **CREATE**: Crear usuarios (excepto otros admins)
- ✅ **READ**: Ver todos los usuarios
- ✅ **UPDATE**: Modificar usuarios (excepto admins)
- ❌ **DELETE**: No puede eliminar usuarios

#### **pedidos**
- ✅ **CREATE**: Crear pedidos
- ✅ **READ**: Ver todos los pedidos
- ✅ **UPDATE**: Modificar cualquier pedido
- ❌ **DELETE**: Solo admin puede eliminar

#### **productos**
- ✅ **CRUD completo**: Gestión completa de productos

#### **categorias**
- ✅ **CRUD completo**: Gestión completa de categorías

#### **repartidores**
- ✅ **CRUD completo**: Gestión completa de repartidores

#### **turnos**
- ✅ **CRUD completo**: Gestión completa de turnos

#### **colonias**
- ✅ **CRUD completo**: Gestión completa de colonias

#### **configuracion**
- ✅ **READ**: Ver configuraciones
- ✅ **UPDATE**: Modificar configuraciones
- ❌ **CREATE/DELETE**: Solo admin

#### **notificaciones**
- ✅ **CREATE**: Enviar notificaciones
- ✅ **READ**: Ver todas las notificaciones
- ✅ **UPDATE**: Marcar notificaciones como leídas
- ❌ **DELETE**: Solo admin

---

### 💰 CAJERA

#### **usuarios**
- ❌ **CREATE**: No puede crear usuarios
- 🔒 **READ**: Solo puede ver su propio perfil
- 🔒 **UPDATE**: Solo puede actualizar su perfil (excepto rol/activo)
- ❌ **DELETE**: No puede eliminar

#### **pedidos**
- ✅ **CREATE**: Crear nuevos pedidos
- ✅ **READ**: Ver todos los pedidos (necesario para gestionar)
- 🔒 **UPDATE**: Solo puede actualizar pedidos que ella creó
- ❌ **DELETE**: No puede eliminar

#### **pedidos/{pedidoId}/items**
- ✅ **CREATE**: Agregar items a pedidos que crea
- ✅ **READ**: Ver items de pedidos
- ✅ **UPDATE**: Modificar items de sus pedidos
- ❌ **DELETE**: No puede eliminar items

#### **pedidos/{pedidoId}/historial**
- ✅ **CREATE**: Crear entradas de historial en sus pedidos
- ✅ **READ**: Ver historial de pedidos

#### **productos**
- ✅ **READ**: Ver todos los productos (necesario para crear pedidos)
- ❌ **CREATE/UPDATE/DELETE**: No puede gestionar productos

#### **categorias**
- ✅ **READ**: Ver categorías (necesario para filtrar productos)
- ❌ **CREATE/UPDATE/DELETE**: No puede gestionar categorías

#### **repartidores**
- ✅ **READ**: Ver repartidores activos (para asignar pedidos)
- ❌ **CREATE/UPDATE/DELETE**: No puede gestionar repartidores

#### **turnos**
- ✅ **CREATE**: Abrir su propio turno
- ✅ **READ**: Ver todos los turnos
- 🔒 **UPDATE**: Solo su turno actual (mientras no esté cerrado)
- ❌ **DELETE**: No puede eliminar turnos

#### **turnos/{turnoId}/transacciones**
- ✅ **CREATE**: Registrar transacciones en su turno
- ✅ **READ**: Ver transacciones de su turno

#### **colonias**
- ✅ **READ**: Ver colonias activas (para calcular costo de envío)
- ❌ **CREATE/UPDATE/DELETE**: No puede gestionar colonias

#### **configuracion**
- ✅ **READ**: Ver configuraciones (ej: comisiones, costos)
- ❌ **CREATE/UPDATE/DELETE**: No puede modificar configuración

#### **notificaciones**
- ✅ **READ**: Ver notificaciones dirigidas a rol 'cajera'
- ✅ **UPDATE**: Marcar sus notificaciones como leídas
- ❌ **CREATE/DELETE**: No puede crear ni eliminar

---

### 👨‍🍳 COCINA

#### **usuarios**
- 🔒 **READ**: Solo su propio perfil
- 🔒 **UPDATE**: Solo su perfil (excepto rol/activo)
- ❌ **CREATE/DELETE**: No puede gestionar usuarios

#### **pedidos**
- ✅ **READ**: Ver todos los pedidos (necesario para cocinar)
- 🔒 **UPDATE**: Solo puede cambiar estado a:
  - `pendiente` → `en_preparacion`
  - `en_preparacion` → `listo`
  - Solo puede actualizar campos: `estado`, `horaInicioCocina`, `horaListo`
- ❌ **CREATE/DELETE**: No puede crear ni eliminar pedidos

#### **pedidos/{pedidoId}/items**
- ✅ **READ**: Ver items de pedidos (necesario para preparar)
- ❌ **CREATE/UPDATE/DELETE**: No puede modificar items

#### **pedidos/{pedidoId}/historial**
- ✅ **CREATE**: Crear entradas de historial al cambiar estados
- ✅ **READ**: Ver historial de pedidos

#### **productos**
- ✅ **READ**: Ver productos (necesario para conocer recetas)
- ❌ **CREATE/UPDATE/DELETE**: No puede gestionar productos

#### **categorias**
- ✅ **READ**: Ver categorías
- ❌ **CREATE/UPDATE/DELETE**: No puede gestionar categorías

#### **configuracion**
- ✅ **READ**: Ver configuraciones (ej: tiempos de preparación)
- ❌ **CREATE/UPDATE/DELETE**: No puede modificar configuración

#### **notificaciones**
- ✅ **READ**: Ver notificaciones dirigidas a rol 'cocina'
- ✅ **UPDATE**: Marcar sus notificaciones como leídas
- ❌ **CREATE/DELETE**: No puede crear ni eliminar

---

### 🚗 REPARTIDOR

#### **usuarios**
- 🔒 **READ**: Solo su propio perfil
- 🔒 **UPDATE**: Solo su perfil (excepto rol/activo)
- ❌ **CREATE/DELETE**: No puede gestionar usuarios

#### **pedidos**
- 🔒 **READ**: Solo pedidos donde `reparto.repartidorId == userId`
- 🔒 **UPDATE**: Solo pedidos asignados a él. Solo puede cambiar:
  - Estado: `listo` → `en_reparto` → `entregado`
  - Campos de reparto: `horaRecogida`, `horaEntrega`, `estadoReparto`
- ❌ **CREATE/DELETE**: No puede crear ni eliminar pedidos

#### **pedidos/{pedidoId}/items**
- ✅ **READ**: Ver items de sus pedidos asignados
- ❌ **CREATE/UPDATE/DELETE**: No puede modificar items

#### **pedidos/{pedidoId}/historial**
- ✅ **CREATE**: Crear entradas de historial en sus pedidos
- ✅ **READ**: Ver historial de sus pedidos

#### **repartidores**
- 🔒 **READ**: Solo su propio documento de repartidor
- 🔒 **UPDATE**: Solo puede cambiar `disponible` en su documento
- ❌ **CREATE/DELETE**: No puede gestionar repartidores

#### **turnos**
- ✅ **READ**: Ver turnos (para saber qué turno está activo)
- ❌ **CREATE/UPDATE/DELETE**: No puede gestionar turnos

#### **colonias**
- ✅ **READ**: Ver colonias activas (para saber ubicaciones)
- ❌ **CREATE/UPDATE/DELETE**: No puede gestionar colonias

#### **notificaciones**
- ✅ **READ**: Ver notificaciones dirigidas a:
  - Rol 'repartidor'
  - O específicamente a su `userId`
- ✅ **UPDATE**: Marcar sus notificaciones como leídas
- ❌ **CREATE/DELETE**: No puede crear ni eliminar

---

## 🔒 Reglas Especiales

### Usuarios Públicos (Sin Autenticación)

#### **productos**
- ✅ **READ**: Solo productos con `disponible: true`

#### **colonias**
- ✅ **READ**: Solo colonias con `activa: true`

#### **pedidos**
- ✅ **CREATE**: Solo si:
  - `canal == 'web'`
  - `creadoPor == 'sistema-web'`
  - `estado == 'pendiente'`

#### **pedidos/{pedidoId}/items**
- ✅ **WRITE**: Permitir creación para pedidos web

#### **pedidos/{pedidoId}/historial**
- ✅ **WRITE**: Permitir creación para pedidos web

---

## 🚨 Casos de Uso Críticos

### 1. Cajera Creando Pedido
```
✅ Puede: Leer productos, colonias, repartidores
✅ Puede: Crear pedido con items
✅ Puede: Asignar repartidor
❌ No puede: Modificar pedidos de otras cajeras
```

### 2. Cocina Preparando Orden
```
✅ Puede: Ver todos los pedidos pendientes
✅ Puede: Cambiar estado a "en_preparacion"
✅ Puede: Marcar como "listo"
❌ No puede: Modificar items, precios, cliente
❌ No puede: Cancelar pedidos
```

### 3. Repartidor en Entrega
```
✅ Puede: Ver solo sus pedidos asignados
✅ Puede: Actualizar ubicación/estado de entrega
✅ Puede: Marcar como entregado
❌ No puede: Ver pedidos de otros repartidores
❌ No puede: Modificar totales o items
```

### 4. Encargado Gestionando Sistema
```
✅ Puede: Ver todo el sistema
✅ Puede: Crear usuarios (cajeras, cocina, repartidores)
✅ Puede: Gestionar productos, categorías
✅ Puede: Configurar colonias y costos
❌ No puede: Crear otros admins
❌ No puede: Eliminar datos (solo admin)
```

---

## 📝 Notas de Implementación

### Funciones Helper en Firestore Rules

```javascript
// Verificar si usuario está autenticado
function isAuthenticated() {
  return request.auth != null;
}

// Obtener datos del usuario actual
function getUserData() {
  return get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data;
}

// Verificar rol específico
function hasRole(role) {
  return isAuthenticated() && getUserData().rol == role;
}

// Verificar múltiples roles
function hasAnyRole(roles) {
  return isAuthenticated() && getUserData().rol in roles;
}

// Verificar si usuario está activo
function isActive() {
  return isAuthenticated() && getUserData().activo == true;
}

// Verificar si es admin
function isAdmin() {
  return hasRole('admin');
}

// Verificar si es manager (admin o encargado)
function isManager() {
  return hasAnyRole(['encargado', 'admin']);
}
```

---

## ✅ Checklist de Seguridad

- [ ] Todos los usuarios autenticados tienen documento en colección `usuarios`
- [ ] Campo `rol` es inmutable por usuarios normales
- [ ] Campo `activo` solo lo modifican managers
- [ ] Repartidores solo ven sus pedidos asignados
- [ ] Cajeras no pueden modificar pedidos ajenos
- [ ] Cocina no puede modificar precios ni items
- [ ] Datos sensibles de clientes están protegidos
- [ ] Acceso público limitado a catálogo y creación de pedidos web

---

**Última actualización**: 2025-12-29
