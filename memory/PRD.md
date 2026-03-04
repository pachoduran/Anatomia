# MorphoVet - PRD

## Problem Statement
Mobile app in Spanish for veterinary students to study the skeletal system of the horse, with quiz and study modes, offline-first.

## Current State (Mar 2026)

### Completed
- Full offline architecture (Expo/React Native)
- 11 anatomical regions with multiple views
- Dictionary with glossary + mini-quiz (8 terms)
- **Landscape mode**: Adaptive layout (2/3 image, 1/3 controls)
- **Safe area lateral insets** for landscape on devices with notches
- **Compact landscape UI** for study/exam screens
- **Logo MorphoVet** as app icon, splash, and home branding
- **Build config**: app.json + eas.json ready for APK/AAB (SDK 35)
- **Expanded skull data from PDF**: 22 structures ventral, 18 lateral, 8 dorsal, 9 caudal, 6 rostral + 15 general
- **Zoom**: ZoomableImage component with fullscreen modal, pinch-to-zoom, pan, +/- buttons
- **react-native-gesture-handler** for native zoom gestures

### Key Files
- `app/data.ts` - All anatomical data (expanded skull)
- `app/localImages.ts` - Image mappings
- `app/ZoomableImage.tsx` - Zoom component
- `app/useOrientation.ts` - Orientation hook
- `app/ExamShared.tsx` - Quiz (landscape + zoom)
- `app/SafeScreen.tsx` - Safe area with lateral insets
- `app.json` / `eas.json` - Build config

## Backlog
- P1: Expand to other animals
- P1: Interactive view rotation (swipe between views)
- P2: User registration and progress tracking
