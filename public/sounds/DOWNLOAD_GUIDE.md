# 🎵 Guía Rápida de Descarga de Sonidos

## 🚀 Opción 1: Descarga Automática con Script

```bash
cd "/Users/pedroduran/Desktop/Proyectos/Old Texas BBQ - CRM"

# Dar permisos
chmod +x scripts/download-notification-sounds.sh

# Ejecutar
./scripts/download-notification-sounds.sh
```

**Nota**: Puede requerir que visites manualmente algunos sitios si fallan las descargas automáticas.

---

## 📥 Opción 2: Descarga Manual Rápida (Recomendada)

### Sitio Recomendado: Pixabay (Sin Registro)

**1. Visita**: https://pixabay.com/sound-effects/search/notification/

**2. Descarga estos 5 sonidos**:

| Archivo           | Búsqueda en Pixabay    | Características           |
| ----------------- | ---------------------- | ------------------------- |
| notification.mp3  | "simple notification"  | Corto (1-2 seg), neutral  |
| new-order.mp3     | "bike bell"            | Campana clara             |
| order-ready.mp3   | "magic chime"          | Positivo, alegre          |
| success.mp3       | "success"              | Sonido de logro           |
| alert.mp3         | "alert notification"   | Llamativo, urgente        |

**3. Guarda todos en**: `public/sounds/`

**Tiempo total**: ~5 minutos

---

## 🔗 Enlaces Directos (Copia y Pega)

### Pixabay - Dominio Público (CC0)

Visita estos IDs directamente en Pixabay:

```
https://pixabay.com/sound-effects/search/notification/
https://pixabay.com/sound-effects/search/bell/
https://pixabay.com/sound-effects/search/chime/
https://pixabay.com/sound-effects/search/success/
https://pixabay.com/sound-effects/search/alert/
```

### Alternativa: Mixkit (Sin Registro)

```
https://mixkit.co/free-sound-effects/notification/
```

---

## 🆘 Opción 3: Crear Placeholders Temporales

Si no tienes tiempo ahora, crea archivos temporales para que el sistema no falle:

```bash
chmod +x scripts/create-placeholder-sounds.sh
./scripts/create-placeholder-sounds.sh
```

Esto creará archivos **silenciosos** que puedes reemplazar después.

---

## ✅ Verificación

```bash
ls -lh public/sounds/*.mp3
```

Deberías ver estos 5 archivos:
- notification.mp3
- new-order.mp3
- order-ready.mp3
- success.mp3
- alert.mp3

---

## 📱 Probar los Sonidos

### macOS:
```bash
afplay public/sounds/notification.mp3
```

### Linux:
```bash
mpg123 public/sounds/notification.mp3
```

### Navegador:
Abre: http://localhost:3000 y prueba las notificaciones

---

## 🎯 Especificaciones Técnicas

- **Formato**: MP3
- **Duración**: 1-3 segundos
- **Tamaño**: < 100KB por archivo
- **Tasa de bits**: 128kbps
- **Licencia**: CC0 (Dominio Público) preferida

---

## 💡 Recomendaciones

### Para Ambiente Profesional (Recomendado)
- ✅ Sonidos cortos (1-2 segundos)
- ✅ Volumen moderado
- ✅ Tonos neutros

### Ajustar Volumen

Si un sonido está muy fuerte, edita en el código:

```javascript
// lib/notifications/fcm.ts
audio.volume = 0.3; // Reducir volumen a 30%
```

---

## 📚 Más Información

- **Fuentes completas**: `public/sounds/SOURCES.md`
- **Guía manual detallada**: `scripts/download-sounds-manual.md`
- **Documentación de notificaciones**: `docs/NOTIFICACIONES.md`

---

**¡Listo para descargar!** 🎵

Elige el método que prefieras y tendrás sonidos en ~5-10 minutos.
