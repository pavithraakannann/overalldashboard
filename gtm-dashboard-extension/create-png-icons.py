#!/usr/bin/env python3
"""
Create simple PNG icons for the Chrome extension
Requires: pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Create image with gradient
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple tree (triangle)
    # Tree top
    points = [
        (size//2, size//5),
        (size - size//5, size - size//3),
        (size//5, size - size//3)
    ]
    draw.polygon(points, fill='white')
    
    # Tree trunk
    trunk_width = size // 8
    trunk_height = size // 4
    trunk_x = size//2 - trunk_width//2
    trunk_y = size - size//3
    draw.rectangle([trunk_x, trunk_y, trunk_x + trunk_width, trunk_y + trunk_height], fill='#8B4513')
    
    # Save
    img.save(filename)
    print(f"Created {filename}")

# Create icons directory
os.makedirs('icons', exist_ok=True)

# Create icons
create_icon(16, 'icons/icon16.png')
create_icon(48, 'icons/icon48.png')
create_icon(128, 'icons/icon128.png')

print("\nIcons created successfully!")
