# 🔥 Solución: Firebase Error en Producción

## Problema
```
Firebase: Error (auth/network-request-failed)
```

Este error ocurre cuando Firebase no puede comunicarse con tu aplicación en producción, generalmente por:
1. Variables de entorno no configuradas en Vercel
2. Dominio no autorizado en Firebase Console

---

## ✅ Solución Paso a Paso

### Paso 1: Configurar Variables de Entorno en Vercel

Debes ir a tu proyecto en Vercel y agregar las siguientes variables de entorno:

**🔗 URL:** https://vercel.com/[tu-usuario]/[tu-proyecto]/settings/environment-variables

**Variables a agregar:**

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA2ghziuh8wz6YMTIq72qdC9y7mLve9HUs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=oldtexasbbq-ecb85.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=oldtexasbbq-ecb85
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=oldtexasbbq-ecb85.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=789446054705
NEXT_PUBLIC_FIREBASE_APP_ID=1:789446054705:web:c117586310b396c01c9610
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-SK8LLDEG47
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

# App Configuration
NEXT_PUBLIC_APP_URL=https://[tu-dominio].vercel.app

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=doqbc2exe
NEXT_PUBLIC_CLOUDINARY_API_KEY=245663283252112
CLOUDINARY_API_SECRET=hQlxzH7kAZh-C7lfQwOql2j6hpY
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=old-texas-bbq-unsigned

# Dev Access
DEV_ACCESS_KEY=271097
```

**Importante:**
- Asegúrate de marcar todas como disponibles en: **Production**, **Preview**, y **Development**
- Reemplaza `[tu-dominio]` con tu dominio real de Vercel

---

### Paso 2: Autorizar Dominio en Firebase Console

1. Ve a **Firebase Console**: https://console.firebase.google.com/project/oldtexasbbq-ecb85

2. Navega a:
   - **Authentication** → **Settings** → **Authorized domains**

3. Agrega tu dominio de Vercel:
   ```
   [tu-proyecto].vercel.app
   ```

4. Si tienes dominio personalizado, agrégalo también:
   ```
   tudominio.com
   www.tudominio.com
   ```

**Dominios que YA deberían estar autorizados:**
- ✅ `localhost`
- ✅ `oldtexasbbq-ecb85.firebaseapp.com`

---

### Paso 3: Re-desplegar en Vercel

Después de configurar las variables de entorno, debes re-desplegar:

#### Opción A: Desde la Terminal
```bash
# Asegúrate de tener el CLI de Vercel instalado
npm i -g vercel

# Desplegar a producción
vercel --prod
```

#### Opción B: Desde el Dashboard de Vercel
1. Ve a tu proyecto en Vercel
2. Pestaña **Deployments**
3. Click en los 3 puntos del último deployment
4. Click en **Redeploy**
5. Marca la opción **Use existing build cache** (opcional)
6. Click en **Redeploy**

---

## 🔍 Verificación

### 1. Verificar Variables de Entorno
Abre las DevTools en tu sitio en producción y ejecuta:

```javascript
console.log({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
})
```

**Debería mostrar los valores reales, NO `undefined`**

### 2. Verificar Dominios Autorizados
En Firebase Console → Authentication → Settings → Authorized domains

Debería incluir:
- ✅ `localhost`
- ✅ `oldtexasbbq-ecb85.firebaseapp.com`
- ✅ `[tu-proyecto].vercel.app`

### 3. Probar Autenticación
Intenta hacer login en tu sitio en producción.

---

## 🚨 Errores Comunes

### Error: "Firebase: Error (auth/unauthorized-domain)"
**Causa:** El dominio no está autorizado en Firebase Console
**Solución:** Agrega el dominio en Firebase Console → Authentication → Authorized domains

### Error: "Firebase: Error (auth/network-request-failed)"
**Causa:** Variables de entorno no configuradas o incorrectas
**Solución:** Verifica que todas las variables `NEXT_PUBLIC_FIREBASE_*` estén en Vercel

### Error: Variables de entorno son `undefined`
**Causa:** No se re-desplegó después de agregar las variables
**Solución:** Re-desplegar el proyecto en Vercel

---

## 📝 Checklist de Solución

- [ ] Variables de entorno agregadas en Vercel
- [ ] Variables marcadas para Production, Preview, Development
- [ ] Dominio de Vercel agregado en Firebase Console
- [ ] Proyecto re-desplegado en Vercel
- [ ] Verificado que variables no sean `undefined` en producción
- [ ] Probado login en producción

---

## 🎯 Comando Rápido para Re-desplegar

```bash
# Si ya tienes el proyecto vinculado
vercel --prod --yes

# Si necesitas vincular primero (desde el dashboard de Vercel)
# 1. Copia el nombre del proyecto (ejemplo: old-texas-bbq-crm)
# 2. Ejecuta:
vercel link --project=old-texas-bbq-crm
vercel --prod --yes
```

---

## 💡 Recomendación

Si el problema persiste después de estos pasos:
1. Limpia la caché del navegador
2. Abre en modo incógnito
3. Verifica los logs en Vercel Dashboard → tu proyecto → Logs
4. Verifica los logs en Firebase Console → Firestore → Usage

---

**Última actualización:** 2025-11-07
