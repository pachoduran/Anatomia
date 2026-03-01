# VetBones - PRD (Product Requirements Document)

## Problem Statement
Mobile application in Spanish for veterinary students to study the skeletal system of animals, starting with the horse. Hierarchical navigation through anatomical divisions, with quiz and study modes featuring specific images per region.

## Core Features
- **Quiz Mode**: Multiple-choice identification of highlighted bones on anatomical images
- **Study Mode**: View all bones labeled on images with descriptions
- **Multi-View System**: Complex regions have multiple anatomical views (dorsal, ventral, lateral, etc.)
- **Offline-First**: All data and images bundled locally, no backend required
- **Safe Area UI**: Proper handling of device notches and system bars

## Architecture
- **Framework**: Expo (React Native) with expo-router (file-based routing)
- **Data**: All data in `frontend/app/data.ts`, images mapped in `frontend/app/localImages.ts`
- **Images**: Stored in `frontend/assets/images/`, loaded via `require()`
- **Backend**: DEPRECATED and removed - 100% offline app

## Current State (Feb 2026)

### Completed
- Full offline migration from backend to frontend-only
- Skull multi-view feature (5 views: Dorsal, Ventral, Lateral, Caudal, Rostral)
- Safe area layout fix with `react-native-safe-area-context`
- Dynamic region count on home page
- **NEW REGIONS ADDED (Feb 2026)**:
  - **A. Cabeza y Cuello**: 4 views (Lateral, Dorsal, Ventral, Nucal) - Focus on atlanto-occipital joint
  - **B. El Tronco (Barril y Dorso)**: 2 views (Dorsal, Lateral) - Focus on Cruz, ribs, thoracic/lumbar spine
  - **C. Extremidades subdivided**:
    - Encuentro y Espalda (Scapula + Humerus)
    - Brazo y Antebrazo (Radius + Ulna)
    - Carpo/Tarso: 2 views (Dorsal, Palmar/Plantar)
    - Region del Dedo: 2 views (Dorsopalmar, Oblicua)

### Total Regions: 11
- Axial (5): Craneo y Cara, Cabeza y Cuello, El Tronco, Columna Vertebral, Caja Toracica
- Apendicular (6): Encuentro y Espalda, Brazo y Antebrazo, Carpo y Tarso, Region del Dedo, Miembro Anterior, Miembro Posterior

## Backlog
- P1: Expand to other animals
- P2: User registration and progress tracking
- P2: Delete obsolete backend directory
- P3: Move non-route files (SafeScreen.tsx, ExamShared.tsx, data.ts) out of /app directory to avoid Expo warnings

## Key Files
- `frontend/app/data.ts` - All anatomical data
- `frontend/app/localImages.ts` - Image mappings
- `frontend/app/SafeScreen.tsx` - Safe area wrapper
- `frontend/app/ExamShared.tsx` - Quiz component
- `frontend/app/_layout.tsx` - Root layout
- `frontend/app/index.tsx` - Home screen
