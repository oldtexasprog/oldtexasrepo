#!/bin/bash

###############################################################################
# Script para Descargar Sonidos de Notificación
# Old Texas BBQ - CRM
#
# Este script descarga sonidos de notificación gratuitos y de dominio público
# desde fuentes verificadas y legales.
#
# Uso: chmod +x scripts/download-notification-sounds.sh && ./scripts/download-notification-sounds.sh
###############################################################################

set -e  # Salir si hay error

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Directorio de destino
SOUNDS_DIR="public/sounds"

echo -e "${BLUE}🔔 Descargando sonidos de notificación...${NC}\n"

# Crear directorio si no existe
mkdir -p "$SOUNDS_DIR"

# Función para descargar y convertir sonido
download_sound() {
    local url=$1
    local filename=$2
    local description=$3

    echo -e "${YELLOW}📥 Descargando: $description${NC}"

    if [ -f "$SOUNDS_DIR/$filename" ]; then
        echo -e "${GREEN}   ✓ Ya existe: $filename${NC}"
        return
    fi

    # Descargar archivo temporal
    local temp_file="/tmp/sound_temp.mp3"

    if curl -L --silent --show-error --fail "$url" -o "$temp_file"; then
        mv "$temp_file" "$SOUNDS_DIR/$filename"
        echo -e "${GREEN}   ✓ Descargado: $filename${NC}"
    else
        echo -e "${RED}   ✗ Error al descargar: $filename${NC}"
    fi
}

echo -e "${BLUE}Opción 1: Sonidos de Pixabay (Dominio Público)${NC}\n"

# 1. Notification.mp3 - Sonido general de notificación
download_sound \
    "https://pixabay.com/sound-effects/download/audio_hero_simple-alert-notification-notification-alert_EM4NJXD-54528/?filetype=mp3" \
    "notification.mp3" \
    "Sonido general de notificación"

# 2. New Order - Sonido de nuevo pedido (campana/ding)
download_sound \
    "https://pixabay.com/sound-effects/download/bike-bell-1-189066/?filetype=mp3" \
    "new-order.mp3" \
    "Nuevo pedido (campana)"

# 3. Order Ready - Pedido listo (ding positivo)
download_sound \
    "https://pixabay.com/sound-effects/download/magic-chime-2-202103/?filetype=mp3" \
    "order-ready.mp3" \
    "Pedido listo para recoger"

# 4. Success - Pedido entregado (éxito)
download_sound \
    "https://pixabay.com/sound-effects/download/success-1-6297/?filetype=mp3" \
    "success.mp3" \
    "Pedido entregado exitosamente"

# 5. Alert - Alerta urgente
download_sound \
    "https://pixabay.com/sound-effects/download/notification-3-14560/?filetype=mp3" \
    "alert.mp3" \
    "Alerta urgente"

echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Descarga completada${NC}\n"

# Listar archivos descargados
echo -e "${BLUE}Archivos en $SOUNDS_DIR:${NC}"
ls -lh "$SOUNDS_DIR"/*.mp3 2>/dev/null || echo -e "${YELLOW}No se encontraron archivos MP3${NC}"

echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}⚠️  NOTA IMPORTANTE:${NC}"
echo -e "Si algún sonido no se descargó automáticamente, puedes:"
echo -e "1. Visitar Pixabay.com y buscar sonidos gratuitos"
echo -e "2. Descargar manualmente desde Freesound.org"
echo -e "3. Usar los enlaces del archivo: ${BLUE}public/sounds/SOURCES.md${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}\n"

# Verificar que todos los archivos existan
required_sounds=("notification.mp3" "new-order.mp3" "order-ready.mp3" "success.mp3" "alert.mp3")
missing_sounds=()

for sound in "${required_sounds[@]}"; do
    if [ ! -f "$SOUNDS_DIR/$sound" ]; then
        missing_sounds+=("$sound")
    fi
done

if [ ${#missing_sounds[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ Todos los sonidos están listos!${NC}\n"
else
    echo -e "${YELLOW}⚠️  Faltan los siguientes sonidos:${NC}"
    for sound in "${missing_sounds[@]}"; do
        echo -e "   - $sound"
    done
    echo -e "\n${BLUE}Por favor, descárgalos manualmente desde:${NC}"
    echo -e "   • https://pixabay.com/sound-effects/search/notification/"
    echo -e "   • https://freesound.org/search/?q=notification"
    echo -e "   • https://notificationsounds.com/\n"
fi

echo -e "${GREEN}🎵 Script completado${NC}\n"
