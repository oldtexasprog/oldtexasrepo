# Archivos de Sonido para Notificaciones

Esta carpeta contiene los archivos de audio utilizados para las notificaciones del sistema.

## Sonidos Requeridos

Para que el sistema de notificaciones funcione correctamente con sonidos, necesitas agregar los siguientes archivos MP3:

1. **notification.mp3** - Sonido general de notificación (por defecto)
2. **new-order.mp3** - Notificación de nuevo pedido (para cocina)
3. **order-ready.mp3** - Pedido listo para recoger (para repartidor)
4. **success.mp3** - Pedido entregado exitosamente
5. **alert.mp3** - Alerta de turno o advertencia

## Dónde Obtener Sonidos

Puedes obtener sonidos gratuitos de:

- **Freesound.org** - https://freesound.org/
- **Zapsplat** - https://www.zapsplat.com/
- **Notification Sounds** - https://notificationsounds.com/

## Formatos Recomendados

- **Formato**: MP3
- **Duración**: 1-3 segundos
- **Volumen**: Normalizado
- **Tasa de bits**: 128kbps o superior

## Ejemplo de Estructura

```
public/sounds/
├── notification.mp3     # Sonido por defecto
├── new-order.mp3        # Nuevo pedido
├── order-ready.mp3      # Pedido listo
├── success.mp3          # Éxito
└── alert.mp3            # Alerta
```

## Uso en el Código

Los sonidos se reproducen automáticamente cuando:

- Llega una notificación en foreground (app abierta)
- Llega una notificación push (FCM)
- Se muestra un toast de notificación

El archivo se selecciona según el tipo de notificación recibida.
