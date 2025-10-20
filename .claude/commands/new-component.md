Crea un nuevo componente de React siguiendo estas especificaciones:

## Instrucciones

1. **Pregunta al usuario**:
   - Nombre del componente (en PascalCase)
   - Tipo: UI base, formulario, o layout
   - Si es Client Component ('use client') o Server Component
   - Props principales que necesita

2. **Crea el componente** en la ubicación correcta:
   - UI base: `components/ui/`
   - Formulario: `components/forms/`
   - Layout: `components/layout/`

3. **Estructura del componente**:

   ```typescript
   // Si es client component
   'use client';

   import { /* imports necesarios */ } from 'react';

   interface [ComponentName]Props {
     // Props tipadas
   }

   export function [ComponentName]({ props }: [ComponentName]Props) {
     // Implementación
     return (
       // JSX con Tailwind CSS
     );
   }
   ```

4. **Incluir**:
   - TypeScript estricto
   - Props interface
   - Tailwind CSS para estilos
   - Responsive design
   - Manejo de estados si es necesario

5. **Verificar**:
   - No usar `any`
   - Nombres descriptivos
   - Código formateado

¡Listo para crear el componente!
