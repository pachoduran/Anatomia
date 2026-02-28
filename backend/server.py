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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class Bone(BaseModel):
    id: str
    name: str
    name_latin: Optional[str] = None
    region: str
    description: str
    image_url: str
    highlight_color: str = "Rojo"

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

class ExamResult(BaseModel):
    total_questions: int
    correct_answers: int
    percentage: float
    region: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Region(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    bone_count: int

# Imágenes funcionales de diferentes huesos
# Usando Freepik y otras fuentes abiertas
BASE_SKELETON_IMG = "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg"

HORSE_BONES = {
    "cabeza": [
        {
            "id": "skull_01",
            "name": "Cráneo",
            "name_latin": "Cranium",
            "region": "cabeza",
            "description": "Estructura ósea que protege el cerebro. En la imagen, es la parte más anterior del esqueleto, de forma redondeada.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Rojo"
        },
        {
            "id": "mandible_01",
            "name": "Mandíbula",
            "name_latin": "Mandibula",
            "region": "cabeza",
            "description": "Hueso móvil inferior de la cabeza. En la imagen, es el hueso alargado debajo del cráneo que contiene los dientes inferiores.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Azul"
        },
        {
            "id": "maxilla_01",
            "name": "Maxilar",
            "name_latin": "Maxilla",
            "region": "cabeza",
            "description": "Hueso superior que contiene los dientes superiores. Forma la parte superior de la cara del caballo.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Verde"
        }
    ],
    "columna_vertebral": [
        {
            "id": "cervical_01",
            "name": "Vértebras Cervicales",
            "name_latin": "Vertebrae cervicales",
            "region": "columna_vertebral",
            "description": "7 vértebras que forman el cuello. En la imagen, son los huesos entre la cabeza y el tronco que permiten el movimiento del cuello.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Rojo"
        },
        {
            "id": "thoracic_01",
            "name": "Vértebras Torácicas",
            "name_latin": "Vertebrae thoracicae",
            "region": "columna_vertebral",
            "description": "18 vértebras en la región del tórax. Se articulan con las costillas. Forman la parte superior del lomo.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Azul"
        },
        {
            "id": "lumbar_01",
            "name": "Vértebras Lumbares",
            "name_latin": "Vertebrae lumbales",
            "region": "columna_vertebral",
            "description": "6 vértebras en la región del lomo, posterior a las torácicas. No tienen articulación con costillas.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Verde"
        },
        {
            "id": "sacral_01",
            "name": "Sacro",
            "name_latin": "Os sacrum",
            "region": "columna_vertebral",
            "description": "5 vértebras fusionadas que conectan con la pelvis. Está ubicado en la grupa del caballo.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Amarillo"
        }
    ],
    "extremidad_anterior": [
        {
            "id": "scapula_01",
            "name": "Escápula",
            "name_latin": "Scapula",
            "region": "extremidad_anterior",
            "description": "Hueso plano triangular en la parte superior del miembro anterior. También llamado omóplato. Conecta el brazo con el tronco.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Rojo"
        },
        {
            "id": "humerus_01",
            "name": "Húmero",
            "name_latin": "Humerus",
            "region": "extremidad_anterior",
            "description": "Hueso largo del brazo, ubicado entre la escápula y el codo. Se articula proximalmente con la escápula.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Azul"
        },
        {
            "id": "radius_01",
            "name": "Radio",
            "name_latin": "Radius",
            "region": "extremidad_anterior",
            "description": "Hueso principal del antebrazo, ubicado entre el codo y la rodilla. Soporta la mayor parte del peso del miembro anterior.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Verde"
        },
        {
            "id": "ulna_01",
            "name": "Ulna (Cúbito)",
            "name_latin": "Ulna",
            "region": "extremidad_anterior",
            "description": "Hueso fusionado con el radio en equinos adultos. El olécranon (punta del codo) es la parte visible de la ulna.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Amarillo"
        },
        {
            "id": "carpus_01",
            "name": "Carpo (Rodilla)",
            "name_latin": "Carpus",
            "region": "extremidad_anterior",
            "description": "Conjunto de 7-8 huesos pequeños que forman la 'rodilla' del caballo. Equivalente a la muñeca humana.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Naranja"
        },
        {
            "id": "metacarpal_01",
            "name": "Metacarpo (Caña)",
            "name_latin": "Os metacarpale III",
            "region": "extremidad_anterior",
            "description": "Hueso largo entre el carpo y las falanges. El tercer metacarpiano es el hueso principal de la caña.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Morado"
        }
    ],
    "extremidad_posterior": [
        {
            "id": "pelvis_01",
            "name": "Pelvis",
            "name_latin": "Os coxae",
            "region": "extremidad_posterior",
            "description": "Cintura pélvica formada por ilion, isquion y pubis. Conecta el miembro posterior con la columna vertebral.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Rojo"
        },
        {
            "id": "femur_01",
            "name": "Fémur",
            "name_latin": "Femur",
            "region": "extremidad_posterior",
            "description": "Hueso más largo y fuerte del cuerpo. Está en la parte superior del miembro posterior, entre cadera y rodilla.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Azul"
        },
        {
            "id": "patella_01",
            "name": "Rótula",
            "name_latin": "Patella",
            "region": "extremidad_posterior",
            "description": "Hueso sesamoideo que protege la articulación de la rodilla (babilla). Ubicado en la parte frontal de la rodilla.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Verde"
        },
        {
            "id": "tibia_01",
            "name": "Tibia",
            "name_latin": "Tibia",
            "region": "extremidad_posterior",
            "description": "Hueso principal de la pierna, entre la rodilla (babilla) y el tarso (corvejón). Hueso largo y fuerte.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Amarillo"
        },
        {
            "id": "tarsus_01",
            "name": "Tarso (Corvejón)",
            "name_latin": "Tarsus",
            "region": "extremidad_posterior",
            "description": "Conjunto de 6 huesos que forman el corvejón. Equivalente al tobillo humano. Articulación muy móvil.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Naranja"
        },
        {
            "id": "metatarsal_01",
            "name": "Metatarso",
            "name_latin": "Os metatarsale III",
            "region": "extremidad_posterior",
            "description": "Hueso de la caña en la extremidad posterior. Equivalente al metacarpo del miembro anterior.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Morado"
        }
    ],
    "torax": [
        {
            "id": "sternum_01",
            "name": "Esternón",
            "name_latin": "Sternum",
            "region": "torax",
            "description": "Hueso plano en la línea media ventral del tórax. Las costillas verdaderas se unen aquí mediante cartílagos.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Rojo"
        },
        {
            "id": "ribs_01",
            "name": "Costillas",
            "name_latin": "Costae",
            "region": "torax",
            "description": "18 pares de costillas que forman la caja torácica. Protegen corazón y pulmones. 8 verdaderas y 10 falsas.",
            "image_url": BASE_SKELETON_IMG,
            "highlight_color": "Azul"
        }
    ]
}

REGIONS = [
    {"id": "cabeza", "name": "Cabeza", "description": "Cráneo, mandíbula y huesos faciales", "icon": "skull", "bone_count": len(HORSE_BONES["cabeza"])},
    {"id": "columna_vertebral", "name": "Columna Vertebral", "description": "Vértebras cervicales, torácicas, lumbares y sacras", "icon": "spine", "bone_count": len(HORSE_BONES["columna_vertebral"])},
    {"id": "torax", "name": "Tórax", "description": "Costillas y esternón", "icon": "ribs", "bone_count": len(HORSE_BONES["torax"])},
    {"id": "extremidad_anterior", "name": "Extremidad Anterior", "description": "Escápula, húmero, radio, carpo y metacarpo", "icon": "arm", "bone_count": len(HORSE_BONES["extremidad_anterior"])},
    {"id": "extremidad_posterior", "name": "Extremidad Posterior", "description": "Pelvis, fémur, tibia, tarso y metatarso", "icon": "leg", "bone_count": len(HORSE_BONES["extremidad_posterior"])}
]

@api_router.get("/")
async def root():
    return {"message": "VetBones API - Sistema Óseo Veterinario"}

@api_router.get("/animals")
async def get_animals():
    return [
        {"id": "horse", "name": "Caballo", "name_scientific": "Equus caballus", "description": "Sistema óseo equino completo con 205 huesos", "icon": "horse", "total_bones": 205, "available": True},
        {"id": "cow", "name": "Vaca", "name_scientific": "Bos taurus", "description": "Próximamente disponible", "icon": "cow", "total_bones": 207, "available": False},
        {"id": "pig", "name": "Cerdo", "name_scientific": "Sus scrofa domesticus", "description": "Próximamente disponible", "icon": "pig", "total_bones": 223, "available": False}
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
            highlight_color=bone["highlight_color"]
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

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
