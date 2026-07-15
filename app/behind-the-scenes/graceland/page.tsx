'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useColors } from '../../context/ColorContext';
import Footer from '../../components/Footer';

export default function GracelandBehindTheScenes() {
  const { accentColor, darkColors } = useColors();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const wipImages = [
    { src: '/WorkInProgress/graceland_wip/reference.jpg', title: 'Reference Photo I Took' },
    { src: '/WorkInProgress/graceland_wip/palette.jpg', title: 'The Color Palette at the end of the painting' },
    { src: '/WorkInProgress/graceland_wip/full_piece_on_box.jpg', title: 'The Setup I used was a Pochade Box on a Tripod' },
    { src: '/WorkInProgress/graceland_wip/closeup1.jpg', title: '' },
    { src: '/WorkInProgress/graceland_wip/closeup2.jpg', title: '' },
    { src: '/WorkInProgress/graceland_wip/anotherview.jpg', title: 'Finished Piece' },
  ];

  // Color palette used in the painting
  const colorPalette = [
    { color: '#9ACD32', name: 'Yellow-Green', percentage: 32 },
    { color: '#2F5233', name: 'Dark Green', percentage: 24 },
    { color: '#87CEEB', name: 'Light Blue', percentage: 17 },
    { color: '#B8B5A8', name: 'Gray', percentage: 15 },
    { color: '#4682B4', name: 'Blue', percentage: 7 },
    { color: '#1C3A1F', name: 'Dark Green-Black', percentage: 5 },
  ];

  // Value breakdown (light to dark) - pure grayscale
  const valueBreakdown = [
    { color: '#E0E0E0', name: 'Highlights', percentage: 8 },
    { color: '#B0B0B0', name: 'Lights', percentage: 22 },
    { color: '#707070', name: 'Midtones', percentage: 35 },
    { color: '#404040', name: 'Darks', percentage: 25 },
    { color: '#202020', name: 'Deep Shadows', percentage: 10 },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % wipImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + wipImages.length) % wipImages.length);
  };

  // Convert hex to HSL for color wheel positioning
  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Generate color wheel markers
  const generateColorWheelMarkers = () => {
    const centerX = 120;
    const centerY = 120;
    const radius = 90;

    return colorPalette.map((item, index) => {
      const hsl = hexToHSL(item.color);
      const angle = (hsl.h - 90) * (Math.PI / 180); // Rotate -90 to start at top
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const markerSize = 6 + (item.percentage / 100) * 8; // Size based on percentage

      return (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r={markerSize}
            fill={item.color}
            stroke="white"
            strokeWidth="2"
          />
        </g>
      );
    });
  };

  // Generate pie chart slices for color palette
  const generatePieSlices = (data: typeof colorPalette) => {
    let currentAngle = 0;
    const radius = 100;
    const centerX = 120;
    const centerY = 120;

    return data.map((item, index) => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      currentAngle = endAngle;

      return (
        <path
          key={index}
          d={pathData}
          fill={item.color}
          stroke="white"
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#fffff7]">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: '#fffff7DD' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="Victor Garcia Art Logo"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <h1 className="text-lg sm:text-3xl font-bold lowercase flex gap-0.5 sm:gap-1 text-black">
              {'vicgarcia.art'.split('').map((letter, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, 0, -2, 3, -1, 0, -2, 3, -4, 2, -1][i]}deg)` }}>{letter}</span>
              ))}
            </h1>
          </Link>

          <Link
            href="/"
            className="px-2 sm:px-4 py-2 rounded-lg font-medium text-sm hover:opacity-70 transition-opacity whitespace-nowrap shrink-0"
            style={{ color: accentColor }}
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>
              Graceland
            </h1>
            <p className="text-xl" style={{ color: darkColors[1] || accentColor }}>
              Behind the Scenes
            </p>
          </motion.div>

          {/* Finished Painting */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="relative max-w-3xl mx-auto bg-[#fffff7] p-6 sm:p-8 shadow-2xl">
              <Image
                src="/FinishedPaintings/graceland.jpg"
                alt="Graceland - Finished Painting"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold mb-2" style={{ color: darkColors[0] || accentColor }}>
                  Finished Painting
                </h2>
                <p className="text-sm" style={{ color: darkColors[1] || accentColor }}>
                  Oil on Canvas 8&quot; x 12&quot; • 2025
                </p>
              </div>
            </div>
          </motion.div>

          {/* Color Palette Pie Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: darkColors[0] || accentColor }}>
              Color Breakdown
            </h2>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Pie Chart */}
                <div className="flex-shrink-0">
                  <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-lg">
                    {generatePieSlices(colorPalette)}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {colorPalette.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md shadow-md flex-shrink-0 border-2 border-white"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: darkColors[0] || accentColor }}>
                          {item.name}
                        </p>
                        <p className="text-xs" style={{ color: darkColors[1] || accentColor }}>
                          {item.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>


          {/* Value Breakdown Pie Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mb-16 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: darkColors[0] || accentColor }}>
              Value Breakdown
            </h2>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Pie Chart */}
                <div className="flex-shrink-0">
                  <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-lg">
                    {generatePieSlices(valueBreakdown)}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {valueBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md shadow-md flex-shrink-0 border-2 border-white"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: darkColors[0] || accentColor }}>
                          {item.name}
                        </p>
                        <p className="text-xs" style={{ color: darkColors[1] || accentColor }}>
                          {item.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6" style={{ color: darkColors[0] || accentColor }}>
              About This Piece
            </h2>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <p className="text-lg leading-relaxed mb-4" style={{ color: darkColors[1] || accentColor }}>
                I wanted to take a drive on California State Route 1 one of my favorite scenic routes. 
                My girlfriend and I stopped by the road right before the coast to take a look at the rolling hills and the cows. 
                I came on this ride with my Nikon D5100 camera hoping to capture some reference photos for future paintings.
                This was one I knew I wanted to paint right away.

              </p>
              <p className="text-lg leading-relaxed" style={{ color: darkColors[1] || accentColor }}>
                I decided on a longer canvas since I wanted to capture a relaxed feeling. I took several photos from different views and used most of them for this composition.
                The Hills for me were the main event and I wanted to make sure they covered most of the canvas. I had a lot of trouble with the foreground,
                I kept adding and taking away detail since I wasn&apos;t sure just how much I wanted the foreground to stand out. In the end I settled for a lot less detail and let the
                two cows steal the show.
              </p>
            </div>
          </motion.div>

          {/* Work in Progress Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: darkColors[0] || accentColor }}>
              The Process
            </h2>

            <div className="relative max-w-4xl mx-auto">
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-lg shadow-2xl bg-white p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <Image
                      src={wipImages[currentImageIndex].src}
                      alt={wipImages[currentImageIndex].title}
                      width={1200}
                      height={900}
                      className="w-full h-auto rounded-lg"
                    />
                    <p className="mt-4 text-xl font-medium" style={{ color: darkColors[0] || accentColor }}>
                      {wipImages[currentImageIndex].title}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ color: darkColors[0] || accentColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ color: darkColors[0] || accentColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {wipImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="w-8 h-8 flex items-center justify-center"
                    aria-label={`Go to image ${index + 1}`}
                  >
                    <span
                      className="w-3 h-3 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: index === currentImageIndex ? (darkColors[0] || accentColor) : '#D1D5DB',
                        transform: index === currentImageIndex ? 'scale(1.2)' : 'scale(1)'
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
