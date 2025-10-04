from PIL import Image, ImageEnhance, ImageStat
import numpy as np

# Path to logo
logo_path = "public/images/victorhugoartlogo.png"

print(f"Processing logo: {logo_path}")

# Target colors
CREAM = np.array([254, 250, 224])  # #FEFAE0
DARK_BROWN = np.array([75, 53, 42])  # #4B352A

TARGET_BRIGHTNESS = 170

def adjust_brightness_histogram(img, target_brightness=170):
    """Adjust image brightness using histogram analysis"""
    if img.mode not in ['RGB', 'RGBA']:
        img = img.convert('RGBA')

    # Work with RGB channels only
    stat = ImageStat.Stat(img.convert('RGB'))
    current_brightness = sum(stat.mean) / 3

    brightness_factor = target_brightness / current_brightness

    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(brightness_factor)

    return img

def apply_two_tone_palette(img):
    """Apply cream and dark brown two-tone color palette while preserving transparency"""
    # Check if image has alpha channel
    has_alpha = img.mode == 'RGBA'

    if has_alpha:
        # Split alpha channel
        alpha = img.split()[3]
        img_rgb = img.convert('RGB')
    else:
        img_rgb = img.convert('RGB')

    # Convert to numpy array
    img_array = np.array(img_rgb).astype(float)

    # Convert to grayscale to get luminance
    grayscale = 0.299 * img_array[:, :, 0] + 0.587 * img_array[:, :, 1] + 0.114 * img_array[:, :, 2]

    # Normalize to 0-1 range
    grayscale_norm = grayscale / 255.0

    # Create output image
    height, width = grayscale.shape
    output = np.zeros((height, width, 3))

    # Map dark values to cream, light values to dark brown (INVERTED)
    for i in range(3):  # For each RGB channel
        output[:, :, i] = CREAM[i] * (1 - grayscale_norm) + DARK_BROWN[i] * grayscale_norm

    result = Image.fromarray(output.astype('uint8'))

    # Restore alpha channel if it existed
    if has_alpha:
        result.putalpha(alpha)

    return result

def adjust_contrast(img, factor=1.6):
    """Increase contrast for better definition"""
    enhancer = ImageEnhance.Contrast(img)
    return enhancer.enhance(factor)

try:
    # Open the logo
    img = Image.open(logo_path)

    print("Original mode:", img.mode)

    # Step 1: Normalize brightness
    img = adjust_brightness_histogram(img, TARGET_BRIGHTNESS)

    # Step 2: Increase contrast
    img = adjust_contrast(img, 1.6)

    # Step 3: Apply two-tone cream and dark brown palette
    img = apply_two_tone_palette(img)

    # Save the processed image (overwrite original)
    img.save(logo_path, 'PNG', optimize=True)

    print("Logo processing complete!")
    print("Applied:")
    print("- #FEFAE0 (cream) for highlights")
    print("- #4B352A (dark brown) for shadows")
    print("- Preserved transparency")

except Exception as e:
    print(f"Error: {e}")
