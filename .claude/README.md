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

### Comandos Personalizados (`commands/`)

#### `/new-component`

Crea un nuevo componente React siguiendo las convenciones del proyecto.

- Pregunta tipo (UI, form, layout)
- Genera estructura correcta
- Incluye TypeScript y Tailwind

#### `/new-service`

Crea un servicio para interactuar con Firebase Firestore.

- Operaciones CRUD tipadas
- Manejo de errores
- Logging incluido

#### `/new-store`

Crea un store de Zustand para estado global.

- Immer middleware
- Persist opcional
- TypeScript estricto

#### `/new-page`

Crea una página en Next.js App Router.

- Metadata configurado
- Server/Client component
- Rutas dinámicas

#### `/review-context`

Revisa el estado actual del proyecto.

- Lee CONTEXT.md y TODO.md
- Muestra próximas tareas
- Verifica estado del proyecto

#### `/check-quality`

Ejecuta revisión de calidad del código.

- ESLint
- Build
- Cumplimiento de reglas

## 🚀 Uso de Comandos

En tu conversación con Claude Code, simplemente escribe:

```
/new-component
```

O menciona que necesitas crear algo específico y Claude usará el comando apropiado.

## 📋 Workflow Recomendado

1. **Al iniciar sesión**: `/review-context`
2. **Antes de desarrollar**: Lee `project_rules.md`
3. **Al crear componentes**: `/new-component`
4. **Al crear servicios**: `/new-service`
5. **Antes de commit**: `/check-quality`

## 🎯 Archivos Clave a Consultar

Siempre ten presente:

- `docs/CONTEXT.md` - Contexto completo
- `docs/TODO.md` - Tareas pendientes
- `lib/types/index.ts` - Tipos del sistema
- `lib/constants/index.ts` - Constantes

---

**Tip**: Estos archivos están optimizados para que Claude Code mantenga el mejor contexto posible del proyecto Old Texas BBQ - CRM.
