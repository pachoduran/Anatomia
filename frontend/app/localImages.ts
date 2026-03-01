// Imágenes locales del caballo - disponibles offline
const HORSE_IMAGES: { [key: string]: any } = {
  craneo: require('../assets/images/horse_skull.jpg'),
  columna: require('../assets/images/horse_spine.jpg'),
  torax: require('../assets/images/horse_thorax.jpg'),
  anterior: require('../assets/images/horse_forelimb.jpg'),
  posterior: require('../assets/images/horse_hindlimb.jpg'),
};

export function getLocalImage(regionId: string): any {
  return HORSE_IMAGES[regionId] || null;
}

export default HORSE_IMAGES;
