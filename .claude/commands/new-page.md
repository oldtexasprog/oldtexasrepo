Crea una nueva página en Next.js usando App Router.

## Instrucciones

1. **Pregunta al usuario**:
   - Ruta de la página (ej: "/dashboard/pedidos", "/login")
   - Si requiere autenticación
   - Layout que debe usar
   - Funcionalidad principal

2. **Crea la estructura**:
   - Para ruta `/dashboard/pedidos` → `app/dashboard/pedidos/page.tsx`
   - Si necesita layout propio → `app/dashboard/pedidos/layout.tsx`
   - Si necesita loading → `app/dashboard/pedidos/loading.tsx`
   - Si necesita error → `app/dashboard/pedidos/error.tsx`

3. **Estructura de page.tsx**:

   ```typescript
   import type { Metadata } from 'next';

   export const metadata: Metadata = {
     title: '[Título] | Old Texas BBQ',
     description: '[Descripción]',
   };

   export default function [Name]Page() {
     return (
       <main className="container mx-auto p-6">
         <h1 className="text-3xl font-bold mb-6">[Título]</h1>
         {/* Contenido */}
       </main>
     );
   }
   ```

4. **Si requiere autenticación**, agregar middleware o verificación

5. **Si es dinámica** `[id]/page.tsx`:

   ```typescript
   interface PageProps {
     params: Promise<{ id: string }>;
   }

   export default async function DetailPage({ params }: PageProps) {
     const { id } = await params;
     // Implementación
   }
   ```

6. **Incluir**:
   - Metadata apropiado
   - Server Component por defecto
   - Responsive design
   - Loading states

¡Listo para crear la página!
