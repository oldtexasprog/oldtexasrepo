# Setup Automático de Cloudinary

## 🚀 Configuración en 2 Minutos

En lugar de configurar manualmente el Upload Preset en el dashboard de Cloudinary, puedes usar nuestro script automatizado que hace todo por ti.

## ¿Qué hace el script?

El script automáticamente:

1. ✅ Crea un Upload Preset "unsigned"
2. ✅ Configura formatos permitidos (jpg, png, webp, pdf)
3. ✅ Establece tamaño máximo (10 MB)
4. ✅ Habilita optimización automática
5. ✅ Configura transformaciones (resize, quality auto, format auto)
6. ✅ Organiza archivos en carpeta `old-texas-bbq/`
7. ✅ Genera las variables de entorno para `.env.local`

## Requisitos Previos

1. Tener una cuenta en Cloudinary (gratuita)
   - Crear en: https://cloudinary.com/users/register/free

2. Tener las credenciales a mano:
   - Cloud Name
   - API Key
   - API Secret

   👉 Encuéntralas en: https://cloudinary.com/console

## Paso 1: Ejecutar el Script

```bash
npx tsx scripts/setup-cloudinary-preset.ts
```

## Paso 2: Seguir las Instrucciones

El script te pedirá:

### 1. Credenciales de Cloudinary

```
Cloud Name: tu-cloud-name
API Key: 123456789012345
API Secret: tu-api-secret
```

### 2. Nombre del Preset (opcional)

```
Nombre del preset (default: old-texas-bbq-unsigned): [Enter]
```

Presiona Enter para usar el nombre por defecto.

## Paso 3: Copiar Variables de Entorno

El script te mostrará algo como:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=tu-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=old-texas-bbq-unsigned
```

**Copia estas líneas** y pégalas en tu archivo `.env.local`

## Paso 4: Reiniciar Servidor

```bash
# Si el servidor está corriendo, detenlo (Ctrl+C) y reinicia:
npm run dev
```

## Paso 5: Verificar

Prueba que todo funciona:

```typescript
import { uploadProductImage } from '@/lib/cloudinary';

const testUpload = async (file: File) => {
  const result = await uploadProductImage(file, 'test-123', (progress) => {
    console.log(`Subiendo: ${progress}%`);
  });

  console.log('✅ Upload exitoso!');
  console.log('URL:', result.secureUrl);
};
```

## Salida del Script (Ejemplo)

```
╔════════════════════════════════════════════════════════════╗
║   🔧 Cloudinary Upload Preset - Configuración Automática  ║
╚════════════════════════════════════════════════════════════╝

Este script creará un Upload Preset en tu cuenta de Cloudinary con:
  ✓ Modo "Unsigned" para uploads desde el frontend
  ✓ Formatos permitidos: jpg, png, webp, pdf
  ✓ Tamaño máximo: 10 MB
  ✓ Optimización automática de imágenes
  ✓ Carpeta de organización: old-texas-bbq/
  ✓ Transformaciones automáticas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PASO 1: Ingresa tus credenciales de Cloudinary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Puedes encontrar estas credenciales en:
👉 https://cloudinary.com/console

Cloud Name: mi-cloud-name
API Key: 123456789012345
API Secret: ******************

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PASO 2: Nombre del Upload Preset
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nombre del preset (default: old-texas-bbq-unsigned):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PASO 3: Creando Upload Preset...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enviando configuración a Cloudinary...

✅ ¡Upload Preset creado exitosamente!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 CONFIGURACIÓN CREADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Preset Name:       old-texas-bbq-unsigned
Signing Mode:      Unsigned
Folder:            old-texas-bbq
Formatos:          jpg, png, webp, pdf
Tamaño máximo:     10 MB
Access Mode:       public

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 PASO 4: Variables de Entorno
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Agrega estas variables a tu archivo .env.local:

─────────────────────────────────────────────────────────────
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mi-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=******************
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=old-texas-bbq-unsigned
─────────────────────────────────────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✔️  PASO 5: Verificación
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para verificar que todo funciona:
1. Copia las variables de entorno a tu .env.local
2. Reinicia tu servidor de desarrollo (npm run dev)
3. Prueba subir una imagen usando:

   import { uploadProductImage } from "@/lib/cloudinary";
   const result = await uploadProductImage(file, "test-123");

4. Verifica en tu dashboard de Cloudinary:
   👉 https://cloudinary.com/console/media_library

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 ¡CONFIGURACIÓN COMPLETADA!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Upload Preset creado
✓ Configuración avanzada aplicada
✓ Optimización automática habilitada
✓ Listo para usar en tu aplicación

📚 Documentación:
  • Guía de setup: docs/cloudinary/SETUP.md
  • Ejemplos de uso: docs/cloudinary/USAGE.md
  • API Reference: https://cloudinary.com/documentation
```

## Troubleshooting

### Error: "Unauthorized" o "401"

**Causa:** Credenciales incorrectas

**Solución:**
1. Verifica que copiaste correctamente el API Key y API Secret
2. Asegúrate de no tener espacios extra
3. Confirma que tu cuenta esté activa en https://cloudinary.com/console

### Error: "Preset already exists"

**Causa:** Ya existe un preset con ese nombre

**Solución:**
- Opción 1: Usa un nombre diferente cuando el script lo pida
- Opción 2: Elimina el preset existente desde:
  https://cloudinary.com/console/settings/upload

### El script no encuentra las credenciales

**Causa:** Las credenciales no están en `.env.local`

**Solución:**
El script te las pedirá manualmente por consola, no te preocupes.

## Configuración Manual (alternativa)

Si prefieres configurar manualmente, sigue la guía completa:

📖 [SETUP.md](./SETUP.md) - Paso 3.2

## Ventajas del Script Automático

| Aspecto | Manual | Automático |
|---------|--------|------------|
| Tiempo | 10-15 min | 2 min |
| Errores | Posibles | Cero |
| Configuración avanzada | Manual | Incluida |
| Variables de entorno | Copiar manualmente | Generadas |
| Verificación | Manual | Automática |

## Qué Crea el Script Exactamente

El script crea un preset con esta configuración:

```json
{
  "name": "old-texas-bbq-unsigned",
  "unsigned": true,
  "folder": "old-texas-bbq",
  "allowed_formats": ["jpg", "png", "webp", "pdf"],
  "max_file_size": 10485760,
  "access_mode": "public",
  "unique_filename": true,
  "use_filename": true,
  "tags": ["old-texas-bbq", "crm"],
  "transformation": [
    {
      "width": 2000,
      "height": 2000,
      "crop": "limit",
      "quality": "auto",
      "fetch_format": "auto"
    }
  ]
}
```

## Beneficios de esta Configuración

- **Unsigned**: Puedes subir desde el frontend sin exponer el API Secret
- **Folder**: Organiza todas las imágenes en `old-texas-bbq/`
- **Allowed formats**: Solo permite formatos válidos y seguros
- **Max file size**: Protege contra uploads gigantes (10 MB max)
- **Transformations**: Optimiza automáticamente cada imagen
  - Limita tamaño a 2000x2000px
  - Ajusta calidad automáticamente
  - Convierte a WebP cuando es posible
  - Usa CDN para entrega rápida

## Próximos Pasos

Después de ejecutar el script:

1. ✅ Copiar variables a `.env.local`
2. ✅ Reiniciar servidor de desarrollo
3. ✅ Probar upload de imagen
4. ✅ Verificar en dashboard de Cloudinary

**📖 Continúa con:** [USAGE.md](./USAGE.md) - Aprende a usar Cloudinary en tu app

---

**¿Prefieres hacerlo manualmente?** → [SETUP.md](./SETUP.md)
