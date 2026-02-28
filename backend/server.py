from fastapi import FastAPI, APIRouter, HTTPException
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

# ============================================
# IMÁGENES DIFERENTES PARA CADA ZONA
# Usando OpenClipArt y otras fuentes estables
# ============================================
IMAGES = {
    # Cráneo - silueta de caballo con foco en cabeza
    "craneo": "https://openclipart.org/image/400px/255836",
    
    # Columna vertebral - silueta lateral del caballo
    "columna": "https://openclipart.org/image/400px/211621",
    
    # Tórax - otra vista del caballo
    "torax": "https://openclipart.org/image/400px/169761",
    
    # Miembro anterior - caballo con énfasis en patas
    "anterior": "https://cdn.iconscout.com/icon/premium/png-256-thumb/horse-skeleton-1-893895.png",
    
    # Miembro posterior - silueta de caballo
    "posterior": "https://openclipart.org/image/400px/255836",
}

# Datos de huesos organizados por región con IMÁGENES ESPECÍFICAS
SKELETON = {
    "axial": {
        "name": "Esqueleto Axial",
        "bones": 81,
        "regions": {
            "craneo": {
                "name": "Cráneo y Cara",
                "desc": "34 huesos del cráneo y cara",
                "bones": 34,
                "image": IMAGES["craneo"],  # IMAGEN DEL CRÁNEO
                "questions": [
                    {"id": "frontal", "name": "Hueso Frontal", "qty": 2, "desc": "Parte superior del cráneo, forma la frente", "x": 35, "y": 15, "color": "Rojo"},
                    {"id": "parietal", "name": "Hueso Parietal", "qty": 2, "desc": "Parte superior-posterior del cráneo", "x": 55, "y": 20, "color": "Azul"},
                    {"id": "temporal", "name": "Hueso Temporal", "qty": 2, "desc": "Lateral del cráneo, contiene el oído", "x": 65, "y": 35, "color": "Verde"},
                    {"id": "occipital", "name": "Hueso Occipital", "qty": 1, "desc": "Parte posterior del cráneo", "x": 75, "y": 40, "color": "Amarillo"},
                    {"id": "nasal", "name": "Hueso Nasal", "qty": 2, "desc": "Forma el puente de la nariz", "x": 15, "y": 30, "color": "Naranja"},
                    {"id": "maxilar", "name": "Maxilar Superior", "qty": 2, "desc": "Contiene los dientes superiores", "x": 25, "y": 50, "color": "Morado"},
                    {"id": "mandibula", "name": "Mandíbula", "qty": 2, "desc": "Hueso móvil inferior con dientes", "x": 40, "y": 75, "color": "Rojo"},
                    {"id": "orbita", "name": "Órbita Ocular", "qty": 2, "desc": "Cavidad donde se aloja el ojo", "x": 30, "y": 35, "color": "Azul"},
                ]
            },
            "columna": {
                "name": "Columna Vertebral",
                "desc": "54 vértebras desde cuello hasta cola",
                "bones": 54,
                "image": IMAGES["columna"],  # IMAGEN DE LA COLUMNA
                "questions": [
                    {"id": "atlas", "name": "Atlas (C1)", "qty": 1, "desc": "Primera vértebra cervical", "x": 12, "y": 28, "color": "Rojo"},
                    {"id": "axis", "name": "Axis (C2)", "qty": 1, "desc": "Segunda vértebra cervical", "x": 15, "y": 30, "color": "Azul"},
                    {"id": "cervicales", "name": "Vértebras Cervicales C3-C7", "qty": 5, "desc": "Vértebras del cuello", "x": 22, "y": 35, "color": "Verde"},
                    {"id": "toracicas", "name": "Vértebras Torácicas T1-T18", "qty": 18, "desc": "Se articulan con las costillas", "x": 45, "y": 18, "color": "Amarillo"},
                    {"id": "lumbares", "name": "Vértebras Lumbares L1-L6", "qty": 6, "desc": "Región del lomo", "x": 62, "y": 22, "color": "Naranja"},
                    {"id": "sacro", "name": "Sacro", "qty": 5, "desc": "Vértebras fusionadas de la grupa", "x": 72, "y": 28, "color": "Morado"},
                    {"id": "coccigeas", "name": "Vértebras Coccígeas", "qty": 18, "desc": "Forman la cola", "x": 88, "y": 35, "color": "Rojo"},
                ]
            },
            "torax": {
                "name": "Caja Torácica",
                "desc": "Costillas y esternón - 37 huesos",
                "bones": 37,
                "image": IMAGES["torax"],  # IMAGEN DEL TÓRAX
                "questions": [
                    {"id": "costillas_v", "name": "Costillas Verdaderas", "qty": 16, "desc": "8 pares que se unen al esternón", "x": 38, "y": 45, "color": "Azul"},
                    {"id": "costillas_f", "name": "Costillas Falsas", "qty": 20, "desc": "10 pares con unión indirecta", "x": 52, "y": 50, "color": "Verde"},
                    {"id": "esternon", "name": "Esternón", "qty": 1, "desc": "Hueso del pecho", "x": 35, "y": 70, "color": "Rojo"},
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
                "image": IMAGES["anterior"],  # IMAGEN DE PATA DELANTERA
                "questions": [
                    {"id": "escapula", "name": "Escápula", "qty": 2, "desc": "Hueso del hombro", "x": 50, "y": 8, "color": "Rojo"},
                    {"id": "humero", "name": "Húmero", "qty": 2, "desc": "Hueso del brazo", "x": 48, "y": 18, "color": "Azul"},
                    {"id": "radio", "name": "Radio", "qty": 2, "desc": "Hueso del antebrazo", "x": 45, "y": 32, "color": "Verde"},
                    {"id": "cubito", "name": "Cúbito (Ulna)", "qty": 2, "desc": "Forma el codo", "x": 52, "y": 25, "color": "Amarillo"},
                    {"id": "carpo", "name": "Carpo (Rodilla)", "qty": 14, "desc": "Articulación de la rodilla", "x": 42, "y": 45, "color": "Naranja"},
                    {"id": "metacarpo", "name": "Metacarpo (Caña)", "qty": 2, "desc": "Hueso de la caña", "x": 40, "y": 58, "color": "Morado"},
                    {"id": "cuartilla", "name": "Cuartilla (P1)", "qty": 2, "desc": "Primera falange", "x": 38, "y": 72, "color": "Rojo"},
                    {"id": "corona", "name": "Corona (P2)", "qty": 2, "desc": "Segunda falange", "x": 36, "y": 82, "color": "Azul"},
                    {"id": "tejuelo", "name": "Tejuelo (P3)", "qty": 2, "desc": "Hueso del casco", "x": 35, "y": 92, "color": "Verde"},
                ]
            },
            "posterior": {
                "name": "Miembro Posterior",
                "desc": "Pata trasera - 80 huesos",
                "bones": 80,
                "image": IMAGES["posterior"],  # IMAGEN DE PATA TRASERA
                "questions": [
                    {"id": "pelvis", "name": "Pelvis (Ilion)", "qty": 2, "desc": "Hueso de la cadera", "x": 25, "y": 25, "color": "Rojo"},
                    {"id": "femur", "name": "Fémur", "qty": 2, "desc": "Hueso del muslo", "x": 72, "y": 35, "color": "Azul"},
                    {"id": "rotula", "name": "Rótula", "qty": 2, "desc": "Hueso de la rodilla", "x": 68, "y": 45, "color": "Verde"},
                    {"id": "tibia", "name": "Tibia", "qty": 2, "desc": "Hueso de la pierna", "x": 72, "y": 55, "color": "Amarillo"},
                    {"id": "tarso", "name": "Tarso (Corvejón)", "qty": 12, "desc": "Articulación del corvejón", "x": 75, "y": 68, "color": "Naranja"},
                    {"id": "metatarso", "name": "Metatarso", "qty": 2, "desc": "Caña trasera", "x": 78, "y": 78, "color": "Morado"},
                    {"id": "falanges_p", "name": "Falanges Posteriores", "qty": 6, "desc": "Dedos de la pata trasera", "x": 80, "y": 90, "color": "Rojo"},
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
    return {"message": "VetBones API - 205 huesos"}

@api_router.get("/animals")
async def get_animals():
    return [{"id": "horse", "name": "Caballo", "bones": 205, "available": True}]

@api_router.get("/divisions/{animal_id}")
async def get_divisions(animal_id: str):
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="No disponible")
    return [
        {"id": "axial", "name": "Esqueleto Axial", "desc": "Cráneo, columna, tórax", "bones": 81},
        {"id": "apendicular", "name": "Esqueleto Apendicular", "desc": "Patas", "bones": 120}
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
            "image": r["image"]  # Imagen específica de la región
        }
        for rid, r in div["regions"].items()
    ]

@api_router.get("/exam/{animal_id}/{division_id}/{region_id}")
async def get_exam(animal_id: str, division_id: str, region_id: str, num: int = 5):
    if animal_id != "horse" or division_id not in SKELETON:
        raise HTTPException(status_code=404, detail="No encontrado")
    
    div = SKELETON[division_id]
    if region_id not in div["regions"]:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    
    region = div["regions"][region_id]
    bones = region["questions"]
    
    # Todos los nombres para distractores
    all_names = []
    for d in SKELETON.values():
        for r in d["regions"].values():
            for b in r["questions"]:
                all_names.append(b["name"])
    
    selected = random.sample(bones, min(num, len(bones)))
    
    questions = []
    for bone in selected:
        correct = bone["name"]
        distractors = [n for n in all_names if n != correct]
        options = [correct] + random.sample(distractors, 3)
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
        "image": region["image"],  # IMAGEN ESPECÍFICA DE ESTA REGIÓN
        "total": len(questions),
        "questions": questions
    }

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
