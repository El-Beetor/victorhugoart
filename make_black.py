from PIL import Image
import os

# List of images to process
images = [
    'public/ButtonImages/aboutme2.png',
    'public/ButtonImages/portfolio2.png',
    'public/ButtonImages/shop2.png',
    'public/ButtonImages/sketchbook2.png'
]

for image_path in images:
    if not os.path.exists(image_path):
        print(f"Warning: {image_path} not found, skipping...")
        continue

    # Open the image
    img = Image.open(image_path).convert('RGBA')

    # Get pixel data
    pixels = img.load()
    width, height = img.size

    # Process each pixel
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            # If pixel is not transparent (alpha > 0)
            if a > 0:
                # Make it black but keep the alpha
                pixels[x, y] = (0, 0, 0, a)

    # Save the modified image
    img.save(image_path)
    print(f"Processed: {image_path}")

print("\nAll images processed successfully!")
