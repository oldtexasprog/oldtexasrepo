# 🤖 Configuración de Claude Code

Esta carpeta contiene las reglas y comandos personalizados para mantener un contexto óptimo durante el desarrollo con Claude Code.

## 📁 Contenido

### `project_rules.md`

**Reglas principales del proyecto** - Lee este archivo ANTES de desarrollar cualquier funcionalidad.

Incluye:

- 🏗️ Stack tecnológico
- 📁 Estructura de carpetas
- 🎯 Principios de desarrollo
- 📝 Nomenclatura y convenciones
- 🚫 Prácticas a evitar
- 🔐 Roles y permisos

## 🤖 Agentes Especializados (`agents/`)

### 🎨 UI/UX Designer

**Archivo**: `agents/ui-ux-designer.md`

Experto en diseño de interfaces usando **shadcn/ui** y Tailwind CSS.

**Especialidad**:

- Sistema de diseño BBQ personalizado
- Componentes accesibles (WCAG 2.1 AA)
- Mobile-first responsive design
- Patrones UI específicos por rol
- Uso eficiente de shadcn/ui (menos tokens)

**Comando**: `/design-ui`

### ⚛️ Frontend Developer

**Archivo**: `agents/frontend-developer.md`

Experto en **Next.js 14+, React, TypeScript** y Zustand.

**Especialidad**:

- Server/Client Components
- Formularios con React Hook Form + Zod
- Estado global con Zustand + immer
- Custom hooks y optimizaciones
- Integración con shadcn/ui

**Comando**: `/build-frontend`

### 🔥 Backend Developer

**Archivo**: `agents/backend-developer.md`

Experto en **Firebase** (Firestore, Auth, Storage, FCM).

**Especialidad**:

- Servicios CRUD completos y tipados
- Seguridad y encriptación de datos
- Reglas de seguridad Firestore
- Optimización de queries e índices
- Transacciones y batch operations

**Comando**: `/build-backend`

## 📝 Comandos Disponibles

### 🎨 Comandos de Agentes Especializados

#### `/design-ui`

Activa el **UI/UX Designer** para diseñar interfaces.

- Diseño completo con shadcn/ui
- Estados: loading, error, success, empty
- Responsive y accesible
- Optimizado para tokens

#### `/build-frontend`

Activa el **Frontend Developer** para implementar lógica de cliente.

- Componentes React con TypeScript
- Estado global y formularios
- Integración con servicios
- Custom hooks

#### `/build-backend`

Activa el **Backend Developer** para servicios Firebase.

- CRUD operations
- Autenticación y autorización
- Seguridad y encriptación
- Queries optimizadas

### 🛠️ Comandos de Generación

#### `/new-component`

Genera un componente React.

- Pregunta tipo (UI, form, layout)
- TypeScript estricto
- Tailwind CSS

#### `/new-service`

Genera un servicio Firebase.

- CRUD completo
- Manejo de errores
- Tipos TypeScript

#### `/new-store`

Genera un store Zustand.

- Immer middleware
- Persist opcional
- Acciones tipadas

#### `/new-page`

Genera una página Next.js.

- App Router
- Metadata
- Server/Client component

### 🔍 Comandos de Utilidad

#### `/review-context`

Revisa el estado del proyecto.

- Lee CONTEXT.md y TODO.md
- Muestra tareas completadas y pendientes
- Próxima acción recomendada

#### `/check-quality`

Verifica calidad del código.

- ESLint
- Build test
- Cumplimiento de reglas

## 🚀 Uso de Comandos

En tu conversación con Claude Code, simplemente escribe el comando:

```
/design-ui
```

O menciona lo que necesitas y Claude usará el agente apropiado automáticamente.

## 📋 Workflow Recomendado

### 1️⃣ Iniciar Sesión

```bash
/review-context
```

### 2️⃣ Diseñar UI

```bash
/design-ui
# El UI/UX Designer preguntará detalles y diseñará la interfaz
```

### 3️⃣ Implementar Frontend

```bash
/build-frontend
# El Frontend Developer implementará la lógica de cliente
```

### 4️⃣ Crear Backend

```bash
/build-backend
# El Backend Developer creará los servicios Firebase
```

### 5️⃣ Verificar Calidad

```bash
/check-quality
npm run format
```

## 💡 Ventajas de los Agentes

### 🎯 Especialización

Cada agente es experto en su área y sigue las mejores prácticas específicas.

### 📦 Uso Eficiente de Tokens

- **shadcn/ui**: Componentes listos, menos código custom
- **Patrones probados**: Menos iteraciones
- **Contexto enfocado**: Solo carga lo necesario

### 🔄 Consistencia

Todos los agentes siguen las mismas reglas del proyecto automáticamente.

### ⚡ Velocidad

Código production-ready desde el primer intento.

## 🎯 Archivos Clave

### Para Agentes (contexto automático):

1. **`.claude/project_rules.md`** - Reglas del proyecto
2. **`docs/CONTEXT.md`** - Contexto del negocio
3. **`docs/TODO.md`** - Tareas y progreso
4. **`lib/types/index.ts`** - Tipos del sistema
5. **`lib/constants/index.ts`** - Constantes

### Para Ti (documentación):

1. **`README.md`** - Documentación general
2. **`NEXT_STEPS.md`** - Próximos pasos
3. **`CLAUDE_SETUP.md`** - Guía de Claude Code

## 🎨 Ejemplo de Uso

```
Usuario: Necesito diseñar una tarjeta para mostrar pedidos en la vista de cocina

Claude: Voy a activar el UI/UX Designer para diseñar esta interfaz.

[Lee .claude/agents/ui-ux-designer.md]
[Diseña usando shadcn/ui]
[Proporciona código completo y responsive]
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Backend**: Firebase (Firestore, Auth, Storage, FCM)
- **State**: Zustand + immer
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📚 Referencias Rápidas

- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [Next.js 14](https://nextjs.org/docs) - Framework
- [Firebase](https://firebase.google.com/docs) - Backend
- [Tailwind CSS](https://tailwindcss.com) - Estilos
- [Zustand](https://zustand-demo.pmnd.rs) - Estado

---

**Tip**: Los agentes están optimizados para proporcionar código de alta calidad usando menos tokens gracias a shadcn/ui y patrones establecidos.
