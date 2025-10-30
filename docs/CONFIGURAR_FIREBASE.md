# 🔥 Configurar Firebase para Old Texas BBQ - CRM

## ⚠️ Estado Actual

Actualmente, el proyecto tiene **credenciales de placeholder** en el archivo `.env.local`. Para que las notificaciones en tiempo real y otras funcionalidades de Firebase funcionen, necesitas configurar tus propias credenciales.

## 📋 Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"**
3. Nombra tu proyecto (ej: `old-texas-bbq-crm`)
4. Acepta los términos y continúa
5. Puedes **desactivar Google Analytics** si no lo necesitas (opcional)
6. Haz clic en **"Crear proyecto"**

### 2. Habilitar Firestore Database

1. En el menú lateral, ve a **"Build" → "Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de prueba"** (para desarrollo)
4. Elige la ubicación más cercana (ej: `us-central`)
5. Haz clic en **"Habilitar"**

### 3. Habilitar Firebase Authentication

1. En el menú lateral, ve a **"Build" → "Authentication"**
2. Haz clic en **"Comenzar"**
3. En la pestaña **"Sign-in method"**, habilita **"Correo electrónico/contraseña"**
4. Haz clic en **"Guardar"**

### 4. Obtener Credenciales de Firebase

1. Ve a **"Configuración del proyecto"** (ícono de engranaje en el menú lateral)
2. Baja hasta la sección **"Tus aplicaciones"**
3. Haz clic en el ícono **Web** (`</>`)
4. Registra tu app con un nombre (ej: `Old Texas BBQ CRM`)
5. **No necesitas** configurar Firebase Hosting por ahora
6. Verás una pantalla con tu configuración de Firebase:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 5. Actualizar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores de placeholder con tus credenciales:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 6. Reiniciar el Servidor

Después de actualizar las variables de entorno:

```bash
# Detén el servidor (Ctrl+C)
# Luego reinicia:
npm run dev
```

## 🔐 Configurar Reglas de Seguridad (Producción)

Para desarrollo, las reglas están en modo de prueba. Para producción, actualiza las reglas:

### Firestore Rules

1. Ve a **"Firestore Database" → "Reglas"**
2. Reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función auxiliar para verificar autenticación
    function isAuthenticated() {
      return request.auth != null;
    }

    // Función para verificar si el usuario es admin
    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
    }

    // Colección de usuarios
    match /usuarios/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Colección de pedidos
    match /pedidos/{pedidoId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isAdmin();

      // Subcollecciones
      match /items/{itemId} {
        allow read, write: if isAuthenticated();
      }
      match /historial/{historialId} {
        allow read, write: if isAuthenticated();
      }
    }

    // Colección de productos
    match /productos/{productoId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Colección de categorías
    match /categorias/{categoriaId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Colección de repartidores
    match /repartidores/{repartidorId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();

      match /liquidaciones/{liquidacionId} {
        allow read: if isAuthenticated();
        allow write: if isAdmin();
      }
    }

    // Colección de turnos
    match /turnos/{turnoId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();

      match /transacciones/{transaccionId} {
        allow read, write: if isAuthenticated();
      }
    }

    // Colección de notificaciones
    match /notificaciones/{notifId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() &&
                      (request.auth.uid == resource.data.usuarioId || isAdmin());
      allow delete: if isAdmin();
    }

    // Colección de configuración
    match /configuracion/{configId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

## ✅ Verificar que Funciona

1. Abre el navegador en: `http://localhost:3001/dev/test`
2. Si Firebase está configurado correctamente, verás la página de prueba
3. Si NO está configurado, verás instrucciones en pantalla

## 🧪 Probar Notificaciones en Tiempo Real

1. Abre `http://localhost:3001/dev/test` en **dos navegadores diferentes**
2. En uno de ellos, haz clic en **"Crear Ticket de Compra"**
3. Observa cómo aparece la notificación en el otro navegador automáticamente 🎉

## 🔍 Debugging

### Ver datos en Firestore

1. Ve a Firebase Console → Firestore Database
2. Verás las colecciones creadas (ej: `notificaciones`)
3. Podrás ver los documentos en tiempo real

### Ver logs en la consola del navegador

Abre la consola (F12) y verás logs como:

```
🔥 Firebase inicializado correctamente
📦 Proyecto: tu-proyecto
🌍 Entorno: development
🔔 NotificationListener montado
📨 Notificaciones recibidas: 1
🎉 Mostrando notificación: 🛒 Nuevo Ticket de Compra
```

## 🚨 Problemas Comunes

### Error: "Missing required Firebase environment variables"

- **Solución**: Asegúrate de que todas las variables en `.env.local` están configuradas y NO contienen valores como `your-api-key-here`
- Reinicia el servidor después de cambiar `.env.local`

### Error: "Permission denied"

- **Solución**: Verifica que las reglas de Firestore permitan lectura/escritura
- Para desarrollo, puedes usar reglas permisivas (modo de prueba)

### La página no carga

- **Solución**: Verifica que el servidor esté corriendo en el puerto correcto (3001)
- Limpia el caché del navegador (Cmd+Shift+R en Mac, Ctrl+Shift+R en Windows)

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs/web/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)

---

**Nota**: Las credenciales de Firebase son **públicas** por naturaleza (van en el cliente). La seguridad se maneja mediante las **reglas de Firestore** y **Authentication**.

**Desarrollado por**: Claude Code - Jarvis
**Proyecto**: Old Texas BBQ - CRM
**Fecha**: Octubre 2025
