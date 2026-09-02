import os
import shutil

src_files = [
    r"C:\Users\cuong\.gemini\antigravity\brain\d81f9437-031a-45ac-85b0-cb42ce705635\banner_01_1787712467893.png",
    r"C:\Users\cuong\.gemini\antigravity\brain\d81f9437-031a-45ac-85b0-cb42ce705635\banner_02_1787712480583.png",
    r"C:\Users\cuong\.gemini\antigravity\brain\d81f9437-031a-45ac-85b0-cb42ce705635\banner_03_1787712528077.png"
]

dest_dir = r"C:\Users\cuong\.gemini\antigravity\scratch\ai_ad_image_analyzer\images"
os.makedirs(dest_dir, exist_ok=True)

names = ["banner_01.png", "banner_02.png", "banner_03.png"]

for src, name in zip(src_files, names):
    dest = os.path.join(dest_dir, name)
    if os.path.exists(src):
        shutil.copy(src, dest)
        print(f"Copied {src} -> {dest}")
    else:
        print(f"File not found: {src}")

print("Images setup complete.")
