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

# Target colors
CREAM = np.array([254, 250, 224])  # #FEFAE0
DARK_BROWN = np.array([75, 53, 42])  # #4B352A

TARGET_BRIGHTNESS = 140  # Target average brightness

def adjust_brightness_histogram(img, target_brightness=140):
    """Adjust image brightness using histogram analysis"""
    if img.mode != 'RGB':
        img = img.convert('RGB')

    stat = ImageStat.Stat(img)
    current_brightness = sum(stat.mean) / 3

    brightness_factor = target_brightness / current_brightness

    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(brightness_factor)

    return img

def apply_two_tone_palette(img):
    """Apply cream and dark brown two-tone color palette"""
    # Convert to numpy array
    img_array = np.array(img).astype(float)

    # Convert to grayscale to get luminance
    grayscale = 0.299 * img_array[:, :, 0] + 0.587 * img_array[:, :, 1] + 0.114 * img_array[:, :, 2]

    # Normalize to 0-1 range
    grayscale_norm = grayscale / 255.0

    # Create output image
    height, width = grayscale.shape
    output = np.zeros((height, width, 3))

    # Map dark values to dark brown, light values to cream
    for i in range(3):  # For each RGB channel
        output[:, :, i] = DARK_BROWN[i] * (1 - grayscale_norm) + CREAM[i] * grayscale_norm

    return Image.fromarray(output.astype('uint8'))

def adjust_contrast(img, factor=1.2):
    """Increase contrast for better definition"""
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

        # Step 1: Normalize brightness
        img = adjust_brightness_histogram(img, TARGET_BRIGHTNESS)

        # Step 2: Increase contrast before color mapping
        img = adjust_contrast(img, 1.3)

        # Step 3: Apply two-tone cream and dark brown palette
        img = apply_two_tone_palette(img)

        # Save the processed image (overwrite original)
        img.save(file_path, 'PNG', optimize=True)

        print("Done")

    except Exception as e:
        print(f"Error: {e}")

print("\nColor palette applied!")
print("All images now use:")
print("- #FEFAE0 (cream) for highlights")
print("- #4B352A (dark brown) for shadows")
print("- Consistent brightness and contrast")
