# 🍖 Old Texas BBQ - CRM: Reglas del Proyecto

## 📋 Contexto General

Este es un **Sistema Integral de Gestión (CRM)** para el restaurante Old Texas BBQ. El sistema automatiza todo el flujo de operaciones desde la recepción de pedidos hasta la entrega, incluyendo cocina, reparto y caja.

### Usuarios del Sistema

- **Cajera**: Recibe y gestiona pedidos
- **Cocina**: Visualiza comandas en tiempo real
- **Repartidor**: Gestiona entregas asignadas
- **Encargado**: Supervisión y reportes
- **Admin**: Configuración y gestión total

## 🏗️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript (estricto)
- **Estilos**: Tailwind CSS v4
- **Backend**: Firebase (Firestore, Auth, Storage, FCM)
- **Estado Global**: Zustand
- **Formularios**: React Hook Form
- **Utilidades**: date-fns, lucide-react, sonner

## 📁 Estructura de Carpetas

```
├── app/                    # Rutas y páginas (App Router)
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas del dashboard
│   └── api/               # API routes
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes UI base
│   ├── forms/            # Componentes de formularios
│   └── layout/           # Componentes de layout
├── lib/
│   ├── firebase/         # Configuración y servicios Firebase
│   ├── hooks/            # Hooks personalizados
│   ├── services/         # Servicios de datos (CRUD)
│   ├── stores/           # Stores de Zustand
│   ├── types/            # Tipos TypeScript
│   ├── constants/        # Constantes del sistema
│   └── utils/            # Utilidades
└── public/               # Archivos estáticos
```

## 🎯 Principios de Desarrollo

### 1. TypeScript Estricto

- ✅ **SIEMPRE** usar tipado explícito
- ✅ **NO** usar `any` (usar `unknown` si es necesario)
- ✅ Definir interfaces para todas las entidades
- ✅ Usar tipos del archivo `lib/types/index.ts`

### 2. Componentes

- ✅ Usar **Server Components** por defecto
- ✅ Marcar con `'use client'` solo cuando sea necesario (hooks, eventos, estado)
- ✅ Componentes pequeños y reutilizables
- ✅ Props tipadas con interfaces
- ✅ Nombres descriptivos en PascalCase

### 3. Estilos

- ✅ Usar **Tailwind CSS** exclusivamente
- ✅ NO crear archivos CSS personalizados
- ✅ Componentes responsive (mobile-first)
- ✅ Usar variables de Tailwind para consistencia

### 4. Estado Global (Zustand)

- ✅ Un store por dominio (pedidos, usuarios, etc.)
- ✅ Acciones tipadas
- ✅ Uso de immer para estado inmutable
- ✅ Persistencia cuando sea necesario

### 5. Firebase

- ✅ **SIEMPRE** validar autenticación
- ✅ Usar transacciones para operaciones críticas
- ✅ Implementar reglas de seguridad estrictas
- ✅ Optimizar queries (índices, límites)
- ✅ Manejar estados de carga y error

### 6. Formularios

- ✅ Usar **React Hook Form** siempre
- ✅ Validación con Zod o validadores custom
- ✅ Mensajes de error descriptivos
- ✅ Estados de carga en botones

### 7. Manejo de Errores

- ✅ Try-catch en todas las operaciones async
- ✅ Notificaciones con Sonner
- ✅ Logging de errores para debugging
- ✅ Mensajes amigables al usuario

### 8. Seguridad

- ✅ **NUNCA** exponer datos sensibles en el cliente
- ✅ Encriptar datos personales (teléfonos, direcciones)
- ✅ Validar permisos en cada operación
- ✅ Sanitizar inputs del usuario

### 9. Performance

- ✅ Lazy loading de componentes pesados
- ✅ Optimización de imágenes (next/image)
- ✅ Paginación en listas largas
- ✅ Debounce en búsquedas
- ✅ Memoización cuando sea necesario

### 10. Código Limpio

- ✅ Funciones pequeñas y con un solo propósito
- ✅ Nombres descriptivos y en español para variables de negocio
- ✅ Comentarios solo cuando sea necesario
- ✅ Formatear con Prettier antes de commits
- ✅ No dejar console.logs en producción

## 🔄 Flujo de Trabajo

### Al Crear Componentes

1. Definir la interfaz de Props
2. Implementar el componente
3. Agregar manejo de errores
4. Testear diferentes estados (loading, error, success)
5. Verificar responsive design

### Al Crear Servicios

1. Definir tipos de entrada y salida
2. Implementar la función con try-catch
3. Validar autenticación si es necesario
4. Agregar logging para debugging
5. Documentar con JSDoc

### Al Trabajar con Firebase

1. Verificar reglas de seguridad
2. Usar transacciones para operaciones críticas
3. Implementar offline persistence si es necesario
4. Optimizar queries con índices
5. Manejar estados de carga

## 📝 Nomenclatura

### Archivos

- Componentes: `PascalCase.tsx` (ej: `OrderCard.tsx`)
- Hooks: `use + PascalCase.ts` (ej: `useOrders.ts`)
- Servicios: `camelCase.ts` (ej: `orderService.ts`)
- Stores: `camelCase + Store.ts` (ej: `orderStore.ts`)
- Tipos: `index.ts` en carpeta `types/`

### Variables y Funciones

- Variables: `camelCase` (ej: `totalPedidos`)
- Funciones: `camelCase` (ej: `crearPedido`)
- Constantes: `UPPER_SNAKE_CASE` (ej: `MAX_ITEMS`)
- Componentes: `PascalCase` (ej: `OrderList`)

### Tipos e Interfaces

- Interfaces: `PascalCase` (ej: `Pedido`, `Usuario`)
- Types: `PascalCase` (ej: `Role`, `EstadoPedido`)
- Enums: `PascalCase` (ej: `PaymentMethod`)

## 🚫 Prácticas a Evitar

- ❌ NO usar `any` en TypeScript
- ❌ NO crear componentes gigantes (máx 200 líneas)
- ❌ NO mezclar lógica de negocio con UI
- ❌ NO hacer fetch directo sin error handling
- ❌ NO hardcodear valores (usar constantes)
- ❌ NO omitir validaciones de formularios
- ❌ NO ignorar warnings de ESLint
- ❌ NO commitear código sin formatear
- ❌ NO dejar TODOs sin resolver en producción

## 📚 Archivos de Referencia Clave

Antes de desarrollar, **SIEMPRE** consulta:

1. **`docs/CONTEXT.md`** - Contexto completo del proyecto
2. **`docs/TODO.md`** - Estado actual y próximas tareas
3. **`lib/types/index.ts`** - Tipos del sistema
4. **`lib/constants/index.ts`** - Constantes del sistema

## 🎨 Diseño UI/UX

### Colores (personalizar en Tailwind)

- Primario: Rojo/Marrón (tema BBQ)
- Secundario: Amarillo/Dorado
- Neutro: Grises
- Success: Verde
- Error: Rojo
- Warning: Amarillo

### Componentes UI

- Botones con estados (loading, disabled)
- Cards con sombras sutiles
- Modales para confirmaciones
- Toast para notificaciones
- Skeleton loaders para carga

### Responsive

- Mobile: < 768px (diseño vertical)
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔔 Notificaciones en Tiempo Real

- Usar Firebase Cloud Messaging (FCM)
- Sonido para nuevos pedidos (cocina)
- Vibración para asignación de reparto
- Badge count en navegación

## 🔐 Roles y Permisos

| Funcionalidad     | Cajera | Cocina | Repartidor | Encargado | Admin |
| ----------------- | ------ | ------ | ---------- | --------- | ----- |
| Crear pedido      | ✅     | ❌     | ❌         | ✅        | ✅    |
| Ver comandas      | ✅     | ✅     | ❌         | ✅        | ✅    |
| Gestionar reparto | ❌     | ❌     | ✅         | ✅        | ✅    |
| Corte de caja     | ✅     | ❌     | ❌         | ✅        | ✅    |
| Reportes          | ❌     | ❌     | ❌         | ✅        | ✅    |
| Configuración     | ❌     | ❌     | ❌         | ❌        | ✅    |

## 📊 Métricas Importantes

Trackear en dashboard:

- Pedidos por hora
- Tiempo promedio de preparación
- Tickets promedio
- Canal más usado
- Repartidores activos
- Diferencias en caja

## 🎯 Prioridades

1. **Funcionalidad** sobre diseño
2. **Performance** sobre features extras
3. **Seguridad** sobre conveniencia
4. **UX simple** sobre complejidad

## 💡 Tips de Desarrollo

1. Lee **CONTEXT.md** y **TODO.md** antes de cada sesión
2. Usa los tipos definidos en `lib/types/`
3. Reutiliza componentes existentes
4. Testea en diferentes roles de usuario
5. Verifica responsive en mobile
6. Optimiza para operación rápida (usuarios en movimiento)
7. Piensa en offline-first cuando sea posible

---

**Última actualización**: Octubre 2025
