import asyncio
import os
import base64
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

async def main():
    api_key = os.getenv("EMERGENT_LLM_KEY")
    chat = LlmChat(api_key=api_key, session_id="horse-anatomy-thorax", system_message="You are a medical illustrator specializing in veterinary anatomy.")
    chat.with_model("gemini", "gemini-3-pro-image-preview").with_params(modalities=["image", "text"])

    prompt = """Generate a highly realistic, detailed anatomical illustration of a horse thoracic cage (ribcage) in lateral view.
The image should be:
- Medical/veterinary quality, educational style
- White/cream colored bones on a neutral gray background
- Showing all 18 pairs of ribs clearly, with true ribs and false ribs distinguishable
- Sternum visible at the ventral aspect
- Costal cartilages connecting ribs to sternum
- Scientific illustration style, as seen in veterinary anatomy textbooks
- High detail showing rib curvature and costal angles
- Clean, professional appearance suitable for veterinary education"""

    msg = UserMessage(text=prompt)
    print("Generating thorax image...")
    text, images = await chat.send_message_multimodal_response(msg)

    if images:
        image_bytes = base64.b64decode(images[0]['data'])
        filepath = "/app/backend/assets/horse_thorax.jpg"
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        print(f"Saved: {filepath} ({len(image_bytes)} bytes)")
    else:
        print("No image generated!")

asyncio.run(main())
