from PIL import Image
import pillow_heif
import os
from pathlib import Path

# Register HEIF opener
pillow_heif.register_heif_opener()

# Path to the bg_wallpapers folder
folder_path = Path("public/bg_wallpapers")

print(f"Looking in: {folder_path.absolute()}")

# Get all HEIC files
files = sorted(folder_path.glob("*.heic"))

print(f"Found {len(files)} files to convert...")

for i, file_path in enumerate(files, start=1):
    try:
        print(f"Converting {file_path.name} to image_{i}.png...", end=" ")

        # Open the HEIC file
        img = Image.open(file_path)

        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # New PNG filename
        png_path = folder_path / f"image_{i}.png"

        # Save as PNG
        img.save(png_path, 'PNG', optimize=True)

        # Delete original HEIC file
        file_path.unlink()

        print("Done")

    except Exception as e:
        print(f"Error: {e}")

print("\nConversion complete!")
