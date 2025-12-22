# 🔊 Fuentes de Sonidos de Notificación

Este documento contiene enlaces directos a sonidos gratuitos y de dominio público para las notificaciones del sistema.

## 📋 Sonidos Requeridos

### 1. notification.mp3 - Notificación General

**Descripción**: Sonido suave y neutral para notificaciones generales.

**Opciones Gratuitas**:

#### Opción A (Recomendada): Pixabay
- **URL**: https://pixabay.com/sound-effects/simple-notification-152054/
- **Licencia**: Dominio Público (CC0)
- **Duración**: 1-2 segundos
- **Cómo descargar**: Click en "Download" → Seleccionar MP3

#### Opción B: Freesound
- **URL**: https://freesound.org/people/InspectorJ/sounds/403013/
- **Nombre**: "Notification, Subtle, A.wav"
- **Licencia**: CC-BY 4.0
- **Nota**: Convertir a MP3 si es necesario

#### Opción C: NotificationSounds.com
- **URL**: https://notificationsounds.com/notification-sounds/elegant-notification-sound-563
- **Licencia**: Uso gratuito
- **Formato**: MP3 directo

---

### 2. new-order.mp3 - Nuevo Pedido

**Descripción**: Sonido llamativo tipo "ding" o campana para alertar de nuevos pedidos (cocina).

**Opciones Gratuitas**:

#### Opción A (Recomendada): Pixabay
- **URL**: https://pixabay.com/sound-effects/bike-bell-1-189066/
- **Licencia**: Dominio Público (CC0)
- **Descripción**: Campana de bicicleta - perfecto para nuevos pedidos

#### Opción B: Freesound
- **URL**: https://freesound.org/people/plasterbrain/sounds/397354/
- **Nombre**: "Restaurant Bell"
- **Licencia**: CC0

#### Opción C: Zapsplat
- **URL**: https://www.zapsplat.com/music/service-bell-single-ring-1/
- **Descripción**: Campana de servicio de restaurante
- **Licencia**: Gratis con atribución

---

### 3. order-ready.mp3 - Pedido Listo

**Descripción**: Sonido positivo y alegre para indicar que un pedido está listo.

**Opciones Gratuitas**:

#### Opción A (Recomendada): Pixabay
- **URL**: https://pixabay.com/sound-effects/magic-chime-2-202103/
- **Licencia**: Dominio Público (CC0)
- **Descripción**: Chime mágico - sonido positivo

#### Opción B: Freesound
- **URL**: https://freesound.org/people/Fupicat/sounds/521645/
- **Nombre**: "Positive Notification"
- **Licencia**: CC0

#### Opción C: Mixkit
- **URL**: https://mixkit.co/free-sound-effects/notification/
- **Búsqueda**: "Positive notification"
- **Licencia**: Mixkit License (uso gratuito)

---

### 4. success.mp3 - Pedido Entregado

**Descripción**: Sonido de éxito/confirmación para pedidos entregados.

**Opciones Gratuitas**:

#### Opción A (Recomendada): Pixabay
- **URL**: https://pixabay.com/sound-effects/success-1-6297/
- **Licencia**: Dominio Público (CC0)
- **Descripción**: Sonido de éxito corto

#### Opción B: Freesound
- **URL**: https://freesound.org/people/grunz/sounds/109662/
- **Nombre**: "Success Jingle"
- **Licencia**: CC-BY 3.0

#### Opción C: Zapsplat
- **URL**: https://www.zapsplat.com/music/game-sound-collect-pick-up-or-grab-item-notification-positive-001/
- **Licencia**: Gratis con atribución

---

### 5. alert.mp3 - Alerta Urgente

**Descripción**: Sonido de alerta para situaciones urgentes (pedidos retrasados, problemas).

**Opciones Gratuitas**:

#### Opción A (Recomendada): Pixabay
- **URL**: https://pixabay.com/sound-effects/notification-3-14560/
- **Licencia**: Dominio Público (CC0)
- **Descripción**: Notificación de alerta

#### Opción B: Freesound
- **URL**: https://freesound.org/people/Breviceps/sounds/445978/
- **Nombre**: "Alert Notification"
- **Licencia**: CC0

#### Opción C: Mixkit
- **URL**: https://mixkit.co/free-sound-effects/alert/
- **Búsqueda**: "Alert notification"
- **Licencia**: Mixkit License

---

## 🎵 Sitios Recomendados para Sonidos Gratuitos

### 1. **Pixabay** (Más Recomendado)
- **URL**: https://pixabay.com/sound-effects/search/notification/
- **Licencia**: Dominio Público (CC0) - Sin atribución requerida
- **Formatos**: MP3, WAV
- **Ventaja**: Descarga directa, sin registro necesario

### 2. **Freesound**
- **URL**: https://freesound.org/
- **Licencia**: Varía (CC0, CC-BY)
- **Formatos**: WAV, MP3, OGG
- **Nota**: Requiere registro gratuito

### 3. **Mixkit**
- **URL**: https://mixkit.co/free-sound-effects/
- **Licencia**: Mixkit License (uso gratuito comercial)
- **Formatos**: MP3
- **Ventaja**: Alta calidad

### 4. **Zapsplat**
- **URL**: https://www.zapsplat.com/
- **Licencia**: Gratis con atribución
- **Formatos**: MP3, WAV
- **Nota**: Requiere registro gratuito

### 5. **NotificationSounds.com**
- **URL**: https://notificationsounds.com/
- **Licencia**: Uso gratuito
- **Formatos**: MP3
- **Ventaja**: Especializado en notificaciones

---

## 📥 Cómo Descargar

### Método 1: Automático (Script)

```bash
# Dar permisos de ejecución
chmod +x scripts/download-notification-sounds.sh

# Ejecutar script
./scripts/download-notification-sounds.sh
```

### Método 2: Manual

1. Visita los enlaces de arriba
2. Descarga los archivos (formato MP3 preferido)
3. Renombra los archivos según la lista:
   - `notification.mp3`
   - `new-order.mp3`
   - `order-ready.mp3`
   - `success.mp3`
   - `alert.mp3`
4. Coloca los archivos en: `public/sounds/`

### Método 3: Convertir desde WAV a MP3

Si descargas archivos WAV, puedes convertirlos a MP3:

```bash
# Usando ffmpeg (instalar si es necesario: brew install ffmpeg)
ffmpeg -i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3

# O usando una herramienta online:
# https://cloudconvert.com/wav-to-mp3
```

---

## 📝 Especificaciones Técnicas

### Requerimientos de los Archivos

- **Formato**: MP3
- **Duración**: 1-3 segundos (recomendado)
- **Tasa de bits**: 128kbps o superior
- **Frecuencia**: 44.1 kHz
- **Canales**: Mono o Stereo
- **Tamaño**: Menos de 100KB por archivo (para performance)

### Normalización de Volumen

Si los sonidos están muy fuertes o muy bajos:

```bash
# Normalizar con ffmpeg
ffmpeg -i input.mp3 -filter:a "volume=0.5" output.mp3

# O ajustar en el código (ya implementado):
audio.volume = 0.5; // 50% de volumen
```

---

## ⚖️ Licencias y Atribución

### CC0 (Dominio Público)
- ✅ Uso comercial permitido
- ✅ No requiere atribución
- ✅ Modificación permitida
- ✅ **Recomendado para este proyecto**

### CC-BY (Atribución Requerida)
- ✅ Uso comercial permitido
- ⚠️ Requiere atribución al autor
- ✅ Modificación permitida

### Mixkit License
- ✅ Uso comercial permitido
- ✅ No requiere atribución
- ✅ No redistribuir como producto standalone

---

## ✅ Checklist de Verificación

Después de descargar, verifica que tengas:

- [ ] `notification.mp3` - Notificación general
- [ ] `new-order.mp3` - Nuevo pedido (campana)
- [ ] `order-ready.mp3` - Pedido listo (positivo)
- [ ] `success.mp3` - Éxito/entrega
- [ ] `alert.mp3` - Alerta urgente

### Verificar que funcionen:

```bash
# Listar archivos
ls -lh public/sounds/*.mp3

# Reproducir (macOS)
afplay public/sounds/notification.mp3

# Reproducir (Linux)
mpg123 public/sounds/notification.mp3

# Reproducir (Windows)
# Usar reproductor de Windows Media
```

---

## 🔧 Solución de Problemas

### Problema: Archivos muy pesados

```bash
# Comprimir MP3
ffmpeg -i input.mp3 -codec:a libmp3lame -b:a 64k output.mp3
```

### Problema: Archivos muy largos

```bash
# Recortar a 2 segundos
ffmpeg -i input.mp3 -t 2 -c copy output.mp3
```

### Problema: Volumen inconsistente

```bash
# Normalizar volumen
ffmpeg -i input.mp3 -af "loudnorm" output.mp3
```

---

## 📊 Sonidos Alternativos por Contexto

### Para Ambiente Profesional
- Sonidos cortos (< 1 segundo)
- Tonos neutros
- Volumen moderado

### Para Ambiente Casual/Divertido
- Sonidos más largos (1-3 segundos)
- Tonos alegres
- Efectos creativos

### Para Ambiente Urgente (Cocina)
- Sonidos distintivos
- Volumen más alto
- Repetición si es necesario

---

## 🎯 Recomendación Final

Para **Old Texas BBQ**, recomiendo:

1. **Pixabay** para todos los sonidos (CC0, sin complicaciones)
2. Duración: 1-2 segundos máximo
3. Volumen: 50-70% del máximo
4. Formato: MP3 a 128kbps

---

**Última actualización**: Diciembre 2024
**Responsable**: Pedro Duran
