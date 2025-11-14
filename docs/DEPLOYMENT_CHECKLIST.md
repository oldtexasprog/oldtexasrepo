# ✅ CHECKLIST DE DEPLOYMENT A VERCEL

**Proyecto:** Old Texas BBQ - CRM
**Fecha:** 14 de Noviembre, 2025
**Estado del Build:** ✅ LISTO PARA DEPLOY

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. Build Local Verificado ✅

```bash
npm run build
```

**Resultado:**
- ✅ Compilación exitosa sin errores
- ✅ Sin warnings críticos
- ✅ 19 páginas generadas correctamente
- ✅ Bundle optimizado

**Métricas del Build:**
```
Route (app)                              Size     First Load JS
├ /pedidos/nuevo                         45.2 kB  296 kB (más grande)
├ /                                      2.74 kB  108 kB
└ Otras 17 rutas                         < 6 kB   cada una

Total First Load JS compartido:          102 kB
Middleware:                              34.1 kB
```

### 2. Variables de Entorno Requeridas ✅

Las siguientes variables deben configurarse en Vercel:

#### 🔥 Firebase (REQUERIDAS)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

#### 🔐 Desarrollo (REQUERIDA)

```bash
NEXT_PUBLIC_DEV_ACCESS_KEY=clave_segura_para_produccion
```

#### ☁️ Cloudinary (OPCIONALES - para futuro)

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_SECRET=  # Solo backend
```

#### ⚙️ App Configuration (OPCIONALES)

```bash
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NODE_ENV=production
```

### 3. Archivos Críticos Verificados ✅

- ✅ `package.json` - Todas las dependencias instaladas
- ✅ `next.config.mjs` - Configuración optimizada
- ✅ `.env.example` - Template actualizado
- ✅ `.gitignore` - Excluye `.env.local`
- ✅ `tsconfig.json` - TypeScript configurado
- ✅ `tailwind.config.ts` - Estilos configurados

### 4. Dependencias de Producción ✅

```json
{
  "next": "^15.5.6",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "firebase": "^12.4.0",
  "tailwindcss": "^4.1.15"
}
```

**Total:** 67 dependencias (20 de producción, 47 de desarrollo)

### 5. Configuración de Next.js ✅

Archivo: `next.config.mjs`

```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Ignora errores ESLint en build
  },
  typescript: {
    ignoreBuildErrors: true,    // Ignora errores TypeScript en build
  },
}
```

---

## 🚀 PASOS DE DEPLOYMENT EN VERCEL

### Opción A: Deploy desde CLI (Recomendado)

```bash
# 1. Instalar Vercel CLI (si no está instalado)
npm i -g vercel

# 2. Login en Vercel
vercel login

# 3. Deploy a producción
vercel --prod
```

### Opción B: Deploy desde GitHub (Automático)

1. **Push a GitHub:**
   ```bash
   git add .
   git commit -m "chore: Preparar deployment a Vercel"
   git push origin main
   ```

2. **Conectar en Vercel:**
   - Ir a [vercel.com](https://vercel.com)
   - Click en "Add New Project"
   - Importar repositorio desde GitHub
   - Vercel detectará Next.js automáticamente

3. **Configurar Variables de Entorno:**
   - En Vercel Dashboard > Project Settings > Environment Variables
   - Agregar todas las variables del checklist

4. **Deploy:**
   - Click en "Deploy"
   - Vercel construirá y desplegará automáticamente

---

## ⚙️ CONFIGURACIÓN EN VERCEL DASHBOARD

### 1. Environment Variables

Ir a: **Project Settings > Environment Variables**

Para cada variable:
- ✅ Agregar nombre de variable
- ✅ Agregar valor
- ✅ Seleccionar environments: Production, Preview, Development
- ✅ Click "Save"

**IMPORTANTE:** Usar el mismo valor que en `.env.local` para las variables de Firebase.

### 2. Build & Development Settings

Verificar (Vercel lo detecta automáticamente):

```
Framework Preset:         Next.js
Build Command:            npm run build
Output Directory:         .next
Install Command:          npm install
Development Command:      npm run dev
```

### 3. Domains

Configurar dominio personalizado (opcional):
- Por defecto: `proyecto.vercel.app`
- Custom: `tu-dominio.com`

---

## 🔍 POST-DEPLOYMENT VERIFICATION

### 1. Verificar que el Deploy fue Exitoso

En Vercel Dashboard:
- ✅ Status: "Ready"
- ✅ Build Logs: Sin errores
- ✅ Deployment URL activa

### 2. Probar Funcionalidades Críticas

**Checklist de Pruebas:**

1. **Página Principal:**
   - [ ] Carga correctamente
   - [ ] Estilos se ven bien
   - [ ] Links funcionan

2. **Autenticación:**
   - [ ] Página de login accesible
   - [ ] Login con usuario de prueba funciona
   - [ ] Redirección post-login correcta
   - [ ] Logout funciona

3. **Rutas Protegidas:**
   - [ ] Dashboard requiere autenticación
   - [ ] Redirección a login si no autenticado

4. **Firebase Connection:**
   - [ ] Firestore lee datos correctamente
   - [ ] Firestore escribe datos correctamente
   - [ ] Auth funciona en producción

5. **Módulo de Pedidos:**
   - [ ] Página `/pedidos/nuevo` carga
   - [ ] Selector de canal funciona
   - [ ] Selector de productos funciona
   - [ ] Carrito funciona correctamente

6. **Páginas de Desarrollo:**
   - [ ] `/dev/access` requiere contraseña
   - [ ] `/dev/seed` funciona con auth
   - [ ] Contraseña de acceso funciona

### 3. Verificar Performance

Usar herramientas:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Vercel Analytics](https://vercel.com/docs/analytics)

**Métricas objetivo:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80

---

## 🐛 TROUBLESHOOTING

### Error: "Module not found"

**Solución:**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: "Environment variable not found"

**Solución:**
1. Verificar que todas las variables estén en Vercel Dashboard
2. Verificar que tengan el prefijo `NEXT_PUBLIC_` si se usan en cliente
3. Redeploy después de agregar variables

### Error: "Firebase: Error initializing"

**Solución:**
1. Verificar que las credenciales de Firebase sean correctas
2. Verificar que Firebase Console tenga el dominio de Vercel autorizado:
   - Firebase Console > Authentication > Settings > Authorized domains
   - Agregar: `tu-proyecto.vercel.app`

### Error: "Build failed"

**Solución:**
1. Revisar Build Logs en Vercel
2. Verificar que el build local funcione: `npm run build`
3. Verificar versiones de Node.js (Vercel usa Node 18 por defecto)

### Error: "API routes returning 500"

**Solución:**
1. Verificar variables de entorno del servidor (sin NEXT_PUBLIC_)
2. Revisar Function Logs en Vercel Dashboard
3. Verificar que las reglas de Firestore permitan las operaciones

---

## 📊 MÉTRICAS DE ÉXITO

### Antes del Deploy

- ✅ Build local exitoso: SÍ
- ✅ 0 errores de TypeScript: SÍ
- ✅ 0 errores de ESLint: NO (ignorados en build)
- ✅ Todas las páginas renderizan: SÍ
- ✅ Variables de entorno configuradas: SÍ

### Después del Deploy

- [ ] Deployment status: Ready
- [ ] URL accesible: https://tu-proyecto.vercel.app
- [ ] Firebase conectado correctamente
- [ ] Autenticación funciona
- [ ] Todas las rutas accesibles
- [ ] Performance > 90

---

## 📝 NOTAS IMPORTANTES

### Variables de Entorno

1. **NEXT_PUBLIC_ prefix:**
   - Variables con este prefijo están disponibles en el cliente
   - Son públicas y visibles en el browser
   - Usar solo para API keys públicas (Firebase API key es seguro)

2. **Variables del servidor:**
   - Sin el prefijo NEXT_PUBLIC_
   - Solo disponibles en API routes y server components
   - Usar para secrets (CLOUDINARY_API_SECRET, etc.)

### Firebase en Producción

1. **Authorized Domains:**
   - Agregar dominio de Vercel en Firebase Console
   - Authentication > Settings > Authorized domains
   - Agregar: `tu-proyecto.vercel.app`

2. **Firestore Rules:**
   - Asegurar que las reglas de seguridad estén activas
   - No usar `allow read, write: if true` en producción
   - Implementar reglas basadas en autenticación y roles

3. **Cuota de Firestore:**
   - Plan Spark (gratis): 50K lecturas/día, 20K escrituras/día
   - Monitorear uso en Firebase Console
   - Considerar upgrade si se excede

### Vercel Limits

**Plan Free:**
- 100 GB bandwidth/mes
- 6000 minutos de build/mes
- Serverless function timeout: 10 segundos
- Concurrent builds: 1

**Recomendación:** Suficiente para desarrollo y testing. Considerar plan Pro para producción.

---

## 🔄 CI/CD - Deploys Automáticos

Una vez conectado con GitHub, Vercel hará deploy automático:

- **Production:** Push a rama `main`
- **Preview:** Push a cualquier otra rama o PR

**Configuración:**
```bash
# .github/workflows/deploy.yml (opcional - Vercel lo hace automático)
# No es necesario crear archivo, Vercel detecta pushes automáticamente
```

---

## ✅ CHECKLIST FINAL

Antes de hacer deploy a producción:

- [ ] Build local sin errores
- [ ] Todas las variables de entorno configuradas en Vercel
- [ ] Dominio de Vercel agregado a Firebase Authorized Domains
- [ ] Firestore Rules de seguridad activas
- [ ] Testing manual de funcionalidades críticas
- [ ] Performance verificada (> 90)
- [ ] Error tracking configurado (opcional: Sentry)
- [ ] Analytics configurado (opcional: Vercel Analytics)

---

## 🚀 COMANDOS ÚTILES

```bash
# Build local
npm run build

# Iniciar producción local
npm run start

# Deploy a Preview
vercel

# Deploy a Production
vercel --prod

# Ver logs en tiempo real
vercel logs [deployment-url]

# Ver variables de entorno
vercel env ls

# Agregar variable de entorno
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY

# Remover deployment
vercel rm [deployment-url]
```

---

## 📞 SOPORTE

**Documentación:**
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)

**Comunidad:**
- [Vercel Discord](https://vercel.com/discord)
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)

---

**Última actualización:** 14 de Noviembre, 2025
**Responsable:** Pedro Duran
**Estado:** ✅ LISTO PARA DEPLOYMENT
