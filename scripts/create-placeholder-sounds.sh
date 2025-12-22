#!/bin/bash

###############################################################################
# Script para Crear Sonidos Placeholder
# Old Texas BBQ - CRM
#
# Crea archivos MP3 silenciosos de placeholder para que el sistema no falle
# mientras descargas los sonidos reales.
#
# Uso: chmod +x scripts/create-placeholder-sounds.sh && ./scripts/create-placeholder-sounds.sh
###############################################################################

set -e

SOUNDS_DIR="public/sounds"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔇 Creando sonidos placeholder...${NC}\n"

mkdir -p "$SOUNDS_DIR"

# Lista de sonidos necesarios
sounds=("notification.mp3" "new-order.mp3" "order-ready.mp3" "success.mp3" "alert.mp3")

# Verificar si ffmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${YELLOW}⚠️  ffmpeg no está instalado.${NC}"
    echo -e "${YELLOW}   Instalando con Homebrew...${NC}"

    if command -v brew &> /dev/null; then
        brew install ffmpeg
    else
        echo -e "${YELLOW}   Por favor instala ffmpeg manualmente:${NC}"
        echo -e "   ${BLUE}brew install ffmpeg${NC}"
        exit 1
    fi
fi

# Crear archivos de audio silenciosos
for sound in "${sounds[@]}"; do
    filepath="$SOUNDS_DIR/$sound"

    if [ -f "$filepath" ] && [ -s "$filepath" ]; then
        echo -e "${GREEN}✓ Ya existe: $sound${NC}"
    else
        echo -e "${YELLOW}📝 Creando: $sound${NC}"

        # Crear 1 segundo de silencio en MP3
        ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 -q:a 9 -acodec libmp3lame "$filepath" -y &> /dev/null

        echo -e "${GREEN}   ✓ Creado: $sound (placeholder)${NC}"
    fi
done

echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Archivos placeholder creados${NC}"
echo -e "\n${YELLOW}⚠️  IMPORTANTE:${NC}"
echo -e "Estos son archivos SILENCIOSOS temporales."
echo -e "Reemplázalos con sonidos reales siguiendo la guía:"
echo -e "${BLUE}scripts/download-sounds-manual.md${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

ls -lh "$SOUNDS_DIR"/*.mp3
