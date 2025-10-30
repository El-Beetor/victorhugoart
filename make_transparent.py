from PIL import Image
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

def make_white_transparent(img, threshold=200):
    """Make white/light pixels transparent"""
    # Convert to RGBA if not already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')

    # Convert to numpy array
    img_array = np.array(img)

    # Create a mask for pixels that are close to white
    # A pixel is "white" if all RGB values are above the threshold
    white_mask = (img_array[:, :, 0] > threshold) & \
                 (img_array[:, :, 1] > threshold) & \
                 (img_array[:, :, 2] > threshold)

    # Set alpha channel to 0 (transparent) for white pixels
    img_array[:, :, 3] = np.where(white_mask, 0, img_array[:, :, 3])

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

        # Make white parts transparent
        img = make_white_transparent(img, threshold=200)

        # Save the processed image (overwrite original)
        img.save(file_path, 'PNG', optimize=True)

        print("Done")

    except Exception as e:
        print(f"Error: {e}")

print("\nTransparency processing complete!")
print("White/light areas are now transparent, leaving only the darker outlines")
