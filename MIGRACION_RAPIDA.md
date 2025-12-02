# 🚀 Migración Rápida de Claude Code

## ⚡ Método Rápido (5 minutos)

### 1. Ejecuta el Script Automático

```bash
cd "/Users/pedroduran/Desktop/Proyectos/Old Texas BBQ - CRM"
./migrate-claude-config.sh
```

El script te pedirá:
- Ruta de tu nuevo proyecto
- Confirmación para sobrescribir archivos (si existen)

### 2. Personaliza tu Proyecto

```bash
# Ve a tu nuevo proyecto
cd /path/to/tu-nuevo-proyecto

# Edita el nombre del proyecto
nano .claude/project_rules.md
# Cambia "Old Texas BBQ - CRM" por tu proyecto

# Completa el contexto
nano docs/CONTEXT.md
# Describe tu proyecto, stack, usuarios, etc.

# Planifica tus fases
nano docs/TODO.md
# Define qué vas a construir
```

### 3. Inicia Claude Code

```bash
# Abre en VS Code
code .

# En Claude Code, activa Jarvis
/jarvis

# Describe tu proyecto
"Voy a crear [tu proyecto]. Stack: Next.js, [tu stack]. ¿Por dónde empezamos?"
```

## 📦 Lo que se Migra

✅ **4 Agentes Especializados:**
- Jarvis (Agent Manager)
- Backend Developer
- Frontend Developer
- UI/UX Designer

✅ **9 Comandos Personalizados:**
- `/jarvis` - Activar asistente
- `/new-component` - Crear componente
- `/new-page` - Crear página
- `/new-service` - Crear servicio
- `/new-store` - Crear store
- `/design-ui` - Diseñar interfaz
- `/check-quality` - Verificar calidad
- `/review-context` - Revisar contexto
- `/build-frontend` y `/build-backend`

✅ **Archivos de Configuración:**
- `.claude/project_rules.md`
- `.claude/settings.local.json`
- `.claudeignore`

✅ **Documentación Base:**
- `docs/CONTEXT.md` - Contexto del proyecto
- `docs/TODO.md` - Lista de tareas
- `docs/NEXT_STEPS.md` - Próximos pasos
- `CLAUDE_MIGRATION_GUIDE.md` - Guía completa

## 🎯 Comandos Útiles Post-Migración

```bash
# Verificar estructura
ls -la .claude/
ls -la docs/

# Ver agentes disponibles
ls .claude/agents/

# Ver comandos disponibles
ls .claude/commands/

# Leer guía completa
cat CLAUDE_MIGRATION_GUIDE.md
```

## ⚙️ Personalización Importante

### Archivo: `.claude/project_rules.md`

Actualiza estas secciones:

```markdown
# CAMBIA ESTO 👇
Old Texas BBQ - CRM  →  TU-PROYECTO

# CAMBIA ESTO 👇
Sistema de gestión de restaurante  →  TU-DESCRIPCION

# REVISA Y ACTUALIZA 👇
Stack Tecnológico:
- Next.js 15 ✓ (probablemente igual)
- Firebase/Firestore → ¿Tu backend?
- Zustand → ¿Tu state manager?
```

### Archivo: `docs/CONTEXT.md`

Completa TODA la información:
- Objetivo del proyecto
- Stack tecnológico específico
- Roles de usuario
- Modelo de datos
- Paleta de colores

### Archivo: `docs/TODO.md`

Define tus fases:
```markdown
## FASE 1: SETUP
- [ ] Tus tareas específicas

## FASE 2: [TU FASE]
- [ ] Tus tareas

## FASE 3: [TU FASE]
- [ ] Tus tareas
```

## 🔧 Si Algo Sale Mal

### El script no funciona
```bash
# Dale permisos de ejecución
chmod +x migrate-claude-config.sh

# Ejecútalo de nuevo
./migrate-claude-config.sh
```

### No se copiaron los archivos
```bash
# Copia manual
cp -r .claude /path/to/nuevo-proyecto/
cp .claudeignore /path/to/nuevo-proyecto/
```

### Comandos no aparecen en VS Code
1. Reinicia VS Code
2. Verifica que estás en la raíz del proyecto
3. Verifica que `.claude/` existe

## 📚 Recursos

- **Guía Completa:** `CLAUDE_MIGRATION_GUIDE.md`
- **Claude Code Docs:** https://github.com/anthropics/claude-code
- **Próximos Pasos:** `docs/NEXT_STEPS.md` (en tu nuevo proyecto)

## 💡 Ejemplo de Uso en Nuevo Proyecto

```bash
# 1. Migrar
./migrate-claude-config.sh
> /Users/tu-usuario/proyectos/mi-app

# 2. Personalizar
cd /Users/tu-usuario/proyectos/mi-app
nano .claude/project_rules.md
nano docs/CONTEXT.md

# 3. Usar
code .
# En Claude Code:
/jarvis
"Voy a crear una app de [tu caso de uso]"
```

---

**Creado:** $(date +"%Y-%m-%d")
**Origen:** Old Texas BBQ - CRM
**Versión:** 1.0.0
