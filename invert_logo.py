from PIL import Image, ImageOps

# Path to logo
logo_path = "public/images/victorhugoartlogo.png"

print(f"Inverting logo: {logo_path}")

try:
    # Open the logo
    img = Image.open(logo_path)

    print(f"Original mode: {img.mode}")

    # Check if image has alpha channel
    if img.mode == 'RGBA':
        # Split the alpha channel
        r, g, b, a = img.split()

        # Invert RGB channels only
        rgb = Image.merge('RGB', (r, g, b))
        rgb_inverted = ImageOps.invert(rgb)

        # Merge back with original alpha
        r_inv, g_inv, b_inv = rgb_inverted.split()
        img_inverted = Image.merge('RGBA', (r_inv, g_inv, b_inv, a))
    else:
        # Simple invert for RGB images
        img_inverted = ImageOps.invert(img.convert('RGB'))

    # Save the inverted image
    img_inverted.save(logo_path, 'PNG', optimize=True)

    print("Logo inversion complete!")

except Exception as e:
    print(f"Error: {e}")
