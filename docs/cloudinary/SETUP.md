# Cloudinary Setup Guide

## Alternativa 100% GRATUITA a Firebase Storage

Cloudinary es un servicio de almacenamiento de imagenes en la nube con un plan gratuito generoso que incluye:

- 25 GB de almacenamiento
- 25 GB de ancho de banda por mes
- Transformaciones de imagen ilimitadas
- CDN global incluido
- API REST completa

## Paso 1: Crear Cuenta en Cloudinary

1. Ve a [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Registrate con tu email (o usa Google/GitHub)
3. Verifica tu email
4. Inicia sesion en [https://cloudinary.com/console](https://cloudinary.com/console)

## Paso 2: Obtener Credenciales

Una vez en el dashboard:

1. En la parte superior veras **Account Details**
2. Copia los siguientes valores:
   - **Cloud name**: Tu identificador unico (ejemplo: `doqbc2exe`)
   - **API Key**: Tu clave publica (ejemplo: `245663283252112`)
   - **API Secret**: Tu clave privada (NUNCA expongas en el frontend)

## Paso 3: Crear Upload Preset

Los upload presets permiten subir archivos desde el frontend sin exponer tu API Secret.

### 3.1. Acceder a Upload Presets

1. En el menu lateral, ve a **Settings** (icono de engranaje)
2. Click en **Upload** en el menu de la izquierda
3. Scroll down hasta **Upload presets**
4. Click en **Add upload preset**

### 3.2. Configurar Upload Preset

Configura el preset con los siguientes valores:

**Configuracion Basica:**

- **Preset name**: `old-texas-bbq-unsigned` (o el nombre que prefieras)
- **Signing Mode**: Selecciona **Unsigned** (IMPORTANTE)
- **Folder**: `old-texas-bbq` (carpeta raiz donde se guardaran los archivos)

**Configuracion Avanzada (opcional pero recomendada):**

En la seccion **Media analysis and AI**:

- Activa **Media analysis**: Para deteccion automatica de contenido

En la seccion **Upload controls**:

- **Allowed formats**: `jpg, png, webp, pdf` (formatos permitidos)
- **Maximum file size**: `10485760` (10 MB en bytes)
- **Image transformations**:
  ```
  c_limit,w_2000,h_2000,q_auto,f_auto
  ```
  Esto limita el tamano maximo a 2000px y optimiza automaticamente

En la seccion **Access control**:

- **Access mode**: `public` (para que las URLs sean accesibles)

### 3.3. Guardar el Preset

1. Click en **Save** en la parte superior
2. Copia el **Preset name** que creaste

## Paso 4: Configurar Variables de Entorno

Abre el archivo `.env.local` (crealo si no existe) y agrega:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=old-texas-bbq-unsigned
```

**IMPORTANTE:**

- Reemplaza `tu-cloud-name`, `tu-api-key`, `tu-api-secret` con tus valores reales
- El `CLOUDINARY_API_SECRET` NO debe exponerse en el frontend
- El `UPLOAD_PRESET` debe ser el nombre que creaste en el paso 3.2

## Paso 5: Verificar Configuracion

Ejecuta el siguiente codigo en tu consola de desarrollo (DevTools):

```javascript
// En el navegador
console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
console.log('Upload Preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
```

Si ves los valores correctos, la configuracion esta completa.

## Paso 6: Probar Upload

Prueba subir una imagen usando el sistema:

```typescript
import { uploadProductImage } from '@/lib/cloudinary';

// Ejemplo de uso
const handleUpload = async (file: File) => {
  const result = await uploadProductImage(
    file,
    'producto-id-123',
    (progress) => {
      console.log(`Progreso: ${progress}%`);
    }
  );

  if (result.success) {
    console.log('URL de la imagen:', result.secureUrl);
    console.log('Public ID:', result.publicId);
  } else {
    console.error('Error:', result.message);
  }
};
```

## Seguridad: Proteger API Secret

El `CLOUDINARY_API_SECRET` NUNCA debe exponerse en el cliente. Solo usalo en:

1. **API Routes de Next.js** (server-side):

   ```typescript
   // app/api/cloudinary/delete/route.ts
   import { v2 as cloudinary } from 'cloudinary';

   cloudinary.config({
     cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
     api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET, // Solo en backend
   });
   ```

2. **Server Actions** (Next.js 13+)
3. **Backend separado** (Node.js, etc.)

## Limites del Plan Gratuito

El plan gratuito de Cloudinary incluye:

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/mes
- **Transformaciones**: Ilimitadas
- **Uploads**: Ilimitados

Si superas estos limites:

- El servicio se detiene hasta el proximo mes
- Puedes upgradear a un plan de pago

**Recomendaciones:**

- Optimiza imagenes antes de subir
- Elimina imagenes no utilizadas regularmente
- Usa transformaciones para servir imagenes del tamano exacto necesario

## Monitoreo de Uso

Para ver tu uso actual:

1. Ve a [https://cloudinary.com/console](https://cloudinary.com/console)
2. En el dashboard veras:
   - **Storage**: Espacio usado de 25 GB
   - **Bandwidth**: Transferencia usada este mes
   - **Transformations**: Numero de transformaciones

## Troubleshooting

### Error: "Upload preset not found"

Verifica que:

1. El nombre del preset en `.env.local` coincide exactamente con el creado
2. El preset esta configurado como **Unsigned**
3. Recargaste la aplicacion despues de cambiar `.env.local`

### Error: "Unsigned upload restricted"

El preset debe estar configurado como **Unsigned** en Cloudinary:

1. Ve a Settings > Upload > Upload presets
2. Edita tu preset
3. Cambia **Signing Mode** a **Unsigned**
4. Guarda

### Error: "Invalid API key"

Verifica que:

1. El `NEXT_PUBLIC_CLOUDINARY_API_KEY` esta correcto
2. No hay espacios extra en `.env.local`
3. Reiniciaste el servidor de desarrollo

## Soporte

- Documentacion oficial: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- API Reference: [https://cloudinary.com/documentation/image_upload_api_reference](https://cloudinary.com/documentation/image_upload_api_reference)
- Community: [https://community.cloudinary.com](https://community.cloudinary.com)

## Proximos Pasos

Lee la guia de uso: [USAGE.md](./USAGE.md)
