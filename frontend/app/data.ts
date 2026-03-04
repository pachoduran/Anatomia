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
  desc: 'Estudio completo del sistema oseo equino',
  totalBones: 205,
  divisions: [
    {
      id: 'axial', name: 'Esqueleto Axial', desc: 'Craneo, columna, torax', bones: 81, icon: 'body',
      regions: [
        {
          id: 'craneo', name: 'Craneo y Cara', desc: '34+ huesos del craneo y cara', bones: 34,
          imageKey: 'craneo',
          views: [
            {
              id: 'dorsal', name: 'Vista Dorsal (Desde arriba)',
              desc: 'Evalua la simetria del craneo, boveda craneal',
              imageKey: 'craneo_dorsal',
              questions: [
                { id: 'cresta_sag_d', name: 'Cresta Sagital Externa', qty: 1, desc: 'Cresta prominente en la linea media dorsal del craneo', x: 70, y: 42, color: 'Rojo' },
                { id: 'parietal_d', name: 'Hueso Parietal', qty: 2, desc: 'Forma la boveda del craneo, detras del frontal', x: 62, y: 38, color: 'Azul' },
                { id: 'frontal_d', name: 'Hueso Frontal', qty: 2, desc: 'Grandes huesos planos que forman la frente', x: 45, y: 33, color: 'Verde' },
                { id: 'supraorb_d', name: 'Agujero Supraorbitario', qty: 2, desc: 'Canales supraorbitarios por donde pasan nervios y vasos', x: 40, y: 50, color: 'Amarillo' },
                { id: 'nasal_d', name: 'Hueso Nasal', qty: 2, desc: 'Forma el puente de la nariz', x: 25, y: 34, color: 'Naranja' },
                { id: 'proc_rostr_d', name: 'Procesos Rostrales del Nasal', qty: 2, desc: 'Extensiones anteriores del hueso nasal', x: 16, y: 36, color: 'Morado' },
                { id: 'incisivo_d', name: 'Hueso Incisivo', qty: 2, desc: 'Forma la escotadura nasoincisiva', x: 9, y: 42, color: 'Rojo' },
                { id: 'proc_palat_inc_d', name: 'Procesos Palatinos del Incisivo', qty: 2, desc: 'Contribuyen a formar el paladar oseo', x: 11, y: 38, color: 'Azul' },
              ]
            },
            {
              id: 'ventral', name: 'Vista Ventral (Desde abajo)',
              desc: 'La mas compleja: base del craneo, paladar y esfenoides',
              imageKey: 'craneo_ventral',
              questions: [
                { id: 'diastema_v', name: 'Diastema', qty: 2, desc: 'Espacio sin dientes entre incisivos y premolares (donde va el bocado)', x: 22, y: 45, color: 'Rojo' },
                { id: 'canal_interinc_v', name: 'Canal Interincisivo', qty: 1, desc: 'Solo en caballos, conducto en el hueso incisivo', x: 12, y: 52, color: 'Azul' },
                { id: 'proc_alveolar_v', name: 'Procesos Alveolares', qty: 2, desc: 'Porciones del maxilar que contienen los alveolos dentarios', x: 30, y: 55, color: 'Verde' },
                { id: 'borde_interalv_v', name: 'Bordes Interalveolares', qty: 2, desc: 'Crestas oseas entre los alveolos de los dientes', x: 55, y: 55, color: 'Amarillo' },
                { id: 'proc_palat_max_v', name: 'Proceso Palatino del Maxilar', qty: 2, desc: 'Mayor parte del paladar oseo', x: 38, y: 45, color: 'Naranja' },
                { id: 'palatino_v', name: 'Hueso Palatino', qty: 2, desc: 'Formado por 2 laminas perpendiculares y 1 horizontal', x: 48, y: 42, color: 'Morado' },
                { id: 'lam_horiz_palat_v', name: 'Lamina Horizontal del Palatino', qty: 2, desc: 'Completa la parte posterior del paladar duro', x: 52, y: 40, color: 'Rojo' },
                { id: 'fisuras_palat_v', name: 'Fisuras Palatinas', qty: 2, desc: 'Aberturas en el paladar oseo', x: 18, y: 48, color: 'Azul' },
                { id: 'foram_palat_v', name: 'Foramenes Palatinos Mayores', qty: 2, desc: 'Paso de la arteria palatina mayor', x: 45, y: 38, color: 'Verde' },
                { id: 'vomer_v', name: 'Vomer (Tabique Nasal)', qty: 1, desc: 'Hueso impar que forma parte del tabique nasal', x: 55, y: 35, color: 'Amarillo' },
                { id: 'terigoides_v', name: 'Hueso Terigoides', qty: 2, desc: 'Pequeno hueso con gancho (hamulus) lateral al palatino', x: 52, y: 32, color: 'Naranja' },
                { id: 'ganchos_terig_v', name: 'Ganchos del Terigoides', qty: 2, desc: 'Procesos en forma de gancho del hueso terigoides', x: 58, y: 34, color: 'Morado' },
                { id: 'presfenoides_v', name: 'Porcion Presfenoides', qty: 1, desc: 'Parte anterior del esfenoides', x: 60, y: 30, color: 'Rojo' },
                { id: 'basiesfenoides_v', name: 'Porcion Basiesfenoides', qty: 1, desc: 'Parte posterior del esfenoides', x: 65, y: 28, color: 'Azul' },
                { id: 'sincondrosis_v', name: 'Sincondrosis Interesfenoidal', qty: 1, desc: 'Union cartilaginosa entre presfenoides y basiesfenoides', x: 62, y: 29, color: 'Verde' },
                { id: 'alas_esfen_v', name: 'Alas del Esfenoides', qty: 2, desc: 'Extensiones laterales del esfenoides', x: 58, y: 25, color: 'Amarillo' },
                { id: 'tuberc_musc_v', name: 'Tuberculo Muscular', qty: 2, desc: 'Protuberancia para insercion muscular en el esfenoides', x: 62, y: 22, color: 'Naranja' },
                { id: 'porcion_basilar_v', name: 'Porcion Basilar del Occipital', qty: 1, desc: 'Base del hueso occipital', x: 72, y: 32, color: 'Morado' },
                { id: 'porcion_basioccip_v', name: 'Porcion Basioccipital', qty: 1, desc: 'Superficie ventral del occipital frente al foramen magno', x: 75, y: 35, color: 'Rojo' },
                { id: 'foram_magno_v', name: 'Foramen Magno', qty: 1, desc: 'Gran abertura para la medula espinal', x: 78, y: 40, color: 'Azul' },
                { id: 'condilos_v', name: 'Condilos del Occipital', qty: 2, desc: 'Articulacion con el Atlas (C1)', x: 80, y: 45, color: 'Verde' },
                { id: 'aguj_estilomast_v', name: 'Agujero Estilomastoides', qty: 2, desc: 'Salida del nervio facial (VII)', x: 70, y: 42, color: 'Amarillo' },
              ]
            },
            {
              id: 'lateral', name: 'Vista Lateral (De perfil)',
              desc: 'La mas comun, porcion lateral con parietal y temporal',
              imageKey: 'craneo_lateral',
              questions: [
                { id: 'parietal_l', name: 'Hueso Parietal', qty: 2, desc: 'Porcion superior-lateral del craneo', x: 62, y: 20, color: 'Rojo' },
                { id: 'temporal_l', name: 'Hueso Temporal', qty: 2, desc: 'Porcion lateral del craneo, contiene el oido', x: 72, y: 28, color: 'Azul' },
                { id: 'petrosa_l', name: 'Porcion Petrosa del Temporal', qty: 2, desc: 'Alberga el oido interno, hueso mas duro del craneo', x: 76, y: 33, color: 'Verde' },
                { id: 'timpanica_l', name: 'Porcion Timpanica del Temporal', qty: 2, desc: 'Rodea la cavidad del oido medio', x: 74, y: 37, color: 'Amarillo' },
                { id: 'escamosa_l', name: 'Porcion Escamosa del Temporal', qty: 2, desc: 'Parte plana y delgada del temporal', x: 68, y: 24, color: 'Naranja' },
                { id: 'proc_cig_temp_l', name: 'Proceso Cigomatico del Temporal', qty: 2, desc: 'Proyeccion que forma parte del arco cigomatico', x: 60, y: 38, color: 'Morado' },
                { id: 'arco_cig_l', name: 'Arco Cigomatico', qty: 2, desc: 'Puente oseo formado por temporal y cigomatico', x: 54, y: 40, color: 'Rojo' },
                { id: 'proc_cig_front_l', name: 'Proceso Cigomatico del Frontal', qty: 2, desc: 'Proyeccion del frontal que contribuye a la orbita', x: 46, y: 28, color: 'Azul' },
                { id: 'frontal_l', name: 'Hueso Frontal', qty: 2, desc: 'Forma la frente del caballo', x: 42, y: 18, color: 'Verde' },
                { id: 'maxilar_l', name: 'Hueso Maxilar (Cuerpo)', qty: 2, desc: 'Hueso grande que contiene los dientes superiores', x: 28, y: 46, color: 'Amarillo' },
                { id: 'cresta_fac_l', name: 'Cresta Facial', qty: 2, desc: 'Cresta del maxilar, no la tienen carnivoros', x: 33, y: 40, color: 'Naranja' },
                { id: 'infraorb_l', name: 'Agujero Infraorbitario', qty: 2, desc: 'Entra por el agujero etmoidal/maxilar y sale aqui', x: 23, y: 38, color: 'Morado' },
                { id: 'lacrimal_l', name: 'Hueso Lacrimal', qty: 2, desc: 'Borde anterior de la orbita, con orificio lacrimal', x: 42, y: 30, color: 'Rojo' },
                { id: 'canal_nasolac_l', name: 'Canal Nasolacrimal', qty: 2, desc: 'Origen del canal por donde drenan las lagrimas', x: 44, y: 33, color: 'Azul' },
                { id: 'nasal_l', name: 'Hueso Nasal', qty: 2, desc: 'Forma el puente de la nariz', x: 20, y: 28, color: 'Verde' },
                { id: 'incisivo_l', name: 'Hueso Incisivo (Premaxilar)', qty: 2, desc: 'Porcion anterior con incisivos superiores', x: 8, y: 46, color: 'Amarillo' },
                { id: 'mandibula_l', name: 'Mandibula', qty: 2, desc: 'Hueso movil inferior, contiene dientes inferiores', x: 32, y: 70, color: 'Naranja' },
                { id: 'etmoides_l', name: 'Etmoides', qty: 1, desc: 'Hueso que divide la parte nasal del craneo', x: 38, y: 24, color: 'Morado' },
              ]
            },
            {
              id: 'caudal', name: 'Vista Caudal/Nucal (Desde atras)',
              desc: 'Porcion nucal: hueso occipital y conexion cervical',
              imageKey: 'craneo_caudal',
              questions: [
                { id: 'escamosa_occ_c', name: 'Porcion Escamosa del Occipital', qty: 1, desc: 'Parte superior plana del hueso occipital', x: 50, y: 24, color: 'Rojo' },
                { id: 'protub_occ_c', name: 'Protuberancia Occipital Externa', qty: 1, desc: 'Prominencia en la linea media del occipital', x: 50, y: 18, color: 'Azul' },
                { id: 'cresta_nucal_c', name: 'Cresta Nucal', qty: 1, desc: 'Cresta para insercion de musculos y ligamento nucal', x: 50, y: 12, color: 'Verde' },
                { id: 'foram_magno_c', name: 'Foramen Magno', qty: 1, desc: 'Gran abertura por donde pasa la medula espinal', x: 50, y: 48, color: 'Amarillo' },
                { id: 'condilos_c', name: 'Condilos del Occipital', qty: 2, desc: 'Articulan con el Atlas (C1), solo en caballos tienen esta forma', x: 38, y: 62, color: 'Naranja' },
                { id: 'porcion_basilar_c', name: 'Porcion Basilar del Occipital', qty: 1, desc: 'Base del occipital visible desde atras', x: 50, y: 70, color: 'Morado' },
                { id: 'porcion_lat_c', name: 'Porcion Lateral del Occipital', qty: 2, desc: 'Partes laterales del occipital', x: 34, y: 42, color: 'Rojo' },
                { id: 'proc_paracond_c', name: 'Proceso Paracondilar', qty: 2, desc: 'Proyeccion inferior-lateral cerca del condilo', x: 32, y: 72, color: 'Azul' },
                { id: 'canal_hipogloso_c', name: 'Canal del Nervio Hipogloso', qty: 2, desc: 'Paso del nervio XII que inerva la lengua', x: 42, y: 62, color: 'Verde' },
              ]
            },
            {
              id: 'rostral', name: 'Vista Rostral (De frente)',
              desc: 'Punta de la nariz, boca y hueso incisivo',
              imageKey: 'craneo_rostral',
              questions: [
                { id: 'incisivo_r', name: 'Hueso Incisivo', qty: 2, desc: 'Contiene los dientes incisivos superiores', x: 50, y: 55, color: 'Rojo' },
                { id: 'cara_labial_r', name: 'Cara Labial del Incisivo', qty: 2, desc: 'Superficie del incisivo que mira hacia los labios', x: 50, y: 48, color: 'Azul' },
                { id: 'apertura_r', name: 'Apertura Nasal Osea', qty: 1, desc: 'Abertura nasal formada por nasales e incisivos', x: 50, y: 28, color: 'Verde' },
                { id: 'infraorb_r', name: 'Agujero Infraorbitario', qty: 2, desc: 'Foramen de salida del nervio infraorbitario', x: 34, y: 42, color: 'Amarillo' },
                { id: 'escot_nasoinc_r', name: 'Escotadura Nasoincisiva', qty: 2, desc: 'Muesca entre hueso nasal e incisivo', x: 42, y: 35, color: 'Naranja' },
                { id: 'incisivos_d_r', name: 'Dientes Incisivos Superiores', qty: 6, desc: '6 incisivos superiores (3 por lado)', x: 50, y: 72, color: 'Morado' },
              ]
            }
          ],
          questions: [
            { id: 'frontal', name: 'Hueso Frontal', qty: 2, desc: 'Forma la frente y la boveda craneal', x: 42, y: 18, color: 'Rojo' },
            { id: 'parietal', name: 'Hueso Parietal', qty: 2, desc: 'Parte superior-posterior del craneo', x: 62, y: 20, color: 'Azul' },
            { id: 'temporal', name: 'Hueso Temporal', qty: 2, desc: 'Lateral del craneo, contiene el oido', x: 72, y: 28, color: 'Verde' },
            { id: 'occipital', name: 'Hueso Occipital', qty: 1, desc: 'Posterior del craneo, foramen magno', x: 82, y: 30, color: 'Amarillo' },
            { id: 'nasal', name: 'Hueso Nasal', qty: 2, desc: 'Forma el puente de la nariz', x: 20, y: 28, color: 'Naranja' },
            { id: 'maxilar', name: 'Maxilar', qty: 2, desc: 'Contiene dientes superiores, cresta facial', x: 28, y: 46, color: 'Morado' },
            { id: 'incisivo', name: 'Hueso Incisivo (Premaxilar)', qty: 2, desc: 'Contiene incisivos, forma la escotadura nasoincisiva', x: 8, y: 46, color: 'Rojo' },
            { id: 'mandibula', name: 'Mandibula', qty: 2, desc: 'Hueso movil inferior', x: 32, y: 70, color: 'Azul' },
            { id: 'lacrimal', name: 'Hueso Lacrimal', qty: 2, desc: 'Borde anterior orbita, canal nasolacrimal', x: 42, y: 30, color: 'Verde' },
            { id: 'etmoides', name: 'Etmoides', qty: 1, desc: 'Divide cavidad nasal del encefalo', x: 38, y: 24, color: 'Amarillo' },
            { id: 'esfenoides', name: 'Esfenoides', qty: 1, desc: 'Base del craneo, presfenoides y basiesfenoides', x: 56, y: 42, color: 'Naranja' },
            { id: 'palatino', name: 'Hueso Palatino', qty: 2, desc: '2 laminas perpendiculares + 1 horizontal', x: 34, y: 50, color: 'Morado' },
            { id: 'terigoides', name: 'Hueso Terigoides', qty: 2, desc: 'Hueso con ganchos lateral al palatino', x: 48, y: 48, color: 'Rojo' },
            { id: 'vomer', name: 'Vomer', qty: 1, desc: 'Tabique nasal oseo', x: 25, y: 36, color: 'Azul' },
            { id: 'cigomatico', name: 'Hueso Cigomatico', qty: 2, desc: 'Forma el pomulo y arco cigomatico', x: 54, y: 40, color: 'Verde' },
          ]
        },
        // ===== A. CABEZA Y CUELLO =====
        {
          id: 'cabeza_cuello', name: 'Cabeza y Cuello', desc: 'Articulacion atlanto-occipital y region cervical', bones: 12,
          imageKey: 'cabeza_cuello',
          views: [
            {
              id: 'lateral', name: 'Vista Lateral',
              desc: 'Vista de perfil de la cabeza y cuello, mostrando la union craneo-cervical',
              imageKey: 'cabeza_cuello_lateral',
              questions: [
                { id: 'atlas_lat', name: 'Atlas (C1)', qty: 1, desc: 'Primera vertebra cervical, permite el movimiento de si/no', x: 58, y: 22, color: 'Rojo' },
                { id: 'axis_lat', name: 'Axis (C2)', qty: 1, desc: 'Segunda vertebra cervical con apofisis odontoides, permite rotacion', x: 62, y: 26, color: 'Azul' },
                { id: 'c3c5_lat', name: 'Vertebras C3-C5', qty: 3, desc: 'Vertebras cervicales medias con procesos transversos grandes', x: 68, y: 34, color: 'Verde' },
                { id: 'c6c7_lat', name: 'Vertebras C6-C7', qty: 2, desc: 'Vertebras cervicales inferiores, transicion al torax', x: 75, y: 44, color: 'Amarillo' },
                { id: 'art_ao_lat', name: 'Articulacion Atlanto-Occipital', qty: 1, desc: 'Union entre craneo y atlas, vital para flexibilidad del bocado', x: 55, y: 20, color: 'Naranja' },
                { id: 'hueso_hioides_lat', name: 'Hueso Hioides', qty: 1, desc: 'Hueso suspendido que soporta la laringe y la lengua', x: 46, y: 52, color: 'Morado' },
              ]
            },
            {
              id: 'dorsal', name: 'Vista Dorsal',
              desc: 'Vista desde arriba de la articulacion cabeza-cuello',
              imageKey: 'cabeza_cuello_dorsal',
              questions: [
                { id: 'atlas_dors', name: 'Atlas (C1) - Alas', qty: 1, desc: 'Alas del atlas visibles desde arriba, amplias para insercion muscular', x: 50, y: 30, color: 'Rojo' },
                { id: 'axis_dors', name: 'Axis (C2) - Espina', qty: 1, desc: 'Proceso espinoso prominente del axis visto desde dorsal', x: 50, y: 42, color: 'Azul' },
                { id: 'proc_esp_dors', name: 'Procesos Espinosos Cervicales', qty: 5, desc: 'Crestas dorsales de C3-C7 para insercion del ligamento nucal', x: 50, y: 60, color: 'Verde' },
                { id: 'lig_nucal_dors', name: 'Ligamento Nucal (insercion)', qty: 1, desc: 'Insercion del fuerte ligamento que sostiene la cabeza', x: 50, y: 20, color: 'Amarillo' },
                { id: 'proc_trans_dors', name: 'Procesos Transversos', qty: 7, desc: 'Proyecciones laterales de las vertebras cervicales', x: 35, y: 50, color: 'Naranja' },
              ]
            },
            {
              id: 'ventral', name: 'Vista Ventral',
              desc: 'Vista desde abajo de la region cervical',
              imageKey: 'cabeza_cuello_ventral',
              questions: [
                { id: 'cuerpos_vert_ven', name: 'Cuerpos Vertebrales C1-C7', qty: 7, desc: 'Superficie ventral de los cuerpos vertebrales cervicales', x: 50, y: 50, color: 'Rojo' },
                { id: 'proc_trans_ven', name: 'Procesos Transversos Ventrales', qty: 7, desc: 'Vistos desde abajo, albergan los forámenes transversos', x: 35, y: 55, color: 'Azul' },
                { id: 'art_ao_ven', name: 'Articulacion Atlanto-Occipital', qty: 1, desc: 'Condilos occipitales encajando en el atlas, vista ventral', x: 50, y: 25, color: 'Verde' },
                { id: 'art_aa_ven', name: 'Articulacion Atlanto-Axial', qty: 1, desc: 'Union atlas-axis con la apofisis odontoides', x: 50, y: 35, color: 'Amarillo' },
                { id: 'hioides_ven', name: 'Aparato Hioideo', qty: 1, desc: 'Conjunto de huesos que soportan laringe y lengua', x: 50, y: 15, color: 'Naranja' },
              ]
            },
            {
              id: 'nucal', name: 'Vista Nucal (Posterior)',
              desc: 'Vista desde atras del cuello, conexion con la cruz',
              imageKey: 'cabeza_cuello_nucal',
              questions: [
                { id: 'cresta_nucal', name: 'Cresta Nucal del Occipital', qty: 1, desc: 'Cresta osea donde se inserta el ligamento nucal', x: 50, y: 20, color: 'Rojo' },
                { id: 'foramen_mag_nuc', name: 'Foramen Magnum', qty: 1, desc: 'Gran abertura para la medula espinal', x: 50, y: 40, color: 'Azul' },
                { id: 'condilos_nuc', name: 'Condilos Occipitales', qty: 2, desc: 'Superficies de articulacion con el atlas', x: 40, y: 50, color: 'Verde' },
                { id: 'alas_atlas_nuc', name: 'Alas del Atlas', qty: 2, desc: 'Proyecciones laterales del atlas visibles desde atras', x: 35, y: 60, color: 'Amarillo' },
                { id: 'proc_esp_axis_nuc', name: 'Proceso Espinoso del Axis', qty: 1, desc: 'Prominencia dorsal del axis vista desde posterior', x: 50, y: 70, color: 'Naranja' },
              ]
            }
          ],
          questions: [
            { id: 'atlas', name: 'Atlas (C1)', qty: 1, desc: 'Primera vertebra cervical, permite flexion/extension de la cabeza', x: 58, y: 22, color: 'Rojo' },
            { id: 'axis', name: 'Axis (C2)', qty: 1, desc: 'Segunda vertebra cervical, permite rotacion de la cabeza', x: 62, y: 26, color: 'Azul' },
            { id: 'cervicales_cc', name: 'Vertebras C3-C7', qty: 5, desc: '5 vertebras cervicales restantes del cuello', x: 72, y: 38, color: 'Verde' },
            { id: 'hioides_cc', name: 'Hueso Hioides', qty: 1, desc: 'Soporta laringe y lengua, suspendido entre mandibulas', x: 46, y: 52, color: 'Amarillo' },
            { id: 'art_ao_cc', name: 'Art. Atlanto-Occipital', qty: 1, desc: 'Union craneo-atlas, vital para control del bocado', x: 55, y: 20, color: 'Naranja' },
          ]
        },
        // ===== B. EL TRONCO (BARRIL Y DORSO) =====
        {
          id: 'tronco', name: 'El Tronco (Barril y Dorso)', desc: 'Cruz, costillas y columna toracica/lumbar', bones: 55,
          imageKey: 'tronco',
          views: [
            {
              id: 'dorsal', name: 'Vista Dorsal',
              desc: 'Vista desde arriba mostrando la cruz y columna',
              imageKey: 'tronco_dorsal',
              questions: [
                { id: 'cruz_dors', name: 'La Cruz (Procesos Espinosos T3-T10)', qty: 8, desc: 'Procesos espinosos altos de las vertebras toracicas, punto de medicion de altura', x: 30, y: 25, color: 'Rojo' },
                { id: 'esp_toracicos_dors', name: 'Procesos Espinosos Toracicos T11-T18', qty: 8, desc: 'Procesos mas cortos posteriores a la cruz', x: 50, y: 30, color: 'Azul' },
                { id: 'esp_lumbares_dors', name: 'Procesos Espinosos Lumbares', qty: 6, desc: 'Procesos anchos y planos de la region lumbar', x: 70, y: 35, color: 'Verde' },
                { id: 'proc_trans_tor_dors', name: 'Procesos Transversos Toracicos', qty: 18, desc: 'Proyecciones laterales donde articulan las costillas', x: 40, y: 45, color: 'Amarillo' },
                { id: 'proc_trans_lum_dors', name: 'Procesos Transversos Lumbares', qty: 6, desc: 'Amplias alas laterales de las vertebras lumbares', x: 75, y: 50, color: 'Naranja' },
                { id: 'costillas_dors', name: 'Costillas (vista dorsal)', qty: 36, desc: 'Arcos costales vistos desde arriba a ambos lados', x: 45, y: 60, color: 'Morado' },
              ]
            },
            {
              id: 'lateral', name: 'Vista Lateral',
              desc: 'Vista de perfil del torax y lomo, evaluacion de capacidad respiratoria',
              imageKey: 'tronco_lateral',
              questions: [
                { id: 'cruz_lat', name: 'La Cruz', qty: 1, desc: 'Punto mas alto del dorso, donde se mide la alzada', x: 25, y: 15, color: 'Rojo' },
                { id: 'vert_toracicas_lat', name: 'Vertebras Toracicas (T1-T18)', qty: 18, desc: '18 vertebras articuladas con costillas', x: 40, y: 25, color: 'Azul' },
                { id: 'vert_lumbares_lat', name: 'Vertebras Lumbares (L1-L6)', qty: 6, desc: '6 vertebras del lomo sin costillas', x: 65, y: 28, color: 'Verde' },
                { id: 'costillas_verd_lat', name: 'Costillas Verdaderas (1-8)', qty: 16, desc: '8 pares que articulan directamente con el esternon', x: 30, y: 50, color: 'Amarillo' },
                { id: 'costillas_fals_lat', name: 'Costillas Falsas (9-18)', qty: 20, desc: '10 pares unidos por cartilago costal', x: 50, y: 55, color: 'Naranja' },
                { id: 'esternon_lat', name: 'Esternon', qty: 1, desc: 'Hueso del pecho, visible en vista lateral inferior', x: 28, y: 75, color: 'Morado' },
                { id: 'espacio_intercostal_lat', name: 'Espacios Intercostales', qty: 17, desc: 'Espacios entre costillas para musculos respiratorios', x: 42, y: 62, color: 'Rojo' },
              ]
            }
          ],
          questions: [
            { id: 'cruz', name: 'La Cruz', qty: 1, desc: 'Punto mas alto del dorso donde se mide la alzada del caballo', x: 25, y: 15, color: 'Rojo' },
            { id: 'vert_toracicas', name: 'Vertebras Toracicas (T1-T18)', qty: 18, desc: '18 vertebras del torax articuladas con costillas', x: 45, y: 25, color: 'Azul' },
            { id: 'vert_lumbares', name: 'Vertebras Lumbares (L1-L6)', qty: 6, desc: '6 vertebras del lomo, soportan carga sin costillas', x: 70, y: 30, color: 'Verde' },
            { id: 'costillas_tronco', name: 'Costillas (18 pares)', qty: 36, desc: '8 pares verdaderas + 10 pares falsas', x: 40, y: 55, color: 'Amarillo' },
            { id: 'esternon_tronco', name: 'Esternon', qty: 1, desc: 'Hueso del pecho donde se unen las costillas verdaderas', x: 30, y: 75, color: 'Naranja' },
          ]
        },
        {
          id: 'columna', name: 'Columna Vertebral', desc: '54 vertebras del cuello a la cola', bones: 54,
          imageKey: 'columna',
          questions: [
            { id: 'cervicales', name: 'Vertebras Cervicales (C1-C7)', qty: 7, desc: '7 vertebras del cuello, incluyendo Atlas y Axis', x: 15, y: 45, color: 'Rojo' },
            { id: 'toracicas', name: 'Vertebras Toracicas (T1-T18)', qty: 18, desc: '18 vertebras que se articulan con las costillas', x: 40, y: 35, color: 'Azul' },
            { id: 'lumbares', name: 'Vertebras Lumbares (L1-L6)', qty: 6, desc: '6 vertebras del lomo, sin costillas', x: 60, y: 40, color: 'Verde' },
            { id: 'sacro', name: 'Sacro (5 fusionadas)', qty: 5, desc: 'Vertebras fusionadas de la grupa', x: 75, y: 45, color: 'Amarillo' },
            { id: 'coccigeas', name: 'Vertebras Coccigeas', qty: 18, desc: 'Vertebras de la cola (15-21)', x: 90, y: 50, color: 'Naranja' },
          ]
        },
        {
          id: 'torax', name: 'Caja Toracica', desc: 'Costillas y esternon - 37 huesos', bones: 37,
          imageKey: 'torax',
          questions: [
            { id: 'costillas', name: 'Costillas (18 pares)', qty: 36, desc: 'Protegen organos vitales, 8 verdaderas + 10 falsas', x: 42, y: 42, color: 'Azul' },
            { id: 'esternon', name: 'Esternon', qty: 1, desc: 'Hueso del pecho donde se unen las costillas', x: 35, y: 62, color: 'Rojo' },
          ]
        }
      ]
    },
    {
      id: 'apendicular', name: 'Esqueleto Apendicular', desc: 'Extremidades y sus regiones', bones: 120, icon: 'walk',
      regions: [
        // ===== C. EXTREMIDADES - Encuentro y Espalda =====
        {
          id: 'encuentro', name: 'Encuentro y Espalda', desc: 'Escapula y humero - region del hombro', bones: 4,
          imageKey: 'encuentro',
          questions: [
            { id: 'escapula_enc', name: 'Escapula (Omoplato)', qty: 2, desc: 'Hueso plano triangular del hombro, se desliza sobre el torax', x: 35, y: 20, color: 'Rojo' },
            { id: 'espina_esc', name: 'Espina de la Escapula', qty: 2, desc: 'Cresta prominente que divide la escapula en fosas', x: 40, y: 25, color: 'Azul' },
            { id: 'humero_enc', name: 'Humero', qty: 2, desc: 'Hueso del brazo, conecta hombro con codo', x: 45, y: 45, color: 'Verde' },
            { id: 'art_escapulohumeral', name: 'Art. Escapulohumeral', qty: 2, desc: 'Articulacion del hombro entre escapula y humero', x: 40, y: 35, color: 'Amarillo' },
            { id: 'tuberosidad_humero', name: 'Tuberosidad Deltoidea', qty: 2, desc: 'Prominencia del humero para insercion del musculo deltoide', x: 48, y: 42, color: 'Naranja' },
            { id: 'cartilago_esc', name: 'Cartilago Escapular', qty: 2, desc: 'Extension cartilaginosa en el borde dorsal de la escapula', x: 30, y: 10, color: 'Morado' },
          ]
        },
        // ===== C. EXTREMIDADES - Brazo y Antebrazo =====
        {
          id: 'antebrazo', name: 'Brazo y Antebrazo', desc: 'Radio y cubito - region del codo', bones: 4,
          imageKey: 'antebrazo',
          questions: [
            { id: 'radio_ant', name: 'Radio', qty: 2, desc: 'Hueso principal del antebrazo, soporta el peso', x: 45, y: 45, color: 'Rojo' },
            { id: 'cubito_ant', name: 'Cubito (Ulna)', qty: 2, desc: 'Hueso posterior del antebrazo, forma el olecranon', x: 50, y: 30, color: 'Azul' },
            { id: 'olecranon_ant', name: 'Olecranon', qty: 2, desc: 'Punta del codo, proyeccion proximal del cubito', x: 52, y: 22, color: 'Verde' },
            { id: 'art_codo', name: 'Articulacion del Codo', qty: 2, desc: 'Union de humero con radio y cubito', x: 48, y: 25, color: 'Amarillo' },
            { id: 'espacio_interoseo', name: 'Espacio Interoseo', qty: 2, desc: 'Espacio entre radio y cubito en el antebrazo', x: 47, y: 40, color: 'Naranja' },
          ]
        },
        // ===== C. EXTREMIDADES - Carpo/Tarso =====
        {
          id: 'carpo_tarso', name: 'Carpo y Tarso', desc: 'Huesos de la rodilla y corvejón', bones: 26,
          imageKey: 'carpo_tarso',
          views: [
            {
              id: 'dorsal', name: 'Vista Dorsal (Anterior)',
              desc: 'Vista frontal de los huesos del carpo y tarso',
              imageKey: 'carpo_tarso_dorsal',
              questions: [
                { id: 'radial_dors', name: 'Hueso Carpal Radial', qty: 2, desc: 'Hueso mas grande de la fila proximal del carpo', x: 35, y: 35, color: 'Rojo' },
                { id: 'intermedio_dors', name: 'Hueso Carpal Intermedio', qty: 2, desc: 'Hueso central de la fila proximal', x: 50, y: 35, color: 'Azul' },
                { id: 'ulnar_dors', name: 'Hueso Carpal Ulnar', qty: 2, desc: 'Hueso lateral de la fila proximal', x: 65, y: 35, color: 'Verde' },
                { id: 'c2_dors', name: 'Segundo Carpal (C2)', qty: 2, desc: 'Pequeno hueso de la fila distal', x: 35, y: 55, color: 'Amarillo' },
                { id: 'c3_dors', name: 'Tercer Carpal (C3)', qty: 2, desc: 'Hueso mas grande de la fila distal', x: 50, y: 55, color: 'Naranja' },
                { id: 'c4_dors', name: 'Cuarto Carpal (C4)', qty: 2, desc: 'Hueso lateral de la fila distal', x: 65, y: 55, color: 'Morado' },
                { id: 'metacarpo_dors', name: 'Metacarpo III (Cana)', qty: 2, desc: 'Hueso principal que se extiende distalmente', x: 50, y: 75, color: 'Rojo' },
              ]
            },
            {
              id: 'palmar', name: 'Vista Palmar/Plantar (Posterior)',
              desc: 'Vista posterior mostrando el hueso accesorio del carpo',
              imageKey: 'carpo_tarso_palmar',
              questions: [
                { id: 'accesorio_palm', name: 'Hueso Accesorio del Carpo', qty: 2, desc: 'Hueso prominente posterior del carpo, equivalente al pisiforme', x: 65, y: 30, color: 'Rojo' },
                { id: 'radial_palm', name: 'Hueso Carpal Radial (palmar)', qty: 2, desc: 'Cara posterior del carpal radial', x: 40, y: 35, color: 'Azul' },
                { id: 'ulnar_palm', name: 'Hueso Carpal Ulnar (palmar)', qty: 2, desc: 'Cara posterior del carpal ulnar', x: 55, y: 38, color: 'Verde' },
                { id: 'canal_carpal', name: 'Canal del Carpo', qty: 2, desc: 'Surco por donde pasan tendones flexores', x: 45, y: 50, color: 'Amarillo' },
                { id: 'metacarpos_rud', name: 'Metacarpos Rudimentarios (II y IV)', qty: 4, desc: 'Huesos de cana finos laterales (peroneos)', x: 35, y: 70, color: 'Naranja' },
              ]
            }
          ],
          questions: [
            { id: 'carpo_general', name: 'Huesos del Carpo', qty: 14, desc: '7-8 huesos pequenos organizados en dos filas (rodilla)', x: 40, y: 35, color: 'Rojo' },
            { id: 'tarso_general', name: 'Huesos del Tarso', qty: 12, desc: '6 huesos del corvejón por lado', x: 60, y: 35, color: 'Azul' },
            { id: 'accesorio', name: 'Hueso Accesorio del Carpo', qty: 2, desc: 'Equivalente al pisiforme, prominente en la parte posterior', x: 55, y: 25, color: 'Verde' },
            { id: 'calcaneo', name: 'Calcaneo (Punta del Corvejon)', qty: 2, desc: 'Hueso grande del tarso, equivalente al talon', x: 65, y: 20, color: 'Amarillo' },
            { id: 'astragalo', name: 'Astragalo (Talus)', qty: 2, desc: 'Hueso principal del tarso, articula con la tibia', x: 58, y: 28, color: 'Naranja' },
          ]
        },
        // ===== C. EXTREMIDADES - Dedo (Menudillo hacia abajo) =====
        {
          id: 'dedo', name: 'Region del Dedo', desc: 'Del menudillo al casco - diagnostico de lesiones', bones: 12,
          imageKey: 'dedo',
          views: [
            {
              id: 'dorsopalmar', name: 'Vista Dorsopalmar (Frente a atras)',
              desc: 'Vista frontal tipo rayos X para diagnostico de lesiones',
              imageKey: 'dedo_dorsopalmar',
              questions: [
                { id: 'f1_dp', name: 'Falange Proximal (Cuartilla)', qty: 2, desc: 'Primer hueso del dedo, desde el menudillo', x: 50, y: 20, color: 'Rojo' },
                { id: 'f2_dp', name: 'Falange Media (Corona)', qty: 2, desc: 'Segundo hueso del dedo, entre cuartilla y tejuelo', x: 50, y: 45, color: 'Azul' },
                { id: 'f3_dp', name: 'Falange Distal (Tejuelo)', qty: 2, desc: 'Hueso dentro del casco, forma de media luna', x: 50, y: 70, color: 'Verde' },
                { id: 'sesamoideos_dp', name: 'Sesamoideos Proximales', qty: 4, desc: 'Dos huesos en la parte posterior del menudillo', x: 35, y: 15, color: 'Amarillo' },
                { id: 'navicular_dp', name: 'Hueso Navicular (Sesamoideo Distal)', qty: 2, desc: 'Hueso clave para diagnostico, detrás del tejuelo', x: 50, y: 60, color: 'Naranja' },
              ]
            },
            {
              id: 'oblicua', name: 'Vista Oblicua',
              desc: 'Vista angular para detectar lesiones en navicular y falanges',
              imageKey: 'dedo_oblicua',
              questions: [
                { id: 'f1_obl', name: 'Falange Proximal (Cuartilla)', qty: 2, desc: 'Vista oblicua de la cuartilla, evalua corteza osea', x: 45, y: 22, color: 'Rojo' },
                { id: 'f2_obl', name: 'Falange Media (Corona)', qty: 2, desc: 'Vista oblicua de la corona, detecta fracturas', x: 48, y: 42, color: 'Azul' },
                { id: 'f3_obl', name: 'Falange Distal (Tejuelo)', qty: 2, desc: 'Vista oblicua del tejuelo, evalua laminitis', x: 50, y: 65, color: 'Verde' },
                { id: 'navicular_obl', name: 'Hueso Navicular', qty: 2, desc: 'Vista oblicua para detectar sindrome navicular', x: 55, y: 58, color: 'Amarillo' },
                { id: 'art_interfalangica', name: 'Art. Interfalangica Distal', qty: 2, desc: 'Articulacion entre corona y tejuelo', x: 47, y: 52, color: 'Naranja' },
                { id: 'proceso_extensor', name: 'Proceso Extensor del Tejuelo', qty: 2, desc: 'Proyeccion dorsal del tejuelo para insercion del tendon extensor', x: 42, y: 70, color: 'Morado' },
              ]
            }
          ],
          questions: [
            { id: 'f1', name: 'Falange Proximal (Cuartilla)', qty: 2, desc: 'Primer hueso del dedo desde el menudillo', x: 45, y: 25, color: 'Rojo' },
            { id: 'f2', name: 'Falange Media (Corona)', qty: 2, desc: 'Segundo hueso del dedo', x: 48, y: 45, color: 'Azul' },
            { id: 'f3', name: 'Falange Distal (Tejuelo)', qty: 2, desc: 'Hueso dentro del casco, forma de media luna', x: 50, y: 68, color: 'Verde' },
            { id: 'navicular', name: 'Hueso Navicular', qty: 2, desc: 'Sesamoideo distal, clave en diagnostico de cojeras', x: 55, y: 60, color: 'Amarillo' },
            { id: 'sesamoideos_prox', name: 'Sesamoideos Proximales', qty: 4, desc: 'Par de huesos en la parte posterior del menudillo', x: 40, y: 15, color: 'Naranja' },
          ]
        },
        {
          id: 'anterior', name: 'Miembro Anterior (Completo)', desc: 'Pata delantera completa - 40 huesos', bones: 40,
          imageKey: 'anterior',
          questions: [
            { id: 'escapula', name: 'Escapula (Omoplato)', qty: 2, desc: 'Hueso plano triangular del hombro', x: 30, y: 10, color: 'Rojo' },
            { id: 'humero', name: 'Humero', qty: 2, desc: 'Hueso del brazo', x: 35, y: 25, color: 'Azul' },
            { id: 'radio', name: 'Radio', qty: 2, desc: 'Hueso principal del antebrazo', x: 40, y: 40, color: 'Verde' },
            { id: 'cubito', name: 'Cubito (Ulna)', qty: 2, desc: 'Forma el codo (olecranon)', x: 45, y: 35, color: 'Amarillo' },
            { id: 'carpo', name: 'Carpo (Rodilla)', qty: 14, desc: '7-8 huesos pequenos de la rodilla', x: 42, y: 55, color: 'Naranja' },
            { id: 'metacarpo', name: 'Metacarpo (Cana)', qty: 2, desc: 'Hueso largo de la cana', x: 45, y: 68, color: 'Morado' },
            { id: 'falanges_a', name: 'Falanges (Cuartilla, Corona, Tejuelo)', qty: 6, desc: 'Dedos que terminan en el casco', x: 48, y: 85, color: 'Rojo' },
          ]
        },
        {
          id: 'posterior', name: 'Miembro Posterior (Completo)', desc: 'Pata trasera completa - 80 huesos', bones: 80,
          imageKey: 'posterior',
          questions: [
            { id: 'pelvis', name: 'Pelvis (Ilion/Isquion/Pubis)', qty: 6, desc: 'Huesos de la cadera', x: 25, y: 15, color: 'Rojo' },
            { id: 'femur', name: 'Femur', qty: 2, desc: 'Hueso del muslo, el mas fuerte', x: 45, y: 30, color: 'Azul' },
            { id: 'rotula', name: 'Rotula (Patela)', qty: 2, desc: 'Hueso de la rodilla verdadera', x: 40, y: 42, color: 'Verde' },
            { id: 'tibia', name: 'Tibia', qty: 2, desc: 'Hueso de la pierna', x: 50, y: 52, color: 'Amarillo' },
            { id: 'tarso', name: 'Tarso (Corvejon)', qty: 12, desc: '6 huesos del corvejon por lado', x: 55, y: 65, color: 'Naranja' },
            { id: 'metatarso', name: 'Metatarso (Cana)', qty: 2, desc: 'Cana de la pata trasera', x: 58, y: 75, color: 'Morado' },
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
