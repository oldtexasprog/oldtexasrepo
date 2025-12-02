#!/bin/bash

# Script de Migración de Configuraciones de Claude Code
# Versión 1.0.0

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   🚀 Migración de Configuraciones de Claude Code         ║"
echo "║   Old Texas BBQ → Nuevo Proyecto                         ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Solicitar ruta del proyecto destino
echo -e "${YELLOW}📍 Ingresa la ruta COMPLETA de tu nuevo proyecto:${NC}"
echo -e "${BLUE}   Ejemplo: /Users/pedroduran/Desktop/Proyectos/mi-nuevo-proyecto${NC}"
read -r DESTINO

# Validar que se ingresó algo
if [ -z "$DESTINO" ]; then
    echo -e "${RED}❌ Error: No ingresaste una ruta${NC}"
    exit 1
fi

# Expandir ~ si se usó
DESTINO="${DESTINO/#\~/$HOME}"

# Verificar que el directorio existe
if [ ! -d "$DESTINO" ]; then
    echo -e "${RED}❌ Error: El directorio no existe: $DESTINO${NC}"
    exit 1
fi

# Verificar que es un proyecto (tiene package.json)
if [ ! -f "$DESTINO/package.json" ]; then
    echo -e "${YELLOW}⚠️  Advertencia: No se encontró package.json en el destino${NC}"
    echo "¿Continuar de todos modos? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Cancelando..."
        exit 1
    fi
fi

# Ruta del proyecto origen (este proyecto)
ORIGEN="/Users/pedroduran/Desktop/Proyectos/Old Texas BBQ - CRM"

echo -e "\n${GREEN}📦 Configuración:${NC}"
echo "   Origen:  $ORIGEN"
echo "   Destino: $DESTINO"
echo ""

# Confirmar
echo -e "${YELLOW}¿Proceder con la migración? (y/n)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "Cancelando..."
    exit 1
fi

echo ""
echo -e "${BLUE}🔄 Iniciando migración...${NC}\n"

# ============================================================================
# 1. Copiar .claude/
# ============================================================================

echo -e "${GREEN}1️⃣  Copiando carpeta .claude/${NC}"

if [ -d "$ORIGEN/.claude" ]; then
    # Verificar si ya existe
    if [ -d "$DESTINO/.claude" ]; then
        echo -e "   ${YELLOW}⚠️  .claude/ ya existe en destino${NC}"
        echo "   ¿Sobrescribir? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            rm -rf "$DESTINO/.claude"
            cp -r "$ORIGEN/.claude" "$DESTINO/"
            echo -e "   ${GREEN}✓ .claude/ sobrescrito${NC}"
        else
            echo -e "   ${YELLOW}↷ .claude/ omitido${NC}"
        fi
    else
        cp -r "$ORIGEN/.claude" "$DESTINO/"
        echo -e "   ${GREEN}✓ .claude/ copiado${NC}"
    fi

    # Contar archivos copiados
    AGENTES=$(ls -1 "$DESTINO/.claude/agents/" 2>/dev/null | wc -l | tr -d ' ')
    COMANDOS=$(ls -1 "$DESTINO/.claude/commands/" 2>/dev/null | wc -l | tr -d ' ')
    echo -e "   ${BLUE}  → $AGENTES agentes${NC}"
    echo -e "   ${BLUE}  → $COMANDOS comandos${NC}"
else
    echo -e "   ${RED}✗ No se encontró .claude/ en el origen${NC}"
    exit 1
fi

# ============================================================================
# 2. Copiar .claudeignore
# ============================================================================

echo -e "\n${GREEN}2️⃣  Copiando .claudeignore${NC}"

if [ -f "$ORIGEN/.claudeignore" ]; then
    if [ -f "$DESTINO/.claudeignore" ]; then
        echo -e "   ${YELLOW}⚠️  .claudeignore ya existe${NC}"
        echo "   ¿Sobrescribir? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            cp "$ORIGEN/.claudeignore" "$DESTINO/"
            echo -e "   ${GREEN}✓ .claudeignore sobrescrito${NC}"
        else
            echo -e "   ${YELLOW}↷ .claudeignore omitido${NC}"
        fi
    else
        cp "$ORIGEN/.claudeignore" "$DESTINO/"
        echo -e "   ${GREEN}✓ .claudeignore copiado${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  No se encontró .claudeignore${NC}"
fi

# ============================================================================
# 3. Crear carpeta docs/
# ============================================================================

echo -e "\n${GREEN}3️⃣  Creando estructura de docs/${NC}"

mkdir -p "$DESTINO/docs"
echo -e "   ${GREEN}✓ docs/ creado${NC}"

# ============================================================================
# 4. Crear CONTEXT.md
# ============================================================================

if [ ! -f "$DESTINO/docs/CONTEXT.md" ]; then
    cat > "$DESTINO/docs/CONTEXT.md" << 'EOF'
# Contexto del Proyecto

## 🎯 Objetivo

[Describe el objetivo principal de tu proyecto aquí]

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15
- **React:** 19
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui

### Backend
- **[Tu Backend Aquí]**

### State Management
- **[Zustand / Redux / Otra]**

### Base de Datos
- **[Firebase / Supabase / PostgreSQL / Otra]**

## 👥 Usuarios y Roles

### Roles del Sistema

1. **[Rol 1]**
   - Descripción
   - Permisos

2. **[Rol 2]**
   - Descripción
   - Permisos

## 📊 Modelo de Datos

### Colecciones/Tablas Principales

1. **[Entidad 1]**
   - Campo 1
   - Campo 2

2. **[Entidad 2]**
   - Campo 1
   - Campo 2

## 🎨 Diseño y UX

### Paleta de Colores

- **Primary:** [Tu color]
- **Secondary:** [Tu color]
- **Accent:** [Tu color]

### Componentes Clave

- [Lista de componentes principales]

## 📝 Notas Adicionales

[Información importante que Claude debe conocer]
EOF
    echo -e "   ${GREEN}✓ docs/CONTEXT.md creado${NC}"
else
    echo -e "   ${YELLOW}↷ docs/CONTEXT.md ya existe${NC}"
fi

# ============================================================================
# 5. Crear TODO.md
# ============================================================================

if [ ! -f "$DESTINO/docs/TODO.md" ]; then
    cat > "$DESTINO/docs/TODO.md" << 'EOF'
# 📋 TODO LIST

## 🏗️ FASE 1: SETUP DEL PROYECTO

### Configuración Inicial

- [ ] Inicializar proyecto Next.js
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar shadcn/ui
- [ ] Configurar ESLint y Prettier
- [ ] Configurar Git
- [ ] Crear estructura de carpetas

### Dependencias Base

- [ ] Instalar dependencias de UI
- [ ] Instalar dependencias de estado
- [ ] Instalar dependencias de backend
- [ ] Instalar dependencias de utilidades

---

## 🎯 FASE 2: ARQUITECTURA DE DATOS

### Modelo de Datos

- [ ] Definir entidades principales
- [ ] Crear tipos TypeScript
- [ ] Diseñar relaciones

### Servicios

- [ ] Crear servicios base
- [ ] Implementar CRUD operations
- [ ] Agregar validaciones

---

## 🔐 FASE 3: AUTENTICACIÓN

### Sistema de Auth

- [ ] Configurar autenticación
- [ ] Crear páginas de login/registro
- [ ] Implementar protección de rutas
- [ ] Crear sistema de roles

---

## 🎨 FASE 4: UI/UX

### Componentes Base

- [ ] Diseñar sistema de componentes
- [ ] Implementar layout principal
- [ ] Crear navegación
- [ ] Implementar tema (light/dark)

### Páginas Principales

- [ ] Dashboard
- [ ] [Tu página 1]
- [ ] [Tu página 2]

---

## 📝 NOTAS

- Usa `/jarvis` para coordinar el desarrollo
- Actualiza este archivo conforme avances
- Marca tareas completadas con [x]
EOF
    echo -e "   ${GREEN}✓ docs/TODO.md creado${NC}"
else
    echo -e "   ${YELLOW}↷ docs/TODO.md ya existe${NC}"
fi

# ============================================================================
# 6. Crear NEXT_STEPS.md
# ============================================================================

if [ ! -f "$DESTINO/docs/NEXT_STEPS.md" ]; then
    cat > "$DESTINO/docs/NEXT_STEPS.md" << 'EOF'
# 🎯 Próximos Pasos

## 📋 Inmediato

1. **Personalizar Configuraciones**
   - [ ] Editar `.claude/project_rules.md`
   - [ ] Completar `docs/CONTEXT.md`
   - [ ] Planificar fases en `docs/TODO.md`

2. **Verificar Setup**
   - [ ] Verificar que Node.js está instalado
   - [ ] Instalar dependencias: `npm install`
   - [ ] Verificar que el proyecto compila: `npm run dev`

3. **Activar Claude Code**
   - [ ] Abrir en VS Code con Claude Code
   - [ ] Ejecutar `/jarvis`
   - [ ] Describir tu proyecto a Jarvis

## 🚀 Siguiente Fase

### Opción 1: Comenzar desde cero
```
/jarvis
"Voy a crear [describe tu proyecto]. Stack: Next.js, [tu stack].
¿Por dónde empezamos?"
```

### Opción 2: Continuar desarrollo existente
```
/jarvis
"Este proyecto ya tiene [describe lo que existe].
Necesito [describe lo que falta]. ¿Qué debería hacer?"
```

## 💡 Comandos Útiles

```bash
/jarvis                    # Activar asistente principal
/new-component Button      # Crear nuevo componente
/new-page dashboard        # Crear nueva página
/new-service users         # Crear nuevo servicio
/design-ui login           # Diseñar interfaz
/check-quality            # Verificar calidad del código
/review-context           # Revisar estado del proyecto
```

## 📚 Recursos

- [Guía de Migración](../CLAUDE_MIGRATION_GUIDE.md)
- [Claude Code Docs](https://github.com/anthropics/claude-code)
- [Next.js Docs](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Fecha de migración:** $(date +"%Y-%m-%d")
**Proyecto origen:** Old Texas BBQ - CRM
EOF
    echo -e "   ${GREEN}✓ docs/NEXT_STEPS.md creado${NC}"
else
    echo -e "   ${YELLOW}↷ docs/NEXT_STEPS.md ya existe${NC}"
fi

# ============================================================================
# 7. Copiar guía de migración
# ============================================================================

echo -e "\n${GREEN}4️⃣  Copiando guía de migración${NC}"

if [ -f "$ORIGEN/CLAUDE_MIGRATION_GUIDE.md" ]; then
    cp "$ORIGEN/CLAUDE_MIGRATION_GUIDE.md" "$DESTINO/"
    echo -e "   ${GREEN}✓ CLAUDE_MIGRATION_GUIDE.md copiado${NC}"
fi

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo -e "\n${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   ✅ MIGRACIÓN COMPLETADA EXITOSAMENTE                    ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${BLUE}📋 Archivos migrados:${NC}"
echo -e "   ${GREEN}✓${NC} .claude/ (con $AGENTES agentes y $COMANDOS comandos)"
echo -e "   ${GREEN}✓${NC} .claudeignore"
echo -e "   ${GREEN}✓${NC} docs/CONTEXT.md"
echo -e "   ${GREEN}✓${NC} docs/TODO.md"
echo -e "   ${GREEN}✓${NC} docs/NEXT_STEPS.md"
echo -e "   ${GREEN}✓${NC} CLAUDE_MIGRATION_GUIDE.md"

echo -e "\n${YELLOW}⚠️  IMPORTANTE - Próximos pasos:${NC}\n"
echo "   1️⃣  Edita el nombre y descripción del proyecto:"
echo -e "      ${BLUE}nano $DESTINO/.claude/project_rules.md${NC}\n"

echo "   2️⃣  Completa el contexto de tu proyecto:"
echo -e "      ${BLUE}nano $DESTINO/docs/CONTEXT.md${NC}\n"

echo "   3️⃣  Planifica tus fases:"
echo -e "      ${BLUE}nano $DESTINO/docs/TODO.md${NC}\n"

echo "   4️⃣  Abre en VS Code con Claude Code:"
echo -e "      ${BLUE}cd $DESTINO && code .${NC}\n"

echo "   5️⃣  Activa Jarvis y comienza:"
echo -e "      ${BLUE}/jarvis${NC}\n"

echo -e "${GREEN}🎉 ¡Listo para desarrollar con Claude Code!${NC}\n"

# Preguntar si abrir el proyecto
echo -e "${YELLOW}¿Deseas abrir el proyecto en VS Code ahora? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    code "$DESTINO"
    echo -e "${GREEN}✓ Proyecto abierto en VS Code${NC}"
fi

echo ""
