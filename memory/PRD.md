# VetBones - PRD (Product Requirements Document)

## Problem Statement
Mobile application in Spanish for veterinary students to study the skeletal system of animals, starting with the horse. Hierarchical navigation through anatomical divisions, with quiz and study modes featuring specific images per region.

## Core Features
- **Quiz Mode**: Multiple-choice identification of highlighted bones on anatomical images
- **Study Mode**: View all bones labeled on images with descriptions
- **Multi-View System**: Complex regions have multiple anatomical views
- **Offline-First**: All data and images bundled locally, no backend required
- **Safe Area UI**: Proper handling of device notches and system bars
- **Anatomical Dictionary**: Glossary + Mini-Quiz for anatomical terminology
- **Landscape Mode**: Adaptive layout - image left (>50% screen), controls right in horizontal orientation

## Architecture
- **Framework**: Expo (React Native) with expo-router (file-based routing)
- **Data**: All data in `frontend/app/data.ts`, images mapped in `frontend/app/localImages.ts`
- **Images**: Stored in `frontend/assets/images/`, loaded via `require()`
- **Backend**: DEPRECATED - 100% offline app

## Current State (Mar 2026)

### Completed
- Full offline migration
- Skull multi-view (5 views)
- Safe area layout fix
- Dynamic region count (11 regions)
- **New regions**: Cabeza y Cuello (4 views), El Tronco (2 views), Encuentro y Espalda, Brazo y Antebrazo, Carpo/Tarso (2 views), Region del Dedo (2 views)
- **Dictionary**: Glossary + Mini-Quiz for 8 anatomical terms
- **Landscape Mode**: All screens adapt to horizontal orientation. Image >50% in landscape, controls on the right side
- **Build Config**: app.json + eas.json configured for APK/AAB builds with SDK 35

### Total Regions: 11
- Axial (5): Craneo y Cara, Cabeza y Cuello, El Tronco, Columna Vertebral, Caja Toracica
- Apendicular (6): Encuentro y Espalda, Brazo y Antebrazo, Carpo y Tarso, Region del Dedo, Miembro Anterior, Miembro Posterior

## Backlog
- P1: Expand to other animals
- P1: Interactive view rotation (swipe between views simulating 3D)
- P2: User registration and progress tracking
- P2: Delete obsolete backend directory

## Key Files
- `frontend/app/data.ts` - All anatomical data
- `frontend/app/localImages.ts` - Image mappings
- `frontend/app/useOrientation.ts` - Orientation detection hook
- `frontend/app/ExamShared.tsx` - Quiz component (landscape-aware)
- `frontend/app/dictionary.tsx` - Dictionary screen
- `frontend/app/SafeScreen.tsx` - Safe area wrapper
- `frontend/app/_layout.tsx` - Root layout
- `frontend/app.json` - Expo config with build properties
- `frontend/eas.json` - EAS build profiles (APK/AAB)
