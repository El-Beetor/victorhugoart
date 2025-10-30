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
    title: 'River',
    year: 2024,
    category: 'Landscape',
    description: 'The flowing movement of water captured in color and light.',
    size: 'medium',
    image: '/FinishedPaintings/river.png'
  },
  {
    id: 5,
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
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
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

      // Draw grayscale version on background canvas
      if (bgCanvasRef.current) {
        const bgCanvas = bgCanvasRef.current;
        const bgCtx = bgCanvas.getContext('2d');
        if (bgCtx) {
          bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

          // Calculate cover dimensions
          const { width, height, offsetX, offsetY } = getCoverDimensions(colorImg);

          // Draw the image
          bgCtx.drawImage(colorImg, offsetX, offsetY, width, height);

          // Apply grayscale filter
          const imageData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;     // R
            data[i + 1] = gray; // G
            data[i + 2] = gray; // B
          }

          bgCtx.putImageData(imageData, 0, 0);
        }
      }

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
    const canvasHeight = window.innerHeight * 0.6667; // 2/3 of viewport height
    const windowRatio = window.innerWidth / canvasHeight;
    const imageRatio = img.naturalWidth / img.naturalHeight;

    let width, height, offsetX, offsetY;

    if (windowRatio > imageRatio) {
      // Window is wider - fit to width
      width = window.innerWidth;
      height = window.innerWidth / imageRatio;
      offsetX = 0;
      offsetY = -(height - canvasHeight) / 2;
    } else {
      // Window is taller - fit to height
      width = canvasHeight * imageRatio;
      height = canvasHeight;
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
    let totalFlowersCreated = 0; // Track total flowers created

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

      // Add new flower only if we haven't created 5 flowers yet
      if (totalFlowersCreated < maxFlowers && Math.random() < 0.015) {
        flowers.push(createFlower());
        totalFlowersCreated++;
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

  // Initialize reveal canvas and background canvas
  useEffect(() => {
    if (!revealCanvasRef.current || !bgCanvasRef.current) return;

    const canvas = revealCanvasRef.current;
    const bgCanvas = bgCanvasRef.current;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.6667; // 2/3 of viewport height
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight * 0.6667;

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
      canvas.height = window.innerHeight * 0.6667; // 2/3 of viewport height
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight * 0.6667;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
      }

      // Redraw grayscale background after resize
      if (colorImageRef.current && bgCanvasRef.current) {
        const bgCtx = bgCanvasRef.current.getContext('2d');
        if (bgCtx) {
          bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          const { width, height, offsetX, offsetY } = getCoverDimensions(colorImageRef.current);
          bgCtx.drawImage(colorImageRef.current, offsetX, offsetY, width, height);

          const imageData = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
          }
          bgCtx.putImageData(imageData, 0, 0);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse tracking for cursor trail and painting
  useEffect(() => {
    let counter = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const canvasHeight = window.innerHeight * 0.6667;

      // Only track cursor trail in the top 2/3
      if (e.clientY <= canvasHeight) {
        setMousePosition({ x: e.clientX, y: e.clientY });

        // Add cursor trail with unique ID
        const newTrail = { x: e.clientX, y: e.clientY, id: `${Date.now()}-${counter++}` };
        setCursorTrail((prev) => [...prev, newTrail].slice(-15));
      }

      // Paint color image using brushstroke alpha as mask (skip if transitioning and only in top 2/3)
      if (e.clientY <= canvasHeight && revealCanvasRef.current && colorImageRef.current && brushImageRef.current && !isTransitioningRef.current) {
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

                // Clear canvas for new image
                ctx.clearRect(0, 0, revealCanvasRef.current.width, revealCanvasRef.current.height);
                baselinePixelCountRef.current = 0;

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
      const canvasHeight = window.innerHeight * 0.6667;

      // Only work in the top 2/3
      if (centerY > canvasHeight) return;

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
        if (!revealCanvasRef.current) return;
        const canvasImageData = ctx.getImageData(0, 0, revealCanvasRef.current.width, revealCanvasRef.current.height);
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

          // Clear canvas for new image
          ctx.clearRect(0, 0, revealCanvasRef.current.width, revealCanvasRef.current.height);
          baselinePixelCountRef.current = 0;

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

    // Check colors periodically (disabled to prevent flashing)
    // const interval = setInterval(checkTextColors, 100);
    // return () => clearInterval(interval);
  }, [darkColors, midColors, brightColors, accentColor]);

  // Petal button data
  const petals = [
    { name: 'Portfolio', href: '#portfolio', angle: 0, image: '/ButtonImages/portfolio.png' },
    { name: 'SketchBook', href: '/sketchbook', angle: 90, image: '/ButtonImages/sketchbook.png' },
    { name: 'Shop', href: '/shop', angle: 180, image: '/ButtonImages/shop.png' },
    { name: 'About', href: '/about', angle: 270, image: '/ButtonImages/aboutme.png' },
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
        {/* Black and white version of current image - 2/3 height */}
        <div className="absolute inset-x-0 top-0 h-[66.67vh] z-0">
          <canvas
            ref={bgCanvasRef}
            className="absolute inset-0"
          />
        </div>
        {/* Canvas that reveals color image on mouse move - 2/3 height */}
        <div className="absolute inset-x-0 top-0 h-[66.67vh] z-10">
          <canvas
            ref={revealCanvasRef}
            className="absolute inset-0 pointer-events-none"
          />
        </div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: '#fffff7DD' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Left: Site Name */}
          <Link href="/" className="inline-flex items-center gap-2 pointer-events-auto z-10">
            <Image
              src="/favicon.ico"
              alt="Victor Garcia Art Logo"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <h1 className="text-2xl sm:text-3xl font-bold lowercase flex gap-1 text-black">
              {'vicgarcia.art'.split('').map((letter, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, 0, -2, 3, -1, 0, -2, 3, -4, 2, -1][i]}deg)` }}>{letter}</span>
              ))}
            </h1>
          </Link>

          {/* Right: Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity relative z-10"
          >
            <span className="w-6 h-0.5 rounded-full bg-black"></span>
            <span className="w-6 h-0.5 rounded-full bg-black"></span>
            <span className="w-6 h-0.5 rounded-full bg-black"></span>
          </button>
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-[#fffff7] shadow-2xl z-50 flex flex-col"
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
                  href="/sketchbook"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'sketchbook'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, -2, 3, -4, 2, -3, 4, -2][i]}deg)` }}>{letter}</span>
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
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative h-screen flex flex-col">
        {/* Top 2/3: Painting Area */}
        <div className="relative h-[66.67vh] flex items-center justify-center">
          {/* Center Text - Victor Garcia Art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex items-center justify-center pointer-events-none z-20 px-4"
          >
          <div className="relative">
            {/* Blur background with gradient fade */}
            <div className="absolute inset-0 backdrop-blur-md" style={{
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
              transform: 'scale(1.2)',
              zIndex: -1
            }}></div>
            <h1 ref={textRef} className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light lowercase flex gap-0.5 sm:gap-1 md:gap-2 text-center flex-wrap justify-center max-w-full" style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))' }}>
            {'victor garcia art'.split('').map((letter, i) => {
              // Use gradient from mid to bright colors only (no dark colors)
              let color = accentColor;

              // Calculate gradient from mid to bright colors as fallback
              const totalLetters = 'victor garcia art'.length - 2; // subtract spaces
              const letterIndex = letter === ' ' ? -1 : i - (i > 6 ? 1 : 0) - (i > 13 ? 1 : 0); // adjust for spaces

              if (letterIndex >= 0) {
                const progress = letterIndex / totalLetters;
                const allColors = [...midColors, ...brightColors]; // Only use mid and bright colors
                if (allColors.length > 0) {
                  const colorIndex = Math.floor(progress * (allColors.length - 1));
                  color = allColors[colorIndex] || accentColor;
                }
              }

              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: `rotate(${[2, -1, 3, -2, 1, -3, 2, 0, -1, 3, -2, 1, -3, 2, -1, 3, -2][i]}deg)`,
                    color: color
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </h1>
          </div>
        </motion.div>
        </div>

        {/* Bottom 1/3: Navigation Buttons */}
        <div className="relative h-[33.33vh] flex items-center justify-center bg-[#fffff7]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-6 select-none max-w-5xl mx-auto"
          >
          {petals.map((petal, index) => (
            <Link key={petal.name} href={petal.href} onClick={petal.name === 'Portfolio' ? scrollToPortfolio : undefined}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  scale: { duration: 0.4, delay: 1.2 + index * 0.1 },
                  opacity: { duration: 0.4, delay: 1.2 + index * 0.1 },
                }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 select-none"
              >
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 10, 0],
                  }}
                  transition={{
                    rotate: {
                      duration: 1.5,
                      delay: 3 + index * 0.3,
                      repeat: Infinity,
                      repeatDelay: 4,
                      ease: "easeInOut"
                    }
                  }}
                  className="rounded-lg overflow-hidden"
                >
                  <Image
                    src={petal.image}
                    alt={petal.name}
                    width={200}
                    height={200}
                    className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain"
                  />
                </motion.div>
                <span
                  className="font-semibold text-base sm:text-lg select-none whitespace-nowrap uppercase"
                  style={{ color: '#000000' }}
                >
                  {petal.name}
                </span>
              </motion.div>
            </Link>
          ))}
          </motion.div>
        </div>
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
                  <p className="text-sm" style={{ color: darkColors[1] || accentColor }}>
                    {art.category} • {art.year}
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
