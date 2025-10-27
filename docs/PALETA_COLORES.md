# 🎨 Paleta de Colores - Old Texas BBQ CRM

## 🍖 Colores de Marca (del Logo)

Extraídos directamente del logo oficial de Old Texas BBQ:

### Navy (Azul Marino)
- **HSL**: `217 91% 25%`
- **HEX**: `#002D72`
- **Uso**: Color principal, botones primarios, navbar, texto de encabezados
- **Representa**: Profesionalismo, confianza, solidez

### Red (Rojo BBQ)
- **HSL**: `356 85% 52%`
- **HEX**: `#ED1C24`
- **Uso**: Acentos, CTAs importantes, alertas de acción, elementos destacados
- **Representa**: Pasión por el BBQ, fuego, energía

### Cream (Crema Cálido)
- **HSL**: `43 74% 94%`
- **HEX**: `#FFF4E6`
- **Uso**: Fondos secundarios, tarjetas, hover states sutiles
- **Representa**: Calidez, hospitalidad, papel craft

### Gold (Dorado BBQ)
- **HSL**: `38 92% 50%`
- **HEX**: `#F59E0B`
- **Uso**: Warnings, destacados especiales, badges premium
- **Representa**: Calidad premium, brillo del ahumado

---

## 🌞 Modo Light

### Colores Base

| Color | HSL | HEX | Uso |
|-------|-----|-----|-----|
| `background` | `0 0% 100%` | `#FFFFFF` | Fondo principal, limpio y profesional |
| `foreground` | `222 47% 11%` | `#0F172A` | Texto principal, alta legibilidad |
| `card` | `0 0% 100%` | `#FFFFFF` | Tarjetas, paneles |
| `muted` | `210 40% 96%` | `#F1F5F9` | Fondos sutiles, disabled states |

### Colores Funcionales

| Nombre | HSL | HEX | Uso |
|--------|-----|-----|-----|
| `primary` | `217 91% 25%` | `#002D72` | Navy - Botones principales |
| `secondary` | `43 74% 94%` | `#FFF4E6` | Cream - Fondos secundarios |
| `accent` | `356 85% 52%` | `#ED1C24` | Red - Acentos importantes |
| `destructive` | `0 84% 60%` | `#EF4444` | Acciones destructivas, errores |
| `success` | `142 76% 36%` | `#16A34A` | Éxito, confirmaciones |
| `warning` | `38 92% 50%` | `#F59E0B` | Gold - Advertencias |
| `info` | `199 89% 48%` | `#0EA5E9` | Información, tips |

### Bordes

| Nombre | HSL | HEX | Uso |
|--------|-----|-----|-----|
| `border` | `214 32% 91%` | `#E2E8F0` | Bordes generales |
| `input` | `214 32% 91%` | `#E2E8F0` | Bordes de inputs |
| `ring` | `217 91% 25%` | `#002D72` | Focus ring (navy) |

---

## 🌙 Modo Dark (No tan oscuro)

**Filosofía**: Colores vibrantes y legibles. No usar negro puro ni tonos demasiado oscuros.

### Colores Base

| Color | HSL | HEX | Uso |
|-------|-----|-----|-----|
| `background` | `222 47% 15%` | `#1E293B` | Gris azulado medio (no negro) |
| `foreground` | `210 40% 98%` | `#F8FAFC` | Texto casi blanco, alta legibilidad |
| `card` | `217 33% 20%` | `#283548` | Tarjetas más claras que el fondo |
| `muted` | `217 33% 25%` | `#303D52` | Fondos sutiles |

### Colores Funcionales (Más brillantes)

| Nombre | HSL | HEX | Uso |
|--------|-----|-----|-----|
| `primary` | `217 91% 45%` | `#1E5CBF` | Navy brillante |
| `secondary` | `217 33% 25%` | `#303D52` | Gris azulado |
| `accent` | `356 85% 58%` | `#F03238` | Red más vibrante |
| `destructive` | `0 84% 65%` | `#F87171` | Rojo claro visible |
| `success` | `142 76% 45%` | `#22C55E` | Verde brillante |
| `warning` | `38 92% 55%` | `#FABC3C` | Dorado brillante |
| `info` | `199 89% 55%` | `#38BDF8` | Azul brillante |

### Bordes

| Nombre | HSL | HEX | Uso |
|--------|-----|-----|-----|
| `border` | `217 33% 30%` | `#3A4A5F` | Bordes visibles |
| `input` | `217 33% 30%` | `#3A4A5F` | Bordes de inputs |
| `ring` | `217 91% 50%` | `#2563EB` | Focus ring brillante |

---

## 🎨 Uso en Tailwind CSS

### Colores de Marca

```tsx
// Fondos
<div className="bg-brand-navy">Navy</div>
<div className="bg-brand-red">Red BBQ</div>
<div className="bg-brand-cream">Cream</div>
<div className="bg-brand-gold">Gold</div>

// Textos
<h1 className="text-brand-navy">Título Navy</h1>
<p className="text-brand-red">Texto Red</p>
<span className="text-brand-gold">Gold</span>

// Bordes
<div className="border-2 border-brand-navy">Border Navy</div>
<div className="border-2 border-brand-red">Border Red</div>
```

### Colores Semánticos

```tsx
// Primary (Navy)
<Button className="bg-primary text-primary-foreground">
  Botón Principal
</Button>

// Accent (Red)
<Button className="bg-accent text-accent-foreground">
  Acción Importante
</Button>

// Success
<Badge className="bg-success text-success-foreground">
  Completado
</Badge>

// Warning
<Alert className="bg-warning text-warning-foreground">
  Advertencia
</Alert>

// Destructive
<Button variant="destructive">
  Eliminar
</Button>
```

### Gradientes

```tsx
// Gradiente Texas (Navy → Red)
<div className="bg-texas-gradient text-white p-8">
  Gradiente Old Texas
</div>

// Gradiente Fire (Red → Gold)
<div className="bg-fire-gradient text-white p-8">
  Gradiente Fuego BBQ
</div>

// Gradiente Navy (Navy → Blue)
<div className="bg-navy-gradient text-white p-8">
  Gradiente Profesional
</div>

// Texto con gradiente
<h1 className="text-texas-gradient text-5xl font-bold">
  Old Texas BBQ
</h1>

<h2 className="text-fire-gradient text-4xl font-bold">
  Sabor Auténtico
</h2>
```

### Efectos de Brillo (Glow)

```tsx
// Brillo Navy
<Card className="glow-navy">
  Tarjeta con brillo azul
</Card>

// Brillo Red
<Button className="glow-red">
  Botón destacado
</Button>

// Brillo Gold
<Badge className="glow-gold">
  Badge premium
</Badge>

// Sombra Texas
<div className="shadow-texas">
  Sombra sutil navy
</div>
```

### Estados Hover

```tsx
// Hover con primary
<div className="hover-texas p-4">
  Hover Navy Sutil
</div>

// Hover con accent
<div className="hover-fire p-4">
  Hover Red Sutil
</div>

// Hover con warning
<div className="hover-gold p-4">
  Hover Gold Sutil
</div>
```

---

## 📊 Colores para Charts

Tanto en light como en dark, los charts usan colores vibrantes y distinguibles:

### Light Mode
1. **chart-1**: Navy `#002D72`
2. **chart-2**: Red `#ED1C24`
3. **chart-3**: Gold `#F59E0B`
4. **chart-4**: Green `#16A34A`
5. **chart-5**: Blue `#0EA5E9`

### Dark Mode (Más brillantes)
1. **chart-1**: Navy brillante `#2563EB`
2. **chart-2**: Red brillante `#F87171`
3. **chart-3**: Gold brillante `#FABC3C`
4. **chart-4**: Green brillante `#22C55E`
5. **chart-5**: Blue brillante `#38BDF8`

```tsx
import { Line } from 'recharts';

<Line
  dataKey="ventas"
  stroke="hsl(var(--chart-1))"  // Navy
/>
<Line
  dataKey="pedidos"
  stroke="hsl(var(--chart-2))"  // Red
/>
```

---

## 🎯 Guía de Uso por Componente

### Navbar / Header
- **Fondo**: `bg-primary` (Navy)
- **Texto**: `text-primary-foreground` (Blanco)
- **Logo**: Colores originales del logo
- **Hover**: `hover:bg-primary/90`

### Botones Principales
- **Primary**: `bg-primary hover:bg-primary/90` (Navy)
- **Accent**: `bg-accent hover:bg-accent/90` (Red)
- **Success**: `bg-success hover:bg-success/90` (Verde)
- **Destructive**: `bg-destructive hover:bg-destructive/90` (Rojo)

### Cards / Tarjetas
- **Fondo**: `bg-card`
- **Bordes**: `border border-border`
- **Hover**: `hover:shadow-texas transition-shadow`

### Forms / Inputs
- **Background**: `bg-background`
- **Border**: `border-input`
- **Focus**: `focus:ring-2 focus:ring-ring focus:border-transparent`
- **Disabled**: `disabled:bg-muted`

### Badges / Tags
- **Success**: `bg-success/10 text-success border-success`
- **Warning**: `bg-warning/10 text-warning border-warning`
- **Info**: `bg-info/10 text-info border-info`
- **Error**: `bg-destructive/10 text-destructive border-destructive`

### Estados de Pedido
- **Pendiente**: `bg-warning/20 text-warning-foreground border-warning`
- **En Preparación**: `bg-info/20 text-info-foreground border-info`
- **Listo**: `bg-success/20 text-success-foreground border-success`
- **En Reparto**: `bg-primary/20 text-primary-foreground border-primary`
- **Entregado**: `bg-success border-success`
- **Cancelado**: `bg-destructive/20 text-destructive-foreground border-destructive`

---

## 💡 Tips de Accesibilidad

### Contraste Mínimo (WCAG AA)
- ✅ **Navy sobre Blanco**: 13.24:1 (Excelente)
- ✅ **Red sobre Blanco**: 4.77:1 (Bueno)
- ✅ **Blanco sobre Navy**: 13.24:1 (Excelente)
- ✅ **Blanco sobre Red**: 4.77:1 (Bueno)

### Dark Mode
- ✅ Fondo `#1E293B` no es negro puro
- ✅ Texto `#F8FAFC` tiene 97% de luminosidad
- ✅ Colores vibrantes mantienen legibilidad
- ✅ Bordes visibles con suficiente contraste

### Recomendaciones
1. Siempre usar `*-foreground` con colores de fondo
2. Nunca poner `text-brand-red` sobre `bg-brand-navy` (bajo contraste)
3. Para texto sobre imágenes, usar `text-shadow` o overlay oscuro
4. Focus rings siempre visibles con `ring-ring`

---

## 🔧 Personalización

### Agregar Variaciones de Colores

Si necesitas variaciones (lighter/darker), usa opacidad:

```tsx
// Más claro (20% opacidad)
<div className="bg-primary/20">Navy muy claro</div>

// Medio (50% opacidad)
<div className="bg-accent/50">Red medio</div>

// Más oscuro (90% opacidad)
<div className="bg-primary/90">Navy oscuro</div>
```

### Variables CSS Personalizadas

Si necesitas usar en CSS puro:

```css
.mi-componente {
  background-color: hsl(var(--brand-navy));
  color: hsl(var(--primary-foreground));
  border: 2px solid hsl(var(--brand-red));
}

.mi-gradiente {
  background: linear-gradient(
    135deg,
    hsl(var(--brand-navy)),
    hsl(var(--brand-red))
  );
}
```

---

## 📱 Ejemplo de Implementación

### Hero Section

```tsx
<section className="bg-texas-gradient text-white py-20">
  <div className="container mx-auto">
    <h1 className="text-6xl font-bold mb-4">
      Old Texas BBQ
    </h1>
    <p className="text-xl opacity-90">
      Sabor auténtico desde 2019
    </p>
    <Button className="mt-8 bg-white text-primary hover:bg-white/90">
      Ver Menú
    </Button>
  </div>
</section>
```

### Dashboard Card

```tsx
<Card className="shadow-texas hover:glow-navy transition-all">
  <CardHeader className="bg-brand-cream">
    <CardTitle className="text-brand-navy">
      Pedidos del Día
    </CardTitle>
  </CardHeader>
  <CardContent className="pt-6">
    <div className="text-4xl font-bold text-brand-red">
      87
    </div>
    <p className="text-muted-foreground">
      +12% vs ayer
    </p>
  </CardContent>
</Card>
```

### Estado de Pedido

```tsx
function PedidoEstado({ estado }: { estado: EstadoPedido }) {
  const estilos = {
    pendiente: 'bg-warning/20 text-warning border-warning',
    en_preparacion: 'bg-info/20 text-info border-info',
    listo: 'bg-success/20 text-success border-success',
    entregado: 'bg-success border-success text-white',
  };

  return (
    <Badge className={`${estilos[estado]} border`}>
      {estado.replace('_', ' ').toUpperCase()}
    </Badge>
  );
}
```

---

**🎨 Paleta de colores lista para usar en todo el proyecto!**

**Última actualización**: Octubre 27, 2025
**Versión**: 1.0
