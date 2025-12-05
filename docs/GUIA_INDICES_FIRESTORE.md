# 📊 Guía: Crear Índices en Firestore para Colonias

## 🎯 Problema

Cuando usas `where()` + `orderBy()` en campos diferentes en Firestore, necesitas crear **índices compuestos**.

En nuestro caso, el módulo de colonias usa estas queries:
- `where('activa', '==', true)` + `orderBy('nombre', 'asc')`
- `where('zona', '==', zona)` + `where('activa', '==', true)` + `orderBy('nombre', 'asc')`

Sin los índices, verás este error:
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

---

## ✅ MÉTODO 1: Usar el Enlace Automático (MÁS RÁPIDO)

### Paso 1: Copia el enlace del error
Cuando intentes cargar colonias, Firebase te dará un enlace como este:
```
https://console.firebase.google.com/v1/r/project/oldtexasbbq-ecb85/firestore/indexes?create_composite=ClJwcm9qZWN0cy9...
```

### Paso 2: Abre el enlace en tu navegador
- El enlace te llevará directamente a la consola de Firebase
- Ya tendrá pre-configurado el índice necesario

### Paso 3: Haz clic en "Crear índice" o "Create Index"
![Botón crear índice](https://via.placeholder.com/400x100/4285F4/FFFFFF?text=Create+Index)

### Paso 4: Espera a que se complete
- **Estado**: "Building" → "Enabled"
- **Tiempo**: 2-5 minutos (a veces solo segundos)
- Verás una barra de progreso

### Paso 5: Repite para el segundo índice
- Si ves otro error para la query de `getByZona()`, repite el proceso con ese enlace

---

## ✅ MÉTODO 2: Crear Manualmente desde Firebase Console

### Paso 1: Accede a Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **oldtexasbbq-ecb85**

### Paso 2: Navega a Firestore Database
1. En el menú lateral izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en la pestaña **"Indexes"** (Índices)

![Navegación Firestore](https://via.placeholder.com/600x100/F4B400/FFFFFF?text=Firestore+Database+%E2%86%92+Indexes)

### Paso 3: Crear el Índice 1 (para `getActivas()`)

1. Haz clic en **"Create Index"** o **"Crear índice compuesto"**

2. Configura el índice así:

| Campo | Valor |
|-------|-------|
| **Collection ID** | `colonias` |
| **Fields to index** | 2 campos ⬇️ |

**Campo 1:**
- Field path: `activa`
- Query scope: Collection
- Order: **Ascending** ⬆️

**Campo 2:**
- Field path: `nombre`
- Query scope: Collection
- Order: **Ascending** ⬆️

3. Haz clic en **"Create"**

### Paso 4: Crear el Índice 2 (para `getByZona()`)

1. Haz clic nuevamente en **"Create Index"**

2. Configura este índice:

| Campo | Valor |
|-------|-------|
| **Collection ID** | `colonias` |
| **Fields to index** | 3 campos ⬇️ |

**Campo 1:**
- Field path: `zona`
- Query scope: Collection
- Order: **Ascending** ⬆️

**Campo 2:**
- Field path: `activa`
- Query scope: Collection
- Order: **Ascending** ⬆️

**Campo 3:**
- Field path: `nombre`
- Query scope: Collection
- Order: **Ascending** ⬆️

3. Haz clic en **"Create"**

### Paso 5: Espera a que se habiliten

Verás los índices en la lista con estados:
- 🟡 **Building** - Se está creando (2-5 minutos)
- 🟢 **Enabled** - ¡Listo para usar!

---

## ✅ MÉTODO 3: Deploy con Firebase CLI (Para Automatizar)

Si tienes Firebase CLI instalado, puedes deployar los índices automáticamente.

### Paso 1: Verifica que tienes Firebase CLI
```bash
firebase --version
```

Si no lo tienes instalado:
```bash
npm install -g firebase-tools
```

### Paso 2: Inicia sesión en Firebase
```bash
firebase login
```

### Paso 3: Inicializa el proyecto (si no lo has hecho)
```bash
cd /Users/pedroduran/Desktop/Proyectos/Old\ Texas\ BBQ\ -\ CRM
firebase init firestore
```

Selecciona:
- ✅ Use an existing project
- ✅ Selecciona: `oldtexasbbq-ecb85`
- ✅ Firestore Rules: `firestore.rules`
- ✅ Firestore Indexes: `firestore.indexes.json`

### Paso 4: El archivo ya está creado
Ya existe el archivo `firestore.indexes.json` en la raíz del proyecto con los índices necesarios.

### Paso 5: Deploy los índices
```bash
firebase deploy --only firestore:indexes
```

Verás algo como:
```
✔  firestore: deployed indexes in firestore.indexes.json successfully
```

---

## 🔍 Verificar que los Índices Estén Funcionando

### Desde Firebase Console:
1. Ve a **Firestore Database** → **Indexes**
2. Debes ver 2 índices para la colección `colonias`
3. Ambos deben estar en estado **"Enabled"** (verde)

### Desde tu App:
1. Abre la página `/colonias` en tu CRM
2. Haz clic en "Nueva Colonia" y crea una colonia de prueba
3. Abre el formulario de pedidos en `/pedidos`
4. En la sección "Colonia y Envío", el selector debe cargar sin errores
5. Si ves las colonias en el dropdown = ¡Índices funcionando! ✅

---

## 📸 Capturas de Referencia Visual

### Cómo se ve el índice creado:

```
┌─────────────────────────────────────────────────────┐
│ Composite indexes                                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Collection: colonias                    [Enabled]  │
│   activa Ascending                                  │
│   nombre Ascending                                  │
│                                         [Edit] [X]  │
│                                                     │
│ Collection: colonias                    [Enabled]  │
│   zona Ascending                                    │
│   activa Ascending                                  │
│   nombre Ascending                                  │
│                                         [Edit] [X]  │
└─────────────────────────────────────────────────────┘
```

---

## ❓ Troubleshooting

### Error: "Index already exists"
- ✅ ¡Perfecto! El índice ya está creado, no necesitas hacer nada

### Error: "Permission denied"
- Verifica que tu usuario tenga permisos de Editor/Owner en el proyecto Firebase
- Contacta al administrador del proyecto para que te dé permisos

### Los índices tardan mucho (>10 minutos)
- Esto puede pasar si tienes muchos documentos en la colección
- Para colonias (que son pocas), debería ser instantáneo o tomar 2-5 min máximo

### No veo la pestaña "Indexes"
- Asegúrate de estar en "Firestore Database", NO en "Realtime Database"
- La pestaña "Indexes" está al lado de "Data", "Rules", "Usage"

---

## 🎓 ¿Por qué se necesitan índices?

### Sin índice:
Firestore tiene que:
1. Buscar TODOS los documentos donde `activa == true`
2. Luego ordenar esos resultados por `nombre`
3. Esto es lento y costoso ❌

### Con índice:
Firestore ya tiene los datos pre-organizados:
1. Todos los documentos donde `activa == true` YA ordenados por `nombre`
2. Respuesta instantánea ⚡
3. Menos lecturas = menos costo 💰

---

## 📝 Resumen Rápido

1. **Opción más rápida**: Usa el enlace del error que te da Firebase
2. **Opción manual**: Firebase Console → Firestore → Indexes → Create
3. **Opción automatizada**: `firebase deploy --only firestore:indexes`

**Tiempo total**: 2-5 minutos

**¿Necesitas ayuda?**
- Revisa la documentación oficial: https://firebase.google.com/docs/firestore/query-data/indexing
- O pregúntame si tienes dudas

---

✅ **Una vez creados los índices, el sistema de colonias funcionará perfectamente.**
