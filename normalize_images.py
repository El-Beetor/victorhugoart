from PIL import Image, ImageEnhance, ImageStat
import os
from pathlib import Path
import numpy as np

# Path to the bg_wallpapers folder
folder_path = Path("public/bg_wallpapers")

print(f"Looking in: {folder_path.absolute()}")

# Get all PNG files
files = sorted(folder_path.glob("*.png"))

print(f"Found {len(files)} images to process...")

# Target color palette (browns and creams)
# We'll shift the color balance towards warm tones
TARGET_BRIGHTNESS = 128  # Target average brightness (0-255)

def adjust_brightness_histogram(img, target_brightness=128):
    """Adjust image brightness using histogram analysis"""
    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')

    # Calculate current average brightness
    stat = ImageStat.Stat(img)
    current_brightness = sum(stat.mean) / 3

    # Calculate brightness adjustment factor
    brightness_factor = target_brightness / current_brightness

    # Apply brightness adjustment
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(brightness_factor)

    return img

def apply_warm_color_grading(img):
    """Apply warm brown/cream color palette"""
    # Convert to numpy array for color manipulation
    img_array = np.array(img).astype(float)

    # Increase red and reduce blue for warm tones
    img_array[:, :, 0] = np.clip(img_array[:, :, 0] * 1.15, 0, 255)  # More red
    img_array[:, :, 1] = np.clip(img_array[:, :, 1] * 1.05, 0, 255)  # Slight green boost
    img_array[:, :, 2] = np.clip(img_array[:, :, 2] * 0.85, 0, 255)  # Less blue

    # Convert back to PIL Image
    return Image.fromarray(img_array.astype('uint8'))

def adjust_contrast(img, factor=1.1):
    """Slightly increase contrast for consistency"""
    enhancer = ImageEnhance.Contrast(img)
    return enhancer.enhance(factor)

# Process each image
for i, file_path in enumerate(files, start=1):
    try:
        print(f"Processing {file_path.name}...", end=" ")

        # Open the image
        img = Image.open(file_path)

        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Step 1: Normalize brightness using histogram
        img = adjust_brightness_histogram(img, TARGET_BRIGHTNESS)

        # Step 2: Apply warm color grading (browns/creams)
        img = apply_warm_color_grading(img)

        # Step 3: Adjust contrast for consistency
        img = adjust_contrast(img, 1.1)

        # Save the processed image (overwrite original)
        img.save(file_path, 'PNG', optimize=True)

        print("Done")

    except Exception as e:
        print(f"Error: {e}")

print("\nImage normalization complete!")
print("All images now have:")
print("- Consistent brightness levels")
print("- Warm brown/cream color palette")
print("- Uniform contrast")
