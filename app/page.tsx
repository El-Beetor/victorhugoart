'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useColors } from './context/ColorContext';
import Footer from './components/Footer';

const artworks = [
  {
    id: 1,
    title: 'Bike',
    year: 2024,
    category: 'Landscape',
    description: 'A vibrant scene capturing the essence of cycling through nature.',
    size: 'large',
    image: '/FinishedPaintings/bike.png'
  },
  {
    id: 2,
    title: 'Bird',
    year: 2024,
    category: 'Nature',
    description: 'Delicate brushwork bringing life to avian beauty.',
    size: 'medium',
    image: '/FinishedPaintings/bird.png'
  },
  {
    id: 3,
    title: 'Duck',
    year: 2024,
    category: 'Nature',
    description: 'A serene moment on the water, painted with careful observation.',
    size: 'large',
    image: '/FinishedPaintings/duck.png'
  },
  {
    id: 4,
    title: 'Lagoon',
    year: 2024,
    category: 'Landscape',
    description: 'Tranquil waters reflecting the peaceful beauty of nature.',
    size: 'small',
    image: '/FinishedPaintings/lagoon.png'
  },
  {
    id: 5,
    title: 'River',
    year: 2024,
    category: 'Landscape',
    description: 'The flowing movement of water captured in color and light.',
    size: 'medium',
    image: '/FinishedPaintings/river.png'
  },
  {
    id: 6,
    title: 'Tree',
    year: 2024,
    category: 'Nature',
    description: 'Strong branches reaching skyward, a study of natural form.',
    size: 'large',
    image: '/FinishedPaintings/tree.png'
  },
];

// Array of finished paintings
const finishedPaintings = [
  '/FinishedPaintings/bike.png',
  '/FinishedPaintings/bird.png',
  '/FinishedPaintings/duck.png',
  '/FinishedPaintings/lagoon.png',
  '/FinishedPaintings/river.png',
  '/FinishedPaintings/tree.png'
];

// Function to get random painting
const getRandomPainting = () => {
  return finishedPaintings[Math.floor(Math.random() * finishedPaintings.length)];
};

export default function Home() {
  const {
    buttonColors,
    accentColor,
    darkGradientColor,
    brightAccentColor,
    darkColors,
    midColors,
    brightColors,
    setButtonColors,
    setAccentColor,
    setDarkGradientColor,
    setBrightAccentColor,
    setDarkColors,
    setMidColors,
    setBrightColors
  } = useColors();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<Array<{ x: number; y: number; id: string }>>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [currentImagePath, setCurrentImagePath] = useState(() => getRandomPainting());
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [isPaintingComplete, setIsPaintingComplete] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [letterColors, setLetterColors] = useState<string[]>([]);
  const [navBarColor, setNavBarColor] = useState('#ffffff');
  const revealCanvasRef = useRef<HTMLCanvasElement>(null);
  const colorImageRef = useRef<HTMLImageElement | null>(null);
  const brushImageRef = useRef<HTMLImageElement | null>(null);
  const lastPercentageCheckRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const baselinePixelCountRef = useRef(0);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Load color image and brushstroke
  useEffect(() => {
    const colorImg = new window.Image();
    colorImg.src = currentImagePath;
    colorImg.onload = () => {
      colorImageRef.current = colorImg;
      // Reset transitioning flag once image is loaded
      isTransitioningRef.current = false;

      // Sample random colors from the image for buttons (only ones with good contrast)
      const canvas = document.createElement('canvas');
      canvas.width = colorImg.naturalWidth;
      canvas.height = colorImg.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(colorImg, 0, 0);
        const colors: string[] = [];
        const extractedDarkColors: string[] = [];
        const extractedMidColors: string[] = [];
        const extractedBrightColors: string[] = [];

        // Helper to calculate luminance for contrast checking
        const getLuminance = (r: number, g: number, b: number) => {
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };

        // Cream background luminance (255, 255, 247)
        const bgLuminance = getLuminance(255, 255, 247);

        let attempts = 0;
        let darkColor: string | null = null;
        let brightColor: string | null = null;

        while ((colors.length < 4 || !darkColor || !brightColor || extractedDarkColors.length < 5 || extractedMidColors.length < 5 || extractedBrightColors.length < 5) && attempts < 1000) {
          const x = Math.floor(Math.random() * canvas.width);
          const y = Math.floor(Math.random() * canvas.height);
          const pixel = ctx.getImageData(x, y, 1, 1).data;

          // Calculate contrast ratio
          const colorLuminance = getLuminance(pixel[0], pixel[1], pixel[2]);
          const contrast = (Math.max(bgLuminance, colorLuminance) + 0.05) /
                          (Math.min(bgLuminance, colorLuminance) + 0.05);

          const rgbColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

          // Categorize colors by luminance
          // Dark colors: luminance < 0.3 (increased threshold to get more variety)
          if (colorLuminance < 0.3 && extractedDarkColors.length < 5) {
            if (!extractedDarkColors.includes(rgbColor)) {
              extractedDarkColors.push(rgbColor);
            }
          }
          // Mid colors: luminance between 0.3 and 0.6
          else if (colorLuminance >= 0.3 && colorLuminance <= 0.6 && extractedMidColors.length < 5) {
            if (!extractedMidColors.includes(rgbColor)) {
              extractedMidColors.push(rgbColor);
            }
          }
          // Bright colors: luminance > 0.6
          else if (colorLuminance > 0.6 && extractedBrightColors.length < 5) {
            if (!extractedBrightColors.includes(rgbColor)) {
              extractedBrightColors.push(rgbColor);
            }
          }

          // Only use colors with contrast ratio > 3 (readable)
          if (contrast > 3) {
            // Add to button colors if we need more
            if (colors.length < 4) {
              colors.push(rgbColor);
            }

            // Find a dark color for gradient (luminance < 0.3)
            if (!darkColor && colorLuminance < 0.3) {
              darkColor = rgbColor;
            }

            // Find a bright/saturated color (luminance between 0.2-0.6 with good saturation)
            if (!brightColor && colorLuminance > 0.2 && colorLuminance < 0.6) {
              const r = pixel[0] / 255;
              const g = pixel[1] / 255;
              const b = pixel[2] / 255;
              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              const saturation = max === 0 ? 0 : (max - min) / max;

              // Look for colors with saturation > 0.3
              if (saturation > 0.3) {
                brightColor = rgbColor;
              }
            }
          }
          attempts++;
        }

        // Fallback to default colors if not enough colors found
        while (colors.length < 4) {
          colors.push('#2e1705');
        }
        if (!darkColor) {
          darkColor = '#2E1705';
        }
        if (!brightColor) {
          brightColor = '#0B3826';
        }

        console.log('Extracted Dark Colors:', extractedDarkColors);
        console.log('Extracted Mid Colors:', extractedMidColors);
        console.log('Extracted Bright Colors:', extractedBrightColors);
        console.log('Button Colors:', colors);

        setButtonColors(colors);
        setDarkColors(extractedDarkColors);
        setMidColors(extractedMidColors);
        setBrightColors(extractedBrightColors);

        // Use extracted colors as main theme colors
        setAccentColor(extractedDarkColors[0] || darkColor || '#2e1705');
        setDarkGradientColor(extractedDarkColors[1] || darkColor || '#2E1705');
        setBrightAccentColor(extractedBrightColors[0] || brightColor || '#0B3826');

        // Set navbar color to a random dark color
        if (extractedDarkColors.length > 0) {
          const randomDarkColor = extractedDarkColors[Math.floor(Math.random() * extractedDarkColors.length)];
          setNavBarColor(randomDarkColor);
          console.log('NavBar Color set to:', randomDarkColor);
        }
      }
    };

    const brushImg = new window.Image();
    brushImg.src = '/test_new_feature/brushstroke.png';
    brushImg.onload = () => {
      brushImageRef.current = brushImg;
    };
  }, [currentImagePath]);

  // Helper function to calculate cover dimensions (maintains aspect ratio)
  const getCoverDimensions = (img: HTMLImageElement) => {
    const windowRatio = window.innerWidth / window.innerHeight;
    const imageRatio = img.naturalWidth / img.naturalHeight;

    let width, height, offsetX, offsetY;

    if (windowRatio > imageRatio) {
      // Window is wider - fit to width
      width = window.innerWidth;
      height = window.innerWidth / imageRatio;
      offsetX = 0;
      offsetY = -(height - window.innerHeight) / 2;
    } else {
      // Window is taller - fit to height
      width = window.innerHeight * imageRatio;
      height = window.innerHeight;
      offsetX = -(width - window.innerWidth) / 2;
      offsetY = 0;
    }

    return { width, height, offsetX, offsetY };
  };

  // Organic raindrop effect - reveals painting with flowing circles
  useEffect(() => {
    if (!revealCanvasRef.current || !colorImageRef.current) return;

    const canvas = revealCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    interface Flower {
      x: number;
      y: number;
      stemStartY: number;
      stemLength: number;
      maxStemLength: number;
      stemGrowthRate: number;
      radius: number;
      maxRadius: number;
      growthRate: number;
      age: number;
      lifespan: number;
      petalCount: number;
      rotationOffset: number;
      stemCurve: number;
      isGrowing: boolean;
    }

    const flowers: Flower[] = [];
    const maxFlowers = 5;
    const goldenRatio = 1.618033988749895; // Golden ratio for natural spacing

    const createFlower = () => {
      const startX = Math.random() * canvas.width;
      const startY = canvas.height + 50; // Start below screen
      const stemHeight = 100 + Math.random() * 200;

      return {
        x: startX,
        y: startY,
        stemStartY: startY,
        stemLength: 0,
        maxStemLength: stemHeight,
        stemGrowthRate: 1 + Math.random() * 2,
        radius: 0, // Start at 0
        maxRadius: 30 + Math.random() * 40, // Max bloom size
        growthRate: 0.5 + Math.random() * 0.7, // How fast it blooms
        age: 0,
        lifespan: 200 + Math.random() * 150, // How long before fading
        petalCount: Math.floor(5 + Math.random() * 8), // 5-12 petals
        rotationOffset: Math.random() * Math.PI * 2,
        stemCurve: (Math.random() - 0.5) * 30, // Slight curve to stem
        isGrowing: true
      };
    };

    const animateFlowers = () => {
      if (!colorImageRef.current) return;

      // Add new flower if we have fewer than max
      if (flowers.length < maxFlowers && Math.random() < 0.015) {
        flowers.push(createFlower());
      }

      // Update and draw flowers
      flowers.forEach((flower, index) => {
        // Age the flower
        flower.age += 1;

        if (ctx && colorImageRef.current) {
          const { width, height, offsetX, offsetY } = getCoverDimensions(colorImageRef.current);

          // First phase: Grow the stem
          if (flower.stemLength < flower.maxStemLength) {
            flower.stemLength += flower.stemGrowthRate;

            // Update flower position as stem grows
            flower.y = flower.stemStartY - flower.stemLength;

            // Draw stem using curved line with circles
            const stemSegments = Math.floor(flower.stemLength / 5);
            for (let i = 0; i < stemSegments; i++) {
              const progress = i / stemSegments;
              const segmentY = flower.stemStartY - (progress * flower.stemLength);
              const segmentX = flower.x + Math.sin(progress * Math.PI) * flower.stemCurve;

              ctx.save();
              ctx.beginPath();
              ctx.arc(segmentX, segmentY, 2, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(colorImageRef.current, offsetX, offsetY, width, height);
              ctx.restore();
            }
          }
          // Second phase: Bloom the flower after stem is fully grown
          else if (flower.radius < flower.maxRadius) {
            flower.radius += flower.growthRate;

            // Draw the stem (fully grown)
            const stemSegments = Math.floor(flower.maxStemLength / 5);
            for (let i = 0; i < stemSegments; i++) {
              const progress = i / stemSegments;
              const segmentY = flower.stemStartY - (progress * flower.maxStemLength);
              const segmentX = flower.x + Math.sin(progress * Math.PI) * flower.stemCurve;

              ctx.save();
              ctx.beginPath();
              ctx.arc(segmentX, segmentY, 2, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(colorImageRef.current, offsetX, offsetY, width, height);
              ctx.restore();
            }

            // Calculate flower position (at top of stem with curve)
            const flowerX = flower.x + Math.sin(Math.PI) * flower.stemCurve * 0.5;
            const flowerY = flower.y;

            // Draw center circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(flowerX, flowerY, flower.radius * 0.3, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(colorImageRef.current, offsetX, offsetY, width, height);
            ctx.restore();

            // Draw petals in a circular pattern (Fibonacci spiral arrangement)
            for (let i = 0; i < flower.petalCount; i++) {
              const goldenAngle = i * goldenRatio * Math.PI * 2; // Fibonacci arrangement

              // Petal position using golden angle for natural spacing
              const petalDistance = flower.radius * 0.6;
              const petalX = flowerX + Math.cos(goldenAngle) * petalDistance;
              const petalY = flowerY + Math.sin(goldenAngle) * petalDistance;

              // Petal size varies with growth
              const petalRadius = flower.radius * 0.35 * (1 - i / flower.petalCount * 0.3);

              ctx.save();
              ctx.beginPath();
              ctx.arc(petalX, petalY, petalRadius, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(colorImageRef.current, offsetX, offsetY, width, height);
              ctx.restore();
            }
          }
        }

        // Remove flower after lifespan
        if (flower.age > flower.lifespan) {
          flowers.splice(index, 1);
        }
      });

      requestAnimationFrame(animateFlowers);
    };

    animateFlowers();
  }, [colorImageRef.current]);

  // Initialize reveal canvas
  useEffect(() => {
    if (!revealCanvasRef.current) return;

    const canvas = revealCanvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Start with transparent canvas (cream background shows through)
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const handleResize = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse tracking for cursor trail and painting
  useEffect(() => {
    let counter = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Add cursor trail with unique ID
      const newTrail = { x: e.clientX, y: e.clientY, id: `${Date.now()}-${counter++}` };
      setCursorTrail((prev) => [...prev, newTrail].slice(-15));

      // Paint color image using brushstroke alpha as mask (skip if transitioning)
      if (revealCanvasRef.current && colorImageRef.current && brushImageRef.current && !isTransitioningRef.current) {
        const ctx = revealCanvasRef.current.getContext('2d', { willReadFrequently: false });
        if (ctx) {
          const brushSize = Math.min(window.innerWidth, window.innerHeight) * 0.2;

          // Create temporary canvas to compose the brushstroke-shaped color reveal
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = brushSize;
          tempCanvas.height = brushSize;
          const tempCtx = tempCanvas.getContext('2d');

          if (tempCtx) {
            // Calculate cover dimensions to maintain aspect ratio
            const { width, height, offsetX, offsetY } = getCoverDimensions(colorImageRef.current);

            // Draw the section of color image at this position
            // We need to offset by the image position to sample the correct portion
            tempCtx.drawImage(
              colorImageRef.current,
              offsetX - (e.clientX - brushSize / 2),
              offsetY - (e.clientY - brushSize / 2),
              width,
              height
            );

            // Use brushstroke alpha as mask
            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.drawImage(brushImageRef.current, 0, 0, brushSize, brushSize);

            // Paint the result onto main canvas
            ctx.drawImage(
              tempCanvas,
              e.clientX - brushSize / 2,
              e.clientY - brushSize / 2,
              brushSize,
              brushSize
            );

            // Calculate actual revealed percentage (throttled to every 100ms)
            const now = Date.now();
            if (now - lastPercentageCheckRef.current > 100) {
              lastPercentageCheckRef.current = now;

              // Sample every 10th pixel to improve performance
              const canvasImageData = ctx.getImageData(0, 0, revealCanvasRef.current.width, revealCanvasRef.current.height);
              let revealedCount = 0;
              let sampledCount = 0;
              for (let i = 3; i < canvasImageData.data.length; i += 40) { // Sample every 10th pixel (4 channels * 10)
                sampledCount++;
                if (canvasImageData.data[i] > 0) {
                  revealedCount++;
                }
              }
              // Calculate percentage based on NEW pixels painted (subtract baseline from previous image)
              const newPixelsRevealed = revealedCount - baselinePixelCountRef.current;
              const maxNewPixels = sampledCount - baselinePixelCountRef.current;
              const percentRevealed = maxNewPixels > 0 ? (newPixelsRevealed / maxNewPixels) * 100 : 0;
              setRevealPercentage(Math.min(Math.max(percentRevealed, 0), 100));

              if (percentRevealed >= 100 && !isTransitioningRef.current) {
                isTransitioningRef.current = true;
                setIsPaintingComplete(true);

                // Switch to new random finished painting
                const newPainting = getRandomPainting();

                // Store current pixel count as baseline for next image
                baselinePixelCountRef.current = revealedCount;

                // Don't clear canvas - keep previous painting
                setRevealPercentage(0);
                setIsPaintingComplete(false);
                setCurrentImagePath(newPainting);
                // Don't reset flag here - wait for image to load (see useEffect above)
              }
            }
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Touch interaction for mobile - tap to auto-reveal around point
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (!revealCanvasRef.current || !colorImageRef.current || !brushImageRef.current || isTransitioningRef.current) return;

      const touch = e.touches[0];
      const centerX = touch.clientX;
      const centerY = touch.clientY;

      const ctx = revealCanvasRef.current.getContext('2d', { willReadFrequently: false });
      if (!ctx) return;

      const brushSize = Math.min(window.innerWidth, window.innerHeight) * 0.2;
      let angle = 0;
      let radius = 0;
      const maxRadius = brushSize * 3; // Expand to 3x brush size
      const spiralSpeed = 0.5; // How fast the spiral expands
      const angleIncrement = 0.3; // How tight the spiral is

      const animateReveal = () => {
        if (radius > maxRadius || isTransitioningRef.current) return;

        // Calculate position on spiral
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Paint at this position
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = brushSize;
        tempCanvas.height = brushSize;
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
          // Calculate cover dimensions to maintain aspect ratio
          const { width, height, offsetX, offsetY } = getCoverDimensions(colorImageRef.current!);

          // Draw the section of color image at this position
          tempCtx.drawImage(
            colorImageRef.current!,
            offsetX - (x - brushSize / 2),
            offsetY - (y - brushSize / 2),
            width,
            height
          );

          // Use brushstroke alpha as mask
          tempCtx.globalCompositeOperation = 'destination-in';
          tempCtx.drawImage(brushImageRef.current!, 0, 0, brushSize, brushSize);

          // Paint the result onto main canvas
          ctx.drawImage(
            tempCanvas,
            x - brushSize / 2,
            y - brushSize / 2,
            brushSize,
            brushSize
          );
        }

        // Update spiral parameters
        angle += angleIncrement;
        radius += spiralSpeed;

        // Continue animation
        requestAnimationFrame(animateReveal);
      };

      // Start the reveal animation
      animateReveal();

      // Calculate percentage after animation completes
      setTimeout(() => {
        const canvasImageData = ctx.getImageData(0, 0, revealCanvasRef.current!.width, revealCanvasRef.current!.height);
        let revealedCount = 0;
        let sampledCount = 0;
        for (let i = 3; i < canvasImageData.data.length; i += 40) {
          sampledCount++;
          if (canvasImageData.data[i] > 0) {
            revealedCount++;
          }
        }
        // Calculate percentage based on NEW pixels painted (subtract baseline from previous image)
        const newPixelsRevealed = revealedCount - baselinePixelCountRef.current;
        const maxNewPixels = sampledCount - baselinePixelCountRef.current;
        const percentRevealed = maxNewPixels > 0 ? (newPixelsRevealed / maxNewPixels) * 100 : 0;
        setRevealPercentage(Math.min(Math.max(percentRevealed, 0), 100));

        // Trigger transition if 100% revealed
        if (percentRevealed >= 100 && !isTransitioningRef.current) {
          isTransitioningRef.current = true;
          setIsPaintingComplete(true);

          // Switch to new random finished painting
          const newPainting = getRandomPainting();

          // Store current pixel count as baseline for next image
          baselinePixelCountRef.current = revealedCount;

          // Don't clear canvas - keep previous painting
          setRevealPercentage(0);
          setIsPaintingComplete(false);
          setCurrentImagePath(newPainting);
        }
      }, (maxRadius / spiralSpeed) * 16); // Wait for animation to complete (approx)
    };

    window.addEventListener('touchstart', handleTouch);
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);

  // Scroll tracking for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic color contrast detection for text
  useEffect(() => {
    const checkTextColors = () => {
      if (!textRef.current || !revealCanvasRef.current || darkColors.length === 0) return;

      const canvas = revealCanvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const letterSpans = textRef.current.querySelectorAll('span');
      const newColors: string[] = [];

      // Helper to calculate luminance
      const getLuminance = (r: number, g: number, b: number) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      letterSpans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Sample the color at the center of the letter
        const imageData = ctx.getImageData(centerX, centerY, 1, 1).data;
        const alpha = imageData[3];

        // If there's painted content underneath (alpha > 0)
        if (alpha > 10) {
          const bgLuminance = getLuminance(imageData[0], imageData[1], imageData[2]);

          // Choose contrasting color from palette
          let chosenColor;
          if (bgLuminance > 0.5) {
            // Background is bright, use dark colors
            chosenColor = darkColors[Math.floor(Math.random() * darkColors.length)] || accentColor;
          } else if (bgLuminance > 0.2) {
            // Background is mid-tone, use bright or dark with good contrast
            const contrastColors = bgLuminance > 0.35 ? darkColors : brightColors;
            chosenColor = contrastColors[Math.floor(Math.random() * contrastColors.length)] || accentColor;
          } else {
            // Background is dark, use bright colors
            chosenColor = brightColors[Math.floor(Math.random() * brightColors.length)] || accentColor;
          }
          newColors.push(chosenColor);
        } else {
          // No paint underneath, use gradient colors
          const letterIndex = Array.from(letterSpans).indexOf(span);
          const progress = letterIndex / (letterSpans.length - 1);
          const allColors = [...darkColors, ...midColors, ...brightColors];
          const colorIndex = Math.floor(progress * (allColors.length - 1));
          newColors.push(allColors[colorIndex] || accentColor);
        }
      });

      setLetterColors(newColors);
    };

    // Check colors periodically
    const interval = setInterval(checkTextColors, 100);
    return () => clearInterval(interval);
  }, [darkColors, midColors, brightColors, accentColor]);

  // Petal button data
  const petals = [
    { name: 'Portfolio', href: '#portfolio', angle: 0 },
    { name: 'SketchBook', href: '/sketchbook', angle: 90 },
    { name: 'Shop', href: '/shop', angle: 180 },
    { name: 'About', href: '/about', angle: 270 },
  ];

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };


  const getFrameSize = (size: string) => {
    switch(size) {
      case 'large': return 'h-[400px] sm:h-[500px]';
      case 'medium': return 'h-[350px] sm:h-[400px]';
      case 'small': return 'h-[300px] sm:h-[350px]';
      default: return 'h-[350px] sm:h-[400px]';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cursor Trail */}
      {cursorTrail.map((trail, index) => (
        <motion.div
          key={trail.id}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed w-4 h-4 rounded-full pointer-events-none z-50"
          style={{
            left: trail.x - 8,
            top: trail.y - 8,
            opacity: (index / cursorTrail.length) * 0.6,
            backgroundColor: midColors[index % midColors.length] || darkGradientColor,
          }}
        />
      ))}

      {/* Static Background - cream color with canvas overlay */}
      <div className="fixed inset-0 -z-10 bg-[#fffff7]">
        {/* Canvas that reveals color image on mouse move */}
        <div className="absolute inset-0 z-10">
          <canvas
            ref={revealCanvasRef}
            className="absolute inset-0 pointer-events-none"
          />
        </div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${accentColor}DD` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Left: Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity relative z-10"
          >
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: brightAccentColor }}></span>
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: brightAccentColor }}></span>
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: brightAccentColor }}></span>
          </button>

          {/* Center: Site Name */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 inline-flex items-center pointer-events-auto z-0">
            <h1 className="text-2xl sm:text-3xl font-bold lowercase flex gap-1" style={{ color: brightAccentColor }}>
              {'vicgarcia.art'.split('').map((letter, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, 0, -2, 3, -1, 0, -2, 3, -4, 2, -1][i]}deg)` }}>{letter}</span>
              ))}
            </h1>
          </Link>

          {/* Right: Empty space for symmetry */}
          <div className="w-10 h-10"></div>
        </div>
      </nav>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-[#fffff7] shadow-2xl z-50 flex flex-col"
            >
              {/* Close Button */}
              <div className="flex justify-start p-6">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
                >
                  <span className="text-3xl" style={{ color: accentColor }}>×</span>
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex flex-col gap-6 px-8 py-4 max-h-[750px]:mt-16">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'home'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[3, -2, 4, -3][i]}deg)` }}>{letter}</span>
                  ))}
                </Link>
                <Link
                  href="#portfolio"
                  onClick={scrollToPortfolio}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'portfolio'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[-2, 3, -4, 2, -3, 4, -2, 3, -1][i]}deg)` }}>{letter}</span>
                  ))}
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'shop'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[-3, 4, -2, 3][i]}deg)` }}>{letter}</span>
                  ))}
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'about'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, -2, 3][i]}deg)` }}>{letter}</span>
                  ))}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'contact'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[-2, 3, -4, 2, -3, 4, -1][i]}deg)` }}>{letter}</span>
                  ))}
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative min-h-screen">
        {/* Center Text - Victor Garcia Art */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 px-4"
        >
          <h1 ref={textRef} className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light lowercase flex gap-0.5 sm:gap-1 md:gap-2 text-center flex-wrap justify-center max-w-full">
            {'victor garcia art'.split('').map((letter, i) => {
              // Use dynamic color from letterColors if available, otherwise use gradient
              let color = accentColor;

              if (letterColors.length > i) {
                color = letterColors[i];
              } else {
                // Calculate gradient from dark to bright colors as fallback
                const totalLetters = 'victor garcia art'.length - 2; // subtract spaces
                const letterIndex = letter === ' ' ? -1 : i - (i > 6 ? 1 : 0) - (i > 13 ? 1 : 0); // adjust for spaces

                if (letterIndex >= 0) {
                  const progress = letterIndex / totalLetters;
                  const allColors = [...darkColors, ...midColors, ...brightColors];
                  if (allColors.length > 0) {
                    const colorIndex = Math.floor(progress * (allColors.length - 1));
                    color = allColors[colorIndex] || accentColor;
                  }
                }
              }

              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: `rotate(${[2, -1, 3, -2, 1, -3, 2, 0, -1, 3, -2, 1, -3, 2, -1, 3, -2][i]}deg)`,
                    color: color,
                    transition: 'color 0.3s ease'
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </h1>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-20 left-0 right-0 flex flex-wrap justify-center gap-3 sm:gap-4 md:justify-evenly px-4 sm:px-6 select-none max-w-4xl mx-auto"
        >
          {petals.map((petal, index) => (
            <Link key={petal.name} href={petal.href} onClick={petal.name === 'Portfolio' ? scrollToPortfolio : undefined}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: [0, -10, 10, -10, 10, 0],
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  scale: { duration: 0.4, delay: 1.2 + index * 0.1 },
                  opacity: { duration: 0.4, delay: 1.2 + index * 0.1 },
                  rotate: {
                    duration: 1.5,
                    delay: 3 + index * 0.3,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut"
                  }
                }}
                whileTap={{ scale: 0.95 }}
                className="px-4 sm:px-6 py-2 border-[3px] sm:border-[5px] rounded-full shadow-lg select-none"
                style={{
                  borderColor: darkColors[index % darkColors.length] || '#2e1705',
                  color: darkColors[index % darkColors.length] || '#2e1705',
                  backgroundColor: brightColors[index % brightColors.length] || 'transparent'
                }}
              >
                <span className="font-semibold text-xs sm:text-sm select-none whitespace-nowrap">
                  {petal.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Decorative Background Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl -z-10"
          style={{ backgroundColor: `${midColors[2] || brightAccentColor}66` }}
        />
      </main>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative py-20 px-4 sm:px-6" style={{
        background: `linear-gradient(to bottom, #fffff7, #f5f5ed)`
      }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>
              Portfolio
            </h2>
            <p className="text-xl" style={{ color: darkColors[1] || accentColor }}>
              Explore my collection of artwork
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 sm:gap-4 mb-16 flex-wrap justify-center"
          >
            {['All', 'Nature', 'Landscape'].map((filter, idx) => (
              <button
                key={filter}
                className="px-4 sm:px-6 py-2 rounded-full transition-all text-sm sm:text-base border-2"
                style={{
                  backgroundColor: brightColors[idx] || `${accentColor}1A`,
                  color: darkColors[idx] || accentColor,
                  borderColor: darkColors[idx] || accentColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = midColors[idx] || `${accentColor}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = brightColors[idx] || `${accentColor}1A`;
                }}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {/* Gallery Wall */}
          <div className="space-y-16 sm:space-y-24">
            {artworks.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index, duration: 0.8 }}
                className="group"
              >
                {/* Frame with shadow effect */}
                <motion.div
                  className="relative mx-auto max-w-3xl"
                >
                  {/* Artwork Frame */}
                  <div className="relative bg-[#fffff7] p-6 sm:p-8 shadow-2xl">
                    {/* Inner artwork area */}
                    <div
                      className="relative w-full overflow-hidden transition-all duration-300 group-hover:border-4"
                      style={{
                        borderColor: darkColors[index % darkColors.length] || darkGradientColor
                      }}
                    >
                      <Image
                        src={art.image}
                        alt={art.title}
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                      />
                    </div>

                    {/* Frame shadow/depth effect */}
                    <div
                      className="absolute -inset-2 -z-10 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(to bottom, ${midColors[index % midColors.length] || accentColor}CC, ${darkColors[index % darkColors.length] || accentColor})`
                      }}
                    ></div>
                  </div>

                  {/* Spotlight effect on hover */}
                  <motion.div
                    className="absolute -inset-12 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-20"
                    initial={{ opacity: 0 }}
                    style={{ backgroundColor: `${darkColors[index % darkColors.length] || darkGradientColor}` }}
                  />
                </motion.div>

                {/* Artwork Info Plaque */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index + 0.3 }}
                  className="mt-8 max-w-2xl mx-auto p-6"
                >
                  <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: darkColors[0] || accentColor }}>
                    {art.title}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: darkColors[1] || accentColor }}>
                    {art.category} • {art.year}
                  </p>
                  <p className="leading-relaxed italic text-sm sm:text-base" style={{ color: darkColors[2] || accentColor }}>
                    &quot;{art.description}&quot;
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
