# Manual de Usuario - Administrador

## Old Texas BBQ - Sistema de Gestión

---

## Contenido

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Panel de Administración](#panel-de-administración)
4. [Gestión de Usuarios](#gestión-de-usuarios)
5. [Configuración del Sistema](#configuración-del-sistema)
6. [Gestión de Productos](#gestión-de-productos)
7. [Gestión de Colonias y Envíos](#gestión-de-colonias-y-envíos)
8. [Reportes Avanzados](#reportes-avanzados)
9. [Seguridad y Auditoría](#seguridad-y-auditoría)
10. [Mantenimiento del Sistema](#mantenimiento-del-sistema)
11. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

Este manual está diseñado para los administradores del sistema Old Texas BBQ. Como administrador, tienes acceso completo a todas las funciones del sistema, incluyendo configuración, usuarios y reportes avanzados.

### Tus Responsabilidades

- Gestionar usuarios y permisos
- Configurar el sistema
- Supervisar toda la operación
- Generar reportes ejecutivos
- Mantener la seguridad del sistema
- Resolver problemas técnicos

---

## Acceso al Sistema

### Iniciar Sesión

1. Ve a la dirección del sistema
2. Ingresa tu correo y contraseña de administrador
3. Haz clic en **"Iniciar Sesión"**

### Seguridad de la Cuenta

Como administrador, debes:
- Usar una contraseña segura (mínimo 12 caracteres)
- No compartir tus credenciales
- Cerrar sesión al terminar
- Cambiar contraseña periódicamente

---

## Panel de Administración

### Vista General

El dashboard de admin muestra:

| Sección | Descripción |
|---------|-------------|
| **Resumen del negocio** | KPIs principales |
| **Usuarios activos** | Personal conectado |
| **Alertas del sistema** | Problemas técnicos |
| **Accesos rápidos** | Funciones de admin |

### Métricas Clave

- Ventas totales (día/semana/mes)
- Comparativas de períodos
- Desempeño por sucursal
- Estado del sistema

---

## Gestión de Usuarios

### Ver Lista de Usuarios

Ve a `/usuarios` para ver todos los usuarios registrados.

### Información de Usuario

| Campo | Descripción |
|-------|-------------|
| **Nombre** | Nombre completo |
| **Email** | Correo de acceso |
| **Rol** | Nivel de permisos |
| **Estado** | Activo/Inactivo |
| **Último acceso** | Fecha y hora |

### Crear Nuevo Usuario

1. Haz clic en **"Nuevo Usuario"**
2. Completa el formulario:

| Campo | Descripción | Requerido |
|-------|-------------|-----------|
| **Nombre** | Nombre completo | Sí |
| **Email** | Correo electrónico | Sí |
| **Contraseña** | Contraseña inicial | Sí |
| **Rol** | Nivel de acceso | Sí |
| **Estado** | Activo por defecto | - |

3. Haz clic en **"Crear Usuario"**
4. El usuario recibirá acceso con las credenciales

### Roles Disponibles

| Rol | Permisos |
|-----|----------|
| **Admin** | Acceso total al sistema |
| **Encargado** | Supervisión, productos, reportes |
| **Cajera** | Pedidos, cobros, corte de caja |
| **Cocina** | Tablero de comandas |
| **Repartidor** | Panel de reparto, entregas |

### Matriz de Permisos

| Módulo | Admin | Encargado | Cajera | Cocina | Repartidor |
|--------|-------|-----------|--------|--------|------------|
| Dashboard | ✓ | ✓ | ✓ | - | - |
| Pedidos | ✓ | ✓ | ✓ | - | - |
| Cocina | ✓ | ✓ | - | ✓ | - |
| Reparto | ✓ | ✓ | - | - | ✓ |
| Productos | ✓ | ✓ | - | - | - |
| Reportes | ✓ | ✓ | - | - | - |
| Usuarios | ✓ | - | - | - | - |
| Config | ✓ | - | - | - | - |

### Editar Usuario

1. Encuentra el usuario en la lista
2. Haz clic en **"Editar"**
3. Modifica los campos necesarios
4. Haz clic en **"Guardar"**

### Desactivar Usuario

1. Encuentra el usuario
2. Cambia el estado a **"Inactivo"**
3. El usuario no podrá iniciar sesión

> **Nota:** No elimines usuarios, desactívalos para mantener el historial.

### Restablecer Contraseña

1. Encuentra el usuario
2. Haz clic en **"Restablecer Contraseña"**
3. Ingresa la nueva contraseña
4. Comunica la nueva contraseña al usuario

---

## Configuración del Sistema

### Configuración General

Ve a `/configuracion` para acceder a:

### Datos del Negocio

| Campo | Descripción |
|-------|-------------|
| **Nombre** | Nombre del restaurante |
| **Dirección** | Dirección física |
| **Teléfono** | Número de contacto |
| **Email** | Correo del negocio |
| **Logo** | Imagen del logo |

### Configuración de Pedidos

| Opción | Descripción |
|--------|-------------|
| **Tiempo máximo** | Minutos para alerta de urgente |
| **Costo envío por defecto** | Si no hay colonia configurada |
| **Métodos de pago** | Activar/desactivar métodos |
| **Canales de venta** | Activar/desactivar canales |

### Configuración de Turnos

| Opción | Descripción |
|--------|-------------|
| **Hora inicio matutino** | Hora de apertura |
| **Hora fin matutino** | Hora de cierre turno 1 |
| **Hora inicio vespertino** | Hora de apertura turno 2 |
| **Hora fin vespertino** | Hora de cierre |

### Configuración de Comisiones

| Opción | Descripción |
|--------|-------------|
| **Comisión repartidor** | Porcentaje o monto fijo |
| **Tipo de comisión** | Por pedido o por envío |

---

## Gestión de Productos

### Acceso Completo

Como admin, tienes acceso completo a productos:

- Crear, editar, eliminar productos
- Gestionar categorías
- Configurar precios y promociones
- Importar/exportar catálogo

### Importar Productos

1. Prepara un archivo CSV con el formato:
```csv
nombre,descripcion,precio,categoria,disponible
Brisket Plate,Plato de brisket con 2 guarniciones,189,Platos Principales,true
```

2. Ve a `/productos`
3. Haz clic en **"Importar"**
4. Selecciona el archivo CSV
5. Revisa la preview
6. Confirma la importación

### Exportar Productos

1. Ve a `/productos`
2. Haz clic en **"Exportar"**
3. Se descargará un CSV con todos los productos

### Estadísticas de Productos

- Productos más vendidos
- Productos sin movimiento
- Productos sin foto
- Análisis de precios

---

## Gestión de Colonias y Envíos

### Ver Colonias

Administra las colonias de entrega y sus costos.

### Crear Colonia

1. Ve a la sección de configuración de colonias
2. Haz clic en **"Nueva Colonia"**
3. Completa:

| Campo | Descripción |
|-------|-------------|
| **Nombre** | Nombre de la colonia |
| **Costo de envío** | Precio del delivery |
| **Tiempo estimado** | Minutos de entrega |
| **Activa** | Si está disponible |

### Editar Costo de Envío

1. Encuentra la colonia
2. Modifica el costo
3. Los nuevos pedidos usarán el nuevo costo

---

## Reportes Avanzados

### Tipos de Reportes

| Reporte | Descripción |
|---------|-------------|
| **Ventas** | Ingresos por período |
| **Productos** | Análisis de ventas por producto |
| **Canales** | Distribución por canal |
| **Repartidores** | Desempeño individual |
| **Turnos** | Resumen de cortes |
| **Comparativas** | Período vs período |

### Generar Reporte de Ventas

1. Ve a `/reportes`
2. Selecciona **"Ventas"**
3. Elige el rango de fechas
4. Filtra por canal/turno si necesitas
5. Haz clic en **"Generar"**

### Métricas Disponibles

| Métrica | Descripción |
|---------|-------------|
| **Ventas totales** | Suma de todos los pedidos |
| **Ticket promedio** | Venta promedio por pedido |
| **Pedidos por hora** | Distribución horaria |
| **Tasa de cancelación** | Porcentaje de cancelados |
| **Tiempo promedio** | De creación a entrega |

### Exportar Reportes

Todos los reportes pueden exportarse a:
- **Excel (.xlsx)** - Para análisis detallado
- **PDF** - Para presentaciones
- **CSV** - Para integración con otros sistemas

---

## Seguridad y Auditoría

### Logs de Auditoría

El sistema registra:
- Inicios de sesión
- Creación/edición de usuarios
- Cambios en configuración
- Operaciones críticas

### Ver Logs

1. Ve a la sección de auditoría
2. Filtra por:
   - Usuario
   - Tipo de acción
   - Fecha

### Información Registrada

| Campo | Descripción |
|-------|-------------|
| **Usuario** | Quién realizó la acción |
| **Acción** | Qué hizo |
| **Fecha/Hora** | Cuándo |
| **Detalles** | Información adicional |
| **IP** | Dirección de origen |

### Reglas de Firestore

Las reglas de seguridad garantizan:
- Solo usuarios autenticados acceden
- Cada rol ve solo lo que le corresponde
- No se puede modificar datos de otros usuarios
- Los pedidos son inmutables después de entregados

---

## Mantenimiento del Sistema

### Tareas Periódicas

| Tarea | Frecuencia | Descripción |
|-------|------------|-------------|
| **Revisar usuarios** | Semanal | Desactivar usuarios inactivos |
| **Revisar productos** | Semanal | Actualizar disponibilidad |
| **Backup datos** | Diario | Firebase hace backups automáticos |
| **Revisar logs** | Semanal | Detectar anomalías |

### Monitoreo de Rendimiento

Revisa periódicamente:
- Velocidad de carga del sistema
- Errores reportados
- Uso de almacenamiento
- Consumo de Firebase

### Actualizaciones

El sistema se actualiza automáticamente. Verifica:
- Que las nuevas funciones funcionen correctamente
- Que no haya errores después de actualizaciones
- Capacita al personal en nuevas funciones

---

## Integraciones

### Sistemas Integrados

| Sistema | Descripción | Estado |
|---------|-------------|--------|
| **Firebase** | Base de datos y auth | Activo |
| **Cloudinary** | Almacenamiento de imágenes | Activo |
| **FCM** | Notificaciones push | Activo |

### APIs Disponibles

El sistema puede integrarse con:
- WhatsApp Business API
- Sistemas de delivery (Uber, Didi)
- Sistemas de facturación

---

## Solución de Problemas

### El sistema está lento

1. Verifica la conexión a internet
2. Revisa el estado de Firebase
3. Limpia caché del navegador
4. Contacta soporte técnico si persiste

### Un usuario no puede acceder

1. Verifica que el usuario esté activo
2. Restablece la contraseña
3. Verifica que el email sea correcto
4. Revisa los logs de acceso

### Los reportes no cargan

1. Reduce el rango de fechas
2. Aplica filtros más específicos
3. Espera unos segundos y reintenta
4. Verifica conexión a internet

### Las notificaciones no llegan

1. Verifica que el usuario tenga permisos de notificación
2. Revisa la configuración del navegador
3. Verifica que FCM esté configurado correctamente

---

## Preguntas Frecuentes

### ¿Cómo elimino un usuario?

No elimines usuarios, desactívalos. Esto mantiene el historial de sus acciones.

### ¿Puedo ver los pedidos de días anteriores?

Sí, usa los filtros de fecha en la bitácora o reportes.

### ¿Cómo cambio los precios de varios productos?

1. Exporta el catálogo a CSV
2. Edita los precios en Excel
3. Importa el archivo actualizado

### ¿Cómo agrego un nuevo método de pago?

Ve a Configuración → Métodos de Pago → Agregar nuevo método.

### ¿Puedo limitar el acceso por horario?

Actualmente no. Los usuarios pueden acceder 24/7 si están activos.

---

## Contacto de Soporte Técnico

Para problemas técnicos avanzados:
- Documenta el problema con capturas de pantalla
- Incluye los pasos para reproducir el error
- Contacta al desarrollador del sistema

---

## Checklist del Administrador

### Diario
- [ ] Revisar alertas del sistema
- [ ] Verificar cortes de caja
- [ ] Revisar incidencias

### Semanal
- [ ] Revisar reportes de ventas
- [ ] Actualizar productos si es necesario
- [ ] Revisar desempeño de repartidores
- [ ] Verificar usuarios activos

### Mensual
- [ ] Generar reporte ejecutivo
- [ ] Revisar y actualizar precios
- [ ] Evaluar desempeño del sistema
- [ ] Planificar mejoras

---

**Versión del Manual:** 1.0
**Última actualización:** Enero 2026
