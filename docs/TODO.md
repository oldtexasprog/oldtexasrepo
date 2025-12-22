# 📋 TODO LIST - OLD TEXAS BBQ AUTOMATION PROJECT

## 🎯 FASE 0: PREPARACIÓN Y DISCOVERY

### Reuniones con Cliente

- [ ] Presentar propuesta al cliente
- [ ] Agendar sesión de Q&A sobre la propuesta
- [ ] Sesión de validación de flujo de trabajo actual
- [ ] Recopilar catálogo completo de productos
- [ ] Documentar todas las personalizaciones posibles (salsas, extras, presentaciones)
- [ ] Definir roles específicos por usuario (nombres, permisos)
- [ ] Identificar casos especiales o excepciones del negocio
- [ ] Obtener acceso a sistema Loyverse actual (si aplica)
- [ ] Recopilar ejemplos de bitácoras manuales de últimos 7 días
- [ ] Definir métricas de éxito del proyecto

### Documentación Inicial

- [ ] Crear documento de requerimientos funcionales
- [ ] Mapear flujo completo de pedidos (diagrama)
- [ ] Documentar estructura de datos necesaria
- [ ] Definir historias de usuario por rol
- [ ] Crear wireframes/bocetos de interfaces principales
- [ ] Documentar casos de uso edge cases

---

## 🏗️ FASE 1: SETUP DEL PROYECTO

### Configuración de Claude Code

- [x] Crear carpeta `.claude/` con configuraciones
- [x] Crear `project_rules.md` con reglas del proyecto
- [x] Crear comandos personalizados útiles
  - [x] `/new-component` - Crear componentes
  - [x] `/new-service` - Crear servicios Firebase
  - [x] `/new-store` - Crear stores Zustand
  - [x] `/new-page` - Crear páginas Next.js
  - [x] `/review-context` - Revisar estado del proyecto
  - [x] `/check-quality` - Verificar calidad de código
- [x] Crear `.claudeignore` para optimizar contexto
- [x] Documentar uso en `.claude/README.md`

### Configuración de Entorno

- [x] Inicializar proyecto Next.js 14+ (App Router)
- [x] Configurar TypeScript
- [x] Instalar y configurar Tailwind CSS
- [x] Configurar ESLint y Prettier
- [x] Configurar Git y crear repositorio
- [x] Crear estructura de carpetas modular
- [x] Configurar variables de entorno (.env)
- [x] Crear README.md con instrucciones de setup

### Firebase Setup

- [x] Crear proyecto en Firebase Console
- [x] Habilitar Firestore Database
- [x] Habilitar Firebase Authentication
- [x] ~~Habilitar Firebase Storage~~ → **Usando Cloudinary (plan gratuito)**
- [x] ~~Habilitar Firebase Hosting~~ → **Usando Vercel (gratis)**
- [x] ~~Habilitar Firebase Cloud Messaging (FCM)~~ → **Sistema de notificaciones in-app con Firestore**
- [x] Configurar reglas de seguridad de Firestore (básicas + notificaciones)
- [x] ~~Configurar reglas de Storage~~ → **No necesario (usando Cloudinary)**
- [x] Conectar Firebase al proyecto Next.js
- [x] Crear archivo de configuración de Firebase (`lib/firebase/config.ts`)

### Alternativas Gratuitas Implementadas ✨

- [x] **Cloudinary Setup** - Alternativa a Firebase Storage
  - [x] Crear `lib/cloudinary/config.ts`
  - [x] Crear `lib/cloudinary/upload.ts`
  - [x] Crear `lib/cloudinary/utils.ts`
  - [x] Crear `lib/cloudinary/types.ts`
  - [x] Documentación en `docs/cloudinary/`
  - [x] Instalar dependencias (`cloudinary`, `next-cloudinary`)
- [x] **Sistema de Notificaciones In-App** - Alternativa a FCM
  - [x] Crear `lib/notifications/in-app.ts`
  - [x] Crear `lib/notifications/useNotifications.ts`
  - [x] Crear `lib/notifications/types.ts`
  - [x] Documentación en `docs/notifications/`
  - [x] Actualizar `firestore.rules` con colección `notificaciones`

### Dependencias Base

- [x] Instalar Firebase SDK (`firebase`)
- [x] Instalar Zustand (estado global)
- [x] Instalar React Hook Form
- [x] Instalar date-fns (manejo de fechas)
- [x] Instalar lucide-react (iconos)
- [x] Instalar sonner o react-hot-toast (notificaciones UI)
- [x] Configurar file de tipos TypeScript globales

---

## 🗄️ FASE 2: ARQUITECTURA DE DATOS

### Modelo de Datos Firestore

- [x] Diseñar colección `usuarios`
- [x] Diseñar colección `pedidos`
- [x] Diseñar colección `productos`
- [x] Diseñar colección `personalizaciones`
- [x] Diseñar colección `repartidores`
- [x] Diseñar colección `turnos` (cortes de caja)
- [x] Diseñar colección `configuracion`
- [x] Crear documento de especificación del schema
- [x] Definir índices compuestos necesarios
- [x] Crear scripts de seed data para testing

### Servicios de Datos (CRUD)

- [x] Crear `pedidosService.ts` (CRUD pedidos)
- [x] Crear `productosService.ts` (CRUD productos)
- [x] Crear `usuariosService.ts` (CRUD usuarios)
- [x] Crear `repartidoresService.ts` (CRUD repartidores)
- [x] Crear `turnosService.ts` (cortes de caja)
- [x] Crear `notificacionesService.ts`
- [x] Implementar listeners en tiempo real (onSnapshot)
- [x] Crear helpers para queries complejas
- [x] Implementar manejo de errores consistente
- [x] Crear utilidades de validación de datos

- [x] crear un toggle para cambiar de tema
- [x] quitar de la pagina de inicio la paleta de colores
---

## 🔐 FASE 3: AUTENTICACIÓN Y ROLES

### Sistema de Auth

- [x] Implementar login con email/password (Firebase Auth)
- [x] Crear página de login (`/login`)
- [x] Crear componente `ProtectedRoute`
- [x] Implementar middleware de autenticación
- [x] Crear hook `useAuth`
- [x] Implementar logout
- [x] Crear store de autenticación (Zustand)
- [x] Manejo de sesiones persistentes
- [x] Implementar recuperación de contraseña
- [x] Crear flujo de cambio de contraseña
- [x] Implementar pagina de perfil para cambiar datos del usuario
 
### Sistema de Roles

- [x] Definir enum de roles (`cajera`, `cocina`, `repartidor`, `encargado`, `admin`)
- [x] Implementar HOC `withRole` para protección por rol
- [x] Crear hook `useRole` para verificar permisos
- [x] Implementar matriz de permisos
- [x] Crear función `checkPermission(user, action)`
- [x] Implementar restricciones UI según rol
- [x] Agregar roles a colección `usuarios` en Firestore
- [x] Crear página de gestión de usuarios (solo admin)

---

## 📱 FASE 4: MÓDULO DE PEDIDOS (CAJERA)

### UI - Captura de Pedidos

- [x] Crear página `/pedidos/nuevo`
- [x] Crear componente `FormPedido`
- [x] Implementar selector de canal (WhatsApp/Mostrador/Uber/Didi/Llamada/Web)
- [x] Crear componente `ClienteForm` (nombre, dirección, teléfono)
- [x] Crear componente `ProductoSelector` (búsqueda y selección)
- [x] Implementar carrito de productos temporal
- [x] Crear componente `PersonalizacionModal` (salsas, extras, presentación)
- [x] Implementar cálculo automático de totales
- [x] Crear componente `MetodoPagoSelector`
- [x] Implementar lógica de cambio (si paga con efectivo)
- [x] Crear componente `RepartidorAsignador`
- [x] Implementar campo de observaciones
- [x] Botón "Crear Pedido" con validaciones
- [x] Implementar feedback visual de éxito/error

### Lógica de Negocio

- [x] Implementar hook `usePedidos`
- [x] Función para crear pedido (`createPedido`)
- [x] Función para editar pedido (`updatePedido`)
- [x] Función para cancelar pedido (`cancelPedido`)
- [x] Generar ID consecutivo de pedido
- [x] Implementar validaciones de formulario
- [x] Calcular subtotal + envío automáticamente
- [x] Calcular cambio si método es efectivo
- [x] Guardar timestamp de creación
- [x] Guardar pedido en Firestore con todos los datos
- [x] Crear documento principal + subcolecciones (items, historial)
- [x] Validar autenticación antes de guardar
- [x] Sincronizar carritos de productos (eliminar estado duplicado)
- [x] Mejorar validación de formulario según método de pago
- [x] Feedback visual claro cuando botón está deshabilitado
- [x] Trigger notificación a cocina al crear pedido
- [x] Integrar con sistema de turnos (actualmente usa 'turno-actual' hardcoded)
- [x] Obtener nombre real del repartidor desde Firestore
- [x] Agregar opción para imprimir ticket del pedido

### Lista de Pedidos

- [x] Crear página `/pedidos`
- [x] Componente `ListaPedidos` con filtros
- [x] Filtro por estado (pendiente/en_preparacion/listo/en_reparto/entregado)
- [x] Filtro por fecha
- [x] Filtro por canal de venta
- [x] Búsqueda por número de pedido, cliente o teléfono
- [x] Filtro por canal
- [x] Filtro por repartidor
- [x] Componente `PedidoCard` con info resumida
- [x] Modal de detalles del pedido
- [x] Botones de acción según estado
- [x] Implementar búsqueda por ID o cliente
- [x] Paginación (12 items por página)
- [x] Vista en tiempo real (onSnapshot)

### Bitácora Digital

- [x] Crear página `/bitacora`
- [x] Crear componente `BitacoraDigital`
- [x] Vista tabla con todos los pedidos del día
- [x] Columnas: ID, Número, Cliente, Colonia, Monto, Cambio, Envío, Repartidor, Método de pago, Estado, Hora
- [x] Totales automáticos por método de pago (Efectivo, Tarjeta, Transferencia)
- [x] Filtro por fecha
- [x] Filtro por turno (matutino/vespertino)
- [x] Botón exportar a CSV
- [x] Actualización en tiempo real con onSnapshot
- [x] Totales de envíos y cambio

---

## 👨‍🍳 FASE 5: MÓDULO DE COCINA

### Tablero de Comandas

- [x] Crear página `/cocina`
- [x] Componente `TableroComandas` (tipo Kanban)
- [x] Columnas: Pendiente | En Preparación | Listo
- [x] Componente `ComandaCard`
- [x] Mostrar productos con cantidades
- [x] Destacar personalizaciones (color/icono)
- [x] Mostrar tiempo transcurrido desde creación
- [x] Drag & drop entre columnas con @dnd-kit
- [x] Botón "Iniciar Preparación"
- [x] Botón "Marcar como Listo"
- [x] Actualización en tiempo real (onSnapshot)
- [x] Notificación sonora cuando llega nuevo pedido
- [x] Alerta visual y sonora para pedidos urgentes (>30 min)
- [x] Badge de contador por columna
- [x] Modo pantalla completa (sin distracciones)

### Lógica de Cocina

- [x] Función `marcarEnPreparacion(pedidoId)` - Implementada en TableroComandas
- [x] Función `marcarListo(pedidoId)` - Implementada en TableroComandas
- [x] Trigger notificación a reparto cuando pedido listo
- [x] Actualizar timestamps en Firestore
- [x] Ordenar por prioridad/tiempo de espera (más antiguos primero)
- [x] Filtrar solo pedidos del día actual (pendiente, en_preparacion, listo)

---

## 🛵 FASE 6: MÓDULO DE REPARTO

### Panel de Repartidores

- [x] Crear página `/reparto`
- [x] Componente `PedidosListosParaRecoger`
- [x] Componente `MisPedidosAsignados`
- [x] Componente `PedidoRepartoCard`
- [x] Mostrar: ID, Monto total, Envío, Colonia, Observaciones
- [x] **NO mostrar:** Teléfono completo ni nombre completo del cliente
- [x] Botón "Aceptar Pedido"
- [x] Botón "Marcar como Entregado"
- [x] Botón "Reportar Incidencia"
- [ ] Vista de mapa con dirección (opcional) - NO IMPLEMENTADO
- [x] Historial de mis entregas del día

### Lógica de Reparto

- [x] Implementar hook `useReparto`
- [x] Función `asignarRepartidor(pedidoId, repartidorId)`
- [ ] Función `confirmarRecogida(pedidoId)` - NO NECESARIA (se marca automático al aceptar)
- [x] Función `confirmarEntrega(pedidoId)` - Implementada como `marcarComoEntregado`
- [ ] Registrar pago adelantado (true/false) - YA EXISTE EN MODELO
- [x] Calcular comisión de repartidor - TODO: Obtener de configuración
- [x] Trigger notificación cuando asignan pedido
- [x] Actualizar estado "en_reparto" al aceptar
- [x] Actualizar estado "entregado" al confirmar
- [x] Registrar timestamp de entrega

### Gestión de Liquidaciones

- [x] Componente `LiquidacionesPendientes`
- [x] Vista de pedidos por liquidar del repartidor
- [x] Botón "Liquidar" (repartidor o cajera)
- [x] Calcular monto a entregar (total - comisión)
- [x] Marcar como liquidado en Firestore
- [x] Historial de liquidaciones

---

## 💰 FASE 7: MÓDULO DE CORTE DE CAJA

### Gestión de Turnos

- [x] Crear página `/turnos`
- [x] Componente `GestionTurnos`
- [x] Vista de estado del turno actual
- [x] Formulario de apertura de turno (tipo, fondo inicial)
- [x] Formulario de cierre de turno (efectivo real, observaciones)
- [x] Mostrar totales del turno (ventas, efectivo, tarjeta, transferencia)
- [x] Calcular diferencia automática al cerrar
- [x] Validaciones completas
- [x] Integración con useTurnoActual hook

### Corte de Turno (Histórico)

- [x] Crear página `/caja/corte`
- [x] Componente `CorteCaja` para ver turnos cerrados
- [x] Filtro por fecha (rango desde-hasta)
- [x] Filtro por tipo de turno (matutino/vespertino)
- [x] Búsqueda por cajero
- [x] Ver detalles de turnos pasados
- [x] Modal `DetallesTurnoModal` con información completa
- [x] Ver transacciones del turno
- [x] Exportar PDF del corte con diseño profesional

### Reportes y Métricas

- [x] Crear página `/reportes`
- [x] Componente `ResumenDiario`
- [x] Gráfica de ventas por hora
- [x] Pedidos por canal
- [x] Productos más vendidos
- [x] Desempeño de repartidores
- [x] Comparativa vs día anterior
- [x] Filtro por rango de fechas
- [x] Exportar reportes a Excel
- [x] Implementar hook `useReportes`

---

## 🔔 FASE 8: SISTEMA DE NOTIFICACIONES

### Firebase Cloud Messaging (FCM)

- [x] Configurar FCM en Firebase Console
- [x] Agregar `firebase-messaging-sw.js` (service worker)
- [x] Crear `lib/notifications/fcm.ts`
- [x] Función `requestNotificationPermission()`
- [x] Función `subscribeUserToTopic(userId, role)`
- [x] Guardar FCM tokens en Firestore por usuario
- [x] Crear función Cloud para enviar notificaciones
- [x] Implementar `sendNotificationToRole(role, message)`

### Notificaciones UI (In-App)

- [x] Crear componente `NotificationCenter`
- [x] Implementar store de notificaciones (Zustand)
- [x] Componente `NotificationBadge` (contador)
- [x] Lista de notificaciones no leídas
- [x] Marcar como leída
- [x] Eliminar notificación
- [x] Notificación con sonido personalizado
- [x] Integrar sonidos de alerta (`/public/sounds/`)

### Triggers de Notificaciones

- [ ] Notificar cocina cuando nuevo pedido
- [ ] Notificar repartidores cuando pedido listo
- [ ] Notificar cajera cuando pedido entregado
- [ ] Notificar encargado en caso de incidencia
- [ ] Notificar en caso de retrasos (>30 min)

---

## 🌐 FASE 9: FORMULARIO WEB PÚBLICO

### Formulario de Pedidos Público

- [ ] Crear página `/pedir` (sin autenticación)
- [ ] Diseño atractivo y responsive
- [ ] Mostrar catálogo de productos con fotos
- [ ] Selector de productos con cantidades
- [ ] Modal de personalización
- [ ] Formulario de datos del cliente
- [ ] Selector de método de pago
- [ ] Campo de dirección con validación
- [ ] Calcular costo de envío según zona (opcional)
- [ ] Botón "Enviar Pedido"
- [ ] Pantalla de confirmación con ID de pedido
- [ ] Enviar notificación a cajera automáticamente

### Catálogo de Productos

- [ ] Crear página `/catalogo` (pública)
- [ ] Vista de productos disponibles
- [ ] Filtros por categoría
- [ ] Fotos de productos
- [ ] Descripción y precios
- [ ] Indicador de disponibilidad

---

## 🎨 FASE 10: UI/UX Y COMPONENTES COMPARTIDOS

### Layout y Navegación

- [ ] Crear componente `Sidebar` con navegación por rol
- [ ] Crear componente `Navbar` con info de usuario
- [ ] Crear componente `Footer`
- [ ] Implementar breadcrumbs
- [ ] Responsive menu (hamburger en móvil)
- [ ] Tema dark/light (opcional)

### Componentes Compartidos

- [ ] Componente `Button` (variantes)
- [ ] Componente `Input` con validación
- [ ] Componente `Select` estilizado
- [ ] Componente `Modal` reutilizable
- [ ] Componente `Card`
- [ ] Componente `Badge` (estados)
- [ ] Componente `Spinner` / Loading
- [ ] Componente `EmptyState`
- [ ] Componente `ErrorBoundary`
- [ ] Componente `Toast` para notificaciones
- [ ] Componente `ConfirmDialog`
- [ ] Componente `Tabs`

### Utilidades

- [ ] Crear `formatters.ts` (formatear moneda, fecha, etc.)
- [ ] Crear `validators.ts` (validar email, teléfono, etc.)
- [ ] Crear `constants.ts` (estados, roles, canales, etc.)
- [ ] Crear hook `useDebounce`
- [ ] Crear hook `useLocalStorage`
- [ ] Crear hook `useMediaQuery`

---

## 🔒 FASE 11: SEGURIDAD Y PERMISOS

### Firestore Rules

- [ ] Escribir reglas de seguridad por colección
- [ ] Permitir lectura/escritura según rol
- [ ] Validar estructura de documentos
- [ ] Implementar reglas para `pedidos`
- [ ] Implementar reglas para `usuarios`
- [ ] Implementar reglas para `productos`
- [ ] Implementar reglas para `turnos`
- [ ] Testear reglas con Firebase Emulator

### Storage Rules

- [ ] Escribir reglas de seguridad para Storage
- [ ] Permitir subida solo a usuarios autenticados
- [ ] Validar tipo y tamaño de archivos
- [ ] Organizar archivos por carpetas

### Validación y Sanitización

- [ ] Validar todos los inputs en frontend
- [ ] Sanitizar datos antes de guardar
- [ ] Implementar rate limiting (opcional)
- [ ] Proteger contra inyección de código
- [ ] Encriptar datos sensibles (teléfonos)

---

## 🧪 FASE 12: TESTING

### Unit Tests

- [ ] Configurar Jest + React Testing Library
- [ ] Tests para servicios de datos
- [ ] Tests para hooks custom
- [ ] Tests para utilidades (formatters, validators)
- [ ] Tests para componentes de formulario

### Integration Tests

- [ ] Tests de flujo de creación de pedido
- [ ] Tests de flujo de cocina
- [ ] Tests de flujo de reparto
- [ ] Tests de autenticación

### E2E Tests (Opcional)

- [ ] Configurar Playwright o Cypress
- [ ] Test de flujo completo de pedido
- [ ] Test de corte de caja

---

## 📚 FASE 13: DOCUMENTACIÓN

### Documentación Técnica

- [ ] Documentar arquitectura del proyecto
- [ ] Documentar estructura de Firestore
- [ ] Documentar API de servicios
- [ ] Documentar componentes principales
- [ ] Crear guía de contribución
- [ ] Documentar variables de entorno
- [ ] Crear diagrama de flujo de datos

### Manual de Usuario

- [ ] Manual para cajeras
- [ ] Manual para cocina
- [ ] Manual para repartidores
- [ ] Manual para encargados
- [ ] Manual para administradores
- [ ] Video tutoriales (opcional)
- [ ] FAQ

---

## 🚀 FASE 14: DEPLOYMENT Y LANZAMIENTO

### Preparación para Producción

- [ ] Configurar variables de entorno de producción
- [ ] Optimizar bundle size
- [ ] Configurar SEO básico
- [ ] Agregar analytics (Google Analytics o similar)
- [ ] Configurar error tracking (Sentry, opcional)
- [ ] Optimizar imágenes
- [ ] Implementar caching strategies
- [ ] Configurar HTTPS
- [ ] Crear favicon y PWA manifest

### Deployment

- [ ] Configurar Firebase Hosting
- [ ] Configurar dominio personalizado
- [ ] Deploy a staging environment
- [ ] Testing en staging
- [ ] Deploy a producción
- [ ] Configurar CI/CD (GitHub Actions, opcional)

### Lanzamiento

- [ ] Capacitación inicial al equipo
- [ ] Período de prueba con datos reales
- [ ] Operación paralela (nuevo sistema + manual)
- [ ] Monitoreo intensivo primera semana
- [ ] Recopilar feedback del equipo
- [ ] Ajustes post-lanzamiento
- [ ] Transición oficial al nuevo sistema

---

## 🔧 FASE 15: MANTENIMIENTO Y MEJORAS

### Post-Lanzamiento

- [ ] Monitoreo de errores y bugs
- [ ] Recopilar feedback de usuarios
- [ ] Priorizar mejoras según feedback
- [ ] Optimizaciones de performance
- [ ] Actualizar dependencias
- [ ] Backups automáticos de Firestore

### Mejoras Futuras (Backlog)

- [ ] Modo offline completo
- [ ] App móvil nativa (React Native)
- [ ] Integración con WhatsApp Business API
- [ ] Integración con Uber Eats / Didi Food API
- [ ] Sistema de fidelización de clientes
- [ ] Módulo de inventario (Fase 2)
- [ ] Módulo de nómina (Fase 2)
- [ ] IA para predicción de demanda
- [ ] Optimización de rutas de reparto
- [ ] Sistema de evaluación de repartidores
- [ ] Multi-sucursal

---

## 📊 MÉTRICAS DE ÉXITO

### KPIs a Medir

- [ ] Tiempo promedio de captura de pedido
- [ ] Tiempo promedio de preparación en cocina
- [ ] Tiempo promedio de entrega
- [ ] Tasa de errores en pedidos
- [ ] Tasa de adopción del sistema por el equipo
- [ ] Satisfacción del equipo (encuesta)
- [ ] Reducción de tiempo en corte de caja
- [ ] Comparativa de volumen de pedidos vs capacidad

---

## 🎯 QUICK WINS (Tareas de Alto Impacto)

### Prioridad MÁXIMA para MVP

1. [ ] Setup del proyecto + Firebase
2. [ ] Autenticación básica
3. [ ] Modelo de datos en Firestore
4. [ ] Captura de pedidos (cajera)
5. [ ] Vista de cocina en tiempo real
6. [ ] Panel básico de reparto
7. [ ] Corte de caja simple
8. [ ] Notificaciones básicas

---

## 📝 NOTAS Y CONSIDERACIONES

### Decisiones Pendientes

- [ ] Definir si se usará Loyverse en paralelo o se reemplaza
- [ ] Decidir si se implementa geolocalización para reparto
- [ ] Definir política de retención de datos (¿cuánto historial guardar?)
- [ ] Decidir si se necesita modo offline avanzado
- [ ] Evaluar necesidad de backup adicional externo a Firebase

### Riesgos Identificados

- [ ] Resistencia al cambio por parte del equipo
- [ ] Curva de aprendizaje del nuevo sistema
- [ ] Posibles problemas de conectividad en ubicación física
- [ ] Dependencia de Firebase (vendor lock-in)

---

**Última actualización:** Octubre 2025  
**Responsable del proyecto:** Pedro Duran  
**Cliente:** Old Texas BBQ
