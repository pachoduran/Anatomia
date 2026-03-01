// Imágenes locales del caballo - disponibles offline
const HORSE_IMAGES: { [key: string]: any } = {
  craneo: require('../assets/images/horse_skull.jpg'),
  columna: require('../assets/images/horse_spine.jpg'),
  torax: require('../assets/images/horse_thorax.jpg'),
  anterior: require('../assets/images/horse_forelimb.jpg'),
  posterior: require('../assets/images/horse_hindlimb.jpg'),
  // Vistas del cráneo
  'craneo_dorsal': require('../assets/images/horse_skull_dorsal.jpg'),
  'craneo_ventral': require('../assets/images/horse_skull_ventral.jpg'),
  'craneo_lateral': require('../assets/images/horse_skull_lateral.jpg'),
  'craneo_caudal': require('../assets/images/horse_skull_caudal.jpg'),
  'craneo_rostral': require('../assets/images/horse_skull_rostral.jpg'),
};

export function getLocalImage(regionId: string, viewId?: string): any {
  if (viewId) {
    return HORSE_IMAGES[`${regionId}_${viewId}`] || HORSE_IMAGES[regionId] || null;
  }
  return HORSE_IMAGES[regionId] || null;
}

export default HORSE_IMAGES;
