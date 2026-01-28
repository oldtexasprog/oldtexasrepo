# 🏗️ Arquitectura del Sistema - Old Texas BBQ CRM

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura de Capas](#arquitectura-de-capas)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Flujo de Datos](#flujo-de-datos)
7. [Decisiones Arquitectónicas](#decisiones-arquitectónicas)
8. [Escalabilidad](#escalabilidad)
9. [Seguridad](#seguridad)

---

## 🎯 Visión General

Old Texas BBQ CRM es un sistema integral de gestión diseñado específicamente para restaurantes, con enfoque en operación rápida, tiempo real y múltiples roles de usuario.

### Características Principales

- **Tiempo Real**: Actualizaciones instantáneas mediante Firebase Firestore
- **Multi-rol**: Cajera, Cocina, Repartidor, Encargado, Admin
- **Responsive**: Diseñado mobile-first con Tailwind CSS
- **Offline-ready**: Persistencia local con Firestore offline mode
- **Type-safe**: TypeScript estricto en todo el código
- **Escalable**: Arquitectura modular y componentes reutilizables

---

## 💻 Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14+ | Framework principal (App Router) |
| **React** | 18+ | Librería UI |
| **TypeScript** | 5+ | Tipado estático |
| **Tailwind CSS** | 4.0 | Estilos y diseño responsive |
| **Zustand** | 4+ | Estado global |
| **React Hook Form** | 7+ | Gestión de formularios |
| **date-fns** | 3+ | Manipulación de fechas |
| **lucide-react** | Latest | Iconografía |
| **sonner** | Latest | Notificaciones toast |
| **@dnd-kit** | Latest | Drag & drop (Kanban) |

### Backend & Servicios

| Servicio | Propósito |
|----------|-----------|
| **Firebase Firestore** | Base de datos NoSQL en tiempo real |
| **Firebase Authentication** | Autenticación y gestión de usuarios |
| **Firebase Cloud Messaging** | Notificaciones push |
| **Cloudinary** | Almacenamiento y optimización de imágenes |
| **Vercel** | Hosting y deployment |

### Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| **Jest** | Testing unitario e integración |
| **React Testing Library** | Testing de componentes |
| **ESLint** | Linter de código |
| **Prettier** | Formateo de código |
| **Claude Code** | Asistente de desarrollo |

---

## 🏛️ Arquitectura de Capas

El sistema sigue una arquitectura en capas claramente separada:

```
┌─────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN            │
│  (Pages, Components, Layouts)           │
│  - Next.js App Router                   │
│  - React Components                     │
│  - Tailwind CSS                         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      CAPA DE LÓGICA DE NEGOCIO          │
│  (Hooks, Stores, Validators)            │
│  - Custom Hooks                         │
│  - Zustand Stores                       │
│  - Business Logic                       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       CAPA DE SERVICIOS DE DATOS        │
│  (Services, Firebase, API)              │
│  - CRUD Operations                      │
│  - Real-time Listeners                  │
│  - Data Transformations                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│        CAPA DE PERSISTENCIA             │
│  (Firebase Firestore, Cloudinary)       │
│  - Database                             │
│  - Storage                              │
│  - Authentication                       │
└─────────────────────────────────────────┘
```

### Separación de Responsabilidades

#### 1. Capa de Presentación
- **Responsabilidad**: Renderizar UI y manejar interacción del usuario
- **Componentes**: Pages, UI Components, Layouts
- **Tecnologías**: Next.js, React, Tailwind CSS
- **Regla**: NO contiene lógica de negocio, solo presentación

#### 2. Capa de Lógica de Negocio
- **Responsabilidad**: Orquestar flujos de negocio y validaciones
- **Componentes**: Custom Hooks, Stores, Validators
- **Tecnologías**: Zustand, React Hooks
- **Regla**: NO accede directamente a Firebase, usa servicios

#### 3. Capa de Servicios
- **Responsabilidad**: Operaciones CRUD y transformación de datos
- **Componentes**: Services (pedidos, productos, usuarios, etc.)
- **Tecnologías**: Firebase SDK
- **Regla**: Cada servicio es agnóstico de la UI

#### 4. Capa de Persistencia
- **Responsabilidad**: Almacenamiento y recuperación de datos
- **Componentes**: Firestore, Cloudinary
- **Tecnologías**: Firebase, Cloud Services
- **Regla**: Acceso solo a través de servicios

---

## 📁 Estructura de Carpetas

```
old-texas-bbq-crm/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación (agrupadas)
│   │   ├── login/
│   │   └── recuperar-password/
│   ├── (dashboard)/              # Rutas principales (agrupadas)
│   │   ├── pedidos/
│   │   ├── cocina/
│   │   ├── reparto/
│   │   ├── productos/
│   │   ├── turnos/
│   │   ├── reportes/
│   │   └── perfil/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── productos/
│   │   └── upload/
│   ├── pedir/                    # Formulario público (sin auth)
│   ├── layout.tsx                # Layout raíz
│   └── page.tsx                  # Página de inicio
│
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/                   # Componentes de layout
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── DashboardLayout.tsx
│   ├── forms/                    # Componentes de formularios
│   │   ├── FormPedido.tsx
│   │   ├── FormProducto.tsx
│   │   └── ...
│   ├── pedidos/                  # Componentes de pedidos
│   ├── productos/                # Componentes de productos
│   ├── cocina/                   # Componentes de cocina
│   ├── reparto/                  # Componentes de reparto
│   ├── turnos/                   # Componentes de turnos
│   └── notifications/            # Componentes de notificaciones
│
├── lib/                          # Lógica de negocio y utilidades
│   ├── firebase/                 # Configuración Firebase
│   │   └── config.ts
│   ├── services/                 # Servicios de datos (CRUD)
│   │   ├── base.service.ts       # Servicio base genérico
│   │   ├── pedidos.service.ts
│   │   ├── productos.service.ts
│   │   ├── usuarios.service.ts
│   │   ├── repartidores.service.ts
│   │   ├── turnos.service.ts
│   │   ├── notificaciones.service.ts
│   │   └── reportes.service.ts
│   ├── stores/                   # Zustand stores
│   │   ├── auth.store.ts
│   │   ├── pedidos.store.ts
│   │   ├── productos.store.ts
│   │   └── notifications.store.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── usePedidos.ts
│   │   ├── useProductos.ts
│   │   ├── useTurnoActual.ts
│   │   └── useNotifications.ts
│   ├── types/                    # Tipos TypeScript
│   │   └── firestore.ts          # Tipos del schema de Firestore
│   ├── constants/                # Constantes del sistema
│   │   └── index.ts
│   ├── utils/                    # Utilidades
│   │   ├── formatters.ts         # Formateo (fecha, moneda, etc.)
│   │   ├── validators.ts         # Validaciones
│   │   └── helpers.ts            # Helpers generales
│   ├── auth/                     # Autenticación server-side
│   │   ├── jwt.ts
│   │   └── session.ts
│   └── api/                      # Utilidades API
│       ├── with-auth.ts
│       └── validators.ts
│
├── public/                       # Archivos estáticos
│   ├── images/
│   ├── sounds/
│   └── icons/
│
├── __tests__/                    # Tests
│   ├── unit/
│   ├── integration/
│   └── utils/
│
├── docs/                         # Documentación
│   ├── CONTEXT.md
│   ├── TODO.md
│   ├── ARQUITECTURA.md           # Este archivo
│   ├── FIRESTORE_SCHEMA.md
│   └── ...
│
└── .claude/                      # Configuración Claude Code
    ├── project_rules.md
    ├── agents/
    └── skills/
```

### Convenciones de Nombres

- **Componentes**: PascalCase (ej: `ProductoCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (ej: `usePedidos.ts`)
- **Services**: camelCase con sufijo `.service.ts` (ej: `pedidos.service.ts`)
- **Stores**: camelCase con sufijo `.store.ts` (ej: `auth.store.ts`)
- **Tipos**: PascalCase en `firestore.ts`
- **Constantes**: UPPER_SNAKE_CASE

---

## 🎨 Patrones de Diseño

### 1. Service Layer Pattern

Todas las operaciones de datos pasan por servicios dedicados:

```typescript
// ✅ Correcto: Usar servicio
import { pedidosService } from '@/lib/services/pedidos.service';

const pedido = await pedidosService.getById(id);
await pedidosService.update(id, data);

// ❌ Incorrecto: Acceso directo a Firebase
import { doc, getDoc } from 'firebase/firestore';
const pedidoDoc = await getDoc(doc(db, 'pedidos', id));
```

**Beneficios**:
- Centralización de lógica de datos
- Reutilización de código
- Facilita testing con mocks
- Abstrae implementación de Firebase

### 2. Repository Pattern (BaseService)

Servicio base genérico con operaciones CRUD comunes:

```typescript
// Servicio base
class BaseService<T> {
  create(data: Partial<T>): Promise<string>
  getById(id: string): Promise<T | null>
  getAll(options?: QueryOptions): Promise<T[]>
  update(id: string, data: Partial<T>): Promise<void>
  delete(id: string): Promise<void>
}

// Servicios específicos extienden BaseService
class PedidosService extends BaseService<Pedido> {
  // Métodos específicos de pedidos
  crearPedidoCompleto(...)
  asignarRepartidor(...)
}
```

### 3. Custom Hooks Pattern

Encapsular lógica de negocio en hooks reutilizables:

```typescript
// Hook personalizado
export const usePedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscripción a Firestore en tiempo real
    const unsubscribe = pedidosService.onCollectionChange((data) => {
      setPedidos(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { pedidos, loading };
};
```

### 4. State Management con Zustand

Estado global simple y eficiente:

```typescript
// Store de autenticación
export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  loading: true,

  setUsuario: (usuario) => set({ usuario }),
  logout: () => set({ usuario: null }),
}));
```

**Por qué Zustand**:
- Más simple que Redux
- No requiere providers ni context
- TypeScript-first
- Performance optimizado
- Bundle pequeño

### 5. Composition Pattern

Componentes pequeños y composables:

```typescript
// ✅ Componentes pequeños y enfocados
<PedidoCard>
  <PedidoHeader />
  <PedidoItems />
  <PedidoTotales />
  <PedidoActions />
</PedidoCard>

// ❌ Componente monolítico
<PedidoCardGigante /> // 500 líneas
```

### 6. Observer Pattern (Firestore Realtime)

Suscripciones a cambios en tiempo real:

```typescript
// Listener en tiempo real
pedidosService.onCollectionChange((pedidos) => {
  // Se ejecuta automáticamente cuando cambian los datos
  updateUI(pedidos);
});
```

### 7. Factory Pattern (Servicios)

Instancias únicas exportadas de servicios:

```typescript
// ✅ Singleton exportado
export const pedidosService = new PedidosService();

// Todos los componentes usan la misma instancia
import { pedidosService } from '@/lib/services/pedidos.service';
```

---

## 🔄 Flujo de Datos

### Flujo Unidireccional

```
User Action → Component → Hook/Store → Service → Firebase
     ↑                                              ↓
     └──────────────── Realtime Update ────────────┘
```

### Ejemplo: Crear un Pedido

```typescript
// 1. Usuario hace clic en "Crear Pedido"
<Button onClick={handleSubmit}>Crear Pedido</Button>

// 2. Componente llama al hook/service
const handleSubmit = async (data) => {
  await pedidosService.crearPedidoCompleto(data, items);
};

// 3. Service ejecuta operación en Firebase
async crearPedidoCompleto(pedido, items) {
  const pedidoId = await this.create(pedido);
  await this.addItems(pedidoId, items);
  await this.notificarNuevoPedido(pedidoId);
}

// 4. Firebase actualiza en tiempo real
onCollectionChange((pedidos) => {
  // Todos los componentes suscritos se actualizan automáticamente
  setPedidos(pedidos);
});

// 5. UI se re-renderiza con nuevos datos
```

### Flujo de Notificaciones

```
Evento → Service → notificacionesService → FCM → Push Notification
  ↓
Firestore → Realtime Listener → UI Update
```

---

## 🧠 Decisiones Arquitectónicas

### 1. ¿Por qué Next.js App Router?

**Decisión**: Usar Next.js 14+ con App Router

**Razones**:
- Server Components por defecto (mejor performance)
- Routing basado en carpetas (más intuitivo)
- Layouts anidados nativos
- Carga de datos optimizada
- SEO mejorado
- API routes integradas

**Trade-off**: Curva de aprendizaje vs paradigma anterior

---

### 2. ¿Por qué Firebase?

**Decisión**: Firebase como backend completo

**Razones**:
- Realtime database (crítico para cocina y reparto)
- Autenticación integrada
- Escalable automáticamente
- Offline persistence
- SDK robusto
- Costos predecibles

**Alternativas consideradas**:
- ❌ PostgreSQL + API custom: Más complejo, no realtime nativo
- ❌ MongoDB: No optimizado para realtime
- ❌ Supabase: Menos maduro en notificaciones push

---

### 3. ¿Por qué Zustand vs Redux?

**Decisión**: Zustand para estado global

**Razones**:
- Sintaxis más simple (menos boilerplate)
- TypeScript-first
- No requiere providers
- Bundle size pequeño (3kb vs 20kb Redux)
- Performance optimizado

**Cuándo usar Redux**: Aplicaciones muy grandes con lógica compleja de estado

---

### 4. ¿Por qué Tailwind CSS?

**Decisión**: Tailwind v4 para estilos

**Razones**:
- Utility-first (desarrollo rápido)
- No CSS personalizado (consistencia)
- Responsive design simple
- Purge automático (bundle pequeño)
- Tema centralizado

**Alternativas consideradas**:
- ❌ CSS Modules: Más código, menos consistente
- ❌ Styled Components: Runtime overhead
- ❌ Bootstrap: Menos flexible, bundle grande

---

### 5. ¿Por qué TypeScript Estricto?

**Decisión**: TypeScript con modo estricto activado

**Razones**:
- Previene bugs en tiempo de desarrollo
- Autocompletado inteligente
- Refactoring seguro
- Documentación implícita en tipos
- Mejor experiencia de desarrollo

**Reglas**:
- ✅ NUNCA usar `any`
- ✅ Definir interfaces para todo
- ✅ Tipado explícito en funciones

---

### 6. ¿Por qué No SSR en Dashboard?

**Decisión**: Client-side rendering para dashboard, SSR solo para landing

**Razones**:
- Dashboard requiere autenticación (no beneficio SEO)
- Realtime updates (WebSocket-like)
- Mejor UX con estado persistente cliente
- Menor carga en servidor

**SSR usado en**:
- `/` (landing page)
- `/pedir` (formulario público)

---

### 7. ¿Por qué Cloudinary vs Firebase Storage?

**Decisión**: Cloudinary para imágenes

**Razones**:
- Transformaciones automáticas (resize, crop)
- CDN global optimizado
- Formato WebP automático
- Plan gratuito generoso
- API simple

---

## 📈 Escalabilidad

### Estrategias Implementadas

#### 1. Lazy Loading de Componentes

```typescript
// Cargar componentes pesados solo cuando se necesiten
const DetallesPedido = lazy(() => import('./DetallesPedido'));
```

#### 2. Paginación en Listas

```typescript
// Limitar queries de Firestore
query(collection(db, 'pedidos'), limit(50));
```

#### 3. Índices Compuestos

```firestore
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "pedidos",
      "fields": [
        { "fieldPath": "estado", "order": "ASCENDING" },
        { "fieldPath": "fechaCreacion", "order": "DESCENDING" }
      ]
    }
  ]
}
```

#### 4. Debounce en Búsquedas

```typescript
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);
```

#### 5. Memoization

```typescript
const pedidosFiltrados = useMemo(
  () => pedidos.filter(f => f.estado === 'pendiente'),
  [pedidos]
);
```

### Límites Conocidos

- **Firestore**: 1 escritura/segundo por documento
- **FCM**: 1000 notificaciones/segundo (plan gratuito)
- **Cloudinary**: 25 créditos/mes en plan gratuito

---

## 🔒 Seguridad

### Capas de Seguridad

#### 1. Autenticación (Firebase Auth)
- Email/password con hash seguro
- Sesiones con JWT httpOnly cookies
- Tokens de refresh automáticos

#### 2. Autorización por Rol
```typescript
// Middleware de protección
export const withAuth = (roles: Rol[]) => {
  return async (req, res) => {
    const usuario = await getSession(req);
    if (!roles.includes(usuario.rol)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // ...
  };
};
```

#### 3. Firestore Security Rules
```firestore
// Solo el creador o admin pueden editar
match /pedidos/{pedidoId} {
  allow read: if isAuthenticated();
  allow update: if isOwner() || isAdmin();
}
```

#### 4. Validación Server-Side
```typescript
// API route validado
export async function POST(req: Request) {
  const data = await req.json();

  // Sanitizar inputs
  const sanitized = sanitizeObject(data);

  // Validar estructura
  validatePedidoSchema(sanitized);

  // Procesar...
}
```

#### 5. Sanitización de Datos
```typescript
// Remover caracteres peligrosos
export const sanitizeString = (str: string): string => {
  return str
    .replace(/<script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};
```

### Mejores Prácticas

- ✅ NUNCA exponer API keys en cliente
- ✅ Variables de entorno para secrets
- ✅ HTTPS obligatorio en producción
- ✅ Rate limiting en API routes
- ✅ Logs de auditoría en operaciones críticas
- ✅ Backup automático de Firestore

---

## 📊 Métricas y Monitoreo

### KPIs Técnicos

- **Time to Interactive (TTI)**: < 3s
- **First Contentful Paint (FCP)**: < 1.5s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 500kb inicial
- **Test Coverage**: > 70%

### Herramientas de Monitoreo

- **Vercel Analytics**: Performance y Core Web Vitals
- **Firebase Console**: Errores y crashes
- **Browser DevTools**: Profiling y network

---

## 🚀 Roadmap Técnico

### Corto Plazo (1-3 meses)
- [ ] Implementar PWA (Progressive Web App)
- [ ] Agregar E2E tests con Playwright
- [ ] Optimizar imágenes con next/image
- [ ] Implementar Service Worker para offline

### Medio Plazo (3-6 meses)
- [ ] Migrar a Server Actions de Next.js
- [ ] Implementar GraphQL con Firebase Extensions
- [ ] Agregar analytics avanzados
- [ ] Multi-tenancy para franquicias

### Largo Plazo (6-12 meses)
- [ ] App móvil nativa (React Native)
- [ ] IA para predicción de demanda
- [ ] Optimización de rutas de reparto
- [ ] Integración con APIs externas (Uber Eats, Didi)

---

## 📚 Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última actualización**: Enero 2026
**Versión**: 1.0
**Autor**: Equipo de Desarrollo Old Texas BBQ
