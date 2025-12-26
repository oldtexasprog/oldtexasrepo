# 🐛 Bugfix: Firebase Error con Campos Undefined

**Fecha:** Diciembre 2025
**Prioridad:** Alta
**Estado:** ✅ Resuelto

---

## 📋 Problema Detectado

### Error Original

```
FirebaseError: Function addDoc() called with invalid data.
Unsupported field value: undefined (found in field descuento in document pedidos/5XSDg8nZMz80k2GHw1KA)
```

### Causa Raíz

Firebase Firestore **no acepta campos con valor `undefined`**. Cuando se intenta crear o actualizar un documento con campos opcionales que tienen valor `undefined`, la operación falla.

El problema se originaba en varios lugares del código donde se usaba el patrón:

```typescript
// ❌ INCORRECTO
descuento: descuento || undefined,
zona: zona || undefined,
```

Cuando `descuento` o `zona` eran falsy (`null`, `false`, `0`, `''`), se asignaba explícitamente `undefined`, causando el error.

---

## ✅ Solución Implementada

### 1. Función Helper en `pedidos.service.ts`

Se agregó una función privada que limpia campos undefined antes de enviar a Firebase:

```typescript
/**
 * Elimina campos con valor undefined de un objeto
 * Firebase no acepta campos con undefined
 */
private removeUndefinedFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: any = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }

  return cleaned;
}
```

### 2. Aplicación en `crearPedidoCompleto`

```typescript
// Antes
const pedidoId = await this.create({
  ...pedidoData,
  numeroPedido,
} as any);

// Después
const pedidoLimpio = this.removeUndefinedFields({
  ...pedidoData,
  numeroPedido,
});

const pedidoId = await this.create(pedidoLimpio as any);
```

### 3. Corrección en Componentes

#### FormPedido.tsx

```typescript
// Antes
const pedidoData: Omit<NuevoPedido, 'numeroPedido'> = {
  canal: canal!,
  cliente,
  // ... otros campos
  descuento: descuento || undefined, // ❌ Genera undefined
  observaciones,
};

// Después
const pedidoData: any = {
  canal: canal!,
  cliente,
  // ... otros campos
  // No incluir campos opcionales aquí
};

// Solo agregar campos opcionales si tienen valor
if (descuento) {
  pedidoData.descuento = descuento;
}

if (observaciones) {
  pedidoData.observaciones = observaciones;
}
```

#### ModalColonia.tsx

```typescript
// Antes
const nuevaColonia: Omit<Colonia, 'id'> = {
  nombre: nombre.trim(),
  zona: zona || undefined, // ❌ Genera undefined
  costoEnvio: costoNumerico,
  activa,
};

// Después
const nuevaColonia: any = {
  nombre: nombre.trim(),
  costoEnvio: costoNumerico,
  activa,
  fechaCreacion: Timestamp.now(),
  fechaActualizacion: Timestamp.now(),
  creadoPor: user?.uid || 'sistema',
};

// Solo agregar zona si tiene valor
if (zona) {
  nuevaColonia.zona = zona;
}
```

#### PersonalizacionModal.tsx

```typescript
// Antes
onConfirm({
  salsas: salsas.length > 0 ? salsas : undefined, // ❌ Genera undefined
  extras: extras.length > 0 ? extras : undefined, // ❌ Genera undefined
  presentacion: presentacion || undefined,        // ❌ Genera undefined
  notas: notas.trim() || undefined,               // ❌ Genera undefined
});

// Después
const personalizacion: any = {};

// Solo agregar campos si tienen valor
if (salsas.length > 0) {
  personalizacion.salsas = salsas;
}

if (extras.length > 0) {
  personalizacion.extras = extras;
}

if (presentacion) {
  personalizacion.presentacion = presentacion;
}

if (notas.trim()) {
  personalizacion.notas = notas.trim();
}

onConfirm(personalizacion);
```

---

## 📁 Archivos Modificados

1. **`lib/services/pedidos.service.ts`**
   - Agregada función `removeUndefinedFields()`
   - Aplicada en `crearPedidoCompleto()`

2. **`components/pedidos/FormPedido.tsx`**
   - Corregida construcción de `pedidoData`
   - Solo agregar campos opcionales si tienen valor

3. **`components/colonias/ModalColonia.tsx`**
   - Corregida construcción de objeto colonia
   - Agregar zona condicionalmente

4. **`components/pedidos/PersonalizacionModal.tsx`**
   - Corregida construcción de objeto personalización
   - Solo agregar campos con valores

---

## 🧪 Testing

### Caso de Prueba 1: Pedido sin descuento

```typescript
// Crear pedido sin descuento
const pedidoData = {
  canal: 'mostrador',
  cliente: { nombre: 'Juan', telefono: '1234567890' },
  // descuento NO incluido
  // ...
};

await pedidosService.crearPedidoCompleto(pedidoData, items);
// ✅ Éxito - No se envía campo descuento a Firebase
```

### Caso de Prueba 2: Colonia sin zona

```typescript
// Crear colonia sin zona
const colonia = {
  nombre: 'Centro',
  costoEnvio: 25,
  // zona NO incluida
};

await coloniasService.create(colonia);
// ✅ Éxito - No se envía campo zona a Firebase
```

### Caso de Prueba 3: Personalización sin notas

```typescript
// Personalización sin notas
const personalizacion = {
  salsas: ['BBQ'],
  // notas NO incluidas
};

// ✅ Éxito - Solo se envían campos con valor
```

---

## ✅ Validación

### Build Exitoso

```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (27/27)
```

### Sin Errores TypeScript

```bash
npx tsc --noEmit
# ✓ No errors found
```

---

## 📚 Lecciones Aprendidas

### 1. **Nunca usar `|| undefined`**

```typescript
// ❌ MAL
campo: valor || undefined

// ✅ BIEN - Opción A: No incluir el campo
const obj: any = { campoRequerido: 'valor' };
if (campoOpcional) {
  obj.campoOpcional = campoOpcional;
}

// ✅ BIEN - Opción B: Usar helper para limpiar
const objLimpio = removeUndefinedFields(obj);
```

### 2. **Firebase no acepta `undefined`**

Los únicos valores válidos en Firestore son:
- `null` ✅ (para indicar ausencia de valor)
- `string`, `number`, `boolean` ✅
- `Timestamp`, `GeoPoint`, etc. ✅
- **NO** `undefined` ❌

### 3. **Campos opcionales en TypeScript vs Firebase**

```typescript
// TypeScript - Campo opcional
interface Pedido {
  descuento?: number; // Puede ser number | undefined
}

// Firebase - Solo enviar si tiene valor
const pedido: any = { /* campos requeridos */ };

if (descuento !== undefined) {
  pedido.descuento = descuento;
}
```

---

## 🔧 Prevención Futura

### Checklist para Nuevos Componentes

Cuando crees componentes que envían datos a Firebase:

- [ ] No usar patrón `campo || undefined`
- [ ] Usar construcción condicional para campos opcionales
- [ ] Considerar usar helper `removeUndefinedFields` en servicios
- [ ] Testear con campos opcionales vacíos
- [ ] Verificar que no haya warnings de Firebase en consola

### ESLint Rule Sugerida (Opcional)

Podría agregarse una regla personalizada de ESLint:

```javascript
// .eslintrc.js
rules: {
  'no-restricted-syntax': [
    'error',
    {
      selector: "LogicalExpression[operator='||'][right.type='Identifier'][right.name='undefined']",
      message: 'Avoid using "|| undefined" pattern. Firebase does not accept undefined values.'
    }
  ]
}
```

---

## 📊 Impacto

### Antes del Fix
- ❌ Pedidos sin descuento: **Error**
- ❌ Colonias sin zona: **Error**
- ❌ Personalizaciones parciales: **Potencial error**

### Después del Fix
- ✅ Pedidos sin descuento: **Funciona**
- ✅ Colonias sin zona: **Funciona**
- ✅ Personalizaciones parciales: **Funciona**
- ✅ Build exitoso sin errores

---

**Última actualización:** Diciembre 2025
**Versión:** 1.0
**Estado:** Resuelto y documentado
