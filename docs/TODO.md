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

### Configuración de Entorno
- [ ] Inicializar proyecto Next.js 14+ (App Router)
- [ ] Configurar TypeScript
- [ ] Instalar y configurar Tailwind CSS
- [ ] Configurar ESLint y Prettier
- [ ] Configurar Git y crear repositorio
- [ ] Crear estructura de carpetas modular
- [ ] Configurar variables de entorno (.env)
- [ ] Crear README.md con instrucciones de setup

### Firebase Setup
- [ ] Crear proyecto en Firebase Console
- [ ] Habilitar Firestore Database
- [ ] Habilitar Firebase Authentication
- [ ] Habilitar Firebase Storage
- [ ] Habilitar Firebase Hosting
- [ ] Habilitar Firebase Cloud Messaging (FCM)
- [ ] Configurar reglas de seguridad de Firestore (básicas)
- [ ] Configurar reglas de Storage
- [ ] Conectar Firebase al proyecto Next.js
- [ ] Crear archivo de configuración de Firebase (`lib/firebase/config.ts`)

### Dependencias Base
- [ ] Instalar Firebase SDK (`firebase`)
- [ ] Instalar Zustand (estado global)
- [ ] Instalar React Hook Form
- [ ] Instalar date-fns (manejo de fechas)
- [ ] Instalar lucide-react (iconos)
- [ ] Instalar sonner o react-hot-toast (notificaciones UI)
- [ ] Configurar file de tipos TypeScript globales

---

## 🗄️ FASE 2: ARQUITECTURA DE DATOS

### Modelo de Datos Firestore
- [ ] Diseñar colección `usuarios`
- [ ] Diseñar colección `pedidos`
- [ ] Diseñar colección `productos`
- [ ] Diseñar colección `personalizaciones`
- [ ] Diseñar colección `repartidores`
- [ ] Diseñar colección `turnos` (cortes de caja)
- [ ] Diseñar colección `configuracion`
- [ ] Crear documento de especificación del schema
- [ ] Definir índices compuestos necesarios
- [ ] Crear scripts de seed data para testing

### Servicios de Datos (CRUD)
- [ ] Crear `pedidosService.ts` (CRUD pedidos)
- [ ] Crear `productosService.ts` (CRUD productos)
- [ ] Crear `usuariosService.ts` (CRUD usuarios)
- [ ] Crear `repartidoresService.ts` (CRUD repartidores)
- [ ] Crear `turnosService.ts` (cortes de caja)
- [ ] Crear `notificacionesService.ts`
- [ ] Implementar listeners en tiempo real (onSnapshot)
- [ ] Crear helpers para queries complejas
- [ ] Implementar manejo de errores consistente
- [ ] Crear utilidades de validación de datos

---

## 🔐 FASE 3: AUTENTICACIÓN Y ROLES

### Sistema de Auth
- [ ] Implementar login con email/password (Firebase Auth)
- [ ] Crear página de login (`/login`)
- [ ] Crear componente `ProtectedRoute`
- [ ] Implementar middleware de autenticación
- [ ] Crear hook `useAuth`
- [ ] Implementar logout
- [ ] Crear store de autenticación (Zustand)
- [ ] Manejo de sesiones persistentes
- [ ] Implementar recuperación de contraseña
- [ ] Crear flujo de cambio de contraseña

### Sistema de Roles
- [ ] Definir enum de roles (`cajera`, `cocina`, `repartidor`, `encargado`, `admin`)
- [ ] Implementar HOC `withRole` para protección por rol
- [ ] Crear hook `useRole` para verificar permisos
- [ ] Implementar matriz de permisos
- [ ] Crear función `checkPermission(user, action)`
- [ ] Implementar restricciones UI según rol
- [ ] Agregar roles a colección `usuarios` en Firestore
- [ ] Crear página de gestión de usuarios (solo admin)

---

## 📱 FASE 4: MÓDULO DE PEDIDOS (CAJERA)

### UI - Captura de Pedidos
- [ ] Crear página `/pedidos/nuevo`
- [ ] Crear componente `FormPedido`
- [ ] Implementar selector de canal (WhatsApp/Mostrador/Uber/Didi/Llamada/Web)
- [ ] Crear componente `ClienteForm` (nombre, dirección, teléfono)
- [ ] Crear componente `ProductoSelector` (búsqueda y selección)
- [ ] Implementar carrito de productos temporal
- [ ] Crear componente `PersonalizacionModal` (salsas, extras, presentación)
- [ ] Implementar cálculo automático de totales
- [ ] Crear componente `MetodoPagoSelector`
- [ ] Implementar lógica de cambio (si paga con efectivo)
- [ ] Crear componente `RepartidorAsignador`
- [ ] Implementar campo de observaciones
- [ ] Botón "Crear Pedido" con validaciones
- [ ] Implementar feedback visual de éxito/error

### Lógica de Negocio
- [ ] Implementar hook `usePedidos`
- [ ] Función para crear pedido (`createPedido`)
- [ ] Función para editar pedido (`updatePedido`)
- [ ] Función para cancelar pedido (`cancelPedido`)
- [ ] Generar ID consecutivo de pedido
- [ ] Implementar validaciones de formulario
- [ ] Calcular subtotal + envío automáticamente
- [ ] Calcular cambio si método es efectivo
- [ ] Guardar timestamp de creación
- [ ] Trigger notificación a cocina al crear pedido

### Lista de Pedidos
- [ ] Crear página `/pedidos`
- [ ] Componente `ListaPedidos` con filtros
- [ ] Filtro por estado (pendiente/en_preparacion/listo/en_reparto/entregado)
- [ ] Filtro por fecha
- [ ] Filtro por canal
- [ ] Filtro por repartidor
- [ ] Componente `PedidoCard` con info resumida
- [ ] Modal de detalles del pedido
- [ ] Botones de acción según estado
- [ ] Implementar búsqueda por ID o cliente
- [ ] Paginación o scroll infinito
- [ ] Vista en tiempo real (onSnapshot)

### Bitácora Digital
- [ ] Crear componente `BitacoraDigital`
- [ ] Vista tabla con todos los pedidos del día
- [ ] Columnas: ID, Monto, Cambio, Colonia, Envío, Repartidor, Método de pago
- [ ] Totales automáticos por método de pago
- [ ] Botón exportar a Excel/CSV
- [ ] Filtro por turno (matutino/vespertino)

---

## 👨‍🍳 FASE 5: MÓDULO DE COCINA

### Tablero de Comandas
- [ ] Crear página `/cocina`
- [ ] Componente `TableroComandas` (tipo Kanban)
- [ ] Columnas: Pendiente | En Preparación | Listo
- [ ] Componente `ComandaCard`
- [ ] Mostrar productos con cantidades
- [ ] Destacar personalizaciones (color/icono)
- [ ] Mostrar tiempo transcurrido desde creación
- [ ] Drag & drop entre columnas (opcional)
- [ ] Botón "Marcar como Listo"
- [ ] Actualización en tiempo real (onSnapshot)
- [ ] Notificación sonora cuando llega nuevo pedido
- [ ] Modo pantalla completa (sin distracciones)

### Lógica de Cocina
- [ ] Implementar hook `useCocina`
- [ ] Función `marcarEnPreparacion(pedidoId)`
- [ ] Función `marcarListo(pedidoId)`
- [ ] Trigger notificación a reparto cuando pedido listo
- [ ] Actualizar timestamps en Firestore
- [ ] Ordenar por prioridad/tiempo de espera
- [ ] Filtrar solo pedidos del día actual

---

## 🛵 FASE 6: MÓDULO DE REPARTO

### Panel de Repartidores
- [ ] Crear página `/reparto`
- [ ] Componente `PedidosListosParaRecoger`
- [ ] Componente `MisPedidosAsignados`
- [ ] Componente `PedidoRepartoCard`
- [ ] Mostrar: ID, Monto total, Envío, Colonia, Observaciones
- [ ] **NO mostrar:** Teléfono completo ni nombre completo del cliente
- [ ] Botón "Aceptar Pedido"
- [ ] Botón "Marcar como Entregado"
- [ ] Botón "Reportar Incidencia"
- [ ] Vista de mapa con dirección (opcional)
- [ ] Historial de mis entregas del día

### Lógica de Reparto
- [ ] Implementar hook `useReparto`
- [ ] Función `asignarRepartidor(pedidoId, repartidorId)`
- [ ] Función `confirmarRecogida(pedidoId)`
- [ ] Función `confirmarEntrega(pedidoId)`
- [ ] Registrar pago adelantado (true/false)
- [ ] Calcular comisión de repartidor
- [ ] Trigger notificación cuando asignan pedido
- [ ] Actualizar estado "en_reparto" al aceptar
- [ ] Actualizar estado "entregado" al confirmar
- [ ] Registrar timestamp de entrega

### Gestión de Liquidaciones
- [ ] Componente `LiquidacionesPendientes`
- [ ] Vista de pedidos por liquidar del repartidor
- [ ] Botón "Liquidar" (repartidor o cajera)
- [ ] Calcular monto a entregar (total - comisión)
- [ ] Marcar como liquidado en Firestore
- [ ] Historial de liquidaciones

---

## 💰 FASE 7: MÓDULO DE CORTE DE CAJA

### Corte de Turno
- [ ] Crear página `/caja/corte`
- [ ] Componente `CorteCaja`
- [ ] Selector de turno (matutino/vespertino)
- [ ] Mostrar fondo inicial
- [ ] Resumen de ventas por método de pago
- [ ] Total en efectivo esperado
- [ ] Total en tarjeta/transferencia
- [ ] Total de envíos cobrados
- [ ] Total de comisiones de repartidores
- [ ] Campo para ingresar efectivo real en caja
- [ ] Calcular diferencia (faltante/sobrante)
- [ ] Botón "Cerrar Turno"
- [ ] Generar documento de corte en Firestore
- [ ] Exportar PDF del corte

### Reportes y Métricas
- [ ] Crear página `/reportes`
- [ ] Componente `ResumenDiario`
- [ ] Gráfica de ventas por hora
- [ ] Pedidos por canal
- [ ] Productos más vendidos
- [ ] Desempeño de repartidores
- [ ] Comparativa vs día anterior
- [ ] Filtro por rango de fechas
- [ ] Exportar reportes a Excel
- [ ] Implementar hook `useReportes`

---

## 🔔 FASE 8: SISTEMA DE NOTIFICACIONES

### Firebase Cloud Messaging (FCM)
- [ ] Configurar FCM en Firebase Console
- [ ] Agregar `firebase-messaging-sw.js` (service worker)
- [ ] Crear `lib/notifications/fcm.ts`
- [ ] Función `requestNotificationPermission()`
- [ ] Función `subscribeUserToTopic(userId, role)`
- [ ] Guardar FCM tokens en Firestore por usuario
- [ ] Crear función Cloud para enviar notificaciones
- [ ] Implementar `sendNotificationToRole(role, message)`

### Notificaciones UI (In-App)
- [ ] Crear componente `NotificationCenter`
- [ ] Implementar store de notificaciones (Zustand)
- [ ] Componente `NotificationBadge` (contador)
- [ ] Lista de notificaciones no leídas
- [ ] Marcar como leída
- [ ] Eliminar notificación
- [ ] Notificación con sonido personalizado
- [ ] Integrar sonidos de alerta (`/public/sounds/`)

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
