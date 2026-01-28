# 🤝 Guía de Contribución - Old Texas BBQ CRM

## 📋 Tabla de Contenidos

1. [Configuración del Entorno](#configuración-del-entorno)
2. [Estándares de Código](#estándares-de-código)
3. [Workflow de Git](#workflow-de-git)
4. [Testing](#testing)
5. [Proceso de Pull Request](#proceso-de-pull-request)

---

## 🛠️ Configuración del Entorno

### Prerrequisitos

- Node.js 18+ y npm/pnpm/yarn
- Git
- Editor de código (VS Code recomendado)

### Setup Inicial

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-org/old-texas-bbq-crm.git
cd old-texas-bbq-crm

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Ejecutar en desarrollo
npm run dev
```

### Extensiones VS Code Recomendadas

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

---

## 📐 Estándares de Código

### TypeScript

- ✅ **SIEMPRE** usar tipado explícito
- ❌ **NUNCA** usar `any` (usar `unknown` si es necesario)
- ✅ Definir interfaces para props y tipos de datos
- ✅ Nombres descriptivos en español para variables de negocio

```typescript
// ✅ Correcto
interface Pedido {
  id: string;
  numeroPedido: number;
  estado: EstadoPedido;
}

// ❌ Incorrecto
const data: any = getData();
```

### Componentes React

- ✅ Server Components por defecto
- ✅ `'use client'` solo cuando sea necesario
- ✅ Componentes pequeños (<200 líneas)
- ✅ Props tipadas con interfaces

```typescript
// ✅ Correcto
'use client';

interface ProductoCardProps {
  producto: Producto;
  onSelect: (id: string) => void;
}

export function ProductoCard({ producto, onSelect }: ProductoCardProps) {
  return (/* ... */);
}
```

### Estilos con Tailwind

- ✅ Usar Tailwind exclusivamente
- ❌ NO crear archivos CSS personalizados
- ✅ Mobile-first approach
- ✅ Usar variables de color del theme

```tsx
// ✅ Correcto
<div className="flex flex-col md:flex-row gap-4 p-4">

// ❌ Incorrecto
<div style={{ display: 'flex', padding: '16px' }}>
```

### Nombrado de Archivos

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Componentes | PascalCase.tsx | `ProductoCard.tsx` |
| Hooks | useCamelCase.ts | `usePedidos.ts` |
| Services | camelCase.service.ts | `pedidos.service.ts` |
| Stores | camelCase.store.ts | `auth.store.ts` |
| Utils | camelCase.ts | `formatters.ts` |

---

## 🌿 Workflow de Git

### Branches

```
main          - Producción (protegida)
develop       - Desarrollo principal
feature/*     - Nuevas funcionalidades
fix/*         - Correcciones de bugs
hotfix/*      - Parches urgentes en producción
```

### Crear una Feature

```bash
# 1. Crear branch desde develop
git checkout develop
git pull origin develop
git checkout -b feature/nombre-descriptivo

# 2. Hacer cambios y commits
git add .
git commit -m "feat: descripción del cambio"

# 3. Push y crear PR
git push origin feature/nombre-descriptivo
```

### Mensajes de Commit

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: agregar formulario de productos
fix: corregir cálculo de totales en pedidos
docs: actualizar README con instrucciones
style: formatear código con prettier
refactor: reorganizar estructura de servicios
test: agregar tests para productosService
chore: actualizar dependencias
```

### Reglas de Commits

- ✅ Un commit = un cambio lógico
- ✅ Mensajes descriptivos y concisos
- ✅ En español e imperativo ("agregar" no "agregado")
- ❌ NO hacer commits gigantes
- ❌ NO commitear `console.log` o código comentado

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Tests específicos
npm test -- pedidos.service
```

### Escribir Tests

```typescript
// __tests__/services/example.service.test.ts
import { describe, it, expect } from '@jest/globals';
import { exampleService } from '@/lib/services/example.service';

describe('ExampleService', () => {
  it('debería crear un registro', async () => {
    const result = await exampleService.create(data);
    expect(result).toBeDefined();
  });
});
```

### Cobertura Mínima

- ✅ Servicios: 70%+
- ✅ Utils: 80%+
- ✅ Componentes críticos: 60%+

---

## 🔄 Proceso de Pull Request

### Antes de Crear el PR

```bash
# 1. Actualizar con develop
git checkout develop
git pull origin develop
git checkout feature/tu-branch
git merge develop

# 2. Resolver conflictos si hay

# 3. Ejecutar tests
npm test

# 4. Formatear código
npm run format

# 5. Lint
npm run lint
```

### Crear el PR

1. Push tu branch
2. Ir a GitHub y crear Pull Request
3. Completar template:

```markdown
## 📝 Descripción
Breve descripción del cambio

## ✅ Checklist
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Sin warnings de ESLint
- [ ] Probado en desarrollo

## 📸 Screenshots (si aplica)
```

### Revisión de Código

- Esperar aprobación de al menos 1 reviewer
- Resolver comentarios
- Re-solicitar review después de cambios

### Merge

- **Squash and merge** para features pequeñas
- **Merge commit** para features grandes
- Eliminar branch después del merge

---

## 🚫 Prácticas a Evitar

- ❌ Trabajar directamente en `main` o `develop`
- ❌ Force push (`-f`) sin coordinar con el equipo
- ❌ Commits sin mensaje descriptivo
- ❌ PR de >500 líneas de cambio
- ❌ Mezclar múltiples features en un PR
- ❌ Ignorar warnings de ESLint
- ❌ Código sin formatear

---

## 🎯 Mejores Prácticas

### DRY (Don't Repeat Yourself)

```typescript
// ✅ Crear utilidad reutilizable
export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);

// ❌ Repetir lógica
const formatted1 = `$${amount1.toFixed(2)}`;
const formatted2 = `$${amount2.toFixed(2)}`;
```

### Separación de Responsabilidades

```typescript
// ✅ Lógica en hook, UI en componente
function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  // ... lógica
  return { pedidos, loading };
}

function ListaPedidos() {
  const { pedidos, loading } = usePedidos();
  return (/* renderizar */);
}
```

### Error Handling

```typescript
// ✅ Siempre manejar errores
try {
  await pedidosService.create(data);
  toast.success('Pedido creado');
} catch (error) {
  console.error('Error:', error);
  toast.error('Error al crear pedido');
}
```

---

## 📚 Recursos

- [Documentación del Proyecto](./docs/)
- [Reglas del Proyecto](./.claude/project_rules.md)
- [Esquema de Firestore](./docs/FIRESTORE_SCHEMA.md)
- [API de Servicios](./docs/API_SERVICIOS.md)

---

## ❓ ¿Necesitas Ayuda?

- Slack: #old-texas-dev
- Email: dev@oldtexasbbq.com
- Issues: GitHub Issues

---

**Última actualización**: Enero 2026
**Versión**: 1.0
