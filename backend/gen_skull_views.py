import asyncio
import os
import base64
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

VIEWS = [
    {
        "id": "dorsal",
        "name": "Vista Dorsal",
        "prompt": """Generate a highly detailed anatomical illustration of a horse skull seen from ABOVE (dorsal view, looking down at the top of the skull).
Show clearly: nasal bones, frontal bones, parietal bones, the sagittal crest at the posterior, and orbital rims visible from above.
Style: Clean veterinary anatomy textbook illustration, white/cream colored bones on neutral gray background.
Labels should show: Nasal Bones, Frontal Bones, Parietal Bones, Sagittal Crest, Orbital Rim.
High detail, professional scientific illustration."""
    },
    {
        "id": "ventral",
        "name": "Vista Ventral",
        "prompt": """Generate a highly detailed anatomical illustration of a horse skull seen from BELOW (ventral view, looking up at the base of the skull).
Show clearly: hard palate, palatine bones, vomer, sphenoid bone, occipital condyles, molar and premolar tooth rows, choanae (posterior nasal openings).
Style: Clean veterinary anatomy textbook illustration, white/cream colored bones on neutral gray background.
Labels should show: Hard Palate, Palatine, Vomer, Sphenoid, Occipital Condyles, Molars, Premolars, Choanae.
High detail, professional scientific illustration."""
    },
    {
        "id": "caudal",
        "name": "Vista Caudal",
        "prompt": """Generate a highly detailed anatomical illustration of a horse skull seen from BEHIND (caudal/nuchal view, looking at the back of the skull).
Show clearly: occipital bone, interparietal bone, foramen magnum (large opening for spinal cord), nuchal crest, occipital condyles.
Style: Clean veterinary anatomy textbook illustration, white/cream colored bones on neutral gray background.
Labels should show: Occipital Bone, Interparietal, Foramen Magnum, Nuchal Crest, Occipital Condyles.
High detail, professional scientific illustration."""
    },
    {
        "id": "rostral",
        "name": "Vista Rostral",
        "prompt": """Generate a highly detailed anatomical illustration of a horse skull seen from the FRONT (rostral view, looking at the nose/mouth from the front).
Show clearly: incisive bones, nasal aperture (bony nasal opening), infraorbital canal/foramen, incisor teeth arrangement.
Style: Clean veterinary anatomy textbook illustration, white/cream colored bones on neutral gray background.
Labels should show: Incisive Bone, Nasal Aperture, Infraorbital Foramen, Incisors.
High detail, professional scientific illustration."""
    },
]

async def main():
    api_key = os.getenv("EMERGENT_LLM_KEY")
    
    for view in VIEWS:
        print(f"Generating {view['name']}...")
        chat = LlmChat(api_key=api_key, session_id=f"skull-{view['id']}", system_message="You are a medical illustrator specializing in veterinary anatomy.")
        chat.with_model("gemini", "gemini-3-pro-image-preview").with_params(modalities=["image", "text"])
        
        msg = UserMessage(text=view["prompt"])
        try:
            text, images = await chat.send_message_multimodal_response(msg)
            if images:
                image_bytes = base64.b64decode(images[0]['data'])
                filepath = f"/app/backend/assets/horse_skull_{view['id']}.jpg"
                with open(filepath, "wb") as f:
                    f.write(image_bytes)
                frontend_path = f"/app/frontend/assets/images/horse_skull_{view['id']}.jpg"
                with open(frontend_path, "wb") as f:
                    f.write(image_bytes)
                print(f"  Saved: {filepath} ({len(image_bytes)} bytes)")
            else:
                print(f"  WARNING: No image generated for {view['name']}")
        except Exception as e:
            print(f"  ERROR generating {view['name']}: {e}")

asyncio.run(main())
