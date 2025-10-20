Realiza una revisión de calidad del código siguiendo las reglas del proyecto.

## Instrucciones

1. **Ejecuta verificaciones**:
   - `npm run lint` - Verificar errores de ESLint
   - `npm run build` - Verificar que compila sin errores
   - Revisar archivos TypeScript sin tipado `any`

2. **Verifica cumplimiento de reglas**:
   - ✅ Componentes no exceden 200 líneas
   - ✅ Todos los tipos están definidos
   - ✅ No hay console.logs innecesarios
   - ✅ Código está formateado con Prettier
   - ✅ Imports están organizados
   - ✅ No hay TODOs pendientes críticos

3. **Revisa estructura**:
   - Archivos en carpetas correctas
   - Nomenclatura consistente
   - Componentes reutilizables en `components/`
   - Servicios en `lib/services/`

4. **Genera reporte**:
   - ⚠️ Warnings encontrados
   - ❌ Errores críticos
   - ✅ Elementos que cumplen estándares
   - 💡 Sugerencias de mejora

5. **Si hay errores**:
   - Listar por prioridad
   - Sugerir soluciones
   - Mostrar archivos afectados

¡Ejecutando revisión de calidad!
