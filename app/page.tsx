'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useColors } from './context/ColorContext';
import Footer from './components/Footer';
import InstagramEmbed from './components/InstagramEmbed';

// Array of finished paintings, with title/medium shown on the home page hero
const finishedPaintings = [
  { src: '/FinishedPaintings/graceland.jpg', title: 'Graceland', medium: 'Oil on Canvas 8" x 12"' },
  { src: '/FinishedPaintings/bar.jpg', title: '10pm', medium: 'Oil on Canvas 8" x 10"' },
  { src: '/FinishedPaintings/bike.jpg', title: 'After School Bike Ride', medium: 'Oil on Canvas 9" x 12"' },
  { src: '/FinishedPaintings/bird.jpg', title: 'Bird in Blue', medium: 'Oil on Canvas 14" x 18"' },
  { src: '/FinishedPaintings/duck.jpg', title: 'Sisters', medium: 'Oil on Paper 8" x 10"' },
  { src: '/FinishedPaintings/river.jpg', title: 'Long way down: Far way forward', medium: 'Oil on Wood 8" x 10"' },
  { src: '/FinishedPaintings/tree.jpg', title: 'Billowing Tree', medium: 'Oil on Canvas 24" x 30"' },
  { src: '/FinishedPaintings/sheep.jpg', title: "Le' Sheep", medium: 'Oil on Canvas 8" x 10"' },
];

// Function to get random painting
const getRandomPainting = () => {
  return finishedPaintings[Math.floor(Math.random() * finishedPaintings.length)];
};

// "What I'm Into" sections shown on the home page
const interests = [
  {
    title: 'Painting & Sketching',
    description: "Most of my time goes into oil painting — small canvases of everyday moments, like a bike ride after school, a quiet bar at 10pm, or a tree caught mid-billow in the wind. I also carry a sketchbook everywhere, filling it with quick studies and ideas."
  },
  {
    title: 'Building Things',
    description: "When I'm not painting, I'm usually building something — websites, apps, little tools that solve a problem I ran into. This site is one of those projects. I love turning an idea into something real, whether it's made of pixels or paint."
  },
  {
    title: 'Process & Behind the Scenes',
    description: "I like sharing the messier side of making art — time-lapses, work-in-progress shots, and the occasional studio chaos. You'll find a lot of that on Instagram, with a few favorites below."
  }
];

// Instagram post/reel URLs to feature in the Watch section.
// Add permalinks like: 'https://www.instagram.com/reel/XXXXXXXXXXX/'
const instagramVideos: string[] = [
  'https://www.instagram.com/reel/DZbpx8ovmhU/',
  'https://www.instagram.com/p/DWuo6Rdj5nm/',
  'https://www.instagram.com/p/DWk4ll2lXlr/',
];

export default function Home() {
  const {
    buttonColors,
    accentColor,
    darkGradientColor,
    brightAccentColor,
    darkColors,
    midColors,
    brightColors,
    bgGradientStart,
    bgGradientEnd,
    textColor,
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
  const [currentPainting, setCurrentPainting] = useState(() => getRandomPainting());
  const [mounted, setMounted] = useState(false);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [isPaintingComplete, setIsPaintingComplete] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [letterColors, setLetterColors] = useState<string[]>([]);
  const [navBarColor, setNavBarColor] = useState('#ffffff');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const revealCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const colorImageRef = useRef<HTMLImageElement | null>(null);
  const brushImageRef = useRef<HTMLImageElement | null>(null);
  const lastPercentageCheckRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const baselinePixelCountRef = useRef(0);
  const textRef = useRef<HTMLHeadingElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Avoid SSR/client mismatch: currentPainting starts random, so only
  // render text that depends on it after the client has mounted.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load color image and brushstroke
  useEffect(() => {
    const colorImg = new window.Image();
    colorImg.src = currentPainting.src;
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
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
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
          const idx = (y * canvas.width + x) * 4;
          const pixel = [pixels[idx], pixels[idx + 1], pixels[idx + 2]];

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
  }, [currentPainting]);

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

  // Reusable offscreen canvas for compositing brush strokes (avoids allocating a new canvas on every mousemove)
  const getTempCanvas = (size: number) => {
    let tempCanvas = tempCanvasRef.current;
    if (!tempCanvas) {
      tempCanvas = document.createElement('canvas');
      tempCanvasRef.current = tempCanvas;
    }
    if (tempCanvas.width !== size || tempCanvas.height !== size) {
      tempCanvas.width = size;
      tempCanvas.height = size;
    }
    return tempCanvas;
  };


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
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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
        const ctx = revealCanvasRef.current.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const brushSize = Math.min(window.innerWidth, window.innerHeight) * 0.2;

          // Reuse a single offscreen canvas to compose the brushstroke-shaped color reveal
          const tempCanvas = getTempCanvas(brushSize);
          const tempCtx = tempCanvas.getContext('2d');

          if (tempCtx) {
            tempCtx.globalCompositeOperation = 'source-over';
            tempCtx.clearRect(0, 0, brushSize, brushSize);

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
                setCurrentPainting(newPainting);
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

      // Ignore touches on interactive elements (nav arrows, links, menu)
      if (e.target instanceof Element && e.target.closest('button, a')) return;

      const touch = e.touches[0];
      const centerX = touch.clientX;
      const centerY = touch.clientY;
      const canvasHeight = window.innerHeight * 0.6667;

      // Only work in the top 2/3
      if (centerY > canvasHeight) return;

      const ctx = revealCanvasRef.current.getContext('2d', { willReadFrequently: true });
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

        // Paint at this position (reuse a single offscreen canvas)
        const tempCanvas = getTempCanvas(brushSize);
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
          tempCtx.globalCompositeOperation = 'source-over';
          tempCtx.clearRect(0, 0, brushSize, brushSize);

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
          setCurrentPainting(newPainting);
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

  // Manually switch the hero to the previous/next painting (wraps around).
  // Mirrors the reset in the 100%-revealed transition: clear the reveal
  // canvas and let the image-load effect finish the swap.
  const goToPainting = (direction: number) => {
    if (isTransitioningRef.current) return;
    const currentIndex = finishedPaintings.findIndex((p) => p.src === currentPainting.src);
    const nextPainting = finishedPaintings[(currentIndex + direction + finishedPaintings.length) % finishedPaintings.length];

    isTransitioningRef.current = true; // reset by the image onload effect
    const canvas = revealCanvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    baselinePixelCountRef.current = 0;
    setRevealPercentage(0);
    setCurrentPainting(nextPainting);
  };

  // Petal button data
  const petals = [
    { name: 'Portfolio', href: '/portfolio', angle: 0, image: '/ButtonImages/portfolio.png', hoverImage: '/ButtonImages/portfolio2.png' },
    { name: 'SketchBook', href: '/sketchbook', angle: 90, image: '/ButtonImages/sketchbook2.png', hoverImage: '/ButtonImages/sketchbook.png' },
    { name: 'About', href: '/about', angle: 270, image: '/ButtonImages/aboutme.png', hoverImage: '/ButtonImages/aboutme2.png' },
  ];

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
      <div className="fixed inset-0 -z-10" style={{ backgroundColor: bgGradientStart }}>
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
        {/* Title & medium for the current painting - bottom left of image */}
        <div className="absolute inset-x-0 top-0 h-[66.67vh] z-20 pointer-events-none">
          {mounted && (
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <p
                className="text-base sm:text-lg md:text-xl font-semibold text-white"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
              >
                {currentPainting.title}
              </p>
              <p
                className="text-xs sm:text-sm text-white"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
              >
                {currentPainting.medium}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${bgGradientStart}DD` }}>
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
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] shadow-2xl z-50 flex flex-col"
              style={{ backgroundColor: bgGradientStart }}
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
              <nav className="flex flex-col gap-6 px-8 py-4">
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
                  href="/portfolio"
                  onClick={() => setIsMenuOpen(false)}
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
      <main className="relative min-h-screen flex flex-col">
        {/* Top 2/3: Painting Area */}
        <div className="relative h-[66.67vh]">
          {/* Previous / next painting arrows */}
          {mounted && (
            <>
              <button
                onClick={() => goToPainting(-1)}
                aria-label="Previous painting"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 backdrop-blur-sm shadow-md flex items-center justify-center text-black/60 hover:bg-white/80 hover:text-black/80 hover:scale-110 active:scale-95 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={() => goToPainting(1)}
                aria-label="Next painting"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 backdrop-blur-sm shadow-md flex items-center justify-center text-black/60 hover:bg-white/80 hover:text-black/80 hover:scale-110 active:scale-95 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Bottom 1/3: Navigation Buttons */}
        <div className="relative py-6 md:py-25 flex items-center justify-center" style={{ backgroundColor: bgGradientStart }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-8 px-4 sm:px-6 select-none max-w-5xl mx-auto"
          >
          {petals.map((petal, index) => (
            <Link key={petal.name} href={petal.href}>
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
                onMouseEnter={() => setHoveredButton(petal.name)}
                onMouseLeave={() => setHoveredButton(null)}
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
                    src={hoveredButton === petal.name ? petal.hoverImage : petal.image}
                    alt={petal.name}
                    width={200}
                    height={200}
                    className="w-24 h-24 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain"
                  />
                </motion.div>
                <span
                  className="font-semibold text-xs sm:text-lg select-none whitespace-nowrap uppercase"
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

      {/* What I'm Into Section */}
      <section className="relative py-16 px-4 sm:px-6" style={{
        background: `linear-gradient(to bottom, ${bgGradientStart}, ${bgGradientEnd})`
      }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>
              What I&apos;m Into
            </h2>
            <p className="text-xl" style={{ color: darkColors[1] || accentColor }}>
              A few of the things that keep me busy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * index, duration: 0.6 }}
                className="p-6 sm:p-8 rounded-2xl shadow-xl border"
                style={{ borderColor: `${accentColor}1A`, backgroundColor: `${bgGradientStart}CC` }}
              >
                <h3 className="text-2xl font-bold mb-3" style={{ color: darkColors[0] || accentColor }}>
                  {interest.title}
                </h3>
                <p className="leading-relaxed" style={{ color: textColor }}>
                  {interest.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="relative py-16 px-4 sm:px-6" style={{ backgroundColor: bgGradientEnd }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>
              Watch
            </h2>
            <p className="text-xl" style={{ color: darkColors[1] || accentColor }}>
              Process videos and time-lapses from the studio
            </p>
          </motion.div>

          {instagramVideos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {instagramVideos.map((url) => (
                <InstagramEmbed key={url} url={url} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg mb-6" style={{ color: textColor }}>
                More videos coming soon — in the meantime, follow along for process clips and time-lapses.
              </p>
              <a
                href="https://instagram.com/vicgarcia.art"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 text-[#fffff7] font-semibold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                @vicgarcia.art on Instagram
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
