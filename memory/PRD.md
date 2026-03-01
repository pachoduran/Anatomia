# VetBones - PRD

## Problem Statement
App móvil en español para estudiantes de veterinaria para estudiar el sistema óseo de animales, comenzando con el caballo. Estructurada jerárquicamente con imágenes específicas por región anatómica.

## Architecture
- **Frontend-only**: Expo (React Native) - 100% offline, sin backend
- **Data**: Embebida en `data.ts` con tipos TypeScript
- **Images**: Bundled con `require()` en `localImages.ts` para uso offline

## Implemented (Mar 1, 2026)
- ✅ Navegación jerárquica (Home → División → Región → Quiz/Estudio)
- ✅ 205 huesos del caballo organizados en 5 regiones
- ✅ 10 imágenes AI anatómicas (5 regiones + 5 vistas del cráneo)
- ✅ 5 vistas del cráneo (Dorsal, Ventral, Lateral, Caudal, Rostral)
- ✅ Modo Estudio con marcadores y etiquetas
- ✅ Quiz contextualizado (opciones solo de la misma región)
- ✅ 100% offline - datos e imágenes embebidos en la app
- ✅ Layout reducido para Android (padding superior/inferior)
- ✅ Componente ExamShared reutilizable

## Key Files
- `frontend/app/data.ts` - Todos los datos anatómicos
- `frontend/app/localImages.ts` - Mapa de imágenes locales
- `frontend/app/ExamShared.tsx` - Componente de examen compartido
- `frontend/assets/images/` - 10 imágenes anatómicas

## Backlog
- P1: Expandir a otros animales
- P2: Más vistas para otras regiones (Columna, Miembros)
- P2: Sistema de registro y progreso
- P3: Quiz cronometrado
