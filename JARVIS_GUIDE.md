# 🤖 Guía de Uso de Jarvis - Agent Manager

Jarvis es tu asistente inteligente de desarrollo que coordina todos los agentes y recursos del proyecto.

## ⚡ Inicio Rápido

### 1. Activar Jarvis

```bash
/jarvis
```

### 2. Decir lo que necesitas

```
"Necesito [tu requerimiento]"
```

### 3. Jarvis hace el resto

- Analiza
- Planifica
- Coordina agentes
- Ejecuta
- Verifica
- Sugiere siguiente paso

---

## 💬 Ejemplos Reales

### 📱 Crear Feature Completo

**Tú**:

```
/jarvis
Necesito crear la pantalla de pedidos para el rol de cocina.
Debe mostrar solo pedidos en preparación, con opción de
marcar como listo y filtros por urgencia.
```

**Jarvis**:

```
Perfecto, voy a crear la pantalla de pedidos para cocina.

📋 Plan de Ejecución:
1. 🎨 Diseñar interfaz (UI/UX Designer)
   - Vista tipo kanban de pedidos
   - Cards con información prioritaria
   - Botones de acción grandes
   - Filtros por estado/urgencia
   - Código de colores

2. ⚛️ Implementar frontend (Frontend Developer)
   - Componente KitchenDashboard
   - Hook useKitchenOrders con filtros
   - Store de pedidos con real-time
   - Notificaciones sonoras

3. 🔥 Crear servicios (Backend Developer)
   - Query optimizada para cocina
   - Listener real-time de nuevos pedidos
   - Actualización de estados
   - Reglas Firestore para rol cocina

Comenzando con el diseño...

[Activa UI/UX Designer]
[Diseña interfaz completa con shadcn/ui]

✅ Diseño completado

[Activa Frontend Developer]
[Implementa componentes y lógica]

✅ Frontend completado

[Activa Backend Developer]
[Crea servicios y reglas]

✅ Backend completado

📊 Resumen Completado:
- ✅ Interfaz diseñada (mobile-first, accesible)
- ✅ Componentes implementados (TypeScript estricto)
- ✅ Real-time listeners configurados
- ✅ Reglas de seguridad aplicadas
- ✅ Notificaciones sonoras integradas

💡 Siguiente sugerencia:
- Agregar métricas de tiempo promedio de preparación
- Implementar priorización automática por hora de pedido
- Dashboard de rendimiento de cocina

¿Qué prefieres hacer ahora?
```

---

### 🐛 Debugging y Resolución de Problemas

**Tú**:

```
/jarvis
Los pedidos no se están guardando en Firebase.
Me da error "permission-denied"
```

**Jarvis**:

```
Voy a diagnosticar el problema de guardado de pedidos.

🔍 Diagnóstico en progreso:
1. Verificando servicio orderService...
2. Checando reglas de Firestore...
3. Validando permisos del usuario actual...
4. Revisando logs de Firebase...

❌ Problema Identificado:
- Error: "permission-denied" en creación de pedidos
- Causa raíz: Regla Firestore requiere campo 'createdBy'
- Usuario autenticado: Sí (UID: abc123)
- Rol del usuario: 'cajera' ✓
- Campo 'createdBy': No se está enviando ❌

🛠️ Solución:

[Activa Backend Developer]
[Modifica orderService.create()]

// Antes:
await addDoc(ordersRef, orderData);

// Ahora:
await addDoc(ordersRef, {
  ...orderData,
  createdBy: auth.currentUser.uid, // ✓ Agregado
  createdAt: serverTimestamp(),
});

✅ Problema Resuelto

📝 Cambios realizados:
- orderService.create() ahora incluye createdBy
- Agregada validación de usuario autenticado
- Mejorado mensaje de error para debugging

🧪 Recomendaciones adicionales:
- Agregar test unitario para prevenir regresión
- Implementar validación de rol antes de guardar
- Logging de errores a servicio de monitoreo

¿Quieres que agregue los tests ahora?
```

---

### ⚡ Optimización de Performance

**Tú**:

```
/jarvis
La lista de pedidos es muy lenta cuando hay
muchos pedidos. Tarda como 5 segundos en cargar.
```

**Jarvis**:

```
Voy a analizar y optimizar el rendimiento de la lista de pedidos.

🔍 Análisis de Performance:

Revisando componente OrderList...
❌ Re-renders en cada keystroke (búsqueda sin debounce)
❌ Fetch completo sin paginación (cargando 1000+ docs)
❌ Sin lazy loading de imágenes
❌ Map sin key optimizada
❌ Sin virtualization para listas largas

Revisando queries de Firestore...
❌ Sin índices compuestos
❌ Query sin límite
❌ Ordenamiento no optimizado

📋 Plan de Optimización:

1. ⚛️ Optimizaciones Frontend:
   - Implementar virtualization (react-window)
   - Debounce en búsqueda (300ms)
   - Lazy loading de imágenes
   - Memoización de componentes
   - Keys optimizadas

2. 🔥 Optimizaciones Backend:
   - Paginación (20 items/página)
   - Índices compuestos en Firestore
   - Query con límite
   - Cache de queries frecuentes

[Aplicando optimizaciones...]

[Frontend Developer]
✅ react-window implementado
✅ useDebounce agregado
✅ Componentes memoizados
✅ Lazy loading configurado

[Backend Developer]
✅ Paginación implementada
✅ Índices creados en Firestore:
   - { estado: ASC, fecha_hora: DESC }
   - { canal: ASC, fecha_hora: DESC }
✅ Queries optimizadas

📊 Resultados de Optimización:

Antes:
- Tiempo de carga: ~5000ms
- Memoria: ~250MB
- FPS en scroll: ~15fps

Después:
- Tiempo de carga: ~800ms (-84%) ⚡
- Memoria: ~80MB (-68%) 📉
- FPS en scroll: 60fps estables 🚀

✅ Lista optimizada para manejar 10,000+ pedidos

💡 Optimizaciones adicionales disponibles:
- Implementar service worker para offline
- Cache con React Query
- Prefetch de páginas siguientes

¿Quieres que implemente alguna de estas?
```

---

### 📊 Consulta de Estado

**Tú**:

```
/jarvis
¿Cómo está el proyecto? ¿Qué debería hacer ahora?
```

**Jarvis**:

```
[Leyendo docs/TODO.md y docs/CONTEXT.md...]

📊 Estado del Proyecto: Old Texas BBQ - CRM

🎯 Fase Actual: FASE 1 - Setup del Proyecto (95%)

✅ Completado:
- [x] Next.js 14+ con TypeScript configurado
- [x] Tailwind CSS v4 + shadcn/ui instalado
- [x] Estructura de carpetas modular creada
- [x] Agentes especializados configurados
  - UI/UX Designer
  - Frontend Developer
  - Backend Developer
  - Agent Manager (Jarvis)
- [x] Tipos TypeScript definidos
- [x] Constantes del sistema creadas
- [x] Repositorio Git inicializado

⏳ Pendiente (Crítico):
- [ ] Configurar proyecto en Firebase Console
- [ ] Copiar credenciales a .env.local
- [ ] Habilitar servicios Firebase
  - Firestore Database
  - Authentication
  - Storage
  - Cloud Messaging

📋 Archivo de referencia:
Ver NEXT_STEPS.md para guía detallada de Firebase

⚡ Siguiente Tarea Recomendada:
**Configurar Firebase** (15-20 minutos)

Esto desbloqueará:
- Desarrollo de autenticación
- Guardado de datos
- Carga de imágenes
- Notificaciones push

🎯 Después de Firebase:
1. Implementar sistema de autenticación
2. Crear colecciones base en Firestore
3. Desarrollar módulo de pedidos (cajera)
4. Vista de cocina
5. App de repartidor

💡 ¿Quieres que te ayude con la configuración de Firebase?
Puedo guiarte paso a paso.
```

---

### 🎨 Solo Diseño UI

**Tú**:

```
/jarvis
Solo necesito el diseño de una tarjeta de producto
para el catálogo. Debe mostrar foto, nombre, precio,
descripción corta y botón de agregar.
```

**Jarvis**:

```
Entendido, solo diseño de tarjeta de producto.

[Activa UI/UX Designer]

Diseñando ProductCard con shadcn/ui...

✅ Diseño completado

[Proporciona código completo del componente]

💡 Siguiente:
¿Quieres que implemente la funcionalidad de "Agregar"
o solo necesitabas el diseño?
```

---

### 🔥 Solo Backend

**Tú**:

```
/jarvis
Necesito solo el servicio de productos con CRUD completo
```

**Jarvis**:

```
Entendido, solo servicio backend de productos.

[Activa Backend Developer]

Creando productService con:
- getAll() con paginación
- getById()
- create() con validación
- update() con seguridad
- delete() (soft delete)
- upload de imágenes a Storage

✅ Servicio completado

[Proporciona código completo]

💡 Siguiente:
¿Quieres que cree el componente frontend para
usar este servicio?
```

---

## 🎯 Tipos de Requests

### Feature Completo

```
"Necesito la funcionalidad de [X] para [rol]"
→ Jarvis: UI + Frontend + Backend
```

### Solo UI

```
"Diseña [componente/pantalla]"
→ Jarvis: Solo UI/UX Designer
```

### Solo Frontend

```
"Implementa [componente] con [funcionalidad]"
→ Jarvis: Solo Frontend Developer
```

### Solo Backend

```
"Crea el servicio de [entidad]"
→ Jarvis: Solo Backend Developer
```

### Debugging

```
"[Problema] no funciona"
→ Jarvis: Diagnostica + Soluciona
```

### Optimización

```
"[X] es lento/tiene problemas"
→ Jarvis: Analiza + Optimiza
```

### Consulta

```
"¿Cómo está [X]?" / "¿Qué sigue?"
→ Jarvis: Revisa + Sugiere
```

---

## 💡 Tips para Mejores Resultados

### ✅ Requests Efectivos

**Específico y con contexto**:

```
"Necesito la pantalla de pedidos para cocina que muestre
solo pedidos en preparación, con filtros por urgencia
y notificación sonora para nuevos pedidos"
```

**Con rol de usuario claro**:

```
"Crea el dashboard para el encargado con métricas
de ventas, pedidos del día y rendimiento de cocina"
```

**Con restricciones claras**:

```
"Implementa login solo con email/password,
sin Google ni otras opciones"
```

### ❌ Requests Vagos

```
"Haz algo con pedidos"
→ Jarvis preguntará para clarificar
```

```
"Crea una pantalla"
→ ¿Qué pantalla? ¿Para quién? ¿Qué funcionalidad?
```

---

## 🚀 Workflow Productivo

### Desarrollo de Módulo Completo

```bash
# 1. Contexto
/jarvis
"¿Cómo está el proyecto?"

# 2. Feature 1
"Necesito el módulo de pedidos para cajera"
[Jarvis crea todo]

# 3. Feature 2 (Jarvis ya tiene contexto)
"Ahora la vista de cocina"
[Jarvis reutiliza tipos y servicios]

# 4. Feature 3
"Y la app de repartidor"
[Jarvis mantiene consistencia]

# 5. Verificación
"Revisa la calidad del código"
[Jarvis ejecuta /check-quality]

# 6. Siguiente fase
"¿Qué sigue?"
[Jarvis sugiere basado en TODO.md]
```

---

## 🎓 Aprende Más

- [.claude/README.md](.claude/README.md) - Documentación completa
- [.claude/agents/agent-manager.md](.claude/agents/agent-manager.md) - Guía de Jarvis
- [CLAUDE_SETUP.md](CLAUDE_SETUP.md) - Setup de Claude Code

---

**Jarvis está listo para hacer tu desarrollo más fácil** 🤖✨

Solo actívalo con `/jarvis` y describe lo que necesitas en lenguaje natural.
