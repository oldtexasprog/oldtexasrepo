# Páginas de Desarrollo - Old Texas BBQ CRM

## 🔒 Sistema Protegido de Desarrollo

Este proyecto incluye un ambiente de desarrollo protegido con páginas especiales para pruebas de código y creación de componentes.

---

## 📍 Páginas Disponibles

### 1. `/dev/access` - Página de Autenticación

**Acceso:** Público (requiere clave)

**Función:** Validar acceso a las páginas de desarrollo

**Características:**

- Input seguro de clave de acceso
- Cookie de sesión (válida por 7 días)
- Redirección automática si ya tiene acceso
- UI moderna con gradientes

**Clave de acceso:** Definida en `.env.local` (`DEV_ACCESS_KEY`)

---

### 2. `/dev/tests` - Pruebas de Código

**Acceso:** Protegido (requiere autenticación)

**Función:** Ejecutar y probar código JavaScript/TypeScript en tiempo real

**Características:**

#### Editor de Código

- Textarea con syntax highlighting
- Soporte para async/await
- Imports dinámicos
- Console.log capture

#### Templates Predefinidos

- **Firebase**: Test de conexión y queries a Firestore
- **Cloudinary**: Test de upload de imágenes
- **Notificaciones**: Test del sistema de notificaciones in-app
- **Zustand**: Test de stores y estado global

#### Resultados

- Historial de ejecuciones
- Output capturado
- Errores detallados
- Tiempo de ejecución
- Color coding (verde=éxito, rojo=error)

#### Funcionalidades

- Ejecutar código con un click
- Ver output en tiempo real
- Limpiar editor
- Borrar historial
- Tabs para organización (Editor/Resultados)

**Ejemplo de uso:**

```typescript
// Test Firebase
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const usuarios = await getDocs(collection(db, 'usuarios'));
console.log('Total usuarios:', usuarios.size);
```

---

### 3. `/dev/playground` - Playground de Componentes

**Acceso:** Protegido (requiere autenticación)

**Función:** Crear, probar y guardar componentes UI

**Características:**

#### Editor de Componentes

- Editor JSX/TSX
- Preview en vivo
- Hot reload del preview
- Soporte para Tailwind CSS

#### Templates Predefinidos

- **Button**: Botón con gradientes
- **Card**: Tarjeta de pedido
- **Badge**: Badge de estado
- **Input**: Input personalizado
- **Alert**: Alerta con iconos

#### Información del Componente

- Nombre del componente
- Descripción
- Metadata

#### Gestión de Componentes

- **Guardar**: Guardar componente para uso futuro
- **Cargar**: Cargar componente guardado
- **Copiar**: Copiar código al portapapeles
- **Descargar**: Descargar como archivo .tsx
- **Eliminar**: Borrar componente guardado

#### Preview en Vivo

- Visualización en tiempo real
- Fondo claro/oscuro
- Errores de sintaxis mostrados

**Ejemplo de componente:**

```tsx
export default function CustomButton() {
  return (
    <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all">
      Old Texas BBQ
    </button>
  );
}
```

---

## 🔐 Sistema de Autenticación

### Cómo Funciona

1. **Cookie de Acceso**: Al validar la clave, se crea una cookie `dev_access_granted`
2. **Validación**: Cada página protegida verifica la cookie
3. **Redirección**: Si no tiene acceso, redirige a `/dev/access`
4. **Expiración**: Cookie válida por 7 días

### Configuración

#### 1. Agregar a `.env.local`

```env
DEV_ACCESS_KEY=271097
```

#### 2. Cambiar la clave (opcional)

Edita `.env.local` y cambia el valor:

```env
DEV_ACCESS_KEY=tu-clave-secreta
```

#### 3. Verificar configuración

El sistema usa por defecto `271097` si no encuentra la variable de entorno.

---

## 🚀 Uso del Sistema

### Primer Acceso

1. Navega a: `http://localhost:3000/dev/access`
2. Ingresa la clave: `271097` (o tu clave personalizada)
3. Click en "Acceder"
4. Serás redirigido a `/dev/tests`

### Navegación

Una vez dentro, puedes navegar entre:

- **Pruebas de Código** (`/dev/tests`)
- **Playground** (`/dev/playground`)

### Cerrar Sesión

Click en el botón "Salir" en el header para:

- Eliminar la cookie de acceso
- Regresar a la página principal

---

## 🎨 Layout Compartido

Todas las páginas `/dev/*` (excepto `/dev/access`) comparten un layout común:

### Header

- Logo "Dev Environment"
- Nombre del proyecto
- Navegación entre páginas
- Botones: "Volver al Inicio" y "Salir"

### Footer

- Información del ambiente
- Copyright

### Estilos

- Dark theme (slate-950)
- Gradientes naranja/rojo (Old Texas BBQ branding)
- Efectos de hover
- Borders y shadows

---

## 🛡️ Seguridad

### Protecciones Implementadas

1. **Cookie HTTP-Only**: La cookie tiene `SameSite=Strict`
2. **Validación en cliente**: Hook `useDevAccess()` en cada página
3. **Delay anti brute-force**: 500ms de delay en validación
4. **Cookie temporal**: Expira en 7 días automáticamente

### Recomendaciones para Producción

⚠️ **IMPORTANTE**: Estas páginas NO deben estar en producción

**Opción 1: Eliminar en build**

En `next.config.js`:

```js
module.exports = {
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/dev/:path*',
          destination: '/',
          permanent: false,
        },
      ];
    }
    return [];
  },
};
```

**Opción 2: Middleware de Next.js**

Crear `middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Bloquear /dev/* en producción
  if (
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.pathname.startsWith('/dev')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: '/dev/:path*',
};
```

**Opción 3: Eliminar carpeta**

Antes de deploy:

```bash
rm -rf app/dev
```

---

## 📂 Estructura de Archivos

```
app/
└── dev/
    ├── access/
    │   └── page.tsx          # Página de autenticación
    ├── tests/
    │   └── page.tsx          # Pruebas de código
    ├── playground/
    │   └── page.tsx          # Playground de componentes
    └── layout.tsx            # Layout compartido

lib/
└── dev-auth.ts               # Utilidades de autenticación

components/ui/
├── textarea.tsx              # Componente Textarea
└── label.tsx                 # Componente Label

.env.example
└── DEV_ACCESS_KEY=271097     # Clave de ejemplo
```

---

## 🔧 Utilidades (`lib/dev-auth.ts`)

### Funciones Disponibles

#### `hasDevAccess(): boolean`

Verifica si el usuario tiene acceso.

```typescript
import { hasDevAccess } from '@/lib/dev-auth';

if (hasDevAccess()) {
  console.log('Acceso permitido');
}
```

#### `validateDevKey(key: string): boolean`

Valida una clave de acceso.

```typescript
import { validateDevKey } from '@/lib/dev-auth';

if (validateDevKey('271097')) {
  console.log('Clave válida');
}
```

#### `grantDevAccess(): void`

Otorga acceso (crea cookie).

```typescript
import { grantDevAccess } from '@/lib/dev-auth';

grantDevAccess();
// Cookie creada, usuario tiene acceso
```

#### `revokeDevAccess(): void`

Revoca acceso (elimina cookie).

```typescript
import { revokeDevAccess } from '@/lib/dev-auth';

revokeDevAccess();
// Cookie eliminada, usuario sin acceso
```

#### `useDevAccess()`

Hook para usar en componentes.

```typescript
import { useDevAccess } from '@/lib/dev-auth';

function MyComponent() {
  const { hasAccess, isChecking } = useDevAccess();

  if (isChecking) return <div>Verificando...</div>;
  if (!hasAccess) return null; // Redirige automáticamente

  return <div>Contenido protegido</div>;
}
```

---

## 🎯 Casos de Uso

### Caso 1: Probar Conexión a Firebase

1. Ir a `/dev/tests`
2. Click en template "Firebase"
3. Click en "Ejecutar"
4. Ver resultados en tab "Resultados"

### Caso 2: Crear Componente de Botón

1. Ir a `/dev/playground`
2. Click en template "Button"
3. Modificar estilos en el editor
4. Ver preview en tiempo real
5. Ingresar nombre y descripción
6. Click en "Guardar"

### Caso 3: Exportar Componente

1. Ir a `/dev/playground`
2. Tab "Guardados"
3. Encontrar tu componente
4. Click en botón de descarga
5. Archivo `.tsx` descargado

### Caso 4: Probar API de Cloudinary

1. Ir a `/dev/tests`
2. Click en template "Cloudinary"
3. Modificar código si es necesario
4. Ejecutar y ver logs de progreso

---

## 🐛 Troubleshooting

### Error: "Acceso denegado"

**Causa:** Clave incorrecta

**Solución:**

1. Verifica que `.env.local` tenga `DEV_ACCESS_KEY=271097`
2. Reinicia el servidor de desarrollo
3. Intenta de nuevo

### Error: "Cannot read property..."

**Causa:** Cookie no se creó correctamente

**Solución:**

1. Limpia las cookies del navegador
2. Recarga la página
3. Vuelve a ingresar la clave

### Preview no se actualiza

**Causa:** Error en el código JSX

**Solución:**

1. Revisa la consola de errores
2. Verifica sintaxis JSX
3. Click en "Actualizar Preview"

### Código no ejecuta

**Causa:** Error de sintaxis o imports

**Solución:**

1. Verifica que los imports sean correctos
2. Revisa el tab "Resultados" para ver el error
3. Usa `console.log()` para debuggear

---

## 💡 Tips y Trucos

### Tests Page

1. **Usa templates como base**: Son ejemplos funcionales que puedes modificar
2. **Console.log es tu amigo**: Usa múltiples console.log para debuggear
3. **Async/await funciona**: Puedes hacer llamadas a Firebase, Cloudinary, etc.
4. **Copia código exitoso**: Usa el que funciona en tu proyecto

### Playground

1. **Empieza con un template**: Modifica en lugar de crear desde cero
2. **Usa Tailwind**: Todos los estilos están disponibles
3. **Guarda versiones**: Guarda diferentes variaciones del mismo componente
4. **Preview en tiempo real**: No necesitas ejecutar, se actualiza solo
5. **Descarga y usa**: Los componentes descargados están listos para usar

### General

1. **Cookie dura 7 días**: No necesitas re-autenticar cada vez
2. **Salir es temporal**: La cookie se borra, pero puedes volver con la clave
3. **Dark theme siempre**: Diseñado para trabajar de noche
4. **Mobile responsive**: Funciona en tablets y móviles

---

## 📚 Referencias

### Componentes UI Usados

- Card, CardContent, CardHeader, CardTitle, CardDescription
- Button
- Input
- Textarea
- Label
- Alert, AlertDescription
- Tabs, TabsContent, TabsList, TabsTrigger
- Badge

Todos de **shadcn/ui**

### Iconos (lucide-react)

- Lock, Terminal, Code2
- Play, Eye, Copy, Download, Trash2
- CheckCircle2, XCircle, Clock
- Sparkles, FlaskConical, FileCode, Palette
- LogOut

### Hooks de Next.js

- `useRouter()`: Navegación
- `usePathname()`: Ruta actual
- `useState()`: Estado local
- `useEffect()`: Efectos

---

## 🎉 Conclusión

El sistema de páginas de desarrollo ofrece:

✅ **Seguridad**: Acceso protegido con clave
✅ **Productividad**: Prueba código sin salir del browser
✅ **Creatividad**: Crea componentes visualmente
✅ **Organización**: Guarda y exporta tu trabajo
✅ **Rapidez**: Templates predefinidos
✅ **Flexibilidad**: Personaliza todo

**Perfecto para desarrollo ágil en Old Texas BBQ CRM!** 🍖🔥

---

**Última actualización:** 2025-10-22
