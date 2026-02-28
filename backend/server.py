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

class Question(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    bone_id: str
    bone_name: str
    region: str
    image_url: str
    options: List[str]
    correct_answer: str
    highlight_description: str
    highlight_color: str
    marker_x: float  # Posición X del marcador (0-100%)
    marker_y: float  # Posición Y del marcador (0-100%)

class ExamResult(BaseModel):
    total_questions: int
    correct_answers: int
    percentage: float
    region: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Imagen base del esqueleto
BASE_IMG = "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg"

# Datos de huesos con coordenadas del marcador (posición aproximada en la imagen)
HORSE_BONES = {
    "cabeza": [
        {
            "id": "skull_01",
            "name": "Cráneo",
            "region": "cabeza",
            "description": "Estructura ósea redondeada que protege el cerebro.",
            "image_url": BASE_IMG,
            "highlight_color": "Rojo",
            "marker_x": 8,  # Posición X en porcentaje
            "marker_y": 22  # Posición Y en porcentaje
        },
        {
            "id": "mandible_01",
            "name": "Mandíbula",
            "region": "cabeza",
            "description": "Hueso móvil inferior de la cabeza con los dientes inferiores.",
            "image_url": BASE_IMG,
            "highlight_color": "Azul",
            "marker_x": 12,
            "marker_y": 35
        },
        {
            "id": "orbital_01",
            "name": "Órbita",
            "region": "cabeza",
            "description": "Cavidad ósea donde se aloja el ojo.",
            "image_url": BASE_IMG,
            "highlight_color": "Verde",
            "marker_x": 10,
            "marker_y": 18
        }
    ],
    "columna_vertebral": [
        {
            "id": "cervical_01",
            "name": "Vértebras Cervicales",
            "region": "columna_vertebral",
            "description": "7 vértebras del cuello, entre la cabeza y el tórax.",
            "image_url": BASE_IMG,
            "highlight_color": "Rojo",
            "marker_x": 22,
            "marker_y": 25
        },
        {
            "id": "thoracic_01",
            "name": "Vértebras Torácicas",
            "region": "columna_vertebral",
            "description": "18 vértebras en la región del lomo, con apófisis espinosas altas.",
            "image_url": BASE_IMG,
            "highlight_color": "Azul",
            "marker_x": 40,
            "marker_y": 18
        },
        {
            "id": "lumbar_01",
            "name": "Vértebras Lumbares",
            "region": "columna_vertebral",
            "description": "6 vértebras en la zona del lomo posterior.",
            "image_url": BASE_IMG,
            "highlight_color": "Verde",
            "marker_x": 55,
            "marker_y": 22
        },
        {
            "id": "sacral_01",
            "name": "Sacro",
            "region": "columna_vertebral",
            "description": "Vértebras fusionadas en la grupa, conectan con la pelvis.",
            "image_url": BASE_IMG,
            "highlight_color": "Amarillo",
            "marker_x": 68,
            "marker_y": 25
        }
    ],
    "extremidad_anterior": [
        {
            "id": "scapula_01",
            "name": "Escápula",
            "region": "extremidad_anterior",
            "description": "Hueso plano triangular en la parte superior del hombro.",
            "image_url": BASE_IMG,
            "highlight_color": "Rojo",
            "marker_x": 25,
            "marker_y": 35
        },
        {
            "id": "humerus_01",
            "name": "Húmero",
            "region": "extremidad_anterior",
            "description": "Hueso del brazo entre el hombro y el codo.",
            "image_url": BASE_IMG,
            "highlight_color": "Azul",
            "marker_x": 28,
            "marker_y": 48
        },
        {
            "id": "radius_01",
            "name": "Radio",
            "region": "extremidad_anterior",
            "description": "Hueso principal del antebrazo, debajo del codo.",
            "image_url": BASE_IMG,
            "highlight_color": "Verde",
            "marker_x": 26,
            "marker_y": 58
        },
        {
            "id": "ulna_01",
            "name": "Ulna (Cúbito)",
            "region": "extremidad_anterior",
            "description": "Forma el punto del codo (olécranon).",
            "image_url": BASE_IMG,
            "highlight_color": "Amarillo",
            "marker_x": 30,
            "marker_y": 52
        },
        {
            "id": "carpus_01",
            "name": "Carpo (Rodilla)",
            "region": "extremidad_anterior",
            "description": "Articulación de la rodilla del caballo, equivalente a la muñeca.",
            "image_url": BASE_IMG,
            "highlight_color": "Naranja",
            "marker_x": 24,
            "marker_y": 68
        },
        {
            "id": "metacarpus_01",
            "name": "Metacarpo (Caña)",
            "region": "extremidad_anterior",
            "description": "Hueso largo de la caña, entre rodilla y menudillo.",
            "image_url": BASE_IMG,
            "highlight_color": "Morado",
            "marker_x": 22,
            "marker_y": 78
        }
    ],
    "extremidad_posterior": [
        {
            "id": "pelvis_01",
            "name": "Pelvis (Ilion)",
            "region": "extremidad_posterior",
            "description": "Hueso de la cadera que conecta con el sacro.",
            "image_url": BASE_IMG,
            "highlight_color": "Rojo",
            "marker_x": 72,
            "marker_y": 30
        },
        {
            "id": "femur_01",
            "name": "Fémur",
            "region": "extremidad_posterior",
            "description": "Hueso del muslo, el más largo y fuerte del cuerpo.",
            "image_url": BASE_IMG,
            "highlight_color": "Azul",
            "marker_x": 78,
            "marker_y": 42
        },
        {
            "id": "patella_01",
            "name": "Rótula (Patella)",
            "region": "extremidad_posterior",
            "description": "Hueso de la rodilla verdadera (babilla).",
            "image_url": BASE_IMG,
            "highlight_color": "Verde",
            "marker_x": 72,
            "marker_y": 50
        },
        {
            "id": "tibia_01",
            "name": "Tibia",
            "region": "extremidad_posterior",
            "description": "Hueso de la pierna entre rodilla y corvejón.",
            "image_url": BASE_IMG,
            "highlight_color": "Amarillo",
            "marker_x": 75,
            "marker_y": 58
        },
        {
            "id": "tarsus_01",
            "name": "Tarso (Corvejón)",
            "region": "extremidad_posterior",
            "description": "Articulación del corvejón, equivalente al tobillo.",
            "image_url": BASE_IMG,
            "highlight_color": "Naranja",
            "marker_x": 78,
            "marker_y": 68
        },
        {
            "id": "metatarsus_01",
            "name": "Metatarso",
            "region": "extremidad_posterior",
            "description": "Caña de la extremidad posterior.",
            "image_url": BASE_IMG,
            "highlight_color": "Morado",
            "marker_x": 80,
            "marker_y": 78
        }
    ],
    "torax": [
        {
            "id": "sternum_01",
            "name": "Esternón",
            "region": "torax",
            "description": "Hueso plano en la parte inferior del pecho.",
            "image_url": BASE_IMG,
            "highlight_color": "Rojo",
            "marker_x": 35,
            "marker_y": 65
        },
        {
            "id": "ribs_01",
            "name": "Costillas",
            "region": "torax",
            "description": "18 pares que forman la caja torácica.",
            "image_url": BASE_IMG,
            "highlight_color": "Azul",
            "marker_x": 42,
            "marker_y": 45
        }
    ]
}

REGIONS = [
    {"id": "cabeza", "name": "Cabeza", "description": "Cráneo y mandíbula", "icon": "skull", "bone_count": len(HORSE_BONES["cabeza"])},
    {"id": "columna_vertebral", "name": "Columna Vertebral", "description": "Vértebras cervicales a sacras", "icon": "spine", "bone_count": len(HORSE_BONES["columna_vertebral"])},
    {"id": "torax", "name": "Tórax", "description": "Costillas y esternón", "icon": "ribs", "bone_count": len(HORSE_BONES["torax"])},
    {"id": "extremidad_anterior", "name": "Extremidad Anterior", "description": "Del hombro al casco", "icon": "arm", "bone_count": len(HORSE_BONES["extremidad_anterior"])},
    {"id": "extremidad_posterior", "name": "Extremidad Posterior", "description": "De la cadera al casco", "icon": "leg", "bone_count": len(HORSE_BONES["extremidad_posterior"])}
]

@api_router.get("/")
async def root():
    return {"message": "VetBones API"}

@api_router.get("/animals")
async def get_animals():
    return [
        {"id": "horse", "name": "Caballo", "name_scientific": "Equus caballus", "description": "Sistema óseo equino", "icon": "horse", "total_bones": 205, "available": True},
        {"id": "cow", "name": "Vaca", "name_scientific": "Bos taurus", "description": "Próximamente", "icon": "cow", "total_bones": 207, "available": False},
        {"id": "pig", "name": "Cerdo", "name_scientific": "Sus scrofa", "description": "Próximamente", "icon": "pig", "total_bones": 223, "available": False}
    ]

@api_router.get("/regions/{animal_id}")
async def get_regions(animal_id: str):
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    return REGIONS

@api_router.get("/bones/{animal_id}/{region_id}")
async def get_bones(animal_id: str, region_id: str):
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    if region_id not in HORSE_BONES:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    return HORSE_BONES[region_id]

@api_router.get("/exam/{animal_id}/{region_id}")
async def generate_exam(animal_id: str, region_id: str, num_questions: int = 5):
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    if region_id not in HORSE_BONES:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    
    bones = HORSE_BONES[region_id]
    all_bone_names = [bone["name"] for region_bones in HORSE_BONES.values() for bone in region_bones]
    
    questions = []
    selected_bones = random.sample(bones, min(num_questions, len(bones)))
    
    for bone in selected_bones:
        correct_answer = bone["name"]
        distractors = [name for name in all_bone_names if name != correct_answer]
        selected_distractors = random.sample(distractors, min(3, len(distractors)))
        options = [correct_answer] + selected_distractors
        random.shuffle(options)
        
        question = Question(
            bone_id=bone["id"],
            bone_name=bone["name"],
            region=region_id,
            image_url=bone["image_url"],
            options=options,
            correct_answer=correct_answer,
            highlight_description=bone["description"],
            highlight_color=bone["highlight_color"],
            marker_x=bone["marker_x"],
            marker_y=bone["marker_y"]
        )
        questions.append(question)
    
    return {
        "exam_id": str(uuid.uuid4()),
        "animal": animal_id,
        "region": region_id,
        "region_name": next((r["name"] for r in REGIONS if r["id"] == region_id), region_id),
        "total_questions": len(questions),
        "questions": questions
    }

@api_router.post("/exam/submit")
async def submit_exam(exam_result: ExamResult):
    return {"message": "Resultado registrado", "result": exam_result}

@api_router.get("/bone/{bone_id}")
async def get_bone_detail(bone_id: str):
    for region_bones in HORSE_BONES.values():
        for bone in region_bones:
            if bone["id"] == bone_id:
                return bone
    raise HTTPException(status_code=404, detail="Hueso no encontrado")

app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

logging.basicConfig(level=logging.INFO)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
