from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import uuid
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Servir archivos estáticos desde /api/assets
ASSETS_DIR = ROOT_DIR / "assets"

# URLs de imágenes - usando el servidor local
# El backend corre en /api, así que las imágenes están en /api/assets/
BASE_URL = "/api/assets"

# DATOS DEL ESQUELETO - 205 huesos organizados
# Usando imágenes generadas con Nano Banana
SKELETON = {
    "axial": {
        "name": "Esqueleto Axial",
        "bones": 81,
        "regions": {
            "craneo": {
                "name": "Cráneo y Cara",
                "desc": "34 huesos del cráneo y cara",
                "bones": 34,
                "image": f"{BASE_URL}/horse_skull.jpg",
                "views": {
                    "dorsal": {
                        "name": "Vista Dorsal (Desde arriba)",
                        "desc": "Evalúa la simetría del cráneo desde arriba",
                        "image": f"{BASE_URL}/horse_skull_dorsal.jpg",
                        "questions": [
                            {"id": "nasal_d", "name": "Huesos Nasales", "qty": 2, "desc": "Unión de los huesos nasales en la línea media", "x": 30, "y": 25, "color": "Rojo"},
                            {"id": "frontal_d", "name": "Huesos Frontales", "qty": 2, "desc": "Grandes huesos planos que forman la frente", "x": 50, "y": 40, "color": "Azul"},
                            {"id": "parietal_d", "name": "Huesos Parietales", "qty": 2, "desc": "Parte superior-posterior del cráneo", "x": 55, "y": 60, "color": "Verde"},
                            {"id": "orbita_d", "name": "Borde Orbital", "qty": 2, "desc": "Borde óseo de las órbitas oculares visto desde arriba", "x": 35, "y": 45, "color": "Amarillo"},
                            {"id": "cresta_d", "name": "Cresta Sagital", "qty": 1, "desc": "Cresta ósea en la línea media posterior del cráneo", "x": 50, "y": 75, "color": "Naranja"},
                        ]
                    },
                    "ventral": {
                        "name": "Vista Ventral (Desde abajo)",
                        "desc": "La más compleja, muestra la base del cráneo",
                        "image": f"{BASE_URL}/horse_skull_ventral.jpg",
                        "questions": [
                            {"id": "palatino_v", "name": "Huesos Palatinos", "qty": 2, "desc": "Forman el paladar duro posterior", "x": 40, "y": 35, "color": "Rojo"},
                            {"id": "vomer_v", "name": "Vómer", "qty": 1, "desc": "Hueso impar que divide las coanas", "x": 50, "y": 25, "color": "Azul"},
                            {"id": "esfenoides_v", "name": "Esfenoides", "qty": 1, "desc": "Hueso complejo en la base del cráneo", "x": 50, "y": 55, "color": "Verde"},
                            {"id": "condilo_v", "name": "Cóndilos del Occipital", "qty": 2, "desc": "Articulación con la primera vértebra cervical (Atlas)", "x": 50, "y": 80, "color": "Amarillo"},
                            {"id": "maxilar_v", "name": "Maxilar (filas dentales)", "qty": 2, "desc": "Filas de molares y premolares superiores", "x": 30, "y": 45, "color": "Naranja"},
                            {"id": "coanas_v", "name": "Coanas", "qty": 2, "desc": "Aberturas posteriores de las fosas nasales", "x": 50, "y": 20, "color": "Morado"},
                        ]
                    },
                    "lateral": {
                        "name": "Vista Lateral (De perfil)",
                        "desc": "La más común, muestra la extensión completa de la cara",
                        "image": f"{BASE_URL}/horse_skull_lateral.jpg",
                        "questions": [
                            {"id": "maxilar_l", "name": "Maxilar", "qty": 2, "desc": "Hueso grande que contiene los dientes superiores", "x": 25, "y": 50, "color": "Morado"},
                            {"id": "premaxilar_l", "name": "Premaxilar (Incisivo)", "qty": 2, "desc": "Porción anterior que contiene los incisivos superiores", "x": 10, "y": 55, "color": "Rojo"},
                            {"id": "lagrimal_l", "name": "Hueso Lagrimal", "qty": 2, "desc": "Pequeño hueso en el borde anterior de la órbita", "x": 40, "y": 30, "color": "Azul"},
                            {"id": "cigomatico_l", "name": "Hueso Cigomático", "qty": 2, "desc": "Forma el pómulo y parte del arco cigomático", "x": 50, "y": 45, "color": "Verde"},
                            {"id": "mandibula_l", "name": "Mandíbula", "qty": 2, "desc": "Hueso móvil inferior que contiene dientes", "x": 35, "y": 70, "color": "Amarillo"},
                            {"id": "arco_l", "name": "Arco Cigomático", "qty": 2, "desc": "Puente óseo lateral del cráneo", "x": 60, "y": 40, "color": "Naranja"},
                            {"id": "diastema_l", "name": "Diastema (Barras)", "qty": 2, "desc": "Espacio entre incisivos y premolares donde se coloca el bocado", "x": 20, "y": 60, "color": "Rojo"},
                        ]
                    },
                    "caudal": {
                        "name": "Vista Caudal (Desde atrás)",
                        "desc": "Conexión con la columna vertebral",
                        "image": f"{BASE_URL}/horse_skull_caudal.jpg",
                        "questions": [
                            {"id": "occipital_c", "name": "Hueso Occipital", "qty": 1, "desc": "Gran hueso posterior del cráneo", "x": 50, "y": 40, "color": "Rojo"},
                            {"id": "interparietal_c", "name": "Hueso Interparietal", "qty": 1, "desc": "Pequeño hueso entre parietales y occipital", "x": 50, "y": 20, "color": "Azul"},
                            {"id": "foramen_c", "name": "Foramen Magnum", "qty": 1, "desc": "Gran abertura por donde pasa la médula espinal", "x": 50, "y": 60, "color": "Verde"},
                            {"id": "cresta_nucal_c", "name": "Cresta Nucal", "qty": 1, "desc": "Cresta donde se insertan ligamentos del cuello", "x": 50, "y": 10, "color": "Amarillo"},
                            {"id": "condilos_c", "name": "Cóndilos Occipitales", "qty": 2, "desc": "Superficies articulares para el Atlas (C1)", "x": 35, "y": 70, "color": "Naranja"},
                        ]
                    },
                    "rostral": {
                        "name": "Vista Rostral (De frente)",
                        "desc": "Punta de la nariz y boca",
                        "image": f"{BASE_URL}/horse_skull_rostral.jpg",
                        "questions": [
                            {"id": "incisivo_r", "name": "Hueso Incisivo", "qty": 2, "desc": "Contiene los dientes incisivos superiores", "x": 50, "y": 70, "color": "Rojo"},
                            {"id": "apertura_r", "name": "Apertura Nasal Ósea", "qty": 1, "desc": "Abertura nasal formada por huesos nasales e incisivos", "x": 50, "y": 30, "color": "Azul"},
                            {"id": "infraorbitario_r", "name": "Canal Infraorbitario", "qty": 2, "desc": "Foramen por donde pasa el nervio infraorbitario", "x": 30, "y": 50, "color": "Verde"},
                            {"id": "incisivos_dientes_r", "name": "Dientes Incisivos", "qty": 6, "desc": "Disposición de los 6 incisivos superiores", "x": 50, "y": 85, "color": "Amarillo"},
                        ]
                    }
                },
                "questions": [
                    {"id": "frontal", "name": "Hueso Frontal", "qty": 2, "desc": "Parte superior del cráneo, forma la frente", "x": 40, "y": 15, "color": "Rojo"},
                    {"id": "parietal", "name": "Hueso Parietal", "qty": 2, "desc": "Detrás del frontal, parte superior-posterior del cráneo", "x": 60, "y": 20, "color": "Azul"},
                    {"id": "temporal", "name": "Hueso Temporal", "qty": 2, "desc": "Lateral del cráneo, contiene el oído", "x": 70, "y": 40, "color": "Verde"},
                    {"id": "occipital", "name": "Hueso Occipital", "qty": 1, "desc": "Posterior del cráneo, conecta con Atlas", "x": 80, "y": 35, "color": "Amarillo"},
                    {"id": "nasal", "name": "Hueso Nasal", "qty": 2, "desc": "Forma el puente de la nariz", "x": 15, "y": 30, "color": "Naranja"},
                    {"id": "maxilar", "name": "Maxilar Superior", "qty": 2, "desc": "Contiene los dientes superiores", "x": 25, "y": 50, "color": "Morado"},
                    {"id": "mandibula", "name": "Mandíbula", "qty": 2, "desc": "Hueso móvil inferior con dientes", "x": 35, "y": 70, "color": "Rojo"},
                    {"id": "orbita", "name": "Órbita Ocular", "qty": 2, "desc": "Cavidad donde se aloja el ojo", "x": 30, "y": 35, "color": "Azul"},
                ]
            },
            "columna": {
                "name": "Columna Vertebral",
                "desc": "54 vértebras del cuello a la cola",
                "bones": 54,
                "image": f"{BASE_URL}/horse_spine.jpg",  # IMAGEN GENERADA - COLUMNA
                "questions": [
                    {"id": "cervicales", "name": "Vértebras Cervicales (C1-C7)", "qty": 7, "desc": "7 vértebras del cuello, incluyendo Atlas y Axis", "x": 15, "y": 45, "color": "Rojo"},
                    {"id": "toracicas", "name": "Vértebras Torácicas (T1-T18)", "qty": 18, "desc": "18 vértebras que se articulan con las costillas", "x": 40, "y": 35, "color": "Azul"},
                    {"id": "lumbares", "name": "Vértebras Lumbares (L1-L6)", "qty": 6, "desc": "6 vértebras del lomo, sin costillas", "x": 60, "y": 40, "color": "Verde"},
                    {"id": "sacro", "name": "Sacro (5 fusionadas)", "qty": 5, "desc": "Vértebras fusionadas de la grupa", "x": 75, "y": 45, "color": "Amarillo"},
                    {"id": "coccigeas", "name": "Vértebras Coccígeas", "qty": 18, "desc": "Vértebras de la cola (15-21)", "x": 90, "y": 50, "color": "Naranja"},
                ]
            },
            "torax": {
                "name": "Caja Torácica",
                "desc": "Costillas y esternón - 37 huesos",
                "bones": 37,
                "image": f"{BASE_URL}/horse_thorax.jpg",  # IMAGEN GENERADA - TÓRAX
                "questions": [
                    {"id": "costillas", "name": "Costillas (18 pares)", "qty": 36, "desc": "Protegen órganos vitales, 8 verdaderas + 10 falsas", "x": 42, "y": 42, "color": "Azul"},
                    {"id": "esternon", "name": "Esternón", "qty": 1, "desc": "Hueso del pecho donde se unen las costillas", "x": 35, "y": 62, "color": "Rojo"},
                ]
            }
        }
    },
    "apendicular": {
        "name": "Esqueleto Apendicular",
        "bones": 120,
        "regions": {
            "anterior": {
                "name": "Miembro Anterior",
                "desc": "Pata delantera - 40 huesos",
                "bones": 40,
                "image": f"{BASE_URL}/horse_forelimb.jpg",  # IMAGEN GENERADA - PATA DELANTERA
                "questions": [
                    {"id": "escapula", "name": "Escápula (Omóplato)", "qty": 2, "desc": "Hueso plano triangular del hombro", "x": 30, "y": 10, "color": "Rojo"},
                    {"id": "humero", "name": "Húmero", "qty": 2, "desc": "Hueso del brazo", "x": 35, "y": 25, "color": "Azul"},
                    {"id": "radio", "name": "Radio", "qty": 2, "desc": "Hueso principal del antebrazo", "x": 40, "y": 40, "color": "Verde"},
                    {"id": "cubito", "name": "Cúbito (Ulna)", "qty": 2, "desc": "Forma el codo (olécranon)", "x": 45, "y": 35, "color": "Amarillo"},
                    {"id": "carpo", "name": "Carpo (Rodilla)", "qty": 14, "desc": "7-8 huesos pequeños de la rodilla", "x": 42, "y": 55, "color": "Naranja"},
                    {"id": "metacarpo", "name": "Metacarpo (Caña)", "qty": 2, "desc": "Hueso largo de la caña", "x": 45, "y": 68, "color": "Morado"},
                    {"id": "falanges_a", "name": "Falanges (Cuartilla, Corona, Tejuelo)", "qty": 6, "desc": "Dedos que terminan en el casco", "x": 48, "y": 85, "color": "Rojo"},
                ]
            },
            "posterior": {
                "name": "Miembro Posterior",
                "desc": "Pata trasera - 80 huesos",
                "bones": 80,
                "image": f"{BASE_URL}/horse_hindlimb.jpg",  # IMAGEN GENERADA - PATA TRASERA
                "questions": [
                    {"id": "pelvis", "name": "Pelvis (Ilion/Isquion/Pubis)", "qty": 6, "desc": "Huesos de la cadera", "x": 25, "y": 15, "color": "Rojo"},
                    {"id": "femur", "name": "Fémur", "qty": 2, "desc": "Hueso del muslo, el más fuerte", "x": 45, "y": 30, "color": "Azul"},
                    {"id": "rotula", "name": "Rótula (Patela)", "qty": 2, "desc": "Hueso de la rodilla verdadera", "x": 40, "y": 42, "color": "Verde"},
                    {"id": "tibia", "name": "Tibia", "qty": 2, "desc": "Hueso de la pierna", "x": 50, "y": 52, "color": "Amarillo"},
                    {"id": "tarso", "name": "Tarso (Corvejón)", "qty": 12, "desc": "6 huesos del corvejón por lado", "x": 55, "y": 65, "color": "Naranja"},
                    {"id": "metatarso", "name": "Metatarso (Caña)", "qty": 2, "desc": "Caña de la pata trasera", "x": 58, "y": 75, "color": "Morado"},
                    {"id": "falanges_p", "name": "Falanges Posteriores", "qty": 6, "desc": "Dedos de la pata trasera", "x": 60, "y": 90, "color": "Rojo"},
                ]
            }
        }
    }
}

# ============================================
# API ENDPOINTS
# ============================================

@api_router.get("/")
async def root():
    return {"message": "VetBones API - 205 huesos del caballo"}

@api_router.get("/animals")
async def get_animals():
    return [{"id": "horse", "name": "Caballo", "name_scientific": "Equus caballus", "description": "Estudio completo del sistema óseo equino", "total_bones": 205, "bones": 205, "available": True}]

@api_router.get("/divisions/{animal_id}")
async def get_divisions(animal_id: str):
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="No disponible")
    return [
        {"id": "axial", "name": "Esqueleto Axial", "desc": "Cráneo, columna, tórax", "description": "Cráneo, columna, tórax", "bones": 81, "total_bones": 81, "icon": "body"},
        {"id": "apendicular", "name": "Esqueleto Apendicular", "desc": "Patas delanteras y traseras", "description": "Patas delanteras y traseras", "bones": 120, "total_bones": 120, "icon": "walk"}
    ]

@api_router.get("/regions/{animal_id}/{division_id}")
async def get_regions(animal_id: str, division_id: str):
    if animal_id != "horse" or division_id not in SKELETON:
        raise HTTPException(status_code=404, detail="No encontrado")
    
    div = SKELETON[division_id]
    return [
        {
            "id": rid,
            "name": r["name"],
            "desc": r["desc"],
            "bones": r["bones"],
            "image": r["image"],
            "has_views": "views" in r
        }
        for rid, r in div["regions"].items()
    ]

@api_router.get("/views/{animal_id}/{division_id}/{region_id}")
async def get_views(animal_id: str, division_id: str, region_id: str):
    if animal_id != "horse" or division_id not in SKELETON:
        raise HTTPException(status_code=404, detail="No encontrado")
    div = SKELETON[division_id]
    if region_id not in div["regions"]:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    region = div["regions"][region_id]
    if "views" not in region:
        raise HTTPException(status_code=404, detail="Esta región no tiene vistas")
    return [
        {"id": vid, "name": v["name"], "desc": v["desc"], "image": v["image"], "bones": len(v["questions"])}
        for vid, v in region["views"].items()
    ]

@api_router.get("/exam-view/{animal_id}/{division_id}/{region_id}/{view_id}")
async def get_exam_view(animal_id: str, division_id: str, region_id: str, view_id: str, num: int = 5):
    if animal_id != "horse" or division_id not in SKELETON:
        raise HTTPException(status_code=404, detail="No encontrado")
    div = SKELETON[division_id]
    if region_id not in div["regions"]:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    region = div["regions"][region_id]
    if "views" not in region or view_id not in region["views"]:
        raise HTTPException(status_code=404, detail="Vista no encontrada")
    view = region["views"][view_id]
    bones = view["questions"]
    view_names = [b["name"] for b in bones]
    # Distractores de otras vistas de la misma región
    other_names = []
    for v in region["views"].values():
        for b in v["questions"]:
            if b["name"] not in view_names:
                other_names.append(b["name"])
    selected = random.sample(bones, min(num, len(bones)))
    questions = []
    for bone in selected:
        correct = bone["name"]
        same_view = [n for n in view_names if n != correct]
        random.shuffle(same_view)
        distractors = same_view[:3]
        if len(distractors) < 3:
            extra = random.sample(other_names, min(3 - len(distractors), len(other_names)))
            distractors.extend(extra)
        options = [correct] + distractors
        random.shuffle(options)
        questions.append({
            "id": str(uuid.uuid4()),
            "bone_id": bone["id"],
            "name": bone["name"],
            "qty": bone["qty"],
            "desc": bone["desc"],
            "x": bone["x"],
            "y": bone["y"],
            "color": bone["color"],
            "options": options,
            "answer": correct
        })
    return {
        "id": str(uuid.uuid4()),
        "region": region["name"],
        "view": view["name"],
        "image": view["image"],
        "total": len(questions),
        "questions": questions
    }

@api_router.get("/study-view/{animal_id}/{division_id}/{region_id}/{view_id}")
async def get_study_view(animal_id: str, division_id: str, region_id: str, view_id: str):
    if animal_id != "horse" or division_id not in SKELETON:
        raise HTTPException(status_code=404, detail="No encontrado")
    div = SKELETON[division_id]
    if region_id not in div["regions"]:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    region = div["regions"][region_id]
    if "views" not in region or view_id not in region["views"]:
        raise HTTPException(status_code=404, detail="Vista no encontrada")
    view = region["views"][view_id]
    return {
        "region": region["name"],
        "view": view["name"],
        "desc": view["desc"],
        "image": view["image"],
        "bones": [
            {"id": b["id"], "name": b["name"], "qty": b["qty"], "desc": b["desc"], "x": b["x"], "y": b["y"], "color": b["color"]}
            for b in view["questions"]
        ]
    }

@api_router.get("/exam/{animal_id}/{division_id}/{region_id}")
async def get_exam(animal_id: str, division_id: str, region_id: str, num: int = 5):
    if animal_id != "horse" or division_id not in SKELETON:
        raise HTTPException(status_code=404, detail="No encontrado")
    
    div = SKELETON[division_id]
    if region_id not in div["regions"]:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    
    region = div["regions"][region_id]
    bones = region["questions"]
    
    # Distractores: priorizar misma región, luego misma división
    region_names = [b["name"] for b in bones]
    division_names = []
    for r in div["regions"].values():
        for b in r["questions"]:
            if b["name"] not in region_names:
                division_names.append(b["name"])
    
    selected = random.sample(bones, min(num, len(bones)))
    
    questions = []
    for bone in selected:
        correct = bone["name"]
        # Primero llenar con huesos de la misma región
        same_region = [n for n in region_names if n != correct]
        random.shuffle(same_region)
        distractors = same_region[:3]
        # Si faltan, completar con huesos de la misma división
        if len(distractors) < 3:
            extra = random.sample(division_names, min(3 - len(distractors), len(division_names)))
            distractors.extend(extra)
        options = [correct] + distractors
        random.shuffle(options)
        
        questions.append({
            "id": str(uuid.uuid4()),
            "bone_id": bone["id"],
            "name": bone["name"],
            "qty": bone["qty"],
            "desc": bone["desc"],
            "x": bone["x"],
            "y": bone["y"],
            "color": bone["color"],
            "options": options,
            "answer": correct
        })
    
    return {
        "id": str(uuid.uuid4()),
        "region": region["name"],
        "image": region["image"],
        "total": len(questions),
        "questions": questions
    }

@api_router.get("/study/{animal_id}/{division_id}/{region_id}")
async def get_study(animal_id: str, division_id: str, region_id: str):
    if animal_id != "horse" or division_id not in SKELETON:
        raise HTTPException(status_code=404, detail="No encontrado")
    div = SKELETON[division_id]
    if region_id not in div["regions"]:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    region = div["regions"][region_id]
    return {
        "region": region["name"],
        "desc": region["desc"],
        "image": region["image"],
        "bones": [
            {"id": b["id"], "name": b["name"], "qty": b["qty"], "desc": b["desc"], "x": b["x"], "y": b["y"], "color": b["color"]}
            for b in region["questions"]
        ]
    }


# Servir assets (imágenes)
@api_router.get("/assets/{filename}")
async def get_asset(filename: str):
    file_path = ASSETS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return FileResponse(file_path)

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
