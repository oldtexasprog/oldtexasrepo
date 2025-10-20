# 🚀 Próximos Pasos

## ✅ Completado

- ✅ Proyecto Next.js 14+ inicializado con App Router
- ✅ TypeScript configurado
- ✅ Tailwind CSS v4 instalado y configurado
- ✅ ESLint y Prettier configurados
- ✅ Estructura de carpetas modular creada
- ✅ Dependencias base instaladas (Firebase, Zustand, React Hook Form, etc.)
- ✅ Tipos TypeScript definidos
- ✅ Constantes del sistema creadas
- ✅ Utilidades de formateo y validación
- ✅ Configuración de Firebase (pendiente credenciales)
- ✅ Repositorio Git inicializado

## 🎯 Siguiente Fase: Firebase Setup

### 1. Crear Proyecto en Firebase Console

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Crear un nuevo proyecto llamado "old-texas-bbq-crm"
3. Habilitar Google Analytics (opcional)

### 2. Habilitar Servicios de Firebase

- [ ] **Firestore Database**: Database > Create database (modo producción)
- [ ] **Authentication**: Authentication > Get started > Email/Password
- [ ] **Storage**: Storage > Get started
- [ ] **Cloud Messaging**: Cloud Messaging > Get started
- [ ] **Hosting**: Hosting > Get started (opcional)

### 3. Obtener Credenciales

1. En Project Settings (⚙️ > Project settings)
2. En "Your apps" > Web app (</>) > Register app
3. Copiar las credenciales de `firebaseConfig`
4. Actualizar el archivo `.env.local` con las credenciales reales

### 4. Configurar Reglas de Seguridad

#### Firestore Rules (básicas para desarrollo):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules (básicas):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🗄️ Siguiente: Diseño de Datos en Firestore

### Colecciones a Crear:

1. **usuarios** - Información de usuarios del sistema
2. **pedidos** - Todos los pedidos del restaurante
3. **productos** - Catálogo de productos
4. **personalizaciones** - Opciones de personalización
5. **turnos** - Cortes de caja
6. **configuracion** - Configuraciones del sistema

Consulta `lib/types/index.ts` para ver la estructura de cada entidad.

## 💻 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Formatear código
npm run format

# Ejecutar linter
npm run lint
```

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎨 Estructura del Proyecto

```
├── app/                    # Rutas y páginas (Next.js App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables (vacío por ahora)
├── lib/
│   ├── firebase/         # Configuración de Firebase
│   ├── types/            # Tipos TypeScript
│   ├── constants/        # Constantes del sistema
│   ├── utils/            # Utilidades (formatters, validators)
│   ├── hooks/            # Hooks personalizados (vacío)
│   ├── services/         # Servicios de datos CRUD (vacío)
│   └── stores/           # Stores de Zustand (vacío)
├── public/               # Archivos estáticos
└── docs/                 # Documentación del proyecto
```

---

**¿Preguntas?** Consulta el [README.md](./README.md) o los archivos en [docs/](./docs/)
