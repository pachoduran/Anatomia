import asyncio
import os
import base64
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

IMAGES_TO_GENERATE = [
    {
        "name": "craneo",
        "filename": "horse_skull.jpg",
        "prompt": """Generate a highly realistic, detailed anatomical illustration of a horse skull (cranium) in lateral view. 
The image should be:
- Medical/veterinary quality, educational style
- White/cream colored bone on a neutral gray background
- Showing all major bones labeled or clearly visible: frontal bone, parietal bone, temporal bone, occipital bone, nasal bone, maxilla, mandible, zygomatic arch, orbit
- Scientific illustration style, as seen in veterinary anatomy textbooks
- High detail showing bone textures, sutures, and foramina
- Clean, professional appearance suitable for veterinary education"""
    },
    {
        "name": "columna",
        "filename": "horse_spine.jpg",
        "prompt": """Generate a highly realistic, detailed anatomical illustration of a horse vertebral column (spine) in lateral view.
The image should be:
- Medical/veterinary quality, educational style
- White/cream colored bones on a neutral gray background
- Showing the complete spine: 7 cervical vertebrae (including atlas and axis), 18 thoracic vertebrae, 6 lumbar vertebrae, sacrum, and coccygeal vertebrae
- Each vertebral region should be distinguishable
- Scientific illustration style, as seen in veterinary anatomy textbooks
- High detail showing vertebral processes and intervertebral spaces
- Clean, professional appearance suitable for veterinary education"""
    },
    {
        "name": "torax",
        "filename": "horse_thorax.jpg",
        "prompt": """Generate a highly realistic, detailed anatomical illustration of a horse thoracic cage (ribcage) in lateral view.
The image should be:
- Medical/veterinary quality, educational style
- White/cream colored bones on a neutral gray background
- Showing all 18 pairs of ribs clearly, with true ribs and false ribs distinguishable
- Sternum visible at the ventral aspect
- Costal cartilages connecting ribs to sternum
- Scientific illustration style, as seen in veterinary anatomy textbooks
- High detail showing rib curvature and costal angles
- Clean, professional appearance suitable for veterinary education"""
    },
    {
        "name": "anterior",
        "filename": "horse_forelimb.jpg",
        "prompt": """Generate a highly realistic, detailed anatomical illustration of a horse forelimb (front leg) bones in lateral view.
The image should be:
- Medical/veterinary quality, educational style
- White/cream colored bones on a neutral gray background
- Showing complete forelimb from scapula to hoof: scapula (shoulder blade), humerus, radius, ulna, carpal bones (knee), metacarpus (cannon bone), proximal sesamoids, first phalanx (long pastern), second phalanx (short pastern), third phalanx (coffin bone), navicular bone
- Each bone clearly distinguishable and properly proportioned
- Scientific illustration style, as seen in veterinary anatomy textbooks
- High detail showing bone surfaces and articular areas
- Clean, professional appearance suitable for veterinary education"""
    },
    {
        "name": "posterior",
        "filename": "horse_hindlimb.jpg",
        "prompt": """Generate a highly realistic, detailed anatomical illustration of a horse hindlimb (rear leg) bones in lateral view.
The image should be:
- Medical/veterinary quality, educational style
- White/cream colored bones on a neutral gray background
- Showing complete hindlimb: pelvis (ilium, ischium, pubis), femur, patella, tibia, fibula, tarsal bones (hock), metatarsus (cannon bone), proximal sesamoids, first phalanx (long pastern), second phalanx (short pastern), third phalanx (coffin bone), navicular bone
- Each bone clearly distinguishable and properly proportioned
- Scientific illustration style, as seen in veterinary anatomy textbooks
- High detail showing bone surfaces and articular areas
- Clean, professional appearance suitable for veterinary education"""
    }
]

async def generate_image(image_info):
    """Generate a single anatomical image"""
    api_key = os.getenv("EMERGENT_LLM_KEY")
    
    chat = LlmChat(
        api_key=api_key, 
        session_id=f"horse-anatomy-{image_info['name']}", 
        system_message="You are a medical illustrator specializing in veterinary anatomy. Create highly detailed, realistic anatomical illustrations."
    )
    chat.with_model("gemini", "gemini-3-pro-image-preview").with_params(modalities=["image", "text"])
    
    msg = UserMessage(text=image_info["prompt"])
    
    print(f"Generating {image_info['name']}...")
    text, images = await chat.send_message_multimodal_response(msg)
    
    if images:
        print(f"  Generated {len(images)} image(s)")
        for i, img in enumerate(images):
            image_bytes = base64.b64decode(img['data'])
            filepath = f"/app/backend/assets/{image_info['filename']}"
            with open(filepath, "wb") as f:
                f.write(image_bytes)
            print(f"  Saved: {filepath}")
            return filepath
    else:
        print(f"  No images generated for {image_info['name']}")
        return None

async def main():
    print("=" * 50)
    print("Generating Horse Anatomy Images with Nano Banana")
    print("=" * 50)
    
    for image_info in IMAGES_TO_GENERATE:
        try:
            await generate_image(image_info)
        except Exception as e:
            print(f"Error generating {image_info['name']}: {e}")
    
    print("=" * 50)
    print("Done! Check /app/backend/assets/ for generated images")
    print("=" * 50)

if __name__ == "__main__":
    asyncio.run(main())
