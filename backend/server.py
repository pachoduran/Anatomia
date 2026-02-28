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

# Imágenes por región anatómica
IMAGES = {
    "craneo": "https://cdn.britannica.com/49/129149-050-32311D6A/skull-Horse.jpg",
    "columna": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
    "torax": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
    "miembro_anterior": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
    "miembro_posterior": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
    "general": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg"
}

# ESTRUCTURA COMPLETA DEL ESQUELETO EQUINO (205 huesos)
HORSE_SKELETON = {
    "axial": {
        "id": "axial",
        "name": "Esqueleto Axial",
        "description": "Eje central del animal - protege sistema nervioso y órganos vitales",
        "total_bones": 81,
        "subdivisions": {
            "craneo_cara": {
                "id": "craneo_cara",
                "name": "Cráneo y Cara",
                "description": "34 huesos que forman la cabeza",
                "total_bones": 34,
                "image_url": IMAGES["craneo"],
                "sections": {
                    "neurocraneo": {
                        "name": "Neurocráneo (Cráneo)",
                        "bones": [
                            {"id": "occipital", "name": "Occipital", "quantity": 1, "description": "Hueso posterior del cráneo, contiene el foramen magno", "marker_x": 85, "marker_y": 35, "color": "Rojo"},
                            {"id": "esfenoides", "name": "Esfenoides", "quantity": 1, "description": "Hueso en la base del cráneo, forma parte de la órbita", "marker_x": 50, "marker_y": 45, "color": "Azul"},
                            {"id": "etmoides", "name": "Etmoides", "quantity": 1, "description": "Hueso entre las cavidades nasales y el cráneo", "marker_x": 35, "marker_y": 40, "color": "Verde"},
                            {"id": "interparietal", "name": "Interparietal", "quantity": 1, "description": "Hueso pequeño entre los parietales", "marker_x": 70, "marker_y": 15, "color": "Amarillo"},
                            {"id": "parietal", "name": "Parietales", "quantity": 2, "description": "Huesos laterales superiores del cráneo", "marker_x": 65, "marker_y": 20, "color": "Naranja"},
                            {"id": "frontal", "name": "Frontales", "quantity": 2, "description": "Huesos de la frente, contienen senos frontales", "marker_x": 45, "marker_y": 15, "color": "Morado"},
                            {"id": "temporal", "name": "Temporales", "quantity": 2, "description": "Huesos laterales con la articulación mandibular", "marker_x": 75, "marker_y": 40, "color": "Rojo"}
                        ]
                    },
                    "esplacnocraneo": {
                        "name": "Esplacnocráneo (Cara)",
                        "bones": [
                            {"id": "nasal", "name": "Nasales", "quantity": 2, "description": "Forman el puente de la nariz", "marker_x": 25, "marker_y": 25, "color": "Azul"},
                            {"id": "lagrimal", "name": "Lagrimales", "quantity": 2, "description": "Forman parte de la órbita ocular", "marker_x": 40, "marker_y": 30, "color": "Verde"},
                            {"id": "cigomatico", "name": "Cigomáticos (Malares)", "quantity": 2, "description": "Forman el arco cigomático", "marker_x": 55, "marker_y": 45, "color": "Amarillo"},
                            {"id": "maxilar", "name": "Maxilares", "quantity": 2, "description": "Hueso superior de la mandíbula con dientes", "marker_x": 35, "marker_y": 55, "color": "Naranja"},
                            {"id": "premaxilar", "name": "Premaxilares (Incisivos)", "quantity": 2, "description": "Contienen los dientes incisivos superiores", "marker_x": 15, "marker_y": 50, "color": "Morado"},
                            {"id": "palatino", "name": "Palatinos", "quantity": 2, "description": "Forman el paladar duro posterior", "marker_x": 40, "marker_y": 65, "color": "Rojo"},
                            {"id": "vomer", "name": "Vómer", "quantity": 1, "description": "Hueso del tabique nasal", "marker_x": 30, "marker_y": 45, "color": "Azul"},
                            {"id": "cornete", "name": "Cornetes (Turbinados)", "quantity": 4, "description": "Estructuras en las cavidades nasales", "marker_x": 28, "marker_y": 38, "color": "Verde"},
                            {"id": "mandibula", "name": "Mandíbula", "quantity": 2, "description": "Hueso móvil inferior con dientes", "marker_x": 45, "marker_y": 75, "color": "Amarillo"},
                            {"id": "hioides", "name": "Hioides", "quantity": 5, "description": "Huesos pequeños en la base de la lengua", "marker_x": 60, "marker_y": 70, "color": "Naranja"}
                        ]
                    }
                }
            },
            "columna_vertebral": {
                "id": "columna_vertebral",
                "name": "Columna Vertebral",
                "description": "54 vértebras que forman el eje del cuerpo",
                "total_bones": 54,
                "image_url": IMAGES["columna"],
                "sections": {
                    "cervicales": {
                        "name": "Vértebras Cervicales (Cuello)",
                        "bones": [
                            {"id": "atlas", "name": "Atlas (C1)", "quantity": 1, "description": "Primera vértebra cervical, permite movimiento de cabeza", "marker_x": 18, "marker_y": 25, "color": "Rojo"},
                            {"id": "axis", "name": "Axis (C2)", "quantity": 1, "description": "Segunda vértebra cervical, permite rotación", "marker_x": 20, "marker_y": 26, "color": "Azul"},
                            {"id": "cervical_3_7", "name": "Cervicales C3-C7", "quantity": 5, "description": "Vértebras del cuello", "marker_x": 25, "marker_y": 28, "color": "Verde"}
                        ]
                    },
                    "toracicas": {
                        "name": "Vértebras Torácicas (Dorso)",
                        "bones": [
                            {"id": "toracica", "name": "Vértebras Torácicas T1-T18", "quantity": 18, "description": "Se articulan con las costillas", "marker_x": 42, "marker_y": 18, "color": "Amarillo"}
                        ]
                    },
                    "lumbares": {
                        "name": "Vértebras Lumbares (Lomo)",
                        "bones": [
                            {"id": "lumbar", "name": "Vértebras Lumbares L1-L6", "quantity": 6, "description": "Región del lomo, sin costillas", "marker_x": 58, "marker_y": 22, "color": "Naranja"}
                        ]
                    },
                    "sacras": {
                        "name": "Vértebras Sacras (Grupa)",
                        "bones": [
                            {"id": "sacro", "name": "Sacro (5 fusionadas)", "quantity": 5, "description": "Vértebras fusionadas que conectan con la pelvis", "marker_x": 70, "marker_y": 25, "color": "Morado"}
                        ]
                    },
                    "coccigeas": {
                        "name": "Vértebras Coccígeas (Cola)",
                        "bones": [
                            {"id": "coccigea", "name": "Vértebras Coccígeas", "quantity": 18, "description": "Forman la cola (15-21 variable)", "marker_x": 85, "marker_y": 30, "color": "Rojo"}
                        ]
                    }
                }
            },
            "caja_toracica": {
                "id": "caja_toracica",
                "name": "Caja Torácica",
                "description": "37 huesos que protegen corazón y pulmones",
                "total_bones": 37,
                "image_url": IMAGES["torax"],
                "sections": {
                    "costillas": {
                        "name": "Costillas",
                        "bones": [
                            {"id": "costilla_verdadera", "name": "Costillas Verdaderas", "quantity": 16, "description": "8 pares que se unen directamente al esternón", "marker_x": 38, "marker_y": 45, "color": "Azul"},
                            {"id": "costilla_falsa", "name": "Costillas Falsas", "quantity": 20, "description": "10 pares con unión indirecta", "marker_x": 48, "marker_y": 50, "color": "Verde"}
                        ]
                    },
                    "esternon": {
                        "name": "Esternón",
                        "bones": [
                            {"id": "esternon", "name": "Esternón", "quantity": 1, "description": "Compuesto por 7 esternebras fusionadas", "marker_x": 35, "marker_y": 65, "color": "Amarillo"}
                        ]
                    }
                }
            }
        }
    },
    "apendicular": {
        "id": "apendicular",
        "name": "Esqueleto Apendicular",
        "description": "Extremidades delanteras y traseras - 120 huesos",
        "total_bones": 120,
        "subdivisions": {
            "miembro_toracico": {
                "id": "miembro_toracico",
                "name": "Miembros Torácicos (Anteriores)",
                "description": "40 huesos - 20 por cada pata delantera",
                "total_bones": 40,
                "image_url": IMAGES["miembro_anterior"],
                "sections": {
                    "hombro": {
                        "name": "Hombro",
                        "bones": [
                            {"id": "escapula", "name": "Escápula", "quantity": 2, "description": "Hueso plano del hombro (1 por lado)", "marker_x": 25, "marker_y": 35, "color": "Rojo"}
                        ]
                    },
                    "brazo": {
                        "name": "Brazo",
                        "bones": [
                            {"id": "humero", "name": "Húmero", "quantity": 2, "description": "Hueso del brazo (1 por lado)", "marker_x": 28, "marker_y": 48, "color": "Azul"}
                        ]
                    },
                    "antebrazo": {
                        "name": "Antebrazo",
                        "bones": [
                            {"id": "radio", "name": "Radio", "quantity": 2, "description": "Hueso principal del antebrazo", "marker_x": 26, "marker_y": 58, "color": "Verde"},
                            {"id": "cubito", "name": "Cúbito (Ulna)", "quantity": 2, "description": "Parcialmente fusionado al radio", "marker_x": 28, "marker_y": 52, "color": "Amarillo"}
                        ]
                    },
                    "carpo": {
                        "name": "Carpo (Rodilla)",
                        "bones": [
                            {"id": "carpo", "name": "Huesos del Carpo", "quantity": 14, "description": "7 huesos por lado en dos filas", "marker_x": 24, "marker_y": 68, "color": "Naranja"}
                        ]
                    },
                    "metacarpo": {
                        "name": "Metacarpo",
                        "bones": [
                            {"id": "metacarpo_iii", "name": "Gran Metacarpiano (Caña)", "quantity": 2, "description": "Hueso principal de la caña", "marker_x": 22, "marker_y": 76, "color": "Morado"},
                            {"id": "metacarpo_ii_iv", "name": "Pequeños Metacarpianos (Splints)", "quantity": 4, "description": "Huesos rudimentarios laterales", "marker_x": 24, "marker_y": 74, "color": "Rojo"}
                        ]
                    },
                    "falanges_ant": {
                        "name": "Falanges y Sesamoideos",
                        "bones": [
                            {"id": "sesamoideo_prox_ant", "name": "Sesamoideos Proximales", "quantity": 4, "description": "2 por menudillo", "marker_x": 20, "marker_y": 82, "color": "Azul"},
                            {"id": "falange_1_ant", "name": "Primera Falange (Cuartilla)", "quantity": 2, "description": "Falange proximal", "marker_x": 20, "marker_y": 85, "color": "Verde"},
                            {"id": "falange_2_ant", "name": "Segunda Falange (Corona)", "quantity": 2, "description": "Falange media", "marker_x": 20, "marker_y": 88, "color": "Amarillo"},
                            {"id": "falange_3_ant", "name": "Tercera Falange (Tejuelo)", "quantity": 2, "description": "Hueso del casco", "marker_x": 20, "marker_y": 92, "color": "Naranja"},
                            {"id": "navicular_ant", "name": "Hueso Navicular", "quantity": 2, "description": "Sesamoideo distal", "marker_x": 22, "marker_y": 90, "color": "Morado"}
                        ]
                    }
                }
            },
            "miembro_pelvico": {
                "id": "miembro_pelvico",
                "name": "Miembros Pélvicos (Posteriores)",
                "description": "80 huesos - 40 por cada lado incluyendo pelvis",
                "total_bones": 80,
                "image_url": IMAGES["miembro_posterior"],
                "sections": {
                    "pelvis": {
                        "name": "Cintura Pélvica",
                        "bones": [
                            {"id": "ilion", "name": "Ilion", "quantity": 2, "description": "Parte superior de la pelvis", "marker_x": 72, "marker_y": 25, "color": "Rojo"},
                            {"id": "isquion", "name": "Isquion", "quantity": 2, "description": "Parte posterior de la pelvis", "marker_x": 75, "marker_y": 32, "color": "Azul"},
                            {"id": "pubis", "name": "Pubis", "quantity": 2, "description": "Parte ventral de la pelvis", "marker_x": 68, "marker_y": 38, "color": "Verde"}
                        ]
                    },
                    "muslo": {
                        "name": "Muslo",
                        "bones": [
                            {"id": "femur", "name": "Fémur", "quantity": 2, "description": "Hueso más largo y fuerte del cuerpo", "marker_x": 78, "marker_y": 42, "color": "Amarillo"}
                        ]
                    },
                    "rodilla": {
                        "name": "Rodilla (Babilla)",
                        "bones": [
                            {"id": "rotula", "name": "Rótula (Patela)", "quantity": 2, "description": "Hueso de la rodilla verdadera", "marker_x": 72, "marker_y": 50, "color": "Naranja"}
                        ]
                    },
                    "pierna": {
                        "name": "Pierna",
                        "bones": [
                            {"id": "tibia", "name": "Tibia", "quantity": 2, "description": "Hueso principal de la pierna", "marker_x": 75, "marker_y": 58, "color": "Morado"},
                            {"id": "perone", "name": "Peroné", "quantity": 2, "description": "Reducido y fusionado a la tibia", "marker_x": 77, "marker_y": 56, "color": "Rojo"}
                        ]
                    },
                    "tarso": {
                        "name": "Tarso (Corvejón)",
                        "bones": [
                            {"id": "tarso", "name": "Huesos del Tarso", "quantity": 12, "description": "6 huesos por lado (astrágalo, calcáneo, etc.)", "marker_x": 78, "marker_y": 68, "color": "Azul"}
                        ]
                    },
                    "metatarso": {
                        "name": "Metatarso",
                        "bones": [
                            {"id": "metatarso_iii", "name": "Gran Metatarsiano (Caña)", "quantity": 2, "description": "Caña posterior", "marker_x": 80, "marker_y": 76, "color": "Verde"},
                            {"id": "metatarso_ii_iv", "name": "Pequeños Metatarsianos", "quantity": 4, "description": "Rudimentarios laterales", "marker_x": 82, "marker_y": 74, "color": "Amarillo"}
                        ]
                    },
                    "falanges_post": {
                        "name": "Falanges y Sesamoideos Posteriores",
                        "bones": [
                            {"id": "sesamoideo_prox_post", "name": "Sesamoideos Proximales", "quantity": 4, "description": "2 por menudillo posterior", "marker_x": 80, "marker_y": 82, "color": "Naranja"},
                            {"id": "falange_1_post", "name": "Primera Falange (Cuartilla)", "quantity": 2, "description": "Falange proximal posterior", "marker_x": 80, "marker_y": 85, "color": "Morado"},
                            {"id": "falange_2_post", "name": "Segunda Falange (Corona)", "quantity": 2, "description": "Falange media posterior", "marker_x": 80, "marker_y": 88, "color": "Rojo"},
                            {"id": "falange_3_post", "name": "Tercera Falange (Tejuelo)", "quantity": 2, "description": "Hueso del casco posterior", "marker_x": 80, "marker_y": 92, "color": "Azul"},
                            {"id": "navicular_post", "name": "Hueso Navicular", "quantity": 2, "description": "Sesamoideo distal posterior", "marker_x": 82, "marker_y": 90, "color": "Verde"}
                        ]
                    }
                }
            }
        }
    }
}

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "VetBones API - Sistema Óseo Equino Completo (205 huesos)"}

@api_router.get("/animals")
async def get_animals():
    return [
        {"id": "horse", "name": "Caballo", "name_scientific": "Equus caballus", "description": "Sistema óseo equino completo - 205 huesos", "total_bones": 205, "available": True},
        {"id": "cow", "name": "Vaca", "name_scientific": "Bos taurus", "description": "Próximamente", "total_bones": 207, "available": False}
    ]

@api_router.get("/divisions/{animal_id}")
async def get_divisions(animal_id: str):
    """Obtener las divisiones principales: Axial y Apendicular"""
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    
    return [
        {
            "id": "axial",
            "name": "Esqueleto Axial",
            "description": "Eje central: cráneo, columna y tórax",
            "total_bones": 81,
            "icon": "body"
        },
        {
            "id": "apendicular",
            "name": "Esqueleto Apendicular",
            "description": "Extremidades anteriores y posteriores",
            "total_bones": 120,
            "icon": "walk"
        }
    ]

@api_router.get("/subdivisions/{animal_id}/{division_id}")
async def get_subdivisions(animal_id: str, division_id: str):
    """Obtener subdivisiones de una división"""
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    
    if division_id not in HORSE_SKELETON:
        raise HTTPException(status_code=404, detail="División no encontrada")
    
    division = HORSE_SKELETON[division_id]
    subdivisions = []
    
    for sub_id, sub_data in division["subdivisions"].items():
        subdivisions.append({
            "id": sub_id,
            "name": sub_data["name"],
            "description": sub_data["description"],
            "total_bones": sub_data["total_bones"],
            "image_url": sub_data.get("image_url", IMAGES["general"])
        })
    
    return subdivisions

@api_router.get("/sections/{animal_id}/{division_id}/{subdivision_id}")
async def get_sections(animal_id: str, division_id: str, subdivision_id: str):
    """Obtener secciones de una subdivisión"""
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    
    if division_id not in HORSE_SKELETON:
        raise HTTPException(status_code=404, detail="División no encontrada")
    
    division = HORSE_SKELETON[division_id]
    if subdivision_id not in division["subdivisions"]:
        raise HTTPException(status_code=404, detail="Subdivisión no encontrada")
    
    subdivision = division["subdivisions"][subdivision_id]
    sections = []
    
    for sec_id, sec_data in subdivision["sections"].items():
        bone_count = sum(b["quantity"] for b in sec_data["bones"])
        sections.append({
            "id": sec_id,
            "name": sec_data["name"],
            "bone_count": bone_count,
            "bones": sec_data["bones"]
        })
    
    return {
        "subdivision_name": subdivision["name"],
        "image_url": subdivision.get("image_url", IMAGES["general"]),
        "sections": sections
    }

@api_router.get("/exam/{animal_id}/{division_id}/{subdivision_id}")
async def generate_exam(animal_id: str, division_id: str, subdivision_id: str, num_questions: int = 5):
    """Generar examen para una subdivisión específica"""
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    
    if division_id not in HORSE_SKELETON:
        raise HTTPException(status_code=404, detail="División no encontrada")
    
    division = HORSE_SKELETON[division_id]
    if subdivision_id not in division["subdivisions"]:
        raise HTTPException(status_code=404, detail="Subdivisión no encontrada")
    
    subdivision = division["subdivisions"][subdivision_id]
    
    # Recopilar todos los huesos de esta subdivisión
    all_bones = []
    for section in subdivision["sections"].values():
        for bone in section["bones"]:
            all_bones.append(bone)
    
    # Recopilar nombres de todos los huesos para distractores
    all_bone_names = []
    for div in HORSE_SKELETON.values():
        for subdiv in div["subdivisions"].values():
            for section in subdiv["sections"].values():
                for bone in section["bones"]:
                    all_bone_names.append(bone["name"])
    
    # Seleccionar huesos para el examen
    selected_bones = random.sample(all_bones, min(num_questions, len(all_bones)))
    
    questions = []
    for bone in selected_bones:
        correct_answer = bone["name"]
        distractors = [name for name in all_bone_names if name != correct_answer]
        selected_distractors = random.sample(distractors, min(3, len(distractors)))
        options = [correct_answer] + selected_distractors
        random.shuffle(options)
        
        questions.append({
            "id": str(uuid.uuid4()),
            "bone_id": bone["id"],
            "bone_name": bone["name"],
            "description": bone["description"],
            "quantity": bone["quantity"],
            "image_url": subdivision.get("image_url", IMAGES["general"]),
            "marker_x": bone["marker_x"],
            "marker_y": bone["marker_y"],
            "highlight_color": bone["color"],
            "options": options,
            "correct_answer": correct_answer
        })
    
    return {
        "exam_id": str(uuid.uuid4()),
        "division": division["name"],
        "subdivision": subdivision["name"],
        "image_url": subdivision.get("image_url", IMAGES["general"]),
        "total_questions": len(questions),
        "questions": questions
    }

# Mantener compatibilidad con rutas anteriores
@api_router.get("/regions/{animal_id}")
async def get_regions(animal_id: str):
    return await get_divisions(animal_id)

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
