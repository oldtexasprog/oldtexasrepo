# 🔐 Documentación de Variables de Entorno

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Variables de Firebase](#variables-de-firebase)
3. [Variables de Cloudinary](#variables-de-cloudinary)
4. [Variables de Seguridad](#variables-de-seguridad)
5. [Variables de Configuración](#variables-de-configuración)
6. [Entornos](#entornos)

---

## 🚀 Configuración Inicial

### Setup Básico

```bash
# 1. Copiar archivo de ejemplo
cp .env.example .env.local

# 2. Editar con tus credenciales
nano .env.local

# 3. Verificar que funciona
npm run dev
```

### ⚠️ Reglas Importantes

- ✅ `.env.local` está en `.gitignore` (nunca commitear)
- ✅ Usar `NEXT_PUBLIC_` para variables del cliente
- ✅ Variables sin prefijo solo en servidor
- ❌ NUNCA exponer secrets en el cliente
- ❌ NUNCA commitear credenciales reales

---

## 🔥 Variables de Firebase

### Obtener Credenciales

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar proyecto
3. ⚙️ Project Settings > General
4. Scroll hasta "Your apps" > Web app
5. Copiar valores

### Variables Requeridas

```bash
# API Key (público, OK exponerlo)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX

# Auth Domain
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com

# Project ID
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id

# Storage Bucket
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com

# Messaging Sender ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012

# App ID
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456

# Measurement ID (opcional - Analytics)
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Variables Opcionales

```bash
# VAPID Key para FCM (requiere plan Blaze)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BNxxxxxxxxxxxxxxxxxxxxxxx

# Usar emuladores en desarrollo
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

### ¿Por qué son públicas?

Firebase API Keys no son secretas porque:
- Están diseñadas para ser públicas
- La seguridad real está en Firestore Rules
- No pueden usarse sin autorización correcta

---

## 🖼️ Variables de Cloudinary

### Obtener Credenciales

1. Ir a [Cloudinary Console](https://cloudinary.com/console)
2. Dashboard muestra Cloud Name, API Key, API Secret

### Variables Requeridas

```bash
# Cloud Name (público)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name

# API Key (público para unsigned uploads)
NEXT_PUBLIC_CLOUDINARY_API_KEY=123456789012345

# API Secret (PRIVADO - solo servidor)
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Upload Preset (público - para unsigned uploads)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=old_texas_products
```

### Crear Upload Preset

1. Cloudinary Console > Settings > Upload
2. Scroll a "Upload presets"
3. Click "Add upload preset"
4. Configurar:
   - **Signing Mode**: Unsigned
   - **Folder**: `old-texas-products`
   - **Access Mode**: Public
   - **Allowed formats**: jpg, png, webp
   - **Max file size**: 5 MB
5. Guardar y copiar el nombre del preset

### ⚠️ Seguridad

- ✅ Cloud Name y API Key → Públicos (OK)
- ✅ Upload Preset → Público (OK)
- ❌ API Secret → **NUNCA** exponer en cliente

---

## 🔒 Variables de Seguridad

### JWT Session Secret

```bash
# Generar con:
# openssl rand -base64 32

SESSION_SECRET=tu_super_secret_key_de_minimo_32_caracteres_aqui
```

**Uso**: Firma tokens JWT para sesiones de usuario

**Importante**:
- Generar diferente para cada entorno
- Mínimo 32 caracteres
- Nunca reusar entre proyectos

### Development Access Key

```bash
# Solo para desarrollo
NEXT_PUBLIC_DEV_ACCESS_KEY=dev_password_123
```

**Uso**: Protege páginas de desarrollo (`/dev/*`)

**En producción**: Eliminar o cambiar contraseña

---

## ⚙️ Variables de Configuración

### App URL

```bash
# Desarrollo
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Producción
NEXT_PUBLIC_APP_URL=https://crm.oldtexasbbq.com
```

**Uso**: URLs absolutas, redirects, OAuth callbacks

### Node Environment

```bash
# Automático en desarrollo
NODE_ENV=development

# Automático en producción (Vercel)
NODE_ENV=production
```

### Configuración de Negocio

```bash
# Comisión por defecto (en pesos)
COMISION_REPARTO_DEFAULT=30

# Costo de envío por zona (JSON)
COSTO_ENVIO_ZONAS='{"centro":40,"norte":50,"sur":60}'

# Tiempo de alerta de retraso (minutos)
TIEMPO_ALERTA_RETRASO=30
```

---

## 🌍 Entornos

### Desarrollo Local

```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
DEBUG=true
```

### Staging

```bash
# Configurar en Vercel Environment Variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.oldtexasbbq.com
```

### Producción

```bash
# Configurar en Vercel Environment Variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://crm.oldtexasbbq.com

# IMPORTANTE: Credenciales de Firebase de producción
# IMPORTANTE: Regenerar SESSION_SECRET
# IMPORTANTE: Deshabilitar debug
```

---

## 🔍 Troubleshooting

### Firebase no conecta

✅ **Verificar**:
- API Key correcto (sin espacios)
- Project ID coincide
- Reglas de Firestore permiten lectura

### Cloudinary no sube imágenes

✅ **Verificar**:
- Upload Preset existe y es "unsigned"
- Cloud Name correcto
- Tamaño de archivo < 5MB

### JWT Session error

✅ **Verificar**:
- SESSION_SECRET configurado
- Mínimo 32 caracteres
- Cookie httpOnly habilitado

### Variables no se actualizan

✅ **Solución**:
```bash
# Reiniciar servidor
npm run dev

# Limpiar cache
rm -rf .next
npm run dev
```

---

## 📚 Referencias

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**Última actualización**: Enero 2026
**Versión**: 1.0
