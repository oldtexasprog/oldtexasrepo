# Desplegar Reglas de Seguridad de Firebase

Guía paso a paso para desplegar las reglas de seguridad de Firestore y Storage.

## Tabla de Contenidos

1. [Método 1: Desde Firebase Console (Recomendado para principiantes)](#método-1-desde-firebase-console)
2. [Método 2: Usando Firebase CLI (Recomendado para producción)](#método-2-usando-firebase-cli)
3. [Verificar Reglas Desplegadas](#verificar-reglas-desplegadas)
4. [Probar Reglas](#probar-reglas)

---

## Método 1: Desde Firebase Console

Este método es más visual y no requiere instalación de herramientas adicionales.

### Desplegar Reglas de Firestore

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **"Firestore Database"**
4. Haz clic en la pestaña **"Rules"** o **"Reglas"**
5. Verás un editor de texto con las reglas actuales
6. **Copia** todo el contenido del archivo `firestore.rules` del proyecto
7. **Pega** el contenido en el editor, reemplazando las reglas actuales
8. Haz clic en **"Publish"** o **"Publicar"**
9. Confirma el despliegue

**Tiempo estimado**: 2 minutos

### Desplegar Reglas de Storage

1. En el menú lateral, haz clic en **"Storage"**
2. Haz clic en la pestaña **"Rules"** o **"Reglas"**
3. Verás un editor de texto con las reglas actuales
4. **Copia** todo el contenido del archivo `storage.rules` del proyecto
5. **Pega** el contenido en el editor, reemplazando las reglas actuales
6. Haz clic en **"Publish"** o **"Publicar"**
7. Confirma el despliegue

**Tiempo estimado**: 2 minutos

---

## Método 2: Usando Firebase CLI

Este método es más eficiente para deployments frecuentes y automatización.

### Paso 1: Instalar Firebase CLI

Si no lo tienes instalado:

```bash
npm install -g firebase-tools
```

Verificar instalación:

```bash
firebase --version
```

### Paso 2: Iniciar Sesión

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte con tu cuenta de Google.

### Paso 3: Inicializar Proyecto Firebase (solo la primera vez)

Desde la raíz del proyecto:

```bash
firebase init
```

Selecciona:
- **Firestore**: Setup Firestore security rules
- **Storage**: Setup Storage security rules

Cuando pregunte por los archivos:
- Firestore rules file: `firestore.rules` (ya existe)
- Storage rules file: `storage.rules` (ya existe)

Esto creará un archivo `firebase.json` en la raíz del proyecto.

### Paso 4: Seleccionar Proyecto

Si tienes múltiples proyectos de Firebase:

```bash
firebase use [PROJECT_ID]
```

Por ejemplo:
```bash
firebase use old-texas-bbq-crm
```

O seleccionar interactivamente:

```bash
firebase use
```

### Paso 5: Desplegar Reglas

**Desplegar solo Firestore:**
```bash
firebase deploy --only firestore:rules
```

**Desplegar solo Storage:**
```bash
firebase deploy --only storage:rules
```

**Desplegar ambas:**
```bash
firebase deploy --only firestore:rules,storage:rules
```

**Tiempo estimado**: 1 minuto

---

## Verificar Reglas Desplegadas

### Verificar en Firebase Console

#### Firestore:
1. Ve a **Firestore Database > Rules**
2. Verifica que las reglas estén actualizadas
3. En la parte superior verás la fecha/hora de la última publicación

#### Storage:
1. Ve a **Storage > Rules**
2. Verifica que las reglas estén actualizadas
3. En la parte superior verás la fecha/hora de la última publicación

### Verificar con Firebase CLI

```bash
# Ver reglas de Firestore
firebase firestore:rules:get

# Ver reglas de Storage
firebase storage:rules:get
```

---

## Probar Reglas

### Método 1: Firebase Emulator (Desarrollo Local)

Ideal para probar reglas sin afectar producción:

```bash
# Instalar emuladores (solo la primera vez)
firebase init emulators

# Iniciar emuladores
firebase emulators:start
```

Esto iniciará:
- Firestore Emulator en `localhost:8080`
- Storage Emulator en `localhost:9199`
- UI del Emulator en `localhost:4000`

Para usar los emuladores en tu app, configura:

```bash
# .env.local
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

### Método 2: Rules Playground (Firebase Console)

#### Para Firestore:

1. Ve a **Firestore Database > Rules**
2. Haz clic en **"Playground"** (si está disponible)
3. Prueba queries simulando diferentes usuarios y roles
4. Ejemplo:

```
Simulación:
- Tipo: get
- Ubicación: /databases/(default)/documents/pedidos/123
- Auth: Autenticado
- UID: test-user-id
```

#### Para Storage:

1. Ve a **Storage > Rules**
2. Haz clic en **"Simulator"** (si está disponible)
3. Prueba operaciones simulando diferentes usuarios

### Método 3: Pruebas Reales

**IMPORTANTE**: Solo hacer esto en desarrollo, nunca en producción.

```typescript
// test-firestore-rules.ts
import { getDocument, COLLECTIONS } from '@/lib/firebase';
import { login } from '@/lib/firebase';

async function testRules() {
  // Test 1: Usuario no autenticado (debe fallar)
  try {
    await getDocument(COLLECTIONS.PEDIDOS, 'test-id');
    console.log('❌ FALLÓ: Usuario no autenticado no debería acceder');
  } catch (error) {
    console.log('✅ PASÓ: Usuario no autenticado bloqueado');
  }

  // Test 2: Login como cajera
  await login({ email: 'cajera@test.com', password: 'password' });

  // Test 3: Cajera puede leer pedidos (debe pasar)
  try {
    await getDocument(COLLECTIONS.PEDIDOS, 'test-id');
    console.log('✅ PASÓ: Cajera puede leer pedidos');
  } catch (error) {
    console.log('❌ FALLÓ: Cajera debería poder leer pedidos');
  }

  // Test 4: Cajera no puede eliminar pedidos (debe fallar)
  // ... más tests
}
```

---

## Estructura de firebase.json

Después de inicializar Firebase CLI, tu archivo `firebase.json` debe verse así:

```json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

Si planeas usar Hosting:

```json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

---

## Comandos Útiles de Firebase CLI

```bash
# Ver proyectos disponibles
firebase projects:list

# Ver proyecto actual
firebase use

# Cambiar proyecto
firebase use [PROJECT_ID]

# Ver configuración actual
firebase list

# Desplegar todo
firebase deploy

# Desplegar solo reglas
firebase deploy --only firestore:rules,storage:rules

# Ver logs
firebase functions:log

# Abrir consola de Firebase
firebase open
```

---

## Troubleshooting

### Error: "No project active"

**Solución**:
```bash
firebase use --add
```
Selecciona tu proyecto de la lista.

### Error: "Permission denied" al desplegar

**Solución**:
```bash
firebase login --reauth
```

### Error: "Rules file not found"

**Solución**: Verifica que estés en la raíz del proyecto y que los archivos `firestore.rules` y `storage.rules` existan.

### Las reglas no se aplican inmediatamente

**Nota**: Puede tomar 1-2 minutos para que las reglas nuevas se propaguen completamente.

---

## Mejores Prácticas

1. **Siempre probar en desarrollo primero**
   - Usa emuladores locales
   - Prueba con diferentes roles y usuarios

2. **Versionado de reglas**
   - Mantén `firestore.rules` y `storage.rules` en Git
   - Comenta cambios importantes

3. **Deployment automatizado**
   - Integra despliegue de reglas en tu CI/CD
   - Ejemplo con GitHub Actions:

```yaml
# .github/workflows/deploy-rules.yml
name: Deploy Firebase Rules

on:
  push:
    branches:
      - main
    paths:
      - 'firestore.rules'
      - 'storage.rules'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: w9jds/firebase-action@master
        with:
          args: deploy --only firestore:rules,storage:rules
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

4. **Monitoreo**
   - Revisa logs de seguridad en Firebase Console
   - Configura alertas para accesos denegados frecuentes

---

## Checklist de Despliegue

Antes de desplegar reglas a producción:

- [ ] Reglas probadas en emuladores locales
- [ ] Documentadas todas las restricciones por rol
- [ ] Verificadas reglas con múltiples roles de usuario
- [ ] Backup de reglas anteriores (si aplica)
- [ ] Comunicado a equipo sobre cambios de permisos
- [ ] Monitoreo configurado para errores de permisos

---

**Última actualización**: 2025-10-22
**Autor**: Database Architect Agent
