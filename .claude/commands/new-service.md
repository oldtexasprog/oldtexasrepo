Crea un nuevo servicio de datos para interactuar con Firebase Firestore.

## Instrucciones

1. **Pregunta al usuario**:
   - Nombre del servicio (ej: "pedidos", "usuarios")
   - Colección de Firestore
   - Operaciones necesarias (CRUD)

2. **Crea el archivo** en `lib/services/[nombre]Service.ts`

3. **Estructura del servicio**:

   ```typescript
   import { db } from '@/lib/firebase/config';
   import {
     collection,
     doc,
     getDoc,
     getDocs,
     addDoc,
     updateDoc,
     deleteDoc,
     query,
     where
   } from 'firebase/firestore';
   import type { [Entity] } from '@/lib/types';

   const COLLECTION_NAME = '[collection]';

   export const [entity]Service = {
     async getAll(): Promise<[Entity][]> {
       try {
         // Implementación
       } catch (error) {
         console.error('Error getting [entities]:', error);
         throw error;
       }
     },

     async getById(id: string): Promise<[Entity] | null> {
       try {
         // Implementación
       } catch (error) {
         console.error('Error getting [entity]:', error);
         throw error;
       }
     },

     async create(data: Omit<[Entity], 'id'>): Promise<string> {
       try {
         // Implementación
       } catch (error) {
         console.error('Error creating [entity]:', error);
         throw error;
       }
     },

     async update(id: string, data: Partial<[Entity]>): Promise<void> {
       try {
         // Implementación
       } catch (error) {
         console.error('Error updating [entity]:', error);
         throw error;
       }
     },

     async delete(id: string): Promise<void> {
       try {
         // Implementación
       } catch (error) {
         console.error('Error deleting [entity]:', error);
         throw error;
       }
     },
   };
   ```

4. **Incluir**:
   - Try-catch en todas las operaciones
   - Tipos de `lib/types/index.ts`
   - Logging de errores
   - JSDoc para documentación

¡Listo para crear el servicio!
