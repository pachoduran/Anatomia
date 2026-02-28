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

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
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

# Horse skeletal data organized by region with Spanish color names
HORSE_BONES = {
    "cabeza": [
        {
            "id": "skull_01",
            "name": "Cráneo",
            "name_latin": "Cranium",
            "region": "cabeza",
            "description": "Estructura ósea que protege el cerebro y los órganos sensoriales.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/1eqscapulaposter%20a.png",
            "highlight_color": "Rojo"
        },
        {
            "id": "mandible_01",
            "name": "Mandíbula",
            "name_latin": "Mandibula",
            "region": "cabeza",
            "description": "Hueso móvil inferior de la cabeza que permite la masticación.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/1eqscapulaposter%20a.png",
            "highlight_color": "Azul"
        },
        {
            "id": "maxilla_01",
            "name": "Maxilar",
            "name_latin": "Maxilla",
            "region": "cabeza",
            "description": "Hueso superior de la mandíbula que forma parte del paladar.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/1eqscapulaposter%20a.png",
            "highlight_color": "Verde"
        },
        {
            "id": "nasal_01",
            "name": "Hueso Nasal",
            "name_latin": "Os nasale",
            "region": "cabeza",
            "description": "Par de huesos que forman el puente de la nariz.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/1eqscapulaposter%20a.png",
            "highlight_color": "Amarillo"
        }
    ],
    "columna_vertebral": [
        {
            "id": "cervical_01",
            "name": "Vértebras Cervicales",
            "name_latin": "Vertebrae cervicales",
            "region": "columna_vertebral",
            "description": "7 vértebras que forman el cuello, permiten el movimiento de la cabeza.",
            "image_url": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
            "highlight_color": "Rojo"
        },
        {
            "id": "thoracic_01",
            "name": "Vértebras Torácicas",
            "name_latin": "Vertebrae thoracicae",
            "region": "columna_vertebral",
            "description": "18 vértebras que se articulan con las costillas.",
            "image_url": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
            "highlight_color": "Azul"
        },
        {
            "id": "lumbar_01",
            "name": "Vértebras Lumbares",
            "name_latin": "Vertebrae lumbales",
            "region": "columna_vertebral",
            "description": "6 vértebras en la región del lomo, sin articulación costal.",
            "image_url": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
            "highlight_color": "Verde"
        },
        {
            "id": "sacral_01",
            "name": "Vértebras Sacras",
            "name_latin": "Vertebrae sacrales",
            "region": "columna_vertebral",
            "description": "5 vértebras fusionadas que forman el sacro.",
            "image_url": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
            "highlight_color": "Amarillo"
        },
        {
            "id": "caudal_01",
            "name": "Vértebras Caudales",
            "name_latin": "Vertebrae caudales",
            "region": "columna_vertebral",
            "description": "15-21 vértebras que forman la cola.",
            "image_url": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
            "highlight_color": "Naranja"
        }
    ],
    "extremidad_anterior": [
        {
            "id": "scapula_01",
            "name": "Escápula",
            "name_latin": "Scapula",
            "region": "extremidad_anterior",
            "description": "Hueso plano triangular que conecta el miembro anterior con el tronco.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/1eqscapulaposter%20a.png",
            "highlight_color": "Rojo"
        },
        {
            "id": "humerus_01",
            "name": "Húmero",
            "name_latin": "Humerus",
            "region": "extremidad_anterior",
            "description": "Hueso largo del brazo, se articula con escápula y radio.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/2eqhumerusposter%20a.png",
            "highlight_color": "Azul"
        },
        {
            "id": "radius_01",
            "name": "Radio",
            "name_latin": "Radius",
            "region": "extremidad_anterior",
            "description": "Hueso principal del antebrazo, soporta la mayor parte del peso.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/3EqRadiusUlnaposter%20a.png",
            "highlight_color": "Verde"
        },
        {
            "id": "ulna_01",
            "name": "Ulna",
            "name_latin": "Ulna",
            "region": "extremidad_anterior",
            "description": "Hueso fusionado con el radio en equinos adultos, forma el olécranon.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/3EqRadiusUlnaposter%20a.png",
            "highlight_color": "Amarillo"
        },
        {
            "id": "carpus_01",
            "name": "Carpo",
            "name_latin": "Carpus",
            "region": "extremidad_anterior",
            "description": "8 huesos pequeños que forman la rodilla del caballo.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/3EqRadiusUlnaposter%20a.png",
            "highlight_color": "Naranja"
        },
        {
            "id": "metacarpal_01",
            "name": "Metacarpo (Caña)",
            "name_latin": "Os metacarpale III",
            "region": "extremidad_anterior",
            "description": "Hueso largo entre el carpo y las falanges, también llamado caña.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/3EqRadiusUlnaposter%20a.png",
            "highlight_color": "Morado"
        }
    ],
    "extremidad_posterior": [
        {
            "id": "pelvis_01",
            "name": "Pelvis",
            "name_latin": "Os coxae",
            "region": "extremidad_posterior",
            "description": "Cintura pélvica formada por ilion, isquion y pubis.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/17eqfemurposter%20a.png",
            "highlight_color": "Rojo"
        },
        {
            "id": "femur_01",
            "name": "Fémur",
            "name_latin": "Femur",
            "region": "extremidad_posterior",
            "description": "Hueso más largo y fuerte del cuerpo, forma la articulación de la cadera.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/17eqfemurposter%20a.png",
            "highlight_color": "Azul"
        },
        {
            "id": "patella_01",
            "name": "Rótula",
            "name_latin": "Patella",
            "region": "extremidad_posterior",
            "description": "Hueso sesamoideo que protege la articulación de la rodilla.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/17eqfemurposter%20a.png",
            "highlight_color": "Verde"
        },
        {
            "id": "tibia_01",
            "name": "Tibia",
            "name_latin": "Tibia",
            "region": "extremidad_posterior",
            "description": "Hueso principal de la pierna, entre la rodilla y el tarso.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/17eqfemurposter%20a.png",
            "highlight_color": "Amarillo"
        },
        {
            "id": "tarsus_01",
            "name": "Tarso (Corvejón)",
            "name_latin": "Tarsus",
            "region": "extremidad_posterior",
            "description": "6 huesos que forman el corvejón, equivalente al tobillo humano.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/17eqfemurposter%20a.png",
            "highlight_color": "Naranja"
        },
        {
            "id": "metatarsal_01",
            "name": "Metatarso",
            "name_latin": "Os metatarsale III",
            "region": "extremidad_posterior",
            "description": "Hueso largo equivalente a la caña en la extremidad posterior.",
            "image_url": "https://vorl.vetmed.ucdavis.edu/sites/g/files/dgvnsk4731/files/styles/sf_gallery_full/public/media/images/17eqfemurposter%20a.png",
            "highlight_color": "Morado"
        }
    ],
    "torax": [
        {
            "id": "sternum_01",
            "name": "Esternón",
            "name_latin": "Sternum",
            "region": "torax",
            "description": "Hueso plano en la línea media ventral del tórax.",
            "image_url": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
            "highlight_color": "Rojo"
        },
        {
            "id": "ribs_01",
            "name": "Costillas",
            "name_latin": "Costae",
            "region": "torax",
            "description": "18 pares de costillas que protegen los órganos torácicos.",
            "image_url": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
            "highlight_color": "Azul"
        },
        {
            "id": "costal_cartilage_01",
            "name": "Cartílagos Costales",
            "name_latin": "Cartilagines costales",
            "region": "torax",
            "description": "Cartílagos que conectan las costillas con el esternón.",
            "image_url": "https://img.freepik.com/free-vector/science-horse-skeletal-system_1308-48067.jpg",
            "highlight_color": "Verde"
        }
    ]
}

# Regions data
REGIONS = [
    {
        "id": "cabeza",
        "name": "Cabeza",
        "description": "Cráneo, mandíbula y huesos faciales",
        "icon": "skull",
        "bone_count": len(HORSE_BONES["cabeza"])
    },
    {
        "id": "columna_vertebral",
        "name": "Columna Vertebral",
        "description": "Vértebras cervicales, torácicas, lumbares, sacras y caudales",
        "icon": "spine",
        "bone_count": len(HORSE_BONES["columna_vertebral"])
    },
    {
        "id": "torax",
        "name": "Tórax",
        "description": "Costillas, esternón y cartílagos costales",
        "icon": "ribs",
        "bone_count": len(HORSE_BONES["torax"])
    },
    {
        "id": "extremidad_anterior",
        "name": "Extremidad Anterior",
        "description": "Escápula, húmero, radio, carpo y metacarpo",
        "icon": "arm",
        "bone_count": len(HORSE_BONES["extremidad_anterior"])
    },
    {
        "id": "extremidad_posterior",
        "name": "Extremidad Posterior",
        "description": "Pelvis, fémur, tibia, tarso y metatarso",
        "icon": "leg",
        "bone_count": len(HORSE_BONES["extremidad_posterior"])
    }
]

# API Routes
@api_router.get("/")
async def root():
    return {"message": "VetBones API - Sistema Óseo Veterinario"}

@api_router.get("/animals")
async def get_animals():
    """Get available animals for study"""
    return [
        {
            "id": "horse",
            "name": "Caballo",
            "name_scientific": "Equus caballus",
            "description": "Sistema óseo equino completo con 205 huesos",
            "icon": "horse",
            "total_bones": 205,
            "available": True
        },
        {
            "id": "cow",
            "name": "Vaca",
            "name_scientific": "Bos taurus",
            "description": "Próximamente disponible",
            "icon": "cow",
            "total_bones": 207,
            "available": False
        },
        {
            "id": "pig",
            "name": "Cerdo",
            "name_scientific": "Sus scrofa domesticus",
            "description": "Próximamente disponible",
            "icon": "pig",
            "total_bones": 223,
            "available": False
        }
    ]

@api_router.get("/regions/{animal_id}")
async def get_regions(animal_id: str):
    """Get anatomical regions for an animal"""
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    return REGIONS

@api_router.get("/bones/{animal_id}/{region_id}")
async def get_bones(animal_id: str, region_id: str):
    """Get bones for a specific region"""
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    if region_id not in HORSE_BONES:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    return HORSE_BONES[region_id]

@api_router.get("/exam/{animal_id}/{region_id}")
async def generate_exam(animal_id: str, region_id: str, num_questions: int = 5):
    """Generate a multiple choice exam for a specific region"""
    if animal_id != "horse":
        raise HTTPException(status_code=404, detail="Animal no disponible")
    if region_id not in HORSE_BONES:
        raise HTTPException(status_code=404, detail="Región no encontrada")
    
    bones = HORSE_BONES[region_id]
    
    # Get all bone names from all regions for distractors
    all_bone_names = []
    for region_bones in HORSE_BONES.values():
        for bone in region_bones:
            all_bone_names.append(bone["name"])
    
    # Generate questions
    questions = []
    selected_bones = random.sample(bones, min(num_questions, len(bones)))
    
    for bone in selected_bones:
        # Create options with the correct answer and 3 distractors
        correct_answer = bone["name"]
        
        # Get distractors (other bone names, excluding the correct one)
        distractors = [name for name in all_bone_names if name != correct_answer]
        selected_distractors = random.sample(distractors, min(3, len(distractors)))
        
        # Combine and shuffle options
        options = [correct_answer] + selected_distractors
        random.shuffle(options)
        
        question = Question(
            bone_id=bone["id"],
            bone_name=bone["name"],
            region=region_id,
            image_url=bone["image_url"],
            options=options,
            correct_answer=correct_answer,
            highlight_description=f"Identifica el hueso señalado en color {bone['highlight_color']}: {bone['description']}"
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
    """Submit exam results (optional persistence)"""
    # For now, just return the results
    # In the future, this could save to MongoDB
    return {
        "message": "Resultado registrado",
        "result": exam_result
    }

@api_router.get("/bone/{bone_id}")
async def get_bone_detail(bone_id: str):
    """Get detailed information about a specific bone"""
    for region_bones in HORSE_BONES.values():
        for bone in region_bones:
            if bone["id"] == bone_id:
                return bone
    raise HTTPException(status_code=404, detail="Hueso no encontrado")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
