from PIL import Image, ImageEnhance
import numpy as np
from pathlib import Path

# Path to the ButtonImages folder
folder_path = Path("public/ButtonImages")

print(f"Looking in: {folder_path.absolute()}")

# Get button images only (not the IMG_ files)
button_files = [
    folder_path / "aboutme.png",
    folder_path / "portfolio.png",
    folder_path / "shop.png",
    folder_path / "sketchbook.png"
]

print(f"Found {len(button_files)} button images to process...")

def extract_dark_outlines(img, dark_threshold=100):
    """
    Extract only dark outlines from the image.
    - Converts to grayscale
    - Increases contrast dramatically
    - Makes everything above the dark threshold transparent
    - Keeps only dark pixels (outlines)
    """
    # Convert to grayscale
    if img.mode != 'L':
        img = img.convert('L')

    # Increase contrast dramatically to separate dark lines from background
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(3.0)  # Very high contrast

    # Increase brightness to make lighter areas even lighter
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.5)

    # Convert to RGBA for transparency
    img = img.convert('RGBA')

    # Convert to numpy array
    img_array = np.array(img)

    # Get the grayscale values (all RGB channels are the same in grayscale)
    gray_values = img_array[:, :, 0]

    # Create alpha channel:
    # - Dark pixels (< threshold) = opaque (255)
    # - Light pixels (>= threshold) = transparent (0)
    alpha_channel = np.where(gray_values < dark_threshold, 255, 0).astype(np.uint8)

    # For pixels that are kept, make them black
    img_array[:, :, 0] = 0  # R
    img_array[:, :, 1] = 0  # G
    img_array[:, :, 2] = 0  # B
    img_array[:, :, 3] = alpha_channel  # Alpha

    return Image.fromarray(img_array)

# Process each button image
for file_path in button_files:
    if not file_path.exists():
        print(f"Skipping {file_path.name} - file not found")
        continue

    try:
        print(f"Processing {file_path.name}...", end=" ")

        # Open the image
        img = Image.open(file_path)

        # Extract dark outlines only
        img = extract_dark_outlines(img, dark_threshold=100)

        # Save the processed image (overwrite original)
        img.save(file_path, 'PNG', optimize=True)

        print("Done")

    except Exception as e:
        print(f"Error: {e}")

print("\nOutline extraction complete!")
print("Only dark outlines remain - background is transparent")
