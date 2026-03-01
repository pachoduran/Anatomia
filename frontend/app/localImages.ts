// Imágenes locales del caballo - disponibles offline
const HORSE_IMAGES: { [key: string]: any } = {
  // Regiones principales existentes
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
  // Cabeza y Cuello
  cabeza_cuello: require('../assets/images/horse_head_neck.jpg'),
  'cabeza_cuello_lateral': require('../assets/images/horse_head_neck_lateral.jpg'),
  'cabeza_cuello_dorsal': require('../assets/images/horse_head_neck_dorsal.jpg'),
  'cabeza_cuello_ventral': require('../assets/images/horse_head_neck_ventral.jpg'),
  'cabeza_cuello_nucal': require('../assets/images/horse_head_neck_nucal.jpg'),
  // El Tronco
  tronco: require('../assets/images/horse_trunk.jpg'),
  'tronco_dorsal': require('../assets/images/horse_trunk_dorsal.jpg'),
  'tronco_lateral': require('../assets/images/horse_trunk_lateral.jpg'),
  // Extremidades - Encuentro y Espalda
  encuentro: require('../assets/images/horse_shoulder.jpg'),
  // Extremidades - Brazo y Antebrazo
  antebrazo: require('../assets/images/horse_forearm.jpg'),
  // Extremidades - Carpo/Tarso
  carpo_tarso: require('../assets/images/horse_carpus.jpg'),
  'carpo_tarso_dorsal': require('../assets/images/horse_carpus_dorsal.jpg'),
  'carpo_tarso_palmar': require('../assets/images/horse_carpus_palmar.jpg'),
  // Extremidades - Dedo
  dedo: require('../assets/images/horse_digit.jpg'),
  'dedo_dorsopalmar': require('../assets/images/horse_digit_dorsopalmar.jpg'),
  'dedo_oblicua': require('../assets/images/horse_digit_oblique.jpg'),
  // Diccionario anatomico
  direcciones: require('../assets/images/horse_directions.jpg'),
};

export function getLocalImage(regionId: string, viewId?: string): any {
  if (viewId) {
    return HORSE_IMAGES[`${regionId}_${viewId}`] || HORSE_IMAGES[regionId] || null;
  }
  return HORSE_IMAGES[regionId] || null;
}

export default HORSE_IMAGES;
