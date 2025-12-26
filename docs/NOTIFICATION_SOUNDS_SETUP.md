# 🔊 Setup Completo de Sonidos de Notificación

**Estado**: ✅ Archivos placeholder creados - Listo para reemplazar con sonidos reales
**Fecha**: Diciembre 22, 2024

---

## ✅ Lo que ya está listo

### 1. Archivos Creados (Placeholder)

```
public/sounds/
├── notification.mp3    ✅ (4.3KB - silencioso)
├── new-order.mp3       ✅ (4.3KB - silencioso)
├── order-ready.mp3     ✅ (4.3KB - silencioso)
├── success.mp3         ✅ (4.3KB - silencioso)
├── alert.mp3           ✅ (4.3KB - silencioso)
├── README.md           ✅ (documentación básica)
├── SOURCES.md          ✅ (enlaces a sonidos gratuitos)
└── DOWNLOAD_GUIDE.md   ✅ (guía de descarga)
```

### 2. Scripts Disponibles

```
scripts/
├── download-notification-sounds.sh  ✅ (descarga automática)
├── create-placeholder-sounds.sh     ✅ (crear placeholders)
└── download-sounds-manual.md        ✅ (guía manual)
```

### 3. Sistema de Notificaciones

- ✅ Código preparado para reproducir sonidos
- ✅ Manejo de errores si no existe el sonido
- ✅ Volumen configurado (50%)
- ✅ Sonidos asignados por tipo de notificación

---

## 🎯 Próximos Pasos

### Opción A: Descarga Manual Rápida (5 minutos) ⭐ RECOMENDADA

1. **Visita Pixabay**: https://pixabay.com/sound-effects/search/notification/

2. **Descarga estos 5 sonidos** (busca por nombre):

   | Archivo           | Búsqueda              | Tipo                  |
   | ----------------- | --------------------- | --------------------- |
   | notification.mp3  | "simple notification" | Neutral, corto        |
   | new-order.mp3     | "bike bell"           | Campana clara         |
   | order-ready.mp3   | "magic chime"         | Positivo, alegre      |
   | success.mp3       | "success"             | Sonido de logro       |
   | alert.mp3         | "alert notification"  | Llamativo, urgente    |

3. **Guarda en**: `public/sounds/` (reemplazar los existentes)

4. **Verifica**:
   ```bash
   ls -lh public/sounds/*.mp3
   # Cada archivo debería ser > 10KB (los actuales son 4.3KB placeholders)
   ```

### Opción B: Script Automático

```bash
cd "/Users/pedroduran/Desktop/Proyectos/Old Texas BBQ - CRM"

# Ejecutar script
./scripts/download-notification-sounds.sh
```

**Nota**: Puede requerir descarga manual de algunos archivos si fallan.

### Opción C: Mantener Placeholders Temporalmente

Los archivos actuales son **silenciosos** pero **funcionales**. El sistema no fallará, simplemente no habrá sonido hasta que los reemplaces.

---

## 🔍 Verificación

### 1. Comprobar que existen los archivos

```bash
ls -lh public/sounds/*.mp3
```

**Esperado**: 5 archivos MP3

### 2. Probar un sonido

```bash
# macOS
afplay public/sounds/notification.mp3

# Linux
mpg123 public/sounds/notification.mp3
```

### 3. Probar en la aplicación

1. Inicia el servidor: `npm run dev`
2. Abre: http://localhost:3000
3. Activa una notificación desde el sistema
4. Deberías escuchar el sonido (o silencio si aún no los has reemplazado)

---

## 📊 Mapa de Sonidos por Tipo

| Tipo de Notificación      | Archivo           | Cuándo suena                        |
| ------------------------- | ----------------- | ----------------------------------- |
| General                   | notification.mp3  | Notificaciones genéricas            |
| Nuevo Pedido (Cocina)     | new-order.mp3     | Cuando llega un nuevo pedido        |
| Pedido Listo (Repartidor) | order-ready.mp3   | Cuando un pedido está listo         |
| Pedido Entregado (Cajera) | success.mp3       | Cuando se confirma entrega          |
| Alerta Urgente            | alert.mp3         | Pedidos retrasados, problemas       |

---

## 🎵 Características de los Sonidos

### Especificaciones Técnicas

- **Formato**: MP3
- **Duración**: 1-3 segundos (recomendado: 1-2 seg)
- **Tamaño**: < 100KB por archivo
- **Tasa de bits**: 128kbps
- **Frecuencia**: 44.1 kHz
- **Licencia**: CC0 (Dominio Público) preferida

### Volumen en el Código

El volumen está configurado al 50% por defecto:

```javascript
// lib/notifications/fcm.ts (línea ~220)
audio.volume = 0.5; // 50%
```

Para ajustar, edita ese valor:
- `0.3` = 30% (más bajo)
- `0.5` = 50% (default)
- `0.7` = 70% (más alto)

---

## 📚 Recursos y Documentación

### Guías Creadas

1. **`public/sounds/DOWNLOAD_GUIDE.md`** - Guía rápida de descarga
2. **`public/sounds/SOURCES.md`** - Enlaces completos a recursos gratuitos
3. **`scripts/download-sounds-manual.md`** - Instrucciones paso a paso

### Sitios Recomendados

| Sitio             | URL                                  | Licencia | Registro |
| ----------------- | ------------------------------------ | -------- | -------- |
| **Pixabay** ⭐    | pixabay.com/sound-effects           | CC0      | No       |
| Mixkit            | mixkit.co/free-sound-effects        | Gratis   | No       |
| Freesound         | freesound.org                        | Varía    | Sí       |
| Zapsplat          | zapsplat.com                         | Gratis   | Sí       |
| NotificationSounds| notificationsounds.com              | Gratis   | No       |

---

## ⚙️ Configuración Actual del Sistema

### Archivos que usan sonidos

1. **`lib/notifications/fcm.ts`**
   - Función: `playNotificationSound(type)`
   - Selecciona sonido según tipo de notificación
   - Maneja errores si el archivo no existe

2. **`components/notifications/notification-listener.tsx`**
   - Reproduce sonido al mostrar toast
   - Usa: `/sounds/notification.mp3`

### Flujo de Reproducción

```
1. Llega notificación
        ↓
2. Sistema detecta tipo
        ↓
3. Selecciona archivo MP3 correspondiente
        ↓
4. Crea Audio() object
        ↓
5. Establece volumen (50%)
        ↓
6. Reproduce sonido
        ↓
7. Si falla → ignora error (silencioso)
```

---

## 🐛 Solución de Problemas

### Problema: No se escucha ningún sonido

**Causas posibles**:

1. **Archivos placeholder (silenciosos)** ← Más probable
   - Solución: Descarga sonidos reales

2. **Volumen del navegador desactivado**
   - Solución: Verifica volumen del sistema/navegador

3. **Usuario no ha interactuado con la página**
   - Solución: Click en cualquier parte de la página primero
   - Razón: Política de autoplay de navegadores

4. **Archivo no existe**
   - Solución: Verifica que los 5 MP3 estén en `public/sounds/`

### Problema: Sonido muy fuerte/bajo

Edita el volumen en el código:

```javascript
// lib/notifications/fcm.ts
audio.volume = 0.3; // Ajusta este valor (0.0 a 1.0)
```

### Problema: No se reproduce en iOS/Safari

Safari requiere interacción del usuario antes de reproducir audio. Asegúrate de que el usuario haya tocado la pantalla al menos una vez.

---

## ✅ Checklist Final

- [x] Archivos placeholder creados (5/5)
- [x] Scripts de descarga disponibles
- [x] Documentación completa
- [ ] **Sonidos reales descargados** ← PENDIENTE
- [ ] Probados en navegador
- [ ] Volumen ajustado según preferencia

---

## 🎯 Resumen

### Estado Actual

✅ **Sistema funcional** - No fallará aunque los sonidos sean silenciosos
✅ **Scripts listos** - Puedes descargar sonidos cuando quieras
✅ **Documentación completa** - Guías paso a paso disponibles

### Siguiente Paso Recomendado

**Descarga 5 sonidos de Pixabay** (~5 minutos):

1. https://pixabay.com/sound-effects/search/notification/
2. Busca y descarga los tipos mencionados arriba
3. Guarda en `public/sounds/`
4. ¡Listo! 🎵

---

## 📞 Enlaces Rápidos

- **Pixabay Notifications**: https://pixabay.com/sound-effects/search/notification/
- **Mixkit Notifications**: https://mixkit.co/free-sound-effects/notification/
- **Guía Completa**: `public/sounds/SOURCES.md`

---

**¡Tu sistema de notificaciones con sonido está casi completo!**

Solo falta reemplazar los archivos placeholder con sonidos reales cuando tengas 5 minutos. 🎵
