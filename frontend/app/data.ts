// Datos completos del esqueleto del caballo - 100% offline
import { getLocalImage } from './localImages';

export interface Bone {
  id: string; name: string; qty: number; desc: string;
  x: number; y: number; color: string;
}

export interface View {
  id: string; name: string; desc: string; imageKey: string;
  questions: Bone[];
}

export interface Region {
  id: string; name: string; desc: string; bones: number;
  imageKey: string; views?: View[]; questions: Bone[];
}

export interface Division {
  id: string; name: string; desc: string; bones: number; icon: string;
  regions: Region[];
}

export interface Animal {
  id: string; name: string; nameScientific: string; desc: string;
  totalBones: number; divisions: Division[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============ DATOS ============
const HORSE: Animal = {
  id: 'horse',
  name: 'Caballo',
  nameScientific: 'Equus caballus',
  desc: 'Estudio completo del sistema óseo equino',
  totalBones: 205,
  divisions: [
    {
      id: 'axial', name: 'Esqueleto Axial', desc: 'Cráneo, columna, tórax', bones: 81, icon: 'body',
      regions: [
        {
          id: 'craneo', name: 'Cráneo y Cara', desc: '34 huesos del cráneo y cara', bones: 34,
          imageKey: 'craneo',
          views: [
            {
              id: 'dorsal', name: 'Vista Dorsal (Desde arriba)',
              desc: 'Evalúa la simetría del cráneo desde arriba',
              imageKey: 'craneo_dorsal',
              questions: [
                { id: 'nasal_d', name: 'Huesos Nasales', qty: 2, desc: 'Unión de los huesos nasales en la línea media', x: 30, y: 25, color: 'Rojo' },
                { id: 'frontal_d', name: 'Huesos Frontales', qty: 2, desc: 'Grandes huesos planos que forman la frente', x: 50, y: 40, color: 'Azul' },
                { id: 'parietal_d', name: 'Huesos Parietales', qty: 2, desc: 'Parte superior-posterior del cráneo', x: 55, y: 60, color: 'Verde' },
                { id: 'orbita_d', name: 'Borde Orbital', qty: 2, desc: 'Borde óseo de las órbitas oculares visto desde arriba', x: 35, y: 45, color: 'Amarillo' },
                { id: 'cresta_d', name: 'Cresta Sagital', qty: 1, desc: 'Cresta ósea en la línea media posterior del cráneo', x: 50, y: 75, color: 'Naranja' },
              ]
            },
            {
              id: 'ventral', name: 'Vista Ventral (Desde abajo)',
              desc: 'La más compleja, muestra la base del cráneo',
              imageKey: 'craneo_ventral',
              questions: [
                { id: 'palatino_v', name: 'Huesos Palatinos', qty: 2, desc: 'Forman el paladar duro posterior', x: 40, y: 35, color: 'Rojo' },
                { id: 'vomer_v', name: 'Vómer', qty: 1, desc: 'Hueso impar que divide las coanas', x: 50, y: 25, color: 'Azul' },
                { id: 'esfenoides_v', name: 'Esfenoides', qty: 1, desc: 'Hueso complejo en la base del cráneo', x: 50, y: 55, color: 'Verde' },
                { id: 'condilo_v', name: 'Cóndilos del Occipital', qty: 2, desc: 'Articulación con la primera vértebra cervical (Atlas)', x: 50, y: 80, color: 'Amarillo' },
                { id: 'maxilar_v', name: 'Maxilar (filas dentales)', qty: 2, desc: 'Filas de molares y premolares superiores', x: 30, y: 45, color: 'Naranja' },
                { id: 'coanas_v', name: 'Coanas', qty: 2, desc: 'Aberturas posteriores de las fosas nasales', x: 50, y: 20, color: 'Morado' },
              ]
            },
            {
              id: 'lateral', name: 'Vista Lateral (De perfil)',
              desc: 'La más común, muestra la extensión completa de la cara',
              imageKey: 'craneo_lateral',
              questions: [
                { id: 'maxilar_l', name: 'Maxilar', qty: 2, desc: 'Hueso grande que contiene los dientes superiores', x: 25, y: 50, color: 'Morado' },
                { id: 'premaxilar_l', name: 'Premaxilar (Incisivo)', qty: 2, desc: 'Porción anterior que contiene los incisivos superiores', x: 10, y: 55, color: 'Rojo' },
                { id: 'lagrimal_l', name: 'Hueso Lagrimal', qty: 2, desc: 'Pequeño hueso en el borde anterior de la órbita', x: 40, y: 30, color: 'Azul' },
                { id: 'cigomatico_l', name: 'Hueso Cigomático', qty: 2, desc: 'Forma el pómulo y parte del arco cigomático', x: 50, y: 45, color: 'Verde' },
                { id: 'mandibula_l', name: 'Mandíbula', qty: 2, desc: 'Hueso móvil inferior que contiene dientes', x: 35, y: 70, color: 'Amarillo' },
                { id: 'arco_l', name: 'Arco Cigomático', qty: 2, desc: 'Puente óseo lateral del cráneo', x: 60, y: 40, color: 'Naranja' },
                { id: 'diastema_l', name: 'Diastema (Barras)', qty: 2, desc: 'Espacio entre incisivos y premolares donde se coloca el bocado', x: 20, y: 60, color: 'Rojo' },
              ]
            },
            {
              id: 'caudal', name: 'Vista Caudal (Desde atrás)',
              desc: 'Conexión con la columna vertebral',
              imageKey: 'craneo_caudal',
              questions: [
                { id: 'occipital_c', name: 'Hueso Occipital', qty: 1, desc: 'Gran hueso posterior del cráneo', x: 50, y: 40, color: 'Rojo' },
                { id: 'interparietal_c', name: 'Hueso Interparietal', qty: 1, desc: 'Pequeño hueso entre parietales y occipital', x: 50, y: 20, color: 'Azul' },
                { id: 'foramen_c', name: 'Foramen Magnum', qty: 1, desc: 'Gran abertura por donde pasa la médula espinal', x: 50, y: 60, color: 'Verde' },
                { id: 'cresta_nucal_c', name: 'Cresta Nucal', qty: 1, desc: 'Cresta donde se insertan ligamentos del cuello', x: 50, y: 10, color: 'Amarillo' },
                { id: 'condilos_c', name: 'Cóndilos Occipitales', qty: 2, desc: 'Superficies articulares para el Atlas (C1)', x: 35, y: 70, color: 'Naranja' },
              ]
            },
            {
              id: 'rostral', name: 'Vista Rostral (De frente)',
              desc: 'Punta de la nariz y boca',
              imageKey: 'craneo_rostral',
              questions: [
                { id: 'incisivo_r', name: 'Hueso Incisivo', qty: 2, desc: 'Contiene los dientes incisivos superiores', x: 50, y: 70, color: 'Rojo' },
                { id: 'apertura_r', name: 'Apertura Nasal Ósea', qty: 1, desc: 'Abertura nasal formada por huesos nasales e incisivos', x: 50, y: 30, color: 'Azul' },
                { id: 'infraorbitario_r', name: 'Canal Infraorbitario', qty: 2, desc: 'Foramen por donde pasa el nervio infraorbitario', x: 30, y: 50, color: 'Verde' },
                { id: 'incisivos_dientes_r', name: 'Dientes Incisivos', qty: 6, desc: 'Disposición de los 6 incisivos superiores', x: 50, y: 85, color: 'Amarillo' },
              ]
            }
          ],
          questions: [
            { id: 'frontal', name: 'Hueso Frontal', qty: 2, desc: 'Parte superior del cráneo, forma la frente', x: 40, y: 15, color: 'Rojo' },
            { id: 'parietal', name: 'Hueso Parietal', qty: 2, desc: 'Detrás del frontal, parte superior-posterior del cráneo', x: 60, y: 20, color: 'Azul' },
            { id: 'temporal', name: 'Hueso Temporal', qty: 2, desc: 'Lateral del cráneo, contiene el oído', x: 70, y: 40, color: 'Verde' },
            { id: 'occipital', name: 'Hueso Occipital', qty: 1, desc: 'Posterior del cráneo, conecta con Atlas', x: 80, y: 35, color: 'Amarillo' },
            { id: 'nasal', name: 'Hueso Nasal', qty: 2, desc: 'Forma el puente de la nariz', x: 15, y: 30, color: 'Naranja' },
            { id: 'maxilar', name: 'Maxilar Superior', qty: 2, desc: 'Contiene los dientes superiores', x: 25, y: 50, color: 'Morado' },
            { id: 'mandibula', name: 'Mandíbula', qty: 2, desc: 'Hueso móvil inferior con dientes', x: 35, y: 70, color: 'Rojo' },
            { id: 'orbita', name: 'Órbita Ocular', qty: 2, desc: 'Cavidad donde se aloja el ojo', x: 30, y: 35, color: 'Azul' },
          ]
        },
        {
          id: 'columna', name: 'Columna Vertebral', desc: '54 vértebras del cuello a la cola', bones: 54,
          imageKey: 'columna',
          questions: [
            { id: 'cervicales', name: 'Vértebras Cervicales (C1-C7)', qty: 7, desc: '7 vértebras del cuello, incluyendo Atlas y Axis', x: 15, y: 45, color: 'Rojo' },
            { id: 'toracicas', name: 'Vértebras Torácicas (T1-T18)', qty: 18, desc: '18 vértebras que se articulan con las costillas', x: 40, y: 35, color: 'Azul' },
            { id: 'lumbares', name: 'Vértebras Lumbares (L1-L6)', qty: 6, desc: '6 vértebras del lomo, sin costillas', x: 60, y: 40, color: 'Verde' },
            { id: 'sacro', name: 'Sacro (5 fusionadas)', qty: 5, desc: 'Vértebras fusionadas de la grupa', x: 75, y: 45, color: 'Amarillo' },
            { id: 'coccigeas', name: 'Vértebras Coccígeas', qty: 18, desc: 'Vértebras de la cola (15-21)', x: 90, y: 50, color: 'Naranja' },
          ]
        },
        {
          id: 'torax', name: 'Caja Torácica', desc: 'Costillas y esternón - 37 huesos', bones: 37,
          imageKey: 'torax',
          questions: [
            { id: 'costillas', name: 'Costillas (18 pares)', qty: 36, desc: 'Protegen órganos vitales, 8 verdaderas + 10 falsas', x: 42, y: 42, color: 'Azul' },
            { id: 'esternon', name: 'Esternón', qty: 1, desc: 'Hueso del pecho donde se unen las costillas', x: 35, y: 62, color: 'Rojo' },
          ]
        }
      ]
    },
    {
      id: 'apendicular', name: 'Esqueleto Apendicular', desc: 'Patas delanteras y traseras', bones: 120, icon: 'walk',
      regions: [
        {
          id: 'anterior', name: 'Miembro Anterior', desc: 'Pata delantera - 40 huesos', bones: 40,
          imageKey: 'anterior',
          questions: [
            { id: 'escapula', name: 'Escápula (Omóplato)', qty: 2, desc: 'Hueso plano triangular del hombro', x: 30, y: 10, color: 'Rojo' },
            { id: 'humero', name: 'Húmero', qty: 2, desc: 'Hueso del brazo', x: 35, y: 25, color: 'Azul' },
            { id: 'radio', name: 'Radio', qty: 2, desc: 'Hueso principal del antebrazo', x: 40, y: 40, color: 'Verde' },
            { id: 'cubito', name: 'Cúbito (Ulna)', qty: 2, desc: 'Forma el codo (olécranon)', x: 45, y: 35, color: 'Amarillo' },
            { id: 'carpo', name: 'Carpo (Rodilla)', qty: 14, desc: '7-8 huesos pequeños de la rodilla', x: 42, y: 55, color: 'Naranja' },
            { id: 'metacarpo', name: 'Metacarpo (Caña)', qty: 2, desc: 'Hueso largo de la caña', x: 45, y: 68, color: 'Morado' },
            { id: 'falanges_a', name: 'Falanges (Cuartilla, Corona, Tejuelo)', qty: 6, desc: 'Dedos que terminan en el casco', x: 48, y: 85, color: 'Rojo' },
          ]
        },
        {
          id: 'posterior', name: 'Miembro Posterior', desc: 'Pata trasera - 80 huesos', bones: 80,
          imageKey: 'posterior',
          questions: [
            { id: 'pelvis', name: 'Pelvis (Ilion/Isquion/Pubis)', qty: 6, desc: 'Huesos de la cadera', x: 25, y: 15, color: 'Rojo' },
            { id: 'femur', name: 'Fémur', qty: 2, desc: 'Hueso del muslo, el más fuerte', x: 45, y: 30, color: 'Azul' },
            { id: 'rotula', name: 'Rótula (Patela)', qty: 2, desc: 'Hueso de la rodilla verdadera', x: 40, y: 42, color: 'Verde' },
            { id: 'tibia', name: 'Tibia', qty: 2, desc: 'Hueso de la pierna', x: 50, y: 52, color: 'Amarillo' },
            { id: 'tarso', name: 'Tarso (Corvejón)', qty: 12, desc: '6 huesos del corvejón por lado', x: 55, y: 65, color: 'Naranja' },
            { id: 'metatarso', name: 'Metatarso (Caña)', qty: 2, desc: 'Caña de la pata trasera', x: 58, y: 75, color: 'Morado' },
            { id: 'falanges_p', name: 'Falanges Posteriores', qty: 6, desc: 'Dedos de la pata trasera', x: 60, y: 90, color: 'Rojo' },
          ]
        }
      ]
    }
  ]
};

export const ANIMALS: Animal[] = [HORSE];

// ============ HELPERS ============

export function getAnimal(id: string): Animal | undefined {
  return ANIMALS.find(a => a.id === id);
}

export function getDivisions(animalId: string): Division[] {
  return getAnimal(animalId)?.divisions || [];
}

export function getRegions(animalId: string, divisionId: string): Region[] {
  return getAnimal(animalId)?.divisions.find(d => d.id === divisionId)?.regions || [];
}

export function getRegion(animalId: string, divisionId: string, regionId: string): Region | undefined {
  return getRegions(animalId, divisionId).find(r => r.id === regionId);
}

export function getView(animalId: string, divisionId: string, regionId: string, viewId: string): View | undefined {
  return getRegion(animalId, divisionId, regionId)?.views?.find(v => v.id === viewId);
}

export function generateExam(questions: Bone[], allRegionNames: string[], num: number = 5) {
  const selected = shuffleArray(questions).slice(0, Math.min(num, questions.length));
  const regionNames = questions.map(q => q.name);

  return selected.map(bone => {
    const sameRegion = regionNames.filter(n => n !== bone.name);
    const shuffled = shuffleArray(sameRegion);
    let distractors = shuffled.slice(0, 3);
    if (distractors.length < 3) {
      const extra = shuffleArray(allRegionNames.filter(n => n !== bone.name && !distractors.includes(n)));
      distractors = [...distractors, ...extra.slice(0, 3 - distractors.length)];
    }
    const options = shuffleArray([bone.name, ...distractors]);
    return { ...bone, options, answer: bone.name };
  });
}

export function getDivisionBoneNames(animalId: string, divisionId: string): string[] {
  const regions = getRegions(animalId, divisionId);
  const names: string[] = [];
  regions.forEach(r => r.questions.forEach(q => names.push(q.name)));
  return names;
}
