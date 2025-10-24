# Firebase Setup - Old Texas BBQ CRM

Guía completa para configurar Firebase en el proyecto Old Texas BBQ CRM.

## Tabla de Contenidos

1. [Prerrequisitos](#prerrequisitos)
2. [Crear Proyecto en Firebase Console](#crear-proyecto-en-firebase-console)
3. [Habilitar Servicios de Firebase](#habilitar-servicios-de-firebase)
4. [Configurar Aplicación Web](#configurar-aplicación-web)
5. [Obtener Credenciales](#obtener-credenciales)
6. [Configurar Variables de Entorno](#configurar-variables-de-entorno)
7. [Configurar Reglas de Seguridad](#configurar-reglas-de-seguridad)
8. [Verificar Instalación](#verificar-instalación)

---

## Prerrequisitos

- Cuenta de Google
- Node.js 18+ instalado
- Proyecto Next.js configurado
- Firebase SDK instalado (ya incluido en package.json)

---

## Crear Proyecto en Firebase Console

### Paso 1: Acceder a Firebase Console

1. Visita [Firebase Console](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Crear un proyecto"** o **"Add project"**

### Paso 2: Configurar Proyecto

1. **Nombre del proyecto**: `old-texas-bbq-crm` (o el nombre que prefieras)
2. **Continuar**
3. **Google Analytics**:
   - Recomendado: **Habilitar** (útil para métricas)
   - Selecciona o crea una cuenta de Analytics
4. **Crear proyecto**
5. Espera 30-60 segundos mientras Firebase crea tu proyecto
6. Haz clic en **"Continuar"**

### Paso 3: Región del Proyecto

1. Una vez creado, ve a **Configuración del proyecto** (icono de engranaje)
2. En la pestaña **General**, verifica la ubicación predeterminada de GCP
3. **Recomendado para México**: `us-central1` o `northamerica-northeast1`

---

## Habilitar Servicios de Firebase

### 1. Firebase Authentication

**Propósito**: Autenticación de usuarios (cajeras, cocina, repartidores, encargado, admin)

1. En el menú lateral, haz clic en **"Authentication"** o **"Autenticación"**
2. Haz clic en **"Comenzar"** o **"Get started"**
3. Ve a la pestaña **"Sign-in method"** o **"Método de acceso"**

#### Habilitar Email/Password:

1. Haz clic en **"Email/Password"**
2. **Habilita** el primer toggle (Email/Password)
3. **NO habilites** "Email link" por ahora
4. Haz clic en **"Guardar"**

#### Configuración adicional recomendada:

1. En **"Settings"** o **"Configuración"**:
   - **Authorized domains**: Agrega tu dominio personalizado cuando lo tengas
   - **User account management**:
     - Email enumeration protection: **Habilitado** (seguridad)

### 2. Cloud Firestore

**Propósito**: Base de datos principal para pedidos, usuarios, productos, etc.

1. En el menú lateral, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"** o **"Create database"**
3. **Modo de inicio**:
   - Selecciona **"Comenzar en modo de producción"** (las reglas se configurarán después)
4. **Ubicación de Firestore**:
   - **Recomendado**: `us-central1` (Iowa) - Mejor latencia para México
   - Alternativa: `northamerica-northeast1` (Montreal)
5. Haz clic en **"Habilitar"** o **"Enable"**
6. Espera 1-2 minutos mientras se crea la base de datos

#### Crear Índices Compuestos (Opcional, pero recomendado):

Más adelante necesitarás estos índices. Firebase te pedirá crearlos automáticamente cuando ejecutes queries complejas, pero puedes crearlos manualmente:

1. Ve a **Firestore Database > Indexes** o **Índices**
2. Haz clic en **"Add index"** o **"Agregar índice"**

**Índice para Pedidos por Estado y Fecha**:

- Collection ID: `pedidos`
- Fields indexed:
  1. `estado_pedido` - Ascending
  2. `fecha_hora` - Descending
- Query scope: Collection

**Índice para Pedidos por Usuario y Fecha**:

- Collection ID: `pedidos`
- Fields indexed:
  1. `createdBy` - Ascending
  2. `fecha_hora` - Descending
- Query scope: Collection

### 3. Cloud Storage

**Propósito**: Almacenar fotos de productos, comprobantes de pago, etc.

1. En el menú lateral, haz clic en **"Storage"**
2. Haz clic en **"Comenzar"** o **"Get started"**
3. **Reglas de seguridad**:
   - Por ahora, acepta las reglas predeterminadas
   - Las configuraremos después con reglas personalizadas
4. **Ubicación de Cloud Storage**:
   - Usa la misma ubicación que Firestore: `us-central1`
5. Haz clic en **"Listo"** o **"Done"**

#### Crear Estructura de Carpetas:

Después de habilitar Storage, Firebase creará un bucket. La estructura de carpetas se creará automáticamente con el código, pero aquí está la estructura recomendada:

```
gs://[tu-proyecto].appspot.com/
  ├── productos/           # Fotos de productos
  │   └── [producto-id]/
  ├── comprobantes/        # Comprobantes de pago
  │   └── [pedido-id]/
  └── usuarios/            # Fotos de perfil (opcional)
      └── [usuario-id]/
```

### 4. Firebase Cloud Messaging (FCM)

**Propósito**: Notificaciones push para nuevos pedidos, cambios de estado, etc.

1. En el menú lateral, ve a **"Configuración del proyecto"** (icono de engranaje)
2. Ve a la pestaña **"Cloud Messaging"**
3. **Cloud Messaging API**:
   - Si aparece un botón **"Enable"**, haz clic en él
   - Esto habilitará la API de Cloud Messaging en Google Cloud
4. **Certificados VAPID** (para notificaciones web):
   - Busca la sección **"Web Push certificates"**
   - Haz clic en **"Generate key pair"** o **"Generar par de claves"**
   - Guarda la **Server Key** (la necesitarás después)

**Nota**: Para notificaciones push en web, necesitarás configurar un Service Worker (se proporciona en la estructura del proyecto).

### 5. Firebase Hosting (Opcional)

**Propósito**: Hosting para la aplicación (alternativa a Vercel)

1. En el menú lateral, haz clic en **"Hosting"**
2. Haz clic en **"Comenzar"** o **"Get started"**
3. Sigue los pasos del asistente (o ciérralo si usarás Vercel)

**Nota**: Si planeas usar Vercel, puedes omitir Firebase Hosting por ahora.

### 6. Firebase Analytics (Ya habilitado)

Si habilitaste Analytics al crear el proyecto, ya está configurado. Puedes ver métricas en:

- **Analytics > Dashboard**: Métricas en tiempo real y reportes
- **Analytics > Events**: Eventos personalizados (pedidos creados, estados cambiados, etc.)

---

## Configurar Aplicación Web

### Paso 1: Agregar Aplicación Web

1. En **Configuración del proyecto** (icono de engranaje), ve a la pestaña **"General"**
2. Baja hasta **"Tus aplicaciones"** o **"Your apps"**
3. Haz clic en el icono **"</>"** (Web)
4. **Registrar aplicación**:
   - **Nombre de la app**: `Old Texas BBQ CRM`
   - **También configura Firebase Hosting**: NO (si usas Vercel)
5. Haz clic en **"Registrar app"**

### Paso 2: Obtener Configuración

Después de registrar la app, Firebase te mostrará un código de configuración similar a:

```javascript
const firebaseConfig = {
  apiKey: 'AIzaSyXxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  authDomain: 'old-texas-bbq-crm.firebaseapp.com',
  projectId: 'old-texas-bbq-crm',
  storageBucket: 'old-texas-bbq-crm.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:xxxxxxxxxxxx',
  measurementId: 'G-XXXXXXXXXX',
};
```

**IMPORTANTE**: Guarda estos valores, los necesitarás en el siguiente paso.

---

## Obtener Credenciales

### Credenciales Públicas (Cliente)

Las credenciales que obtuviste en el paso anterior son públicas y se pueden usar en el frontend.

**Ubicación**: Configuración del proyecto > General > Tus aplicaciones > SDK setup and configuration

### Credenciales Privadas (Servidor - Opcional)

Si necesitas usar Firebase Admin SDK en Server Components o API Routes:

1. Ve a **Configuración del proyecto** > **Cuentas de servicio**
2. Haz clic en **"Generar nueva clave privada"**
3. Descarga el archivo JSON
4. **IMPORTANTE**: NO subas este archivo a Git
5. Guarda el contenido en una variable de entorno:
   ```bash
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'
   ```

**Para este proyecto (solo frontend con reglas de seguridad)**: NO necesitas credenciales de servidor por ahora.

---

## Configurar Variables de Entorno

### Paso 1: Copiar Template

Ya existe un archivo `.env.example` en el proyecto. Actualízalo con tus valores:

```bash
cp .env.example .env.local
```

### Paso 2: Agregar Valores

Abre `.env.local` y completa con las credenciales de Firebase:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=old-texas-bbq-crm.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=old-texas-bbq-crm
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=old-texas-bbq-crm.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Cloud Messaging (opcional)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Paso 3: Verificar Seguridad

1. **NUNCA** subas `.env.local` a Git
2. Verifica que `.env.local` esté en `.gitignore`:
   ```bash
   cat .gitignore | grep ".env.local"
   ```
3. Solo sube `.env.example` (sin valores)

---

## Configurar Reglas de Seguridad

### 1. Reglas de Firestore

Las reglas de Firestore controlan quién puede leer/escribir en tu base de datos.

1. Ve a **Firestore Database > Rules** o **Reglas**
2. Reemplaza el contenido con el archivo `firestore.rules` del proyecto
3. Haz clic en **"Publicar"** o **"Publish"**

**Ver archivo**: `firestore.rules` en la raíz del proyecto

**Reglas principales**:

- Autenticación requerida para todas las operaciones
- Cajeras: Crear y leer pedidos
- Cocina: Leer pedidos y actualizar estado a 'en_preparacion' y 'listo'
- Repartidores: Leer pedidos asignados y actualizar estado de reparto
- Encargado: Todas las operaciones en pedidos, productos, y turnos
- Admin: Acceso total

### 2. Reglas de Storage

1. Ve a **Storage > Rules** o **Reglas**
2. Reemplaza el contenido con el archivo `storage.rules` del proyecto
3. Haz clic en **"Publicar"** o **"Publish"**

**Ver archivo**: `storage.rules` en la raíz del proyecto

**Reglas principales**:

- Solo usuarios autenticados pueden subir archivos
- Tamaño máximo: 5MB
- Formatos permitidos: imágenes (jpg, png, webp)
- Estructura organizada por carpetas

---

## Verificar Instalación

### Paso 1: Verificar Dependencias

```bash
npm list firebase
```

Debería mostrar: `firebase@12.4.0` (o superior)

### Paso 2: Probar Conexión

Crea un archivo de prueba temporal:

```typescript
// test-firebase.ts
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

async function testConnection() {
  try {
    const testRef = collection(db, 'test');
    await getDocs(testRef);
    console.log('✅ Firebase conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a Firebase:', error);
  }
}

testConnection();
```

Ejecuta:

```bash
npx tsx test-firebase.ts
```

### Paso 3: Verificar en Firebase Console

1. Ve a **Firestore Database > Data**
2. Deberías ver la estructura de colecciones (vacías por ahora)
3. Ve a **Authentication > Users**
4. Deberías ver 0 usuarios (crearás el primer admin después)

---

## Próximos Pasos

Una vez completada la configuración:

1. **Crear primer usuario Admin**:
   - Usa Firebase Console > Authentication > Users > Add user
   - O crea un script de inicialización

2. **Poblar datos iniciales**:
   - Productos
   - Personalizaciones
   - Configuración

3. **Probar autenticación**:
   - Login/Logout
   - Protección de rutas

4. **Configurar notificaciones**:
   - Service Worker para PWA
   - Permisos de notificaciones

---

## Comandos Útiles de Firebase CLI (Opcional)

Si quieres usar Firebase CLI para desplegar reglas:

### Instalar Firebase CLI:

```bash
npm install -g firebase-tools
```

### Iniciar sesión:

```bash
firebase login
```

### Inicializar proyecto:

```bash
firebase init
```

Selecciona:

- Firestore
- Storage
- Hosting (si lo usas)

### Desplegar reglas:

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## Troubleshooting

### Error: "Firebase config is missing"

**Solución**: Verifica que todas las variables en `.env.local` estén completas y sin espacios.

### Error: "Permission denied" en Firestore

**Solución**:

1. Verifica que las reglas estén publicadas
2. Verifica que el usuario esté autenticado
3. Revisa el rol del usuario

### Error: "Storage bucket not found"

**Solución**: Verifica que hayas habilitado Storage en Firebase Console y que la variable `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` sea correcta.

### Error: "Quota exceeded" (Plan gratuito)

**Límites del plan Spark (gratuito)**:

- Firestore: 50K lecturas/día, 20K escrituras/día
- Storage: 1GB almacenamiento, 10GB transferencia/mes
- Authentication: Ilimitado

**Solución**:

- Optimiza queries (usa índices)
- Implementa caché con TanStack Query
- Considera actualizar al plan Blaze (pay-as-you-go)

---

## Recursos Adicionales

- [Documentación oficial de Firebase](https://firebase.google.com/docs)
- [Firebase con Next.js](https://firebase.google.com/docs/web/setup)
- [Reglas de seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

---

## Contacto y Soporte

Si encuentras problemas durante la configuración:

1. Revisa la consola del navegador (F12)
2. Revisa los logs de Firebase Console
3. Consulta la documentación en `/docs`

---

**Última actualización**: 2025-10-22
**Autor**: Database Architect Agent
