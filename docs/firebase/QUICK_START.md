# Quick Start - Firebase Setup

Guía rápida de 5 pasos para configurar Firebase en 25 minutos.

---

## Paso 1: Crear Proyecto en Firebase Console (5 min)

1. Ve a https://console.firebase.google.com/
2. Clic en "Crear un proyecto"
3. Nombre: `old-texas-bbq-crm`
4. Habilitar Analytics: Sí
5. Crear proyecto

---

## Paso 2: Habilitar Servicios (10 min)

### Authentication

1. Menú > Authentication > Comenzar
2. Email/Password > Habilitar > Guardar

### Firestore

1. Menú > Firestore Database > Crear base de datos
2. Modo: Producción
3. Ubicación: `us-central1`
4. Habilitar

### Storage

1. Menú > Storage > Comenzar
2. Modo: Producción
3. Ubicación: `us-central1`
4. Habilitar

### Cloud Messaging

1. Menú > Configuración del proyecto (engranaje)
2. Pestaña: Cloud Messaging
3. Web Push certificates > Generate key pair
4. Copiar VAPID key

---

## Paso 3: Registrar App Web (3 min)

1. Configuración del proyecto > General
2. Tus aplicaciones > Web (icono `</>`)
3. Nombre: `Old Texas BBQ CRM`
4. No habilitar Hosting (si usas Vercel)
5. Registrar app
6. **Copiar todo el objeto `firebaseConfig`**

---

## Paso 4: Configurar Variables de Entorno (2 min)

```bash
# Copiar template
cp .env.example .env.local

# Editar con tus credenciales
nano .env.local
```

Pegar las credenciales copiadas del paso 3:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=old-texas-bbq-crm.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=old-texas-bbq-crm
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=old-texas-bbq-crm.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BNxxxx...
```

**IMPORTANTE**: También actualizar `public/firebase-messaging-sw.js` con las mismas credenciales.

---

## Paso 5: Desplegar Reglas de Seguridad (5 min)

### Opción A: Desde Firebase Console (Más fácil)

**Firestore:**

1. Firestore Database > Rules
2. Copiar contenido de `firestore.rules` del proyecto
3. Pegar en el editor
4. Publish

**Storage:**

1. Storage > Rules
2. Copiar contenido de `storage.rules` del proyecto
3. Pegar en el editor
4. Publish

### Opción B: Con Firebase CLI (Más rápido)

```bash
# Instalar CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar proyecto
firebase init
# Seleccionar: Firestore, Storage
# Usar archivos existentes: firestore.rules, storage.rules

# Desplegar reglas
firebase deploy --only firestore:rules,storage:rules
```

---

## Verificación

```bash
# Iniciar dev server
npm run dev

# Abrir en navegador
# http://localhost:3000
```

**En la consola deberías ver**:

```
🔥 Firebase inicializado correctamente
📦 Proyecto: old-texas-bbq-crm
🌍 Entorno: development
🧪 Emulador: No
```

---

## Crear Primer Usuario Admin

### Desde Firebase Console:

1. Authentication > Users > Add user
2. Email: `admin@oldtexasbbq.com`
3. Password: (contraseña segura)
4. Copiar el UID generado

5. Firestore Database > Data > Agregar colección
   - Collection ID: `usuarios`
   - Document ID: (pegar el UID copiado)
   - Campos:
     ```
     id: [UID]
     nombre: "Administrador"
     email: "admin@oldtexasbbq.com"
     rol: "admin"
     activo: true
     createdAt: [usar "Timestamp"]
     ```

---

## Probar Login

```typescript
import { login } from '@/lib/firebase';

const result = await login({
  email: 'admin@oldtexasbbq.com',
  password: 'tu_contraseña',
});

if (result.success) {
  console.log('✅ Login exitoso!');
}
```

---

## Siguiente: Poblar Datos Iniciales

Ver `docs/firebase/SEED_DATA.md` para scripts de inicialización de:

- Productos
- Personalizaciones
- Configuración

---

## Troubleshooting Rápido

| Error                        | Solución                      |
| ---------------------------- | ----------------------------- |
| "Firebase config is missing" | Verifica `.env.local`         |
| "Permission denied"          | Despliega reglas de seguridad |
| "Storage bucket not found"   | Habilita Storage en Console   |
| "Module not found"           | `npm install`                 |

---

## Recursos

- **Setup completo**: `docs/firebase/FIREBASE_SETUP_GUIDE.md`
- **Documentación**: `docs/firebase/README.md`
- **Desplegar reglas**: `docs/firebase/DEPLOY_RULES.md`
- **Resumen**: `docs/firebase/RESUMEN_FIREBASE_SETUP.md`

---

**¡Firebase configurado en 25 minutos!** 🎉

Siguiente paso: Crear componentes de UI con las utilidades de Firebase.
