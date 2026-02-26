from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import random
import os

# Configuration
WIDTH = 1200
HEIGHT = 630
  OUTPUT_PATH = "public/images/pitch-decks/ai-web3-logistics-cover.webp"
FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
TITLE = "AI-Native Global Logistics"
SUBTITLE = "Protocol-Driven Cross-Border Trade"

def create_gradient(width, height, start_color, end_color):
    base = Image.new('RGB', (width, height), start_color)
    top = Image.new('RGB', (width, height), end_color)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            # Radial gradient from center
            dx = x - width / 2
            dy = y - height / 2
            dist = math.sqrt(dx*dx + dy*dy)
            max_dist = math.sqrt((width/2)**2 + (height/2)**2)
            ratio = min(1.0, dist / max_dist)
            mask_data.append(int(255 * ratio))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def draw_grid(draw, width, height, color):
    # Draw a perspective grid
    # Horizon line at 60% height
    horizon_y = int(height * 0.6)
    
    # Vertical lines converging to center
    center_x = width // 2
    for i in range(-20, 21):
        x_bottom = center_x + i * 100
        draw.line([(center_x, horizon_y), (x_bottom, height)], fill=color, width=1)
    
    # Horizontal lines
    for i in range(10):
        y = horizon_y + (height - horizon_y) * (i / 10)**2
        draw.line([(0, y), (width, y)], fill=color, width=1)

def draw_network(draw, width, height):
    # Draw some connection curves
    nodes = [
        (200, 300), (400, 200), (600, 350), (800, 150), (1000, 400),
        (300, 500), (900, 500), (500, 100)
    ]
    
    # Draw connections
    for i, start in enumerate(nodes):
        for j, end in enumerate(nodes):
            if i < j and random.random() > 0.7:
                draw.line([start, end], fill=(56, 189, 248, 60), width=1)

    # Draw nodes
    for x, y in nodes:
        r = 4
        draw.ellipse((x-r, y-r, x+r, y+r), fill=(56, 189, 248, 200))
        # Glow
        r = 8
        draw.ellipse((x-r, y-r, x+r, y+r), outline=(56, 189, 248, 100))

def main():
    # Colors
    # Dark blue background: #020617 (rgb(2, 6, 23))
    # Lighter blue center: #0c1a2e (rgb(12, 26, 46))
    bg_color = (2, 6, 23)
    center_color = (12, 26, 46)
    
    img = create_gradient(WIDTH, HEIGHT, center_color, bg_color)
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Draw background grid/network
    draw_grid(draw, WIDTH, HEIGHT, (56, 189, 248, 30))
    draw_network(draw, WIDTH, HEIGHT)
    
    # Text
    try:
        title_font = ImageFont.truetype(FONT_PATH, 70)
        subtitle_font = ImageFont.truetype(FONT_PATH, 30)
    except:
        # Fallback
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        print("Warning: Custom font not found, using default.")

    # Calculate text positions
    title_bbox = draw.textbbox((0, 0), TITLE, font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    
    sub_bbox = draw.textbbox((0, 0), SUBTITLE, font=subtitle_font)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_h = sub_bbox[3] - sub_bbox[1]
    
    x_title = (WIDTH - title_w) // 2
    y_title = (HEIGHT - title_h) // 2 - 20
    
    x_sub = (WIDTH - sub_w) // 2
    y_sub = y_title + title_h + 30
    
    # Draw Title Shadow/Glow
    # Simulate glow by drawing text multiple times with offset and low opacity
    glow_color = (56, 189, 248, 50)
    for offset in range(1, 5):
         draw.text((x_title+offset, y_title+offset), TITLE, font=title_font, fill=glow_color)
         draw.text((x_title-offset, y_title-offset), TITLE, font=title_font, fill=glow_color)
         
    # Draw Main Title (Cyan/White gradient simulation - just solid for now)
    # Using a light cyan/white
    text_color = (224, 242, 254) # e0f2fe
    draw.text((x_title, y_title), TITLE, font=title_font, fill=text_color)
    
    # Draw Subtitle
    sub_color = (125, 211, 252) # 7dd3fc
    draw.text((x_sub, y_sub), SUBTITLE, font=subtitle_font, fill=sub_color)
    
    # Add a border
    draw.rectangle([(0,0), (WIDTH-1, HEIGHT-1)], outline=(56, 189, 248), width=2)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    
    img.save(OUTPUT_PATH)
    print(f"Image saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
