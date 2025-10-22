from PIL import Image
import pillow_heif
import os
from pathlib import Path

# Register HEIF opener
pillow_heif.register_heif_opener()

# Path to the FinishedPaintings folder
folder_path = Path("public/FinishedPaintings")

print(f"Looking in: {folder_path.absolute()}")

# Get all HEIC files (case insensitive)
files = sorted(list(folder_path.glob("*.heic")) + list(folder_path.glob("*.HEIC")))

print(f"Found {len(files)} files to convert...")

for file_path in files:
    try:
        # Keep the original filename, just change extension
        png_filename = file_path.stem + ".png"
        print(f"Converting {file_path.name} to {png_filename}...", end=" ")

        # Open the HEIC file
        img = Image.open(file_path)

        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # New PNG filename with same name
        png_path = folder_path / png_filename

        # Save as PNG
        img.save(png_path, 'PNG', optimize=True)

        # Delete original HEIC file
        file_path.unlink()

        print("Done")

    except Exception as e:
        print(f"Error: {e}")

print("\nConversion complete!")
