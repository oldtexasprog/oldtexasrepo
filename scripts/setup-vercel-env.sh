#!/bin/bash

# 🚀 Script para Configurar Variables de Entorno en Vercel
# Old Texas BBQ - CRM

echo "🔥 Old Texas BBQ - Configuración de Vercel"
echo "=========================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar que vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI no está instalado${NC}"
    echo -e "${YELLOW}Instalando Vercel CLI...${NC}"
    npm i -g vercel
fi

# Verificar autenticación
echo -e "${BLUE}🔑 Verificando autenticación con Vercel...${NC}"
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}No estás autenticado. Iniciando sesión...${NC}"
    vercel login
fi

echo ""
echo -e "${GREEN}✅ Autenticado correctamente${NC}"
echo ""

# Solicitar nombre del proyecto
echo -e "${BLUE}📝 Ingresa el nombre de tu proyecto en Vercel:${NC}"
echo -e "${YELLOW}   (ejemplo: old-texas-bbq-crm)${NC}"
read -p "Nombre del proyecto: " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}❌ El nombre del proyecto no puede estar vacío${NC}"
    exit 1
fi

# Solicitar dominio de producción
echo ""
echo -e "${BLUE}🌐 Ingresa tu dominio de producción en Vercel:${NC}"
echo -e "${YELLOW}   (ejemplo: old-texas-bbq-crm.vercel.app)${NC}"
read -p "Dominio: " PRODUCTION_DOMAIN

if [ -z "$PRODUCTION_DOMAIN" ]; then
    echo -e "${RED}❌ El dominio no puede estar vacío${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔄 Configurando variables de entorno...${NC}"
echo ""

# Leer variables del archivo .env.local
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ No se encontró el archivo .env.local${NC}"
    exit 1
fi

# Función para agregar variable de entorno
add_env_var() {
    local key=$1
    local value=$2
    local env=$3

    echo -e "${BLUE}  Agregando $key...${NC}"
    echo "$value" | vercel env add "$key" "$env" --force > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}    ✅ $key configurada${NC}"
    else
        echo -e "${RED}    ❌ Error al configurar $key${NC}"
    fi
}

# Extraer variables del .env.local y configurarlas en Vercel
echo -e "${YELLOW}📋 Configurando variables de Firebase...${NC}"

# Firebase
add_env_var "NEXT_PUBLIC_FIREBASE_API_KEY" "$(grep NEXT_PUBLIC_FIREBASE_API_KEY .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "$(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "$(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" "$(grep NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" "$(grep NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "NEXT_PUBLIC_FIREBASE_APP_ID" "$(grep NEXT_PUBLIC_FIREBASE_APP_ID .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" "$(grep NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "NEXT_PUBLIC_USE_FIREBASE_EMULATOR" "false" "production preview development"

echo ""
echo -e "${YELLOW}📋 Configurando variables de Cloudinary...${NC}"

# Cloudinary
add_env_var "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" "$(grep NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "NEXT_PUBLIC_CLOUDINARY_API_KEY" "$(grep NEXT_PUBLIC_CLOUDINARY_API_KEY .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "CLOUDINARY_API_SECRET" "$(grep CLOUDINARY_API_SECRET .env.local | cut -d '=' -f2)" "production preview development"
add_env_var "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET" "$(grep NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET .env.local | cut -d '=' -f2)" "production preview development"

echo ""
echo -e "${YELLOW}📋 Configurando variables de aplicación...${NC}"

# App Config
add_env_var "NEXT_PUBLIC_APP_URL" "https://$PRODUCTION_DOMAIN" "production"
add_env_var "NEXT_PUBLIC_APP_URL" "https://\$VERCEL_URL" "preview"
add_env_var "NEXT_PUBLIC_APP_URL" "http://localhost:3000" "development"

# Dev Access
add_env_var "DEV_ACCESS_KEY" "$(grep DEV_ACCESS_KEY .env.local | cut -d '=' -f2)" "production preview development"

echo ""
echo -e "${GREEN}✅ Variables de entorno configuradas exitosamente${NC}"
echo ""

# Preguntar si desea desplegar
echo -e "${BLUE}🚀 ¿Deseas desplegar a producción ahora? (s/n)${NC}"
read -p "Respuesta: " DEPLOY

if [ "$DEPLOY" == "s" ] || [ "$DEPLOY" == "S" ]; then
    echo ""
    echo -e "${YELLOW}🚀 Desplegando a producción...${NC}"
    vercel --prod --yes

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Despliegue exitoso${NC}"
    else
        echo ""
        echo -e "${RED}❌ Error en el despliegue${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}=========================================="
echo -e "✅ Configuración completada"
echo -e "==========================================${NC}"
echo ""
echo -e "${YELLOW}📝 Próximos pasos:${NC}"
echo ""
echo -e "${BLUE}1.${NC} Ve a Firebase Console:"
echo -e "   ${YELLOW}https://console.firebase.google.com/project/oldtexasbbq-ecb85${NC}"
echo ""
echo -e "${BLUE}2.${NC} Navega a: ${YELLOW}Authentication → Settings → Authorized domains${NC}"
echo ""
echo -e "${BLUE}3.${NC} Agrega tu dominio de Vercel:"
echo -e "   ${GREEN}$PRODUCTION_DOMAIN${NC}"
echo ""
echo -e "${BLUE}4.${NC} Guarda los cambios"
echo ""
echo -e "${BLUE}5.${NC} Prueba tu aplicación en:"
echo -e "   ${GREEN}https://$PRODUCTION_DOMAIN${NC}"
echo ""
echo -e "${GREEN}🎉 ¡Listo!${NC}"
echo ""
