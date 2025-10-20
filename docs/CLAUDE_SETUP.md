# 🤖 Guía de Configuración de Claude Code

## ✅ Configuración Completada

Se ha creado una configuración completa de Claude Code para mantener un contexto óptimo durante el desarrollo del proyecto Old Texas BBQ - CRM.

## 📁 Archivos Creados

### `.claude/project_rules.md`

**El archivo más importante** - Contiene todas las reglas de desarrollo del proyecto:

- 🏗️ Stack tecnológico y arquitectura
- 📁 Estructura de carpetas y convenciones
- 🎯 Principios de desarrollo (TypeScript, componentes, estilos)
- 📝 Nomenclatura y estándares de código
- 🚫 Prácticas a evitar
- 🔐 Roles y permisos del sistema
- 📊 Métricas y consideraciones importantes

**⚠️ IMPORTANTE**: Claude Code leerá este archivo automáticamente para mantener contexto durante el desarrollo.

### `.claude/commands/` - Comandos Personalizados

#### 1. `/new-component`

Crea un componente React siguiendo las convenciones del proyecto.

**Uso**: Simplemente escribe `/new-component` en el chat.

**Hace**:

- Pregunta el tipo de componente (UI, form, layout)
- Genera estructura correcta en la carpeta adecuada
- Incluye TypeScript estricto
- Aplica Tailwind CSS
- Configura como Server/Client component según necesidad

#### 2. `/new-service`

Genera un servicio para interactuar con Firebase Firestore.

**Uso**: `/new-service`

**Hace**:

- Crea operaciones CRUD completas
- Incluye manejo de errores
- Tipado TypeScript estricto
- Logging para debugging

#### 3. `/new-store`

Crea un store de Zustand para estado global.

**Uso**: `/new-store`

**Hace**:

- Genera estructura con immer middleware
- Incluye persist si es necesario
- Acciones tipadas
- Estados de loading y error

#### 4. `/new-page`

Crea una página en Next.js con App Router.

**Uso**: `/new-page`

**Hace**:

- Genera estructura de página
- Configura metadata
- Maneja rutas dinámicas
- Incluye loading/error states

#### 5. `/review-context`

Revisa el estado actual del proyecto.

**Uso**: Escribe `/review-context` al iniciar una sesión de desarrollo.

**Hace**:

- Lee CONTEXT.md y TODO.md
- Muestra tareas completadas y pendientes
- Identifica próxima tarea
- Da recomendaciones

#### 6. `/check-quality`

Ejecuta revisión de calidad del código.

**Uso**: `/check-quality` antes de hacer commits.

**Hace**:

- Ejecuta ESLint
- Verifica build
- Revisa cumplimiento de reglas
- Genera reporte de mejoras

### `.claudeignore`

Optimiza el contexto ignorando archivos innecesarios:

- `node_modules/`
- `.next/`
- Build artifacts
- Lock files
- Archivos temporales

## 🚀 Cómo Usar Esta Configuración

### Al Iniciar una Nueva Sesión

```
/review-context
```

Esto te dará un resumen completo del estado del proyecto y qué hacer a continuación.

### Durante el Desarrollo

Simplemente menciona lo que necesitas y Claude Code usará automáticamente las reglas y comandos apropiados:

**Ejemplos**:

- "Necesito crear un componente para mostrar tarjetas de pedidos"
  → Claude usará `/new-component` internamente
- "Voy a crear el servicio de pedidos para Firebase"
  → Claude usará `/new-service`
- "Necesito un store para gestionar el estado de autenticación"
  → Claude usará `/new-store`

### Antes de Hacer Commits

```
/check-quality
```

Esto verificará que todo cumpla con los estándares del proyecto.

## 📋 Archivos Clave a Conocer

### Para Claude Code (contexto automático):

1. **`.claude/project_rules.md`** - Reglas del proyecto
2. **`docs/CONTEXT.md`** - Contexto completo del negocio
3. **`docs/TODO.md`** - Tareas y progreso
4. **`lib/types/index.ts`** - Tipos del sistema
5. **`lib/constants/index.ts`** - Constantes

### Para Ti (documentación):

1. **`README.md`** - Documentación general
2. **`NEXT_STEPS.md`** - Próximos pasos (Firebase setup)
3. **`.claude/README.md`** - Guía de comandos Claude

## 🎯 Workflow Recomendado

### 1️⃣ Iniciar Sesión

```
/review-context
```

### 2️⃣ Desarrollar

- Usa los comandos `/new-*` según necesites
- O simplemente describe lo que necesitas hacer

### 3️⃣ Antes de Commit

```
/check-quality
npm run format
git add .
git commit -m "..."
```

## 💡 Tips Importantes

### ✅ Haz Esto:

- Usa `/review-context` al inicio de cada sesión
- Consulta `project_rules.md` cuando tengas dudas
- Usa los comandos personalizados para generación de código
- Mantén TODO.md actualizado
- Ejecuta `/check-quality` regularmente

### ❌ Evita Esto:

- Crear código sin consultar las reglas
- Ignorar las convenciones de nomenclatura
- Omitir tipado TypeScript
- Saltarte las validaciones
- Dejar TODOs sin resolver

## 🔄 Mantener el Contexto

Claude Code ahora tiene acceso automático a:

1. **Reglas del proyecto** → `.claude/project_rules.md`
2. **Comandos personalizados** → `.claude/commands/`
3. **Contexto de negocio** → `docs/CONTEXT.md`
4. **Estado actual** → `docs/TODO.md`
5. **Tipos del sistema** → `lib/types/index.ts`

Esto significa que Claude mantendrá **consistencia** en:

- Estilo de código
- Nomenclatura
- Arquitectura
- Mejores prácticas

## 🎓 Próximos Pasos

1. **Configurar Firebase** (ver `NEXT_STEPS.md`)
2. **Iniciar desarrollo de funcionalidades** (ver `docs/TODO.md`)
3. **Usar comandos de Claude** para acelerar desarrollo

## 📚 Recursos Adicionales

- [Claude Code Docs](https://docs.claude.com/claude-code)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

**¡Listo para desarrollar!** 🚀

Cada vez que necesites ayuda, simplemente pregunta o usa los comandos personalizados.
Claude Code mantendrá el contexto completo del proyecto automáticamente.
