# 🚀 Guía para Desplegar Reglas de Firestore

## ⚠️ IMPORTANTE - Lee Antes de Desplegar

Las nuevas reglas de seguridad de Firestore han sido completamente reescritas y segmentadas por rol. **DEBES desplegar estas reglas para que el sistema funcione correctamente.**

---

## 📋 ¿Qué Cambió?

### Antes:
- ❌ Reglas genéricas y permisivas
- ❌ No había separación clara por rol
- ❌ Permisos insuficientes causaban errores

### Ahora:
- ✅ Permisos segmentados por rol (admin, encargado, cajera, cocina, repartidor)
- ✅ Matriz de permisos documentada en `docs/MATRIZ_PERMISOS.md`
- ✅ Cada rol tiene acceso específico a lo que necesita
- ✅ Repartidores solo ven sus pedidos
- ✅ Cajeras no pueden modificar pedidos de otras
- ✅ Cocina solo puede cambiar estados de preparación

---

## 🎯 Opciones de Despliegue

### Opción 1: Firebase Console (Recomendado - Más Fácil) ⭐

#### Paso 1: Acceder a Firebase Console
1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto **Old Texas BBQ - CRM**
3. En el menú lateral, ve a **Firestore Database**

#### Paso 2: Abrir el Editor de Reglas
1. Haz clic en la pestaña **Reglas** (Rules)
2. Verás el editor de reglas actual

#### Paso 3: Copiar las Nuevas Reglas
1. Abre el archivo `firestore.rules` en tu editor de código
2. **Selecciona todo el contenido** (Ctrl+A o Cmd+A)
3. **Copia** el contenido completo (Ctrl+C o Cmd+C)

#### Paso 4: Pegar y Publicar
1. En la consola de Firebase, **borra todo el contenido actual** del editor
2. **Pega las nuevas reglas** (Ctrl+V o Cmd+V)
3. Revisa que no haya errores de sintaxis (aparecerán en rojo)
4. Haz clic en el botón **"Publicar"** (Publish)

#### Paso 5: Verificar
1. Espera el mensaje de confirmación ✅
2. Las reglas ahora están desplegadas y activas

---

### Opción 2: Firebase CLI (Avanzado)

#### Requisitos Previos
```bash
# 1. Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# 2. Iniciar sesión
firebase login
```

#### Despliegue
```bash
# 1. Navegar al directorio del proyecto
cd "/Users/pedroduran/Desktop/Proyectos/Old Texas BBQ - CRM"

# 2. Inicializar Firebase (si no lo has hecho)
firebase init firestore
# Selecciona tu proyecto
# Usa firestore.rules como archivo de reglas

# 3. Desplegar solo las reglas
firebase deploy --only firestore:rules

# 4. Verificar que se desplegaron correctamente
firebase firestore:rules:get
```

---

## ✅ Verificación Post-Despliegue

### 1. Verificar en Firebase Console

1. Ve a **Firestore Database** → **Reglas**
2. Verifica que veas las nuevas reglas con los comentarios:
   ```
   * Basado en matriz de permisos documentada en docs/MATRIZ_PERMISOS.md
   * Roles del sistema:
   * - admin: Acceso total (100%)
   * - encargado: Gestión operativa completa (95%)
   * ...
   ```

### 2. Probar Accesos por Rol

#### Admin:
```bash
# Debe poder:
✅ Ver todos los usuarios
✅ Crear usuarios con cualquier rol
✅ Ver y modificar todos los pedidos
✅ Eliminar datos
```

#### Encargado:
```bash
# Debe poder:
✅ Ver todos los usuarios
✅ Crear usuarios (excepto admins)
✅ Ver y modificar todos los pedidos
✅ Gestionar productos, categorías, repartidores
❌ No puede: Eliminar usuarios o pedidos
```

#### Cajera:
```bash
# Debe poder:
✅ Ver su propio perfil
✅ Crear pedidos
✅ Ver todos los pedidos (para gestionar)
✅ Actualizar solo pedidos que ella creó
✅ Ver productos y repartidores disponibles
❌ No puede: Modificar pedidos de otras cajeras
❌ No puede: Gestionar usuarios o productos
```

#### Cocina:
```bash
# Debe poder:
✅ Ver todos los pedidos
✅ Cambiar estado a "en_preparacion" y "listo"
✅ Ver productos (para cocinar)
❌ No puede: Modificar items, precios, o datos del cliente
❌ No puede: Cancelar pedidos
```

#### Repartidor:
```bash
# Debe poder:
✅ Ver solo sus pedidos asignados
✅ Actualizar estado de entrega
✅ Marcar como entregado
✅ Ver colonias (para rutas)
❌ No puede: Ver pedidos de otros repartidores
❌ No puede: Modificar totales o items
```

---

## 🔍 Troubleshooting

### Error: "Missing or insufficient permissions"

#### Causa 1: Reglas no desplegadas
```
Solución: Desplegar reglas siguiendo los pasos de arriba
```

#### Causa 2: Usuario sin documento en colección "usuarios"
```
Solución:
1. Verificar que el usuario tenga documento en Firestore
2. El documento debe tener los campos:
   - rol: 'admin' | 'encargado' | 'cajera' | 'cocina' | 'repartidor'
   - activo: true
```

#### Causa 3: Usuario inactivo
```
Solución:
1. Ir a Firestore → usuarios → [usuarioId]
2. Cambiar campo "activo" a true
```

#### Causa 4: Usuario intentando acceder fuera de su rol
```
Ejemplo: Cajera intentando ver usuarios
Solución: Esto es correcto, la cajera no debe poder ver usuarios
Verificar en docs/MATRIZ_PERMISOS.md qué puede hacer cada rol
```

---

## 🧪 Script de Prueba (Opcional)

Puedes usar este script para verificar que las reglas funcionan:

```javascript
// En la consola del navegador (con usuario autenticado)

// 1. Verificar tu rol
const userData = await firebase.firestore()
  .collection('usuarios')
  .doc(firebase.auth().currentUser.uid)
  .get();
console.log('Mi rol:', userData.data().rol);

// 2. Intentar leer pedidos
try {
  const pedidos = await firebase.firestore()
    .collection('pedidos')
    .limit(1)
    .get();
  console.log('✅ Puedo leer pedidos:', pedidos.size);
} catch (error) {
  console.log('❌ No puedo leer pedidos:', error.message);
}

// 3. Intentar crear pedido
try {
  await firebase.firestore()
    .collection('pedidos')
    .add({
      /* datos del pedido */
    });
  console.log('✅ Puedo crear pedidos');
} catch (error) {
  console.log('❌ No puedo crear pedidos:', error.message);
}
```

---

## 📞 Soporte

Si después de desplegar las reglas sigues teniendo problemas:

1. **Verifica el rol del usuario** en Firestore
2. **Revisa la documentación** en `docs/MATRIZ_PERMISOS.md`
3. **Consulta los logs** de Firebase Console (Firestore → pestaña "Request")
4. **Compara** con los ejemplos de la matriz de permisos

---

## 📚 Documentación Relacionada

- `docs/MATRIZ_PERMISOS.md` - Detalle completo de permisos por rol
- `firestore.rules` - Reglas de seguridad implementadas
- `docs/FIRESTORE_SCHEMA.md` - Esquema de la base de datos

---

**Última actualización**: 2025-12-29

**Estado**: ✅ Listo para desplegar
