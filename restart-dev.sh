#!/bin/bash
echo "🧹 Limpiando caché..."
rm -rf .next node_modules/.cache .turbo

echo "🚀 Iniciando servidor de desarrollo..."
npm run dev
