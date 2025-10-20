Crea un nuevo store de Zustand para gestionar estado global.

## Instrucciones

1. **Pregunta al usuario**:
   - Nombre del store (ej: "order", "user", "auth")
   - Estado que necesita gestionar
   - Acciones principales

2. **Crea el archivo** en `lib/stores/[nombre]Store.ts`

3. **Estructura del store**:

   ```typescript
   import { create } from 'zustand';
   import { persist } from 'zustand/middleware';
   import { immer } from 'zustand/middleware/immer';
   import type { [Entity] } from '@/lib/types';

   interface [Name]State {
     // Estado
     [items]: [Entity][];
     loading: boolean;
     error: string | null;

     // Acciones
     set[Items]: (items: [Entity][]) => void;
     add[Item]: (item: [Entity]) => void;
     update[Item]: (id: string, data: Partial<[Entity]>) => void;
     remove[Item]: (id: string) => void;
     setLoading: (loading: boolean) => void;
     setError: (error: string | null) => void;
     reset: () => void;
   }

   const initialState = {
     [items]: [],
     loading: false,
     error: null,
   };

   export const use[Name]Store = create<[Name]State>()(
     persist(
       immer((set) => ({
         ...initialState,

         set[Items]: (items) =>
           set((state) => {
             state.[items] = items;
           }),

         add[Item]: (item) =>
           set((state) => {
             state.[items].push(item);
           }),

         update[Item]: (id, data) =>
           set((state) => {
             const index = state.[items].findIndex((item) => item.id === id);
             if (index !== -1) {
               state.[items][index] = { ...state.[items][index], ...data };
             }
           }),

         remove[Item]: (id) =>
           set((state) => {
             state.[items] = state.[items].filter((item) => item.id !== id);
           }),

         setLoading: (loading) =>
           set((state) => {
             state.loading = loading;
           }),

         setError: (error) =>
           set((state) => {
             state.error = error;
           }),

         reset: () => set(initialState),
       })),
       {
         name: '[name]-storage',
         // skipHydration: true, // Descomentar si es necesario
       }
     )
   );
   ```

4. **Incluir**:
   - Tipos TypeScript estrictos
   - Uso de immer para inmutabilidad
   - Persist middleware si es necesario
   - Estado de loading y error

¡Listo para crear el store!
