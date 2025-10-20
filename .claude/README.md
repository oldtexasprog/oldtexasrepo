# 🤖 Configuración de Claude Code

Sistema inteligente de desarrollo para **Old Texas BBQ - CRM** con Agent Manager (Jarvis) y agentes especializados.

## 🌟 NUEVO: Jarvis - Tu Asistente Inteligente

### 🤖 ¿Qué es Jarvis?

**Jarvis** es tu Agent Manager - un orquestador inteligente tipo Iron Man que:

- 🎧 Escucha tus necesidades en **lenguaje natural**
- 🧠 Analiza y decide qué agentes necesitas
- 📋 Crea planes de ejecución optimizados
- 🚀 Coordina múltiples agentes automáticamente
- ✅ Verifica calidad y sugiere mejoras
- 💡 Propone próximos pasos proactivamente

### ⚡ Uso de Jarvis

```bash
/jarvis
```

Luego simplemente describe lo que necesitas:

```
"Necesito la pantalla de pedidos para cocina"
"Optimiza el rendimiento de la lista de productos"
"Los pedidos no se guardan, ayuda"
"¿Cómo está el proyecto?"
```

**Jarvis coordina todo automáticamente** 🎯

---

## 📁 Contenido

### `project_rules.md`

Reglas principales del proyecto - Jarvis las sigue automáticamente.

### 🤖 **Agent Manager** (`agents/agent-manager.md`)

**Jarvis** - Tu orquestador central

**Comando**: `/jarvis`

**Capacidades**:

- Coordinación multi-agente inteligente
- Análisis de contexto completo del proyecto
- Planificación automática de tareas
- Ejecución secuencial u paralela según necesidad
- Detección y resolución de problemas
- Sugerencias proactivas de mejoras

**Cuándo usar**:

- ✨ **Siempre** - Es tu punto de entrada principal
- Features complejos que requieren múltiples agentes
- Necesitas orientación sobre qué hacer
- Quieres desarrollo con mínimo esfuerzo

---

## 🤖 Agentes Especializados

Jarvis coordina estos agentes automáticamente, pero puedes invocarlos directamente:

### 🎨 UI/UX Designer

**Archivo**: `agents/ui-ux-designer.md`  
**Comando**: `/design-ui`

**Experto en**: shadcn/ui, Tailwind CSS, diseño accesible, patrones UI por rol

### ⚛️ Frontend Developer

**Archivo**: `agents/frontend-developer.md`  
**Comando**: `/build-frontend`

**Experto en**: Next.js 14+, React, TypeScript, Zustand, React Hook Form

### 🔥 Backend Developer

**Archivo**: `agents/backend-developer.md`  
**Comando**: `/build-backend`

**Experto en**: Firebase, Firestore, Auth, Storage, FCM, Security Rules

---

## 📝 Todos los Comandos

### 🤖 **Comando Principal**

#### `/jarvis` ⭐

**Tu asistente inteligente** - Punto de entrada recomendado

Simplemente describe qué necesitas y Jarvis:

1. Analiza tu request
2. Crea un plan
3. Coordina los agentes necesarios
4. Ejecuta todo
5. Verifica calidad
6. Sugiere siguiente paso

**Ejemplos**:

```
/jarvis
→ "Necesito crear la pantalla de cocina"
→ "Optimiza la lista de pedidos"
→ "¿Qué debería hacer ahora?"
```

### 🎨 Comandos de Agentes

#### `/design-ui`

Activa UI/UX Designer directamente

#### `/build-frontend`

Activa Frontend Developer directamente

#### `/build-backend`

Activa Backend Developer directamente

### 🛠️ Comandos de Generación

#### `/new-component`

Genera componente React

#### `/new-service`

Genera servicio Firebase

#### `/new-store`

Genera store Zustand

#### `/new-page`

Genera página Next.js

### 🔍 Comandos de Utilidad

#### `/review-context`

Revisa estado del proyecto

#### `/check-quality`

Verifica calidad de código

---

## 🚀 Workflows Recomendados

### 🌟 Workflow con Jarvis (Recomendado)

```bash
# 1. Activar Jarvis
/jarvis

# 2. Describir lo que necesitas
"Necesito la funcionalidad completa de pedidos para cajera"

# 3. Jarvis hace todo:
# - Analiza
# - Planifica
# - Coordina agentes (UI → Frontend → Backend)
# - Ejecuta
# - Verifica
# - Sugiere siguiente paso

# 4. Continuar desarrollo
"Ahora necesito la vista de cocina"
# Jarvis repite el proceso automáticamente
```

### 📋 Workflow Manual (Granular)

```bash
# 1. Revisar estado
/review-context

# 2. Diseñar UI
/design-ui

# 3. Implementar frontend
/build-frontend

# 4. Crear backend
/build-backend

# 5. Verificar calidad
/check-quality
```

---

## 💬 Ejemplos de Uso con Jarvis

### Ejemplo 1: Feature Completo

```
Tú: /jarvis
Tú: Necesito la pantalla de gestión de productos para el encargado

Jarvis:
📋 Plan de Ejecución:
1. Diseñar interfaz CRUD (UI/UX Designer)
2. Implementar componente (Frontend Developer)
3. Crear servicios (Backend Developer)
4. Upload de imágenes (Backend Developer)

[Ejecuta automáticamente todo el plan]

✅ Completado!
💡 Siguiente: ¿Agregar gestión de categorías?
```

### Ejemplo 2: Debugging

```
Tú: /jarvis
Tú: Los pedidos no se están guardando

Jarvis:
🔍 Diagnosticando...
❌ Encontrado: Reglas Firestore bloqueando
🛠️ Solucionado: Reglas actualizadas
✅ Pedidos ahora se guardan correctamente
🧪 ¿Agregar tests para prevenir esto?
```

### Ejemplo 3: Optimización

```
Tú: /jarvis
Tú: La app está lenta

Jarvis:
🔍 Analizando performance...

Problemas detectados:
- Re-renders innecesarios
- Queries sin paginación
- Sin lazy loading

📋 Aplicando optimizaciones:
[Frontend] Memoization + virtualization
[Backend] Paginación + índices

✅ Optimizado!
📈 Mejora esperada: -70% tiempo de carga
```

---

## 🎯 Ventajas del Sistema

### Con Jarvis (Agent Manager)

✅ **Desarrollo en lenguaje natural**  
✅ **Coordinación automática de agentes**  
✅ **Planes de ejecución optimizados**  
✅ **Menos esfuerzo, más resultados**  
✅ **Sugerencias proactivas**  
✅ **Detección temprana de problemas**

### Con Agentes Especializados

✅ **Código experto por especialidad**  
✅ **shadcn/ui = Menos tokens**  
✅ **Consistencia automática**  
✅ **Production-ready desde inicio**  
✅ **TypeScript estricto**  
✅ **Accesibilidad integrada**

---

## 📊 Jerarquía de Comandos

```
/jarvis (🌟 RECOMENDADO)
├── Analiza tu request
├── Decide qué agentes usar
├── Coordina ejecución
└── Sugiere siguiente paso
    │
    ├── /design-ui (🎨 UI/UX Designer)
    ├── /build-frontend (⚛️ Frontend Dev)
    ├── /build-backend (🔥 Backend Dev)
    │
    ├── /new-component
    ├── /new-service
    ├── /new-store
    ├── /new-page
    │
    ├── /review-context
    └── /check-quality
```

---

## 🎓 Guía Rápida

### Nuevo en el Proyecto?

1. **Lee el contexto**:

   ```bash
   /jarvis
   "Dame un resumen del proyecto"
   ```

2. **Comienza a desarrollar**:

   ```bash
   /jarvis
   "Necesito [describe tu feature]"
   ```

3. **Jarvis se encarga del resto** ✨

### Tips Pro

- 🎯 **Sé específico**: "Pantalla de pedidos para cocina con filtros"
- 🗣️ **Lenguaje natural**: Habla como hablarías con un colega
- 💡 **Confía en Jarvis**: Él conoce el proyecto completo
- 📋 **Revisa sugerencias**: Jarvis propone próximos pasos útiles

---

## 📚 Archivos Clave

### Para Agentes (lectura automática)

1. `.claude/project_rules.md` - Reglas del proyecto
2. `docs/CONTEXT.md` - Contexto del negocio
3. `docs/TODO.md` - Tareas y progreso
4. `lib/types/index.ts` - Tipos del sistema
5. `lib/constants/index.ts` - Constantes

### Para Ti (documentación)

1. `CLAUDE_SETUP.md` - Guía completa de Claude Code
2. `README.md` - Documentación del proyecto
3. `NEXT_STEPS.md` - Próximos pasos

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Backend**: Firebase (Firestore, Auth, Storage, FCM)
- **State**: Zustand + immer
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

---

## 🎯 Conclusión

**Usa `/jarvis` como tu punto de entrada principal** 🤖

Jarvis es tu copiloto de desarrollo que:

- Entiende lo que necesitas
- Coordina todos los recursos
- Ejecuta con calidad
- Te mantiene enfocado en lo importante

**Solo describe, Jarvis hace el resto** ✨

---

**Sistema optimizado para desarrollo eficiente con mínimo esfuerzo**  
_Powered by Claude Code Agent System_
