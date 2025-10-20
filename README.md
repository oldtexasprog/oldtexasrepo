# 🍖 Old Texas BBQ - CRM

Sistema integral de gestión para Old Texas BBQ. Automatiza el proceso completo de pedidos, desde la recepción hasta la entrega, incluyendo gestión de cocina, reparto y caja.

## 📋 Características Principales

- ✅ Gestión de pedidos multicanal (WhatsApp, Mostrador, Llamada, Apps de delivery)
- 👨‍🍳 Panel de cocina en tiempo real
- 🛵 Sistema de reparto y asignación
- 💰 Corte de caja automatizado
- 📊 Reportes y métricas
- 🔔 Notificaciones en tiempo real
- 🔐 Sistema de roles y permisos

## 🚀 Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Cuenta de Firebase (para backend)

## 📦 Instalación

1. Clonar el repositorio

```bash
git clone <repository-url>
cd old-texas-bbq-crm
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env.local` y configurar las credenciales de Firebase:

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales de Firebase Console.

4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage, FCM)
- **Estado**: Zustand
- **Formularios**: React Hook Form
- **Iconos**: Lucide React
- **Notificaciones**: Sonner
- **Fechas**: date-fns

## 📁 Estructura del Proyecto

```
├── app/                    # Páginas y rutas (App Router)
├── components/             # Componentes reutilizables
├── lib/
│   ├── firebase/          # Configuración de Firebase
│   ├── hooks/             # Hooks personalizados
│   ├── services/          # Servicios de datos (CRUD)
│   ├── stores/            # Stores de Zustand
│   ├── types/             # Tipos TypeScript
│   ├── constants/         # Constantes del sistema
│   └── utils/             # Utilidades (formatters, validators)
├── public/                # Archivos estáticos
└── docs/                  # Documentación del proyecto
```

## 🔐 Roles del Sistema

| Rol            | Descripción               |
| -------------- | ------------------------- |
| **Admin**      | Acceso total al sistema   |
| **Encargado**  | Supervisión y reportes    |
| **Cajera**     | Gestión de pedidos y caja |
| **Cocina**     | Vista de comandas         |
| **Repartidor** | Pedidos asignados         |

## 📝 Scripts Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
npm run format   # Formatear código con Prettier
```

## 🔧 Configuración de Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar los siguientes servicios:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
   - Cloud Messaging (FCM)
3. Copiar las credenciales a `.env.local`

## 📚 Documentación

- [CONTEXT.md](./docs/CONTEXT.md) - Contexto completo del proyecto
- [TODO.md](./docs/TODO.md) - Lista de tareas y progreso

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es propiedad de Old Texas BBQ.

## 👤 Autor

**Pedro Duran**

---

**Última actualización**: Octubre 2025
