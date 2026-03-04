# MorphoVet - PRD

## Declaracion del Problema
Aplicacion movil en espanol para estudiantes de veterinaria para estudiar el sistema esqueletico de animales, empezando por el caballo.

## Arquitectura
- **Frontend**: Expo (React Native) - aplicacion offline-first
- **Backend**: FastAPI (obsoleto - no se usa activamente)
- **Datos**: Todos los datos en `frontend/app/data.ts` (offline)
- **Imagenes**: Bundled en `frontend/assets/images/`
- **Routing**: expo-router (file-based)

## Funcionalidades Core
1. **Modo Estudio**: Imagen anatomica con marcadores interactivos
   - Todos los marcadores visibles como puntos pequenos
   - Al seleccionar un hueso (de la lista o tocando el marcador), se agranda
   - Zoom pinch-to-zoom en las imagenes
2. **Modo Examen/Quiz**: Pregunta con marcador unico, opciones multiples
3. **Sistema Multi-Vista**: 5 vistas del craneo (dorsal, ventral, lateral, caudal, rostral)
4. **Diccionario Anatomico**: Glosario de terminos con mini-quiz
5. **Modo Paisaje**: Layout responsivo 2/3 imagen, 1/3 controles
6. **Branding**: Logo MorphoVet, app icon y splash screen personalizados

## Lo Implementado
- Expansion masiva de contenido anatomico (~16 imagenes AI)
- Datos del craneo expandidos desde PDF del usuario (5 vistas detalladas)
- Modo paisaje completo
- Zoom pinch-to-zoom inline
- Diccionario anatomico
- Configuracion EAS Build para APK
- **[2024-03-04] Fix critico de marcadores**:
  - ZoomableImage actualizado para calcular limites reales de la imagen (corrige letterboxing)
  - Deteccion dinamica de aspect ratio (1408x768 y 1024x1024)
  - Coordenadas corregidas para TODAS las 5 vistas del craneo
  - Coordenadas corregidas para craneo general y cabeza/cuello
  - Marcadores ahora son Pressable (tap-to-select desde la imagen)
  - ExamShared.tsx corregido (referencia s.img eliminada)

## Testing
- Testing agent iteration 2: 100% frontend pass rate
- Verificado: Dorsal, Lateral, Ventral, General skull study, Exam mode, Navigation flow

## Backlog (Priorizado)
### P1
- Corregir coordenadas de marcadores para regiones NO-craneo (tronco, extremidades, etc.) - las posiciones actuales son aproximadas
- Eliminar directorio `backend/` obsoleto

### P2
- Visor de modelos 3D (react-three/fiber con expo-gl)
- Expandir a otros animales
- Sistema de registro y seguimiento de progreso

### P3
- Migrar coordenadas a porcentajes relativos (ya implementado) - posible refactor para persistencia
- Limpiar pantallas de examen antiguas que usan API del backend
