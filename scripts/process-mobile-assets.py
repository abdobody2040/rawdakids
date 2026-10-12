import os
from PIL import Image, ImageDraw

BRAIN_DIR = r"C:\Users\ABDO\.gemini\antigravity-ide\brain\4b284fed-950f-49b8-92cc-f9db4874e3b2"
APP_ICON_SRC = os.path.join(BRAIN_DIR, "mobile_app_icon_1791538772601.jpg")
SPLASH_SRC = os.path.join(BRAIN_DIR, "mobile_splash_screen_1791538794566.jpg")
ADAPTIVE_SRC = os.path.join(BRAIN_DIR, "adaptive_mascot_foreground_1791538845811.jpg")

ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets", "images")
DIST_ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist", "assets", "images")

print("Processing mobile assets...")

# 1. Main App Icon (icon.png - 1024x1024)
if os.path.exists(APP_ICON_SRC):
    img = Image.open(APP_ICON_SRC).convert("RGBA")
    img = img.resize((1024, 1024), Image.Resampling.LANCZOS)
    
    # Fill any corner rounding with matching deep emerald green (#0d4a34)
    bg = Image.new("RGBA", (1024, 1024), (13, 74, 52, 255))
    final_icon = Image.alpha_composite(bg, img)
    final_icon = final_icon.convert("RGB") # App store icons must not have alpha channel
    
    out_path = os.path.join(ASSETS_DIR, "icon.png")
    final_icon.save(out_path, "PNG", optimize=True)
    print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

    # Favicon (48x48)
    fav = final_icon.resize((48, 48), Image.Resampling.LANCZOS)
    fav_path = os.path.join(ASSETS_DIR, "favicon.png")
    fav.save(fav_path, "PNG", optimize=True)
    print(f"Saved: {fav_path}")

# 2. Splash Screen (splash-screen.png & splash-screen.jpg)
if os.path.exists(SPLASH_SRC):
    splash = Image.open(SPLASH_SRC).convert("RGB")
    splash_path = os.path.join(ASSETS_DIR, "splash-screen.jpg")
    splash.save(splash_path, "JPEG", quality=95)
    print(f"Saved: {splash_path} ({os.path.getsize(splash_path)} bytes)")
    
    splash_png_path = os.path.join(ASSETS_DIR, "splash-screen.png")
    splash.save(splash_png_path, "PNG", optimize=True)
    print(f"Saved: {splash_png_path}")

    # Splash Icon (centered mascot on transparent or circular safe frame for Expo splash)
    splash_icon = splash.resize((1024, 1024 * splash.height // splash.width), Image.Resampling.LANCZOS)
    # Crop center 1024x1024
    w, h = splash_icon.size
    top = (h - 1024) // 2
    splash_icon_cropped = splash_icon.crop((0, top, 1024, top + 1024))
    splash_icon_path = os.path.join(ASSETS_DIR, "splash-icon.png")
    splash_icon_cropped.save(splash_icon_path, "PNG", optimize=True)
    print(f"Saved: {splash_icon_path}")

# 3. Android Adaptive Foreground (android-icon-foreground.png - 1024x1024 with transparency)
if os.path.exists(ADAPTIVE_SRC):
    fg_src = Image.open(ADAPTIVE_SRC).convert("RGBA")
    
    # Key out black background: calculate alpha based on max(R,G,B)
    datas = fg_src.getdata()
    new_data = []
    for item in datas:
        r, g, b, a = item
        brightness = max(r, g, b)
        if brightness < 15:
            new_data.append((0, 0, 0, 0))
        elif brightness < 45:
            alpha = int(255 * (brightness - 15) / 30)
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, 255))
    fg_src.putdata(new_data)
    
    # Scale character so it sits inside the Android adaptive icon safe zone (centered 65%)
    # Target size ~640x640 within 1024x1024 canvas
    fg_scaled = fg_src.resize((660, 660), Image.Resampling.LANCZOS)
    
    adaptive_canvas = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    paste_x = (1024 - 660) // 2
    paste_y = (1024 - 660) // 2
    adaptive_canvas.paste(fg_scaled, (paste_x, paste_y), fg_scaled)
    
    afg_path = os.path.join(ASSETS_DIR, "android-icon-foreground.png")
    adaptive_canvas.save(afg_path, "PNG", optimize=True)
    print(f"Saved: {afg_path} ({os.path.getsize(afg_path)} bytes)")

# 4. Android Adaptive Background (android-icon-background.png - 1024x1024)
bg_canvas = Image.new("RGBA", (1024, 1024), (6, 78, 59, 255)) # #064E3B emerald
draw = ImageDraw.Draw(bg_canvas)
# Subtle radiating circles in lighter emerald (#0a5c36 / #0f7652)
for r in range(500, 50, -50):
    alpha = int(15 * (1 - r / 500))
    draw.ellipse([512 - r, 512 - r, 512 + r, 512 + r], outline=(15, 118, 82, alpha), width=8)

abg_path = os.path.join(ASSETS_DIR, "android-icon-background.png")
bg_canvas.save(abg_path, "PNG", optimize=True)
print(f"Saved: {abg_path}")

# Sync to dist if exists
if os.path.exists(DIST_ASSETS_DIR):
    import shutil
    for fname in ["icon.png", "favicon.png", "splash-screen.jpg", "splash-screen.png", "splash-icon.png", "android-icon-foreground.png", "android-icon-background.png"]:
        src_f = os.path.join(ASSETS_DIR, fname)
        if os.path.exists(src_f):
            shutil.copy2(src_f, os.path.join(DIST_ASSETS_DIR, fname))
            print(f"Synced to dist: {fname}")

print("Mobile assets processing completed successfully!")
