# Guia de Migracion: Firebase Storage y FCM a Alternativas Gratuitas

## Resumen de Cambios

Este proyecto ha migrado de servicios de Firebase que requieren plan Blaze (pago) a alternativas 100% gratuitas:

| Servicio Original              | Servicio Nuevo          | Razon                             |
| ------------------------------ | ----------------------- | --------------------------------- |
| Firebase Storage               | Cloudinary              | Storage requiere plan Blaze       |
| Firebase Cloud Messaging (FCM) | Sistema In-App          | FCM requiere plan Blaze           |
| Firebase Firestore             | Firebase Firestore      | Sin cambios (plan Spark gratuito) |
| Firebase Authentication        | Firebase Authentication | Sin cambios (plan Spark gratuito) |

## Que Cambio

### 1. Almacenamiento de Archivos

**ANTES (Firebase Storage):**

```typescript
import { uploadProductImage } from '@/lib/firebase';

const result = await uploadProductImage(file, productId);
```

**AHORA (Cloudinary):**

```typescript
import { uploadProductImage } from '@/lib/cloudinary';

const result = await uploadProductImage(file, productId);
```

**Cambios clave:**

- Misma API/interfaz
- `result.url` ahora es `result.secureUrl`
- Guarda `result.publicId` para eliminacion posterior
- Plan gratuito: 25GB storage + 25GB bandwidth/mes

### 2. Notificaciones

**ANTES (FCM):**

```typescript
import { initializeFCM, notifyNewOrder } from '@/lib/firebase';

await initializeFCM(userId);
await notifyNewOrder(orderId, orderNumber);
```

**AHORA (Sistema In-App):**

```typescript
import { useNotifications, notifyNewOrder } from '@/lib/notifications';

// En tu componente
const { notifications, unreadCount } = useNotifications({
  userId,
  roles: [userRole],
});

// Crear notificacion
await notifyNewOrder(orderId, orderNumber);
```

**Cambios clave:**

- No hay push notifications cuando la app esta cerrada
- Notificaciones en tiempo real cuando la app esta abierta
- Mejor historial y persistencia
- 100% gratuito (usa Firestore)

## Migracion Paso a Paso

### Paso 1: Instalar Dependencias

```bash
npm install cloudinary
```

### Paso 2: Configurar Cloudinary

1. Crea cuenta en [Cloudinary](https://cloudinary.com/users/register/free)
2. Crea un Upload Preset (ver [docs/cloudinary/SETUP.md](./cloudinary/SETUP.md))
3. Agrega variables de entorno en `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset
```

### Paso 3: Actualizar Imports

**Busca y reemplaza en tu codigo:**

```typescript
// ANTES
import { uploadProductImage, uploadComprobante } from '@/lib/firebase';

// DESPUES
import { uploadProductImage, uploadComprobante } from '@/lib/cloudinary';
```

```typescript
// ANTES
import { notifyNewOrder, initializeFCM } from '@/lib/firebase';

// DESPUES
import { notifyNewOrder, useNotifications } from '@/lib/notifications';
```

### Paso 4: Actualizar Componentes de Upload

**ANTES:**

```typescript
const handleUpload = async (file: File) => {
  const result = await uploadProductImage(file, productId);

  if (result.success) {
    // Guardar URL
    await updateProduct(productId, {
      imagen_url: result.url,
    });
  }
};
```

**DESPUES:**

```typescript
const handleUpload = async (file: File) => {
  const result = await uploadProductImage(file, productId);

  if (result.success) {
    // Guardar URL y public_id
    await updateProduct(productId, {
      imagen_url: result.secureUrl,
      imagen_public_id: result.publicId, // Necesario para eliminar
    });
  }
};
```

### Paso 5: Actualizar Eliminacion de Imagenes

**IMPORTANTE:** La eliminacion en Cloudinary requiere API Secret, por lo que debe hacerse desde el backend.

#### 5.1. Crear API Route

```typescript
// app/api/cloudinary/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: result.result === 'ok',
      result: result.result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
```

#### 5.2. Usar en Frontend

```typescript
import { deleteImage } from '@/lib/cloudinary';

const handleDelete = async (publicId: string) => {
  const result = await deleteImage(publicId);

  if (result.success) {
    console.log('Imagen eliminada');
  }
};
```

### Paso 6: Migrar Notificaciones

#### 6.1. Actualizar Firestore Rules

Agrega reglas para la coleccion `notificaciones` en `firestore.rules`:

```javascript
match /notificaciones/{notifId} {
  allow read: if request.auth != null &&
    request.auth.token.rol in resource.data.rol_destino;

  allow create: if request.auth != null &&
    (request.auth.token.rol == 'admin' || request.auth.token.rol == 'encargado');

  allow update: if request.auth != null &&
    request.auth.token.rol in resource.data.rol_destino &&
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['leida', 'leida_por']);

  allow delete: if request.auth != null &&
    request.auth.token.rol == 'admin';
}
```

#### 6.2. Actualizar Componentes

**ANTES:**

```typescript
useEffect(() => {
  initializeFCM(userId);
}, [userId]);
```

**DESPUES:**

```typescript
const { notifications, unreadCount } = useNotifications({
  userId,
  roles: [userRole],
  autoPlay: true,
  showToast: true,
});
```

### Paso 7: Migrar Datos Existentes (Opcional)

Si tienes imagenes en Firebase Storage, puedes migrarlas:

1. Descarga imagenes de Firebase Storage
2. Subelas a Cloudinary usando el nuevo sistema
3. Actualiza URLs en Firestore

**Script de migracion (ejemplo):**

```typescript
import { getFileURL } from '@/lib/firebase/storage'; // Old
import { uploadToCloudinary } from '@/lib/cloudinary'; // New

const migrateImages = async () => {
  const productos = await getDocuments('productos');

  for (const producto of productos) {
    if (producto.imagen_url) {
      // Descargar de Firebase
      const response = await fetch(producto.imagen_url);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg');

      // Subir a Cloudinary
      const result = await uploadToCloudinary(file, {
        folder: 'old-texas-bbq/productos',
        id: producto.id,
      });

      if (result.success) {
        // Actualizar Firestore
        await updateDocument('productos', producto.id, {
          imagen_url: result.secureUrl,
          imagen_public_id: result.publicId,
        });
      }
    }
  }
};
```

## Verificacion de Migracion

### Checklist de Cloudinary

- [ ] Cuenta de Cloudinary creada
- [ ] Upload preset configurado como "unsigned"
- [ ] Variables de entorno agregadas
- [ ] API route para eliminacion creada
- [ ] Imports actualizados
- [ ] Guardando `publicId` en Firestore
- [ ] Eliminacion funcionando

### Checklist de Notificaciones

- [ ] Reglas de Firestore actualizadas
- [ ] Archivos de sonido agregados en `public/sounds/`
- [ ] `useNotifications` implementado
- [ ] Componente de notificaciones creado
- [ ] Helpers de notificacion funcionando

## Limpieza (Opcional)

Una vez que la migracion este completa, puedes:

1. **Remover archivos deprecados:**
   - `lib/firebase/storage.ts` (mantener para referencia)
   - `lib/firebase/messaging.ts` (mantener para referencia)

2. **Remover service worker de FCM:**
   - `public/firebase-messaging-sw.js`

3. **Remover variables de entorno:**
   - `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

## Rollback (En caso de problemas)

Si necesitas volver atras:

1. Descomenta exports en `lib/firebase/index.ts`
2. Revertir imports a `@/lib/firebase`
3. Configurar plan Blaze en Firebase

## Diferencias Clave

### Cloudinary vs Firebase Storage

| Caracteristica          | Firebase Storage    | Cloudinary      |
| ----------------------- | ------------------- | --------------- |
| Plan Gratuito           | No (requiere Blaze) | Si (25GB)       |
| Transformaciones        | No                  | Si (ilimitadas) |
| CDN                     | Si                  | Si              |
| Optimizacion automatica | No                  | Si              |
| API                     | SDK Firebase        | REST API        |

### Sistema In-App vs FCM

| Caracteristica            | FCM                 | Sistema In-App |
| ------------------------- | ------------------- | -------------- |
| Plan Gratuito             | No (requiere Blaze) | Si             |
| Push (app cerrada)        | Si                  | No             |
| Tiempo real (app abierta) | Si                  | Si             |
| Historial                 | Limitado            | Completo       |
| Setup                     | Complejo            | Simple         |

## Recursos

- [Cloudinary Setup Guide](./cloudinary/SETUP.md)
- [Cloudinary Usage Guide](./cloudinary/USAGE.md)
- [Notificaciones In-App Guide](./notifications/IN_APP_SYSTEM.md)

## Soporte

Si encuentras problemas durante la migracion:

1. Revisa los logs de consola
2. Verifica variables de entorno
3. Confirma que las reglas de Firestore estan actualizadas
4. Revisa la documentacion de cada servicio

## FAQ

**P: Puedo seguir usando Firebase Storage si pago plan Blaze?**
R: Si, los archivos `lib/firebase/storage.ts` y `lib/firebase/messaging.ts` permanecen para compatibilidad.

**P: Las notificaciones in-app funcionan offline?**
R: No, requieren conexion a internet para sincronizar con Firestore.

**P: Puedo usar ambos sistemas al mismo tiempo?**
R: Si, pero no es recomendado. Elige uno y mantente en el.

**P: Como migro archivos PDF?**
R: Cloudinary soporta PDFs. Usa `uploadComprobante()` para subir documentos.

**P: Las URLs de Cloudinary expiran?**
R: No, las URLs publicas de Cloudinary son permanentes.

**P: Puedo recibir notificaciones cuando la app esta cerrada?**
R: No con el sistema in-app. Necesitarias FCM + plan Blaze para eso.
