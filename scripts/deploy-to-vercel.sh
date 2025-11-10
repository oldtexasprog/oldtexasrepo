#!/bin/bash

# 🚀 Script Simple para Desplegar a Vercel
# Old Texas BBQ - CRM

echo "🔥 Old Texas BBQ - Despliegue Rápido"
echo "===================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar que vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
    npm i -g vercel
fi

echo -e "${BLUE}🔍 Verificando autenticación...${NC}"
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}🔑 Iniciando sesión en Vercel...${NC}"
    vercel login
fi

echo ""
echo -e "${GREEN}✅ Listo para desplegar${NC}"
echo ""

# Preguntar si es primer despliegue
echo -e "${BLUE}¿Es el primer despliegue? (s/n)${NC}"
read -p "Respuesta: " FIRST_DEPLOY

if [ "$FIRST_DEPLOY" == "s" ] || [ "$FIRST_DEPLOY" == "S" ]; then
    echo ""
    echo -e "${YELLOW}📝 Primer despliegue - Se creará el proyecto${NC}"
    echo ""
    vercel --prod
else
    echo ""
    echo -e "${YELLOW}🚀 Desplegando a producción...${NC}"
    echo ""
    vercel --prod --yes
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Despliegue exitoso${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE: Configurar variables de entorno${NC}"
    echo ""
    echo -e "${BLUE}1.${NC} Ve al dashboard de Vercel:"
    echo -e "   ${GREEN}https://vercel.com/dashboard${NC}"
    echo ""
    echo -e "${BLUE}2.${NC} Selecciona tu proyecto"
    echo ""
    echo -e "${BLUE}3.${NC} Ve a: ${YELLOW}Settings → Environment Variables${NC}"
    echo ""
    echo -e "${BLUE}4.${NC} Copia y pega las variables del archivo: ${YELLOW}.env.local${NC}"
    echo ""
    echo -e "${BLUE}5.${NC} Marca todas como: ${YELLOW}Production, Preview, Development${NC}"
    echo ""
    echo -e "${BLUE}6.${NC} Ve a Firebase Console y autoriza tu dominio:"
    echo -e "   ${GREEN}https://console.firebase.google.com/project/oldtexasbbq-ecb85${NC}"
    echo -e "   ${YELLOW}→ Authentication → Settings → Authorized domains${NC}"
    echo ""
    echo -e "${BLUE}7.${NC} Re-despliega ejecutando:"
    echo -e "   ${GREEN}./scripts/deploy-to-vercel.sh${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Error en el despliegue${NC}"
    echo ""
    echo -e "${YELLOW}💡 Consejos:${NC}"
    echo -e "  - Verifica que estés autenticado: ${GREEN}vercel whoami${NC}"
    echo -e "  - Intenta limpiar caché: ${GREEN}vercel --prod --yes --force${NC}"
    echo -e "  - Lee los logs: ${GREEN}vercel logs${NC}"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 ¡Proceso completado!${NC}"
echo ""
