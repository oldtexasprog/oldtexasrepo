# Alternativas 100% GRATUITAS a Firebase Storage y FCM

## Resumen

Este proyecto utiliza alternativas completamente gratuitas a servicios de Firebase que requieren plan Blaze (pago):

| Servicio Firebase | Alternativa Gratuita | Beneficio |
|-------------------|---------------------|-----------|
| **Firebase Storage** | **Cloudinary** | 25GB storage + 25GB bandwidth/mes |
| **Firebase Cloud Messaging (FCM)** | **Sistema In-App** | Notificaciones en tiempo real via Firestore |

## 1. Cloudinary (Reemplazo de Firebase Storage)

### Por que Cloudinary

- Plan gratuito generoso: 25 GB storage + 25 GB bandwidth/mes
- Transformaciones de imagen ilimitadas
- Optimizacion automatica (WebP, AVIF, calidad auto)
- CDN global incluido
- API REST simple
- Sin necesidad de plan Blaze

### Archivos Implementados

```
lib/cloudinary/
├── config.ts          # Configuracion y validacion
├── upload.ts          # Funciones de upload con progreso
├── utils.ts           # Transformaciones y utilidades
├── types.ts           # Tipos TypeScript
└── index.ts           # Barrel export
```

### Quick Start

1. **Crear cuenta en Cloudinary:**
   - https://cloudinary.com/users/register/free

2. **Configurar variables de entorno:**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=tu-api-key
   CLOUDINARY_API_SECRET=tu-api-secret
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset
   ```

3. **Usar en tu codigo:**
   ```typescript
   import { uploadProductImage } from '@/lib/cloudinary';

   const result = await uploadProductImage(file, productId, (progress) => {
     console.log(`${progress}%`);
   });

   if (result.success) {
     console.log('URL:', result.secureUrl);
     console.log('Public ID:', result.publicId);
   }
   ```

### Documentacion Completa

- [Setup Guide](./cloudinary/SETUP.md) - Guia paso a paso de configuracion
- [Usage Guide](./cloudinary/USAGE.md) - Ejemplos completos de uso

## 2. Sistema de Notificaciones In-App (Reemplazo de FCM)

### Por que Sistema In-App

- 100% gratuito (usa Firestore en plan Spark)
- Notificaciones en tiempo real cuando la app esta abierta
- Persistencia completa en Firestore
- Mejor historial que FCM
- Sistema de sonidos personalizado
- Contador de no leidas integrado
- Filtrado por rol de usuario

### Archivos Implementados

```
lib/notifications/
├── in-app.ts              # Core del sistema de notificaciones
├── useNotifications.ts    # Hook de React
├── types.ts               # Tipos TypeScript
└── index.ts               # Barrel export
```

### Quick Start

1. **Actualizar Firestore rules:**
   Las reglas ya estan agregadas en `firestore.rules`

2. **Agregar archivos de sonido:**
   ```
   public/sounds/
   ├── notification-low.mp3
   ├── notification-normal.mp3
   ├── notification-high.mp3
   └── notification-urgent.mp3
   ```

3. **Usar en tu componente:**
   ```typescript
   import { useNotifications } from '@/lib/notifications';

   const { notifications, unreadCount, markAsRead } = useNotifications({
     userId: user.uid,
     roles: [user.rol],
     autoPlay: true,
     showToast: true,
   });
   ```

4. **Crear notificaciones:**
   ```typescript
   import { notifyNewOrder } from '@/lib/notifications';

   await notifyNewOrder('pedido-123', '123');
   ```

### Documentacion Completa

- [In-App System Guide](./notifications/IN_APP_SYSTEM.md) - Guia completa del sistema

## Migracion desde Firebase

Si ya tienes codigo usando Firebase Storage o FCM, consulta:

- [Migration Guide](./MIGRATION_FROM_FIREBASE.md) - Guia de migracion paso a paso

## Estructura del Proyecto

```
/Users/pedroduran/Desktop/Proyectos/Old Texas BBQ - CRM/
├── lib/
│   ├── cloudinary/          # Sistema de almacenamiento
│   │   ├── config.ts
│   │   ├── upload.ts
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── notifications/       # Sistema de notificaciones
│   │   ├── in-app.ts
│   │   ├── useNotifications.ts
│   │   ├── types.ts
│   │   └── index.ts
│   └── firebase/
│       ├── index.ts         # Exports actualizados (sin storage/messaging)
│       ├── storage.ts       # DEPRECATED (mantener para referencia)
│       └── messaging.ts     # DEPRECATED (mantener para referencia)
├── docs/
│   ├── cloudinary/
│   │   ├── SETUP.md
│   │   └── USAGE.md
│   ├── notifications/
│   │   └── IN_APP_SYSTEM.md
│   ├── MIGRATION_FROM_FIREBASE.md
│   └── FREE_ALTERNATIVES_README.md
├── .env.example             # Variables de entorno actualizadas
└── firestore.rules          # Reglas actualizadas con notificaciones
```

## Comparacion de Costos

### Firebase (Plan Blaze)

| Servicio | Costo Base | Costo Adicional |
|----------|------------|-----------------|
| Storage | $0.026/GB/mes | $0.12/GB transferencia |
| Cloud Messaging | Gratis | Requiere Blaze ($25/mes minimo) |
| **TOTAL MINIMO** | **$25/mes** | - |

### Alternativas Gratuitas

| Servicio | Costo | Limites Gratuitos |
|----------|-------|-------------------|
| Cloudinary | **$0** | 25GB storage + 25GB bandwidth/mes |
| Notificaciones In-App | **$0** | Ilimitado (usa Firestore Spark) |
| **TOTAL** | **$0** | - |

**AHORRO: $25/mes = $300/ano**

## Caracteristicas

### Cloudinary

- Upload con progreso
- Validacion de archivos
- Transformaciones automaticas
- Optimizacion de imagenes (WebP, AVIF)
- Redimensionamiento on-the-fly
- CDN global
- URLs permanentes
- API simple

### Notificaciones In-App

- Tiempo real via Firestore
- Persistencia de notificaciones
- Filtrado por rol
- Contador de no leidas
- Sistema de sonidos
- Toasts visuales (Sonner)
- Acciones personalizadas
- Expiracion automatica
- Estadisticas

## Limitaciones

### Cloudinary vs Firebase Storage

- **Eliminacion**: Requiere API route en backend (por seguridad)
- **Limites**: 25GB storage (vs ilimitado en Blaze)

### Sistema In-App vs FCM

- **No hay push**: Solo funciona con app abierta
- **Requiere internet**: Notificaciones via Firestore
- **Limites de Firestore**: Plan Spark tiene limites diarios

## Proximos Pasos

1. **Configurar Cloudinary:**
   - Seguir guia: [docs/cloudinary/SETUP.md](./cloudinary/SETUP.md)

2. **Configurar Notificaciones:**
   - Agregar archivos de sonido
   - Actualizar Firestore rules (ya hecho)
   - Implementar `useNotifications` en componentes

3. **Migrar codigo existente:**
   - Seguir guia: [docs/MIGRATION_FROM_FIREBASE.md](./MIGRATION_FROM_FIREBASE.md)

4. **Testing:**
   - Probar upload de imagenes
   - Probar notificaciones en tiempo real
   - Verificar permisos de Firestore

## Soporte

### Documentacion

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Problemas Comunes

1. **"Upload preset not found"**
   - Verificar que el preset existe en Cloudinary
   - Verificar que es tipo "unsigned"
   - Recargar aplicacion despues de cambiar .env

2. **Notificaciones no llegan**
   - Verificar reglas de Firestore
   - Verificar que el usuario tiene el rol correcto
   - Verificar listener activo en componente

3. **Error de permisos en Firestore**
   - Desplegar `firestore.rules` actualizadas
   - Verificar que el usuario esta autenticado
   - Verificar campo `rol` en documento de usuario

## Contribuir

Si encuentras bugs o mejoras:

1. Revisa la documentacion
2. Verifica las reglas de Firestore
3. Consulta los ejemplos en `lib/`

## Licencia

Este sistema es parte del proyecto Old Texas BBQ CRM.
