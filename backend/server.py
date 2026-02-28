from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# IMÁGENES ESPECÍFICAS POR REGIÓN - URLs verificadas que funcionan
REGION_IMAGES = {
    # Imagen del esqueleto completo etiquetado
    "skeleton_full": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
    # Cráneo de caballo
    "skull": "https://img.freepik.com/free-photo/horse-skull_1232-572.jpg",
    # Esqueleto vista lateral
    "lateral": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
}

# Estructura de datos con coordenadas de marcadores MUY ESPECÍFICAS para cada hueso
# Las coordenadas están basadas en la imagen del esqueleto de Freepik

SKELETON_DATA = {
    "axial": {
        "name": "Esqueleto Axial",
        "description": "Cráneo, columna vertebral y tórax - 81 huesos",
        "total_bones": 81,
        "regions": {
            "craneo": {
                "name": "Cráneo y Cara",
                "description": "34 huesos del cráneo y cara",
                "total_bones": 34,
                "image": REGION_IMAGES["skeleton_full"],
                "zoom_area": "head",  # Indica qué zona resaltar
                "bones": [
                    {"id": "frontal", "name": "Hueso Frontal", "qty": 2, "desc": "Forma la frente del caballo, visible en la parte superior de la cabeza", "x": 8, "y": 18, "color": "Rojo"},
                    {"id": "parietal", "name": "Hueso Parietal", "qty": 2, "desc": "En la parte superior del cráneo, detrás del frontal", "x": 12, "y": 16, "color": "Azul"},
                    {"id": "temporal", "name": "Hueso Temporal", "qty": 2, "desc": "Lateral del cráneo, contiene el oído", "x": 14, "y": 22, "color": "Verde"},
                    {"id": "occipital", "name": "Hueso Occipital", "qty": 1, "desc": "Parte posterior del cráneo, conecta con el atlas", "x": 16, "y": 20, "color": "Amarillo"},
                    {"id": "nasal", "name": "Hueso Nasal", "qty": 2, "desc": "Forma el puente de la nariz", "x": 5, "y": 22, "color": "Naranja"},
                    {"id": "maxilar", "name": "Maxilar Superior", "qty": 2, "desc": "Contiene los dientes superiores", "x": 6, "y": 28, "color": "Morado"},
                    {"id": "mandibula", "name": "Mandíbula", "qty": 2, "desc": "Hueso móvil inferior con dientes", "x": 10, "y": 38, "color": "Rojo"},
                    {"id": "cigomatico", "name": "Arco Cigomático", "qty": 2, "desc": "Forma el pómulo del caballo", "x": 12, "y": 26, "color": "Azul"},
                ]
            },
            "columna": {
                "name": "Columna Vertebral", 
                "description": "54 vértebras desde el cuello hasta la cola",
                "total_bones": 54,
                "image": REGION_IMAGES["skeleton_full"],
                "zoom_area": "spine",
                "bones": [
                    {"id": "atlas", "name": "Atlas (C1)", "qty": 1, "desc": "Primera vértebra cervical, permite mover la cabeza arriba/abajo", "x": 18, "y": 24, "color": "Rojo"},
                    {"id": "axis", "name": "Axis (C2)", "qty": 1, "desc": "Segunda vértebra, permite girar la cabeza", "x": 20, "y": 25, "color": "Azul"},
                    {"id": "cervical", "name": "Vértebras Cervicales C3-C7", "qty": 5, "desc": "Forman el cuello, muy móviles", "x": 24, "y": 28, "color": "Verde"},
                    {"id": "toracica", "name": "Vértebras Torácicas T1-T18", "qty": 18, "desc": "Se articulan con las costillas, forman la cruz", "x": 40, "y": 15, "color": "Amarillo"},
                    {"id": "lumbar", "name": "Vértebras Lumbares L1-L6", "qty": 6, "desc": "Región del lomo, sin costillas", "x": 56, "y": 20, "color": "Naranja"},
                    {"id": "sacro", "name": "Sacro (5 fusionadas)", "qty": 5, "desc": "Conecta con la pelvis en la grupa", "x": 68, "y": 24, "color": "Morado"},
                    {"id": "coccigea", "name": "Vértebras Coccígeas", "qty": 18, "desc": "Forman la cola del caballo", "x": 82, "y": 28, "color": "Rojo"},
                ]
            },
            "torax": {
                "name": "Caja Torácica",
                "description": "Costillas y esternón - 37 huesos",
                "total_bones": 37,
                "image": REGION_IMAGES["skeleton_full"],
                "zoom_area": "thorax",
                "bones": [
                    {"id": "costillas_v", "name": "Costillas Verdaderas (8 pares)", "qty": 16, "desc": "Se unen directamente al esternón", "x": 36, "y": 42, "color": "Azul"},
                    {"id": "costillas_f", "name": "Costillas Falsas (10 pares)", "qty": 20, "desc": "Se unen indirectamente o flotan", "x": 48, "y": 48, "color": "Verde"},
                    {"id": "esternon", "name": "Esternón", "qty": 1, "desc": "Hueso del pecho donde se unen las costillas", "x": 32, "y": 62, "color": "Rojo"},
                ]
            }
        }
    },
    "apendicular": {
        "name": "Esqueleto Apendicular",
        "description": "Extremidades anteriores y posteriores - 120 huesos",
        "total_bones": 120,
        "regions": {
            "anterior": {
                "name": "Miembro Anterior",
                "description": "Pata delantera - 20 huesos por lado (40 total)",
                "total_bones": 40,
                "image": REGION_IMAGES["skeleton_full"],
                "zoom_area": "forelimb",
                "bones": [
                    {"id": "escapula", "name": "Escápula (Omóplato)", "qty": 2, "desc": "Hueso plano triangular del hombro", "x": 26, "y": 34, "color": "Rojo"},
                    {"id": "humero", "name": "Húmero", "qty": 2, "desc": "Hueso del brazo, entre hombro y codo", "x": 28, "y": 46, "color": "Azul"},
                    {"id": "radio", "name": "Radio", "qty": 2, "desc": "Hueso principal del antebrazo", "x": 26, "y": 56, "color": "Verde"},
                    {"id": "cubito", "name": "Cúbito (Ulna)", "qty": 2, "desc": "Forma el codo, fusionado al radio", "x": 28, "y": 50, "color": "Amarillo"},
                    {"id": "carpo", "name": "Carpo (Rodilla)", "qty": 14, "desc": "7 huesos pequeños por lado", "x": 24, "y": 66, "color": "Naranja"},
                    {"id": "metacarpo", "name": "Metacarpo (Caña)", "qty": 2, "desc": "Hueso largo de la caña delantera", "x": 22, "y": 74, "color": "Morado"},
                    {"id": "cuartilla_a", "name": "Cuartilla (P1)", "qty": 2, "desc": "Primera falange", "x": 20, "y": 82, "color": "Rojo"},
                    {"id": "corona_a", "name": "Corona (P2)", "qty": 2, "desc": "Segunda falange", "x": 20, "y": 86, "color": "Azul"},
                    {"id": "tejuelo_a", "name": "Tejuelo (P3)", "qty": 2, "desc": "Hueso del casco", "x": 20, "y": 92, "color": "Verde"},
                ]
            },
            "posterior": {
                "name": "Miembro Posterior",
                "description": "Pata trasera - 40 huesos por lado (80 total)",
                "total_bones": 80,
                "image": REGION_IMAGES["skeleton_full"],
                "zoom_area": "hindlimb",
                "bones": [
                    {"id": "ilion", "name": "Ilion (Pelvis)", "qty": 2, "desc": "Parte superior de la cadera", "x": 70, "y": 26, "color": "Rojo"},
                    {"id": "isquion", "name": "Isquion", "qty": 2, "desc": "Parte posterior de la pelvis", "x": 74, "y": 32, "color": "Azul"},
                    {"id": "femur", "name": "Fémur", "qty": 2, "desc": "Hueso del muslo, el más fuerte", "x": 76, "y": 42, "color": "Verde"},
                    {"id": "rotula", "name": "Rótula (Patela)", "qty": 2, "desc": "Hueso de la rodilla verdadera", "x": 72, "y": 48, "color": "Amarillo"},
                    {"id": "tibia", "name": "Tibia", "qty": 2, "desc": "Hueso de la pierna", "x": 76, "y": 56, "color": "Naranja"},
                    {"id": "tarso", "name": "Tarso (Corvejón)", "qty": 12, "desc": "6 huesos por lado", "x": 78, "y": 66, "color": "Morado"},
                    {"id": "metatarso", "name": "Metatarso (Caña)", "qty": 2, "desc": "Caña de la pata trasera", "x": 80, "y": 74, "color": "Rojo"},
                    {"id": "cuartilla_p", "name": "Cuartilla (P1)", "qty": 2, "desc": "Primera falange trasera", "x": 80, "y": 82, "color": "Azul"},
                    {"id": "corona_p", "name": "Corona (P2)", "qty": 2, "desc": "Segunda falange trasera", "x": 80, "y": 86, "color": "Verde"},
                    {"id": "tejuelo_p", "name": "Tejuelo (P3)", "qty": 2, "desc": "Hueso del casco trasero", "x": 80, "y": 92, "color": "Amarillo"},
                ]
            }
        }
    }
}

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "VetBones API - 205 huesos del caballo"}

@api_router.get("/animals")
async def get_animals():
    return [{"id": "horse", "name": "Caballo", "bones": 205, "available": True}]

@api_router.get("/divisions/{animal_id}")
async def get_divisions(animal_id: str):
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    return [
        {"id": "axial", "name": "Esqueleto Axial", "desc": "Cráneo, columna y tórax", "bones": 81},
        {"id": "apendicular", "name": "Esqueleto Apendicular", "desc": "Patas delanteras y traseras", "bones": 120}
    ]

@api_router.get("/regions/{animal_id}/{division_id}")
async def get_regions(animal_id: str, division_id: str):
    if animal_id != "horse" or division_id not in SKELETON_DATA:
        raise HTTPException(status_code=404, detail="No encontrado")
    
    div = SKELETON_DATA[division_id]
    return [
        {
            "id": reg_id,
            "name": reg["name"],
            "desc": reg["description"],
            "bones": reg["total_bones"],
            "image": reg["image"],
            "zoom": reg["zoom_area"]
        }
        for reg_id, reg in div["regions"].items()
    ]

@api_router.get("/exam/{animal_id}/{division_id}/{region_id}")
async def get_exam(animal_id: str, division_id: str, region_id: str, num: int = 5):
    if animal_id != "horse" or division_id not in SKELETON_DATA:
        raise HTTPException(status_code=404, detail="No encontrado")
    
    div = SKELETON_DATA[division_id]
    if region_id not in div["regions"]:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    
    region = div["regions"][region_id]
    bones = region["bones"]
    
    # Todos los nombres de huesos para distractores
    all_names = []
    for d in SKELETON_DATA.values():
        for r in d["regions"].values():
            for b in r["bones"]:
                all_names.append(b["name"])
    
    # Seleccionar huesos aleatorios
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
        "image": region["image"],
        "zoom": region["zoom_area"],
        "total": len(questions),
        "questions": questions
    }

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
