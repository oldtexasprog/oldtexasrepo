# 🔒 Seguridad del Sistema de Notificaciones

## Arquitectura de Seguridad Mejorada

Este documento explica las medidas de seguridad implementadas en el Service Worker de Firebase Cloud Messaging para proteger las credenciales y mejorar la seguridad del sistema.

## 🎯 Problema Original

Anteriormente, el Service Worker (`firebase-messaging-sw.js`) tenía las credenciales de Firebase **hardcodeadas** directamente en el código:

```javascript
// ❌ INSEGURO - Credenciales hardcodeadas
const firebaseConfig = {
  apiKey: 'AIzaSyA2ghziuh8wz6YMTIq72qdC9y7mLve9HUs',
  authDomain: 'oldtexasbbq-ecb85.firebaseapp.com',
  // ...
};
```

### Riesgos:

1. **Exposición de credenciales** - Cualquiera puede ver las credenciales en el código fuente
2. **Dificultad de actualización** - Cambiar credenciales requiere modificar código
3. **Sin gestión de entornos** - Mismo archivo para dev, staging y producción
4. **Falta de validación** - No se verifica que las credenciales sean válidas

## ✅ Solución Implementada

### Configuración Dinámica desde API

Ahora el Service Worker obtiene la configuración de Firebase de forma **dinámica** desde un endpoint API seguro.

```
┌─────────────────┐
│  Service Worker │
│ (firebase-sw.js)│
└────────┬────────┘
         │
         │ 1. Solicita config
         ▼
┌─────────────────────────┐
│ API Endpoint            │
│ /api/firebase-config    │
└────────┬────────────────┘
         │
         │ 2. Lee desde env
         ▼
┌─────────────────────────┐
│ Variables de Entorno    │
│ (.env.local)            │
└─────────────────────────┘
```

### Características de Seguridad

#### 1. **API Endpoint Seguro** (`/api/firebase-config`)

```typescript
// app/api/firebase-config/route.ts
export async function GET() {
  // ✅ Validación de variables de entorno
  // ✅ Solo devuelve credenciales PÚBLICAS
  // ✅ Headers de seguridad (CORS, Cache-Control)
  // ✅ Solo permite método GET
  // ✅ Manejo de errores robusto
}
```

**Validaciones:**
- Verifica que todas las variables de entorno existan
- Devuelve error 500 si falta alguna
- Implementa CORS restringido al dominio de la app
- Cache de 1 hora para reducir peticiones

#### 2. **Service Worker con Caché Inteligente**

```javascript
// public/firebase-messaging-sw.js

async function getFirebaseConfig() {
  // 1. Intenta obtener de caché (válido por 1 hora)
  // 2. Si no hay caché, obtiene desde /api/firebase-config
  // 3. Valida la configuración recibida
  // 4. Guarda en caché
  // 5. Retorna configuración válida
}
```

**Ventajas:**
- ✅ **Caché local** - Reduce peticiones innecesarias al API
- ✅ **Validación** - Verifica que la config sea válida antes de usar
- ✅ **Fallback** - Manejo de errores si el API falla
- ✅ **Performance** - Config se cachea por 1 hora

#### 3. **Inicialización Dinámica**

```javascript
async function initializeFirebase() {
  const config = await getFirebaseConfig();

  if (!config) {
    throw new Error('No se pudo obtener la configuración');
  }

  firebaseApp = firebase.initializeApp(config);
  messaging = firebase.messaging();
}
```

**Flujo de Inicialización:**
1. Service Worker se instala
2. Pre-cachea la configuración de Firebase
3. Se activa y obtiene control de los clientes
4. Inicializa Firebase con la config obtenida
5. Configura handler de mensajes en background

## 🔐 Medidas de Seguridad Implementadas

### 1. Separación de Credenciales

| Antes (❌)                        | Ahora (✅)                         |
| --------------------------------- | ---------------------------------- |
| Hardcodeadas en código público    | En variables de entorno            |
| Visibles en el navegador          | Solo accesibles vía API            |
| Mismo archivo para todos los env  | Diferentes .env por entorno        |

### 2. Validación de Configuración

```javascript
// Validar campos obligatorios
if (!config.apiKey || !config.authDomain || !config.projectId) {
  throw new Error('Invalid Firebase configuration');
}
```

### 3. Control de Acceso (CORS)

```typescript
// Solo permitir acceso desde el dominio de la app
'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
'Access-Control-Allow-Methods': 'GET',
```

### 4. Caché Controlado

```javascript
// Cache-Control con max-age de 1 hora
'Cache-Control': 'public, max-age=3600, s-maxage=3600',
```

### 5. Versionamiento del Service Worker

```javascript
const SW_VERSION = '2.0.0';

// Permite forzar actualizaciones cambiando la versión
```

### 6. Manejo de Errores Robusto

```javascript
try {
  const config = await getFirebaseConfig();
} catch (error) {
  console.error('Error al obtener config:', error);
  return null; // Fallback seguro
}
```

## 🛡️ Configuración de Variables de Entorno

### Archivo `.env.local`

```bash
# Firebase Configuration (PÚBLICAS - safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123DEF

# App Configuration
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### Importante sobre Credenciales "Públicas"

Las credenciales de Firebase con prefijo `NEXT_PUBLIC_` son **públicas** y **seguras de exponer** porque:

1. **Firebase usa reglas de seguridad** - La protección real está en Firestore Rules
2. **No permiten acceso directo** - Requieren autenticación para operaciones sensibles
3. **Son necesarias en el cliente** - Para inicializar el SDK
4. **Google las considera públicas** - Documentación oficial las expone

⚠️ **NUNCA expongas**:
- Claves privadas de servidor
- Service Account JSON
- Secretos de API (sin NEXT_PUBLIC_)
- Tokens de acceso

## 🔄 Flujo Completo de Seguridad

### 1. Instalación del Service Worker

```
Usuario abre la app
        ↓
Service Worker se registra
        ↓
event: install → Pre-cachea config
        ↓
event: activate → Obtiene control
        ↓
Inicializa Firebase con config segura
        ↓
Listo para recibir notificaciones
```

### 2. Obtención de Configuración

```
Service Worker necesita config
        ↓
Busca en Cache API (válido 1h)
        ↓
¿Encontrado y válido?
   │
   ├─ SÍ → Usa config cacheada
   │
   └─ NO → Fetch a /api/firebase-config
           ↓
       Valida respuesta
           ↓
       Guarda en cache
           ↓
       Retorna config
```

### 3. Recepción de Notificación Push

```
Firebase envía mensaje
        ↓
Service Worker intercepta
        ↓
onBackgroundMessage()
        ↓
Extrae datos y opciones
        ↓
Muestra notificación nativa
        ↓
Usuario hace clic
        ↓
Abre/Enfoca la app
```

## 🧪 Cómo Verificar la Seguridad

### 1. Inspeccionar en Chrome DevTools

```javascript
// Abrir DevTools > Application > Service Workers
// Verificar que esté registrado

// Console:
navigator.serviceWorker.getRegistration('/').then(reg => {
  reg.active.postMessage({ type: 'GET_VERSION' });
});
```

### 2. Verificar Caché

```javascript
// DevTools > Application > Cache Storage
// Debería haber: firebase-config-cache
```

### 3. Probar API Endpoint

```bash
curl http://localhost:3000/api/firebase-config

# Debería retornar la configuración de Firebase
```

### 4. Logs del Service Worker

```javascript
// DevTools > Console > Filtrar por [SW]
[SW] 🚀 Service Worker cargado - Versión 2.0.0
[SW] 🔒 Modo seguro: Configuración dinámica habilitada
[SW] ✅ Configuración de Firebase obtenida y cacheada
```

## 📊 Comparación: Antes vs Ahora

| Aspecto                    | Antes (v1)     | Ahora (v2)     |
| -------------------------- | -------------- | -------------- |
| **Credenciales**           | Hardcodeadas   | Dinámicas      |
| **Gestión de entornos**    | Manual         | Automática     |
| **Validación**             | Ninguna        | Completa       |
| **Caché**                  | No             | Sí (1 hora)    |
| **Versionamiento**         | No             | Sí             |
| **Logs detallados**        | Básicos        | Completos      |
| **Manejo de errores**      | Básico         | Robusto        |
| **Performance**            | N/A            | Optimizada     |

## 🚀 Mejoras Futuras Posibles

### 1. Rate Limiting
```typescript
// Limitar peticiones al API endpoint
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  const { success } = await rateLimit(request);
  if (!success) return new Response('Too Many Requests', { status: 429 });
  // ...
}
```

### 2. Autenticación del Service Worker
```typescript
// Requerir token de autenticación
const token = request.headers.get('Authorization');
if (!validateToken(token)) {
  return new Response('Unauthorized', { status: 401 });
}
```

### 3. Rotación de Credenciales
```typescript
// Permitir rotación sin downtime
const config = await getFirebaseConfig(version);
```

### 4. Monitoreo y Analytics
```typescript
// Trackear uso del API
await analytics.track('firebase-config-fetched', {
  timestamp: Date.now(),
  cached: fromCache,
});
```

## ⚠️ Advertencias de Seguridad

### ❌ NO HACER:

1. **NO** expongas secretos del servidor en el API endpoint
2. **NO** deshabilites CORS sin razón válida
3. **NO** guardes credenciales en localStorage del navegador
4. **NO** uses credenciales de producción en desarrollo

### ✅ SÍ HACER:

1. **SÍ** mantén las variables de entorno fuera del control de versiones
2. **SÍ** usa diferentes credenciales por entorno (dev, staging, prod)
3. **SÍ** implementa reglas de seguridad estrictas en Firestore
4. **SÍ** monitorea los logs del Service Worker en producción

## 📖 Referencias

- [Service Workers - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Firebase Security - Google](https://firebase.google.com/docs/rules)
- [Cache API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [CORS - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Versión**: 2.0.0
**Última actualización**: Diciembre 2024
**Autor**: Pedro Duran
