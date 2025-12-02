# 📦 Guía de Migración de Configuraciones de Claude Code

Esta guía te ayudará a migrar todas las configuraciones de Claude Code de este proyecto a un nuevo proyecto Next.js.

## 🎯 ¿Qué se Incluye?

### 📁 Estructura Completa

```
.claude/
├── README.md                          # Documentación principal
├── project_rules.md                   # Reglas del proyecto
├── settings.local.json                # Configuraciones locales
├── agents/                            # Agentes especializados
│   ├── agent-manager.md              # Jarvis - Orquestador principal
│   ├── backend-developer.md          # Especialista en backend
│   ├── ui-ux-designer.md             # Diseñador UI/UX
│   └── frontend-developer.md         # Especialista en frontend
└── commands/                          # Comandos personalizados
    ├── jarvis.md                     # Activar Jarvis
    ├── new-component.md              # Crear componente
    ├── new-page.md                   # Crear página
    ├── new-service.md                # Crear servicio
    ├── new-store.md                  # Crear store Zustand
    ├── design-ui.md                  # Diseñar interfaz
    ├── build-frontend.md             # Build frontend
    ├── build-backend.md              # Build backend
    ├── review-context.md             # Revisar contexto
    └── check-quality.md              # Verificar calidad

.claudeignore                          # Archivos a ignorar
```

## 🚀 Métodos de Migración

### Método 1: Copia Manual (Recomendado para personalización)

```bash
# 1. Ir a tu nuevo proyecto
cd /path/to/nuevo-proyecto

# 2. Copiar toda la carpeta .claude
cp -r /Users/pedroduran/Desktop/Proyectos/Old\ Texas\ BBQ\ -\ CRM/.claude .

# 3. Copiar .claudeignore
cp /Users/pedroduran/Desktop/Proyectos/Old\ Texas\ BBQ\ -\ CRM/.claudeignore .

# 4. Verificar
ls -la .claude/
```

### Método 2: Script Automático (Más rápido)

Usa el script incluido más abajo en esta guía.

## 📝 Pasos Post-Migración

### 1. Actualizar `project_rules.md`

Edita `.claude/project_rules.md` y actualiza:

```markdown
# Nombre del proyecto
Old Texas BBQ - CRM  →  TU-NUEVO-PROYECTO

# Descripción
Sistema de gestión de restaurante  →  TU-DESCRIPCION

# Stack tecnológico
- Revisa y actualiza según tu stack
- Mantén lo que uses, elimina lo que no
```

### 2. Actualizar Agentes (Opcional)

Los agentes son genéricos y funcionarán, pero puedes personalizar:

**`.claude/agents/backend-developer.md`**
- Actualiza ejemplos específicos de tu dominio
- Mantén la estructura general

**`.claude/agents/ui-ux-designer.md`**
- Actualiza paleta de colores si es diferente
- Mantén principios de diseño

**`.claude/agents/frontend-developer.md`**
- Actualiza componentes específicos de tu proyecto

### 3. Personalizar Comandos

**Mantener sin cambios:**
- `/jarvis` - Funciona universalmente
- `/new-component` - Genérico
- `/new-page` - Genérico
- `/check-quality` - Genérico

**Revisar y actualizar:**
- `/new-service` - Si usas Firebase/Firestore, mantén. Si no, actualiza.
- `/new-store` - Si usas Zustand, mantén. Si usas Redux/otra cosa, actualiza.
- `/design-ui` - Actualiza paleta de colores específica

### 4. Actualizar `.claudeignore`

Revisa y ajusta según tu estructura:

```gitignore
# Mantén estas (comunes a todos los proyectos)
node_modules/
.next/
.git/
dist/
build/
*.log

# Actualiza rutas específicas de tu proyecto
docs/firebase/         # Si no usas Firebase, elimina
public/sounds/         # Si no tienes, elimina
```

### 5. Crear Documentación Inicial

Crea los archivos base que los agentes esperan:

```bash
mkdir -p docs

# Archivo de contexto
touch docs/CONTEXT.md

# Lista de tareas
touch docs/TODO.md

# Próximos pasos
touch docs/NEXT_STEPS.md
```

**Contenido mínimo para `docs/CONTEXT.md`:**

```markdown
# Contexto del Proyecto

## 🎯 Objetivo

[Describe tu proyecto]

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** [Tu elección]
- **Backend:** [Tu elección]

## 👥 Usuarios

[Describe roles de usuario]

## 📊 Modelo de Datos

[Describe tu modelo de datos]
```

**Contenido mínimo para `docs/TODO.md`:**

```markdown
# 📋 TODO LIST

## 🏗️ FASE 1: SETUP

- [ ] Configurar Next.js
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind
- [ ] Instalar shadcn/ui

## 🎯 SIGUIENTE

[Tus prioridades]
```

## 🔧 Script de Migración Automática

Guarda este script como `migrate-claude.sh` en tu nuevo proyecto:

```bash
#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Migrando configuraciones de Claude Code...${NC}\n"

# Verificar que estamos en un proyecto
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠️  Advertencia: No se encontró package.json${NC}"
    echo "¿Estás seguro de que estás en la raíz de tu proyecto? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Cancelando..."
        exit 1
    fi
fi

# Ruta del proyecto origen
ORIGEN="/Users/pedroduran/Desktop/Proyectos/Old Texas BBQ - CRM"

# Copiar .claude/
echo -e "${GREEN}📁 Copiando carpeta .claude/${NC}"
if [ -d "$ORIGEN/.claude" ]; then
    cp -r "$ORIGEN/.claude" .
    echo "   ✓ .claude/ copiado"
else
    echo "   ✗ No se encontró .claude/ en el origen"
    exit 1
fi

# Copiar .claudeignore
echo -e "${GREEN}📄 Copiando .claudeignore${NC}"
if [ -f "$ORIGEN/.claudeignore" ]; then
    cp "$ORIGEN/.claudeignore" .
    echo "   ✓ .claudeignore copiado"
else
    echo "   ⚠️  No se encontró .claudeignore"
fi

# Crear carpeta docs si no existe
echo -e "${GREEN}📚 Creando estructura de docs/${NC}"
mkdir -p docs

# Crear archivos base si no existen
if [ ! -f "docs/CONTEXT.md" ]; then
    cat > docs/CONTEXT.md << 'EOF'
# Contexto del Proyecto

## 🎯 Objetivo

[Describe tu proyecto aquí]

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** [Tu elección]
- **Backend:** [Tu elección]

## 👥 Usuarios y Roles

[Describe los roles de usuario]

## 📊 Modelo de Datos

[Describe tu estructura de datos]
EOF
    echo "   ✓ docs/CONTEXT.md creado"
fi

if [ ! -f "docs/TODO.md" ]; then
    cat > docs/TODO.md << 'EOF'
# 📋 TODO LIST

## 🏗️ FASE 1: SETUP DEL PROYECTO

- [ ] Configurar Next.js
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar shadcn/ui
- [ ] Configurar estructura de carpetas

## 🎯 SIGUIENTE FASE

[Define tus prioridades]
EOF
    echo "   ✓ docs/TODO.md creado"
fi

if [ ! -f "docs/NEXT_STEPS.md" ]; then
    cat > docs/NEXT_STEPS.md << 'EOF'
# 🎯 Próximos Pasos

## Inmediato

1. Actualizar `.claude/project_rules.md` con el nombre y descripción de tu proyecto
2. Completar `docs/CONTEXT.md` con información específica
3. Planificar fases en `docs/TODO.md`

## Siguiente

- Activar Jarvis: `/jarvis`
- Crear primer componente: `/new-component`
EOF
    echo "   ✓ docs/NEXT_STEPS.md creado"
fi

# Resumen
echo -e "\n${GREEN}✅ Migración completada exitosamente!${NC}\n"
echo -e "${BLUE}📋 Archivos migrados:${NC}"
echo "   • .claude/ (con 4 agentes y 9 comandos)"
echo "   • .claudeignore"
echo "   • docs/CONTEXT.md"
echo "   • docs/TODO.md"
echo "   • docs/NEXT_STEPS.md"

echo -e "\n${YELLOW}⚠️  Próximos pasos importantes:${NC}"
echo "   1. Edita .claude/project_rules.md con tu proyecto"
echo "   2. Completa docs/CONTEXT.md"
echo "   3. Planifica en docs/TODO.md"
echo "   4. Activa Jarvis con: /jarvis"

echo -e "\n${GREEN}🎉 ¡Listo para usar Claude Code!${NC}\n"
```

### Uso del script:

```bash
# 1. En tu nuevo proyecto
cd /path/to/nuevo-proyecto

# 2. Crear el script
nano migrate-claude.sh
# (pega el contenido de arriba)

# 3. Dar permisos de ejecución
chmod +x migrate-claude.sh

# 4. Ejecutar
./migrate-claude.sh
```

## ✅ Verificación Post-Migración

Ejecuta estos comandos para verificar que todo está bien:

```bash
# Verificar estructura
ls -la .claude/
ls -la .claude/agents/
ls -la .claude/commands/

# Verificar archivos de docs
ls -la docs/

# Verificar que .claudeignore existe
cat .claudeignore
```

Deberías ver:
```
✓ .claude/README.md
✓ .claude/project_rules.md
✓ .claude/settings.local.json
✓ 4 agentes en .claude/agents/
✓ 9 comandos en .claude/commands/
✓ .claudeignore
✓ docs/CONTEXT.md
✓ docs/TODO.md
```

## 🎯 Usar Claude Code en el Nuevo Proyecto

Una vez migrado:

1. **Abrir en VS Code con Claude Code**
   ```bash
   code .
   ```

2. **Activar Jarvis**
   ```
   /jarvis
   ```

3. **Describir tu proyecto**
   ```
   "Voy a crear [describe tu proyecto].
   Stack: Next.js, [tu stack].
   ¿Qué debería hacer primero?"
   ```

4. **Jarvis coordinará todo** - analizará tu proyecto, activará los agentes necesarios, y te guiará paso a paso.

## 💡 Comandos Útiles

```bash
/jarvis                    # Activar asistente principal
/new-component Button      # Crear componente
/new-page dashboard        # Crear página
/new-service users         # Crear servicio
/design-ui login           # Diseñar UI
/check-quality            # Verificar calidad
/review-context           # Revisar estado
```

## 🔄 Diferencias con el Proyecto Original

Este proyecto (Old Texas BBQ) usa:
- Firebase/Firestore
- Zustand para estado
- Cloudinary para imágenes
- shadcn/ui

Si tu proyecto usa algo diferente, actualiza:
- `.claude/project_rules.md` - Stack tecnológico
- `.claude/commands/new-service.md` - Si no usas Firebase
- `.claude/commands/new-store.md` - Si no usas Zustand

## 📚 Recursos Adicionales

- [Documentación de Claude Code](https://github.com/anthropics/claude-code)
- [shadcn/ui](https://ui.shadcn.com/)
- [Next.js](https://nextjs.org/)

## 🆘 Troubleshooting

**Problema:** Comandos no aparecen
- Solución: Reinicia VS Code

**Problema:** Jarvis no conoce mi proyecto
- Solución: Completa `docs/CONTEXT.md` y `docs/TODO.md`

**Problema:** Agentes usan stack incorrecto
- Solución: Actualiza `.claude/project_rules.md`

---

**¿Necesitas ayuda?** Activa Jarvis con `/jarvis` y pregunta.

**Elaborado:** $(date +"%Y-%m-%d")
**Versión:** 1.0.0
