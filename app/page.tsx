'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useColors } from './context/ColorContext';

const artworks = [
  {
    id: 1,
    title: 'Midnight Dreams',
    year: 2024,
    category: 'Abstract',
    description: 'An exploration of subconscious imagery through bold strokes and deep colors.',
    size: 'large'
  },
  {
    id: 2,
    title: 'Portrait of Solitude',
    year: 2024,
    category: 'Portrait',
    description: 'Capturing the quiet beauty of introspection and self-reflection.',
    size: 'medium'
  },
  {
    id: 3,
    title: 'Mountain Serenity',
    year: 2023,
    category: 'Landscape',
    description: 'A peaceful vista inspired by early morning light in the Rockies.',
    size: 'large'
  },
  {
    id: 4,
    title: 'Urban Rhythm',
    year: 2023,
    category: 'Abstract',
    description: 'The pulse and energy of city life translated into geometric forms.',
    size: 'small'
  },
  {
    id: 5,
    title: 'Faces of Time',
    year: 2022,
    category: 'Portrait',
    description: 'A study of aging and the stories written in every line and wrinkle.',
    size: 'medium'
  },
  {
    id: 6,
    title: 'Coastal Sunset',
    year: 2022,
    category: 'Landscape',
    description: 'Golden hour on the Pacific coast, where sky meets sea.',
    size: 'large'
  },
];

export default function Home() {
  const { buttonColors, accentColor, darkGradientColor, brightAccentColor, setButtonColors, setAccentColor, setDarkGradientColor, setBrightAccentColor } = useColors();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<Array<{ x: number; y: number; id: string }>>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const [currentImagePath, setCurrentImagePath] = useState('/test_new_feature/color.png');
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [isPaintingComplete, setIsPaintingComplete] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const revealCanvasRef = useRef<HTMLCanvasElement>(null);
  const colorImageRef = useRef<HTMLImageElement | null>(null);
  const brushImageRef = useRef<HTMLImageElement | null>(null);
  const lastPercentageCheckRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const baselinePixelCountRef = useRef(0);

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

        while ((colors.length < 4 || !darkColor || !brightColor) && attempts < 300) {
          const x = Math.floor(Math.random() * canvas.width);
          const y = Math.floor(Math.random() * canvas.height);
          const pixel = ctx.getImageData(x, y, 1, 1).data;

          // Calculate contrast ratio
          const colorLuminance = getLuminance(pixel[0], pixel[1], pixel[2]);
          const contrast = (Math.max(bgLuminance, colorLuminance) + 0.05) /
                          (Math.min(bgLuminance, colorLuminance) + 0.05);

          // Only use colors with contrast ratio > 3 (readable)
          if (contrast > 3) {
            const rgbColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

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

        setButtonColors(colors);
        // Set the first color as the main accent color for other elements
        setAccentColor(colors[0]);
        setDarkGradientColor(darkColor);
        setBrightAccentColor(brightColor);
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

                // Switch to new image immediately without clearing canvas
                // Pick random image from bg_wallpapers
                const images = ['image_1.png', 'image_3.png', 'image_4.png', 'image_5.png', 'image_6.png', 'image_7.png', 'image_8.png', 'image_9.png', 'image_10.png', 'image_11.png', 'image_12.png', 'image_13.png', 'image_14.png', 'image_15.png', 'image_17.png', 'image_19.png', 'image_21.png'];
                const randomImage = images[Math.floor(Math.random() * images.length)];

                // Store current pixel count as baseline for next image
                baselinePixelCountRef.current = revealedCount;

                // Don't clear canvas - keep previous painting
                setRevealPercentage(0);
                setIsPaintingComplete(false);
                setCurrentImagePath(`/bg_wallpapers/${randomImage}`);
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

          // Switch to new image immediately without clearing canvas
          const images = ['image_1.png', 'image_3.png', 'image_4.png', 'image_5.png', 'image_6.png', 'image_7.png', 'image_8.png', 'image_9.png', 'image_10.png', 'image_11.png', 'image_12.png', 'image_13.png', 'image_14.png', 'image_15.png', 'image_17.png', 'image_19.png', 'image_21.png'];
          const randomImage = images[Math.floor(Math.random() * images.length)];

          // Store current pixel count as baseline for next image
          baselinePixelCountRef.current = revealedCount;

          // Don't clear canvas - keep previous painting
          setRevealPercentage(0);
          setIsPaintingComplete(false);
          setCurrentImagePath(`/bg_wallpapers/${randomImage}`);
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

  // Petal button data
  const petals = [
    { name: 'Portfolio', href: '#portfolio', angle: 0 },
    { name: 'Shop', href: '/shop', angle: 90 },
    { name: 'About', href: '/about', angle: 180 },
    { name: 'Contact', href: '/contact', angle: 270 },
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
      {/* Debug: Reveal Percentage */}
      <div className="fixed top-24 right-4 z-50 bg-black/70 text-white px-4 py-2 rounded-lg font-mono">
        Revealed: {revealPercentage.toFixed(1)}%
      </div>

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
            backgroundColor: darkGradientColor,
          }}
        />
      ))}

      {/* Static Background - cream color with canvas overlay */}
      <div className="fixed inset-0 -z-10 bg-[#fffff7]">
        {/* Canvas that reveals color image on mouse move with logo mask */}
        <div className="absolute inset-0 z-10" style={{
          WebkitMaskImage: 'url(/images/victorhugoartlogo.png)',
          WebkitMaskPosition: '50% 50%',
          WebkitMaskSize: '600px 600px',
          WebkitMaskRepeat: 'no-repeat',
          maskImage: 'url(/images/victorhugoartlogo.png)',
          maskPosition: '50% 50%',
          maskSize: '600px 600px',
          maskRepeat: 'no-repeat',
        }}>
          <canvas
            ref={revealCanvasRef}
            className="absolute inset-0 pointer-events-none"
          />
        </div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fffff7]/55 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Left: Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity relative z-10"
          >
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: accentColor }}></span>
          </button>

          {/* Center: Site Name */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 inline-flex items-center pointer-events-auto z-0">
            <h1 className="text-2xl sm:text-3xl font-bold lowercase flex gap-1" style={{ color: accentColor }}>
              {'vic art'.split('').map((letter, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, 0, -2, 3, -1][i]}deg)` }}>{letter}</span>
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
        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-20 left-0 right-0 flex justify-evenly px-6 select-none max-w-4xl mx-auto"
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
                className="px-6 py-2 bg-transparent border-[5px] rounded-full shadow-lg select-none"
                style={{
                  borderColor: buttonColors[index] || '#2e1705',
                  color: buttonColors[index] || '#2e1705'
                }}
              >
                <span className="font-semibold text-sm select-none">
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
          style={{ backgroundColor: `${brightAccentColor}66` }}
        />
      </main>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative py-20 px-4 sm:px-6" style={{
        background: `linear-gradient(to bottom, #fffff7, ${darkGradientColor})`
      }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: accentColor }}>
              Portfolio
            </h2>
            <p className="text-xl" style={{ color: `${accentColor}B3` }}>
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
            <button
              className="px-4 sm:px-6 py-2 rounded-full transition-colors text-sm sm:text-base"
              style={{
                backgroundColor: `${accentColor}1A`,
                color: accentColor
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accentColor}33`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}1A`}
            >
              All
            </button>
            <button
              className="px-4 sm:px-6 py-2 rounded-full transition-colors text-sm sm:text-base"
              style={{
                backgroundColor: `${accentColor}1A`,
                color: accentColor
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accentColor}33`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}1A`}
            >
              Abstract
            </button>
            <button
              className="px-4 sm:px-6 py-2 rounded-full transition-colors text-sm sm:text-base"
              style={{
                backgroundColor: `${accentColor}1A`,
                color: accentColor
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accentColor}33`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}1A`}
            >
              Portrait
            </button>
            <button
              className="px-4 sm:px-6 py-2 rounded-full transition-colors text-sm sm:text-base"
              style={{
                backgroundColor: `${accentColor}1A`,
                color: accentColor
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accentColor}33`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}1A`}
            >
              Landscape
            </button>
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
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="relative mx-auto max-w-3xl"
                >
                  {/* Artwork Frame */}
                  <div className={`relative ${getFrameSize(art.size)} bg-[#fffff7] p-6 sm:p-8 shadow-2xl`}>
                    {/* Inner artwork area */}
                    <div
                      className="w-full h-full flex items-center justify-center border-2"
                      style={{
                        background: `linear-gradient(to bottom right, ${brightAccentColor}4D, ${darkGradientColor}4D)`,
                        borderColor: darkGradientColor
                      }}
                    >
                      <div className="text-center" style={{ color: accentColor }}>
                        <div className="text-5xl sm:text-7xl mb-4">🎨</div>
                        <p className="text-sm font-medium">&quot;{art.title}&quot;</p>
                      </div>
                    </div>

                    {/* Frame shadow/depth effect */}
                    <div
                      className="absolute -inset-2 -z-10 shadow-2xl"
                      style={{
                        background: `linear-gradient(to bottom, ${accentColor}CC, ${accentColor})`
                      }}
                    ></div>
                  </div>

                  {/* Spotlight effect on hover */}
                  <motion.div
                    className="absolute -inset-12 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20"
                    initial={{ opacity: 0 }}
                    style={{ backgroundColor: `${brightAccentColor}33` }}
                  />
                </motion.div>

                {/* Artwork Info Plaque */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index + 0.3 }}
                  className="mt-8 max-w-2xl mx-auto backdrop-blur-sm rounded-lg p-6"
                  style={{
                    backgroundColor: `${accentColor}33`,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: `${accentColor}4D`
                  }}
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-[#fffff7] mb-2">
                    {art.title}
                  </h3>
                  <p className="text-[#fffff7]/60 text-sm mb-3">
                    {art.category} • {art.year}
                  </p>
                  <p className="text-[#fffff7]/80 leading-relaxed italic text-sm sm:text-base">
                    &quot;{art.description}&quot;
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
